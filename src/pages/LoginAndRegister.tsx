import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { type AuthMode } from "../layout/AuthLayout.tsx";
import AuthForm, { type AuthFormData } from "../component/AuthForm";
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

const createLoginPayload = (formData: AuthFormData): LoginProps => ({
  email: formData.email.trim(),
  password: formData.password,
});

const createRegisterPayload = (formData: AuthFormData): RegisterProps => ({
  email: formData.email.trim(),
  username: formData.username.trim(),
  password: formData.password,
  phone_number: formData.phone_number.trim(),
  role: formData.role || "customer",
});

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
    phone_number: "",
    role: "customer", 
  });
  const [apiMessage, setApiMessage] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const role = searchParams.get("role") || undefined;
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    const isPopup = window.opener && window.opener !== window;

    if (error) {
      if (isPopup) {
        window.opener?.postMessage({ type: 'google_auth_error', error, message }, '*');
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (!token) {
      if (isPopup && window.opener) {
        window.addEventListener('message', (event) => {
          if (event.data?.type === 'close_popup') {
            window.close();
          }
        });
      }
      return;
    }

    if (isPopup && window.opener) {
      window.opener.postMessage({ type: 'google_auth_success', token, role }, '*');
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'popup_close') {
          window.close();
        }
      });
    } else {
      login(token, role);
      navigate("/", { replace: true });
    }
  }, [location.search, login, navigate]);

  const handleLogin = async () => {
    const loginUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
    setApiMessage("");
    const loginPayload = createLoginPayload(formData);

    try {
      const response = await axios.post(loginUrl, loginPayload);
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

  const handleGoogleLogin = () => {
    const googleLoginUrl = getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_LOGIN);
    const popupWidth = 520;
    const popupHeight = 680;
    const left = Math.max((window.screen.width - popupWidth) / 2, 0);
    const top = Math.max((window.screen.height - popupHeight) / 2, 0);
    const popupFeatures = [
      `width=${popupWidth}`,
      `height=${popupHeight}`,
      `left=${Math.round(left)}`,
      `top=${Math.round(top)}`,
      'resizable=yes',
      'scrollbars=yes',
      'status=no',
      'toolbar=no',
      'menubar=no',
      'location=yes',
    ].join(',');

    const popup = window.open(googleLoginUrl, 'google_oauth_popup', popupFeatures);

    if (!popup) {
      window.location.href = googleLoginUrl;
      return;
    }

    popup.focus();

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'google_auth_success') {
        login(event.data.token, event.data.role);
        popup.postMessage({ type: 'popup_close' }, '*');
        window.removeEventListener('message', messageHandler);
        navigate("/");
      } else if (event.data?.type === 'google_auth_error') {
        setApiMessage(event.data.message || "Đăng nhập Google thất bại");
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
  };
  
  const handleRegister = async () => {
    const registerUrl = getApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
    setApiMessage("");
    const registerPayload = createRegisterPayload(formData);
    try {
      const response = await axios.post(registerUrl, registerPayload);
      if (response.data) {
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
      <AuthForm
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={mode === "login" ? handleLogin : handleRegister}
        onGoogleLogin={mode === "login" ? handleGoogleLogin : undefined}
        onSwitch={() => setMode(mode === "login" ? "register" : "login")}
      />
    </AuthLayout>
  );
};

export default LoginAndRegister;
