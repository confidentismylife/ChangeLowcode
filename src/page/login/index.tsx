import { Button, Input, message } from "antd";
import img from "../../../public/logo.png";
import whiteimg from "../../../public/white_on_trans.png";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { userLogin, userZuche } from "../../utils/axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false); // 用于切换注册和登录
  const navigate = useNavigate();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleInputChange = useCallback(
    debounce((field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, 500),
    []
  );

  const handleSubmit = async () => {
    try {
      let res;
      if (isRegistering) {
        // 注册逻辑
        res = await userZuche(formData.username, formData.password); // 使用 await 等待注册响应
        console.log(res);
        if (res.code === 201) {
          message.success("注册成功");
          localStorage.setItem("username", formData.username);
          localStorage.setItem("accessToken", res.accessToken); // 保存 accessToken
          localStorage.setItem("refreshToken", res.refreshToken); // 保存 refreshToken
          navigate("/show");
        }
      } else {
        // 登录逻辑
        res = await userLogin(formData.username, formData.password); // 使用 await 等待登录响应
        console.log(res);
        if (res.code === 200) {
          message.success("登录成功");
          // 假设后端返回的 JWT 存储在 res.data.accessToken 中
          localStorage.setItem("accessToken", res.accessToken); // 保存 accessToken
          localStorage.setItem("refreshToken", res.refreshToken); // 保存 refreshToken
          navigate("/show");
        }
      }
    } catch (error) {
      console.error(error);
      message.error("操作失败，请检查用户名和密码");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen w-full flex flex-col">
      {/* 标题区域 */}
      <div className="w-full h-[80px] flex items-center justify-start bg-gray-800 shadow-lg p-4">
        <img src={whiteimg} className="w-[8%] h-auto mr-2" alt="Logo" />
        <div className="text-2xl font-bold text-white">ChangeLowCode</div>
      </div>

      <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        {/* 登录框 */}
        <div className="w-full max-w-xs bg-white shadow-md rounded-lg flex flex-col items-center justify-center p-8">
          <img src={img} className="w-[60%] h-auto mb-4" alt="Logo" />
          <Input
            placeholder="输入账号"
            className="mb-4 border border-gray-300 rounded-md shadow-sm"
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
          <Input
            placeholder="输入密码"
            className="mb-4 border border-gray-300 rounded-md shadow-sm"
            type="password"
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          <div className="flex flex-col w-full">
            <Button
              type="primary"
              className="mb-4 w-full bg-blue-600 hover:bg-blue-700 transition duration-200"
              onClick={handleSubmit}
            >
              {isRegistering ? "注册" : "登录"}
            </Button>
            <Button
              type="default"
              className="w-full text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
              onClick={() => setIsRegistering(!isRegistering)} // 切换登录和注册状态
            >
              {isRegistering ? "切换到登录" : "切换到注册"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
