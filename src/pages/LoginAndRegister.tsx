import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout, { type AuthMode } from "../layout/AuthLayout.tsx";
import LoginForm from "../component/LoginForm";
import RegisterForm from "../component/RegisterForm";
import AuthMessage from "../component/AuthMessage";
import { API_CONFIG, getApiUrl } from "../config/api";
import { useAuth } from "../context/AuthContext";

export interface LoginProps {
  email: string;
  password: string;
}
export interface RegisterProps {
  email: string;
  password: string;
  phone_number?: string;
  username?: string;
  role?: string;
}
const LoginAndRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formLogin, setFormLogin] = useState<LoginProps>({
    email: "",
    password: "",
  });
  const [formRegister, setFormRegister] = useState<RegisterProps>({
    email: "",
    username: "",
    password: "",
    phone_number: "",
    role: "customer", 
  });
  const [apiMessage, setApiMessage] = useState<string>("");

  const handleLogin = async () => {
    const loginUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
    setApiMessage("");

    try {
      const response = await axios.post(loginUrl, formLogin);
      const message = response.data?.message || "Đăng nhập thành công";
      login(response.data.token, response.data.user.role);
      setApiMessage(message);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Đăng nhập thất bại";
        setApiMessage(message);
        console.error("Login failed:", error.response?.data || error.message);
        return;
      }
      setApiMessage("Đăng nhập thất bại");
      console.error("Login failed:", error);
    }
  };
  
  const handleRegister = async () => {
    const registerUrl = getApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
    setApiMessage("");
    try {
      const response = await axios.post(registerUrl, formRegister);
      if(response.data) {
        setApiMessage(response.data?.message);
        setMode("login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiMessage(error.response?.data?.message);
        console.error("Register failed:", error.response?.data || error.message);
        return;
      }
      setApiMessage("Đăng ký thất bại");
      console.error("Register failed:", error);
    }
  };

  return (
    <AuthLayout mode={mode}>
      <AuthMessage message={apiMessage} />
      {mode === "login" ? (
        <LoginForm 
          formLogin={formLogin}
          setFromLogin={setFormLogin}
          onLogin={handleLogin}
          onSwitch={() => setMode("register")}
        />
      ) : (
        <RegisterForm 
          setFromRegister={setFormRegister}
          formRegister={formRegister}
          onRegister={handleRegister}
          onSwitch={() => setMode("login")}
        />
      )}
    </AuthLayout>
  );
};

export default LoginAndRegister;
