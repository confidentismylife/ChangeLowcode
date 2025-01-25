import { Button, Input } from "antd";
import img from "../../../public/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons/lib/icons';

const Login = () => {
  const [formData, setFormData] = useState({ username: "admin", password: "123456" });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    navigate("/show");
  };

  return (
    <div className="min-h-screen bg-[#f1f2f3]">
      {/* 导航栏 */}
      <div className="w-full h-[64px] bg-white flex items-center justify-between px-8 fixed top-0 z-50 shadow-sm">
        <div className="flex items-center">
          <img src={img} className="h-[26px] mr-3" alt="Logo" />
          <span className="text-[#18191c] text-lg font-medium">
            ChangeLowCode
          </span>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-[64px] min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[440px] mx-auto bg-white rounded-lg p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-[24px] font-bold text-[#18191c] mb-3">
              {isRegistering ? "注册账号" : "登录账号"}
            </h1>
            <p className="text-[14px] text-[#61666d]">
              {isRegistering ? "欢迎加入 ChangeLowCode" : "欢迎回来，请登录您的账号"}
            </p>
          </div>
          
          <div className="space-y-6">
            <Input
              placeholder="请输入账号"
              className="h-[44px] text-[14px] rounded-lg border-[#e3e5e7] hover:border-[#00aeec] focus:border-[#00aeec] transition-colors"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              prefix={<UserOutlined className="text-[#9499a0]" />}
            />
            
            <Input.Password
              placeholder="请输入密码"
              className="h-[44px] text-[14px] rounded-lg border-[#e3e5e7] hover:border-[#00aeec] focus:border-[#00aeec] transition-colors"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              prefix={<LockOutlined className="text-[#9499a0]" />}
            />

            <Button
              type="primary"
              className="w-full h-[44px] text-[16px] rounded-lg bg-[#00aeec] hover:bg-[#00b5f5] border-none font-medium"
              onClick={handleSubmit}
            >
              {isRegistering ? "注册" : "登录"}
            </Button>

            <div className="flex justify-between items-center text-[14px] text-[#61666d]">
              <button
                className="hover:text-[#00aeec] transition-colors"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "已有账号？立即登录" : "没有账号？立即注册"}
              </button>
              <a href="#" className="hover:text-[#00aeec] transition-colors">
                忘记密码
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
