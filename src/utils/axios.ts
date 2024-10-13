import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}

let refreshing = false;
const queue: PendingTask[] = [];

const axiosInstance = axios.create({
  baseURL: "", // 这里可以设置你的基本 URL
  timeout: 3000,
});

// 封装请求方法
async function sendRequest<T>(
  method: "GET" | "POST",
  url: string,
  data: any = null
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error("Request failed:", error);
    throw error; // 让错误向上传播
  }
}

export async function userLogin(
  username: string,
  password: string
): Promise<any> {
  return sendRequest<any>("POST", "/api/auth/login", { username, password });
}

export async function userEnv(): Promise<any> {
  return sendRequest<any>("GET", "/api/auth/env");
}

export async function userZuche(
  username: string,
  password: string
): Promise<any> {
  return sendRequest<any>("POST", "/api/auth/register", { username, password });
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

async function refreshToken(): Promise<RefreshTokenResponse> {
  try {
    const res = await sendRequest<RefreshTokenResponse>(
      "POST",
      "/api/auth/refresh",
      {
        refreshToken: localStorage.getItem("refreshToken"),
      }
    );
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    return res; // 返回新的 token
  } catch (err) {
    console.error("Refresh token failed:", err);
    throw err; // 让错误向上传播
  }
}

// 请求响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    const config = error.config;

    // 应该使用 response.status 来判断是否是 401 错误
    if (
      response &&
      response.status === 401 &&
      !config.url.includes("/refresh")
    ) {
      if (refreshing) {
        // 如果正在刷新 token，将请求加入队列
        return new Promise((resolve) => {
          queue.push({ config, resolve });
        });
      }

      refreshing = true;

      try {
        const res = await refreshToken();

        refreshing = false;

        if (res) {
          // 处理队列中的请求
          queue.forEach(({ config, resolve }) => {
            config.headers["Authorization"] =
              "Bearer " + localStorage.getItem("accessToken");
            resolve(axiosInstance(config));
          });
          queue.length = 0; // 清空队列

          // 重试当前的请求
          config.headers["Authorization"] =
            "Bearer " + localStorage.getItem("accessToken");
          return axiosInstance(config);
        }
      } catch (err) {
        refreshing = false;
        alert("登录过期，请重新登录");
      }
    }
    return Promise.reject(error); // 将错误向上传递
  }
);

// 请求拦截器
axiosInstance.interceptors.request.use(function (
  config: InternalAxiosRequestConfig
) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // 创建新的 AxiosHeaders 实例
    const headers = new AxiosHeaders(config.headers);
    headers.set("Authorization", "Bearer " + accessToken);

    // 重新赋值 headers
    config.headers = headers;
  }
  return config;
});
