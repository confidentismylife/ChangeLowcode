import { Button, Input } from "antd";
import img from "../../../public/logo.png";
import whiteimg from "../../../public/white_on_trans.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate

const Login = () => {
  // 设置默认的账号和密码
  const [formData, setFormData] = useState({ username: "admin", password: "123456" });
  const [isRegistering, setIsRegistering] = useState(false); // 用于切换注册和登录
  const navigate = useNavigate(); // 使用 useNavigate 创建导航函数

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // 这里可以添加你想要的逻辑，例如打印表单数据
    console.log(formData);
    // 直接跳转到 show 界面
    navigate("/show");
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
            value={formData.username} // 绑定默认用户名
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
          <Input
            placeholder="输入密码"
            className="mb-4 border border-gray-300 rounded-md shadow-sm"
            type="password"
            value={formData.password} // 绑定默认密码
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
