import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { type AuthMode } from "../../../layout/AuthLayout.tsx";
import AuthForm, { type AuthFormData } from "../../../component/AuthForm.tsx";
import type { LoginPayload, RegisterPayload } from "../types/auth-type.ts";
import {authApi} from "../api/auth-api.ts";
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { loginThunk, registerThunk, getMeThunk } from "../store/auth-thunk.ts";
import AuthMessage from "@/component/AuthMessage.tsx";


const createLoginPayload = (formData: AuthFormData): LoginPayload => ({
  email: formData.email.trim(),
  password: formData.password,
});

const createRegisterPayload = (formData: AuthFormData): RegisterPayload => ({
  email: formData.email.trim(),
  username: formData.username.trim(),
  password: formData.password,
  phone_number: formData.phone_number.trim(),
  role: formData.role || "customer",
});

const LoginAndRegister = () => {
  
  const authError = useAppSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
    phone_number: "",
    role: "customer", 
  });
  const [googleAuthMessage, setGoogleAuthMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const message = googleAuthMessage || authError || "";

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const role = searchParams.get("role") || undefined;
      const userId = searchParams.get("user_id") || undefined;
      const error = searchParams.get("error");
      const message = searchParams.get("message");
      console.log("Google OAuth callback params:", { token, refreshToken, role, userId, error, message });
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

      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (isPopup && window.opener) {
        window.opener.postMessage({ type: 'google_auth_success', token, refreshToken, role }, '*');
        window.addEventListener('message', (event) => {
          if (event.data?.type === 'popup_close') {
            window.close();
          }
        });
      } else {
        await dispatch(getMeThunk());
        navigate("/", { replace: true });
      }
    };

    void handleCallback();
  }, [location.search, navigate, dispatch]);

  const handleLogin = async (): Promise<boolean> => {
    setGoogleAuthMessage("");
    const loginPayload = createLoginPayload(formData);

    try {
      await dispatch(loginThunk({ ...loginPayload })).unwrap();

      return true; 
    } catch (error) {
      console.error("Login failed:", error);
      return false; 
    }
  };

  const handleGoogleLogin = () => {
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

    const popup = window.open(authApi.getGoogleLoginUrl(), 'google_oauth_popup', popupFeatures);

    if (!popup) {
      window.location.href = authApi.getGoogleLoginUrl();
      return;
    }

    popup.focus();

    const messageHandler = async (event: MessageEvent) => {
      if (event.data?.type === 'google_auth_success') {
        const { token: accessToken, refreshToken } = event.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        popup.postMessage({ type: 'popup_close' }, '*');
        window.removeEventListener('message', messageHandler);

        try {
          await dispatch(getMeThunk()).unwrap();
        } catch (error) {
          console.warn('Unable to refresh user after Google login:', error);
        }

        navigate("/");
      } else if (event.data?.type === 'google_auth_error') {
        setGoogleAuthMessage(event.data.message || "Đăng nhập Google thất bại");
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
  };
  
  const handleRegister = async (): Promise<boolean> => {
    setGoogleAuthMessage("");
    try {
      await dispatch(registerThunk({ ...createRegisterPayload(formData) })).unwrap();
      
      // Delay 1.2s để xem thỏ vui, sau đó tự động chuyển form qua Login
      setTimeout(() => {
        setMode("login");
      }, 1200);

      return true; // THÀNH CÔNG
    } catch (error) {
      console.error("Register failed:", error);
      return false; // THẤT BẠI
    }
  };

  return (
    <AuthLayout mode={mode}>
      
      <AuthMessage message={message}    />
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
