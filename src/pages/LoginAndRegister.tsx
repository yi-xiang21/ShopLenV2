import { useState } from "react";
import AuthLayout, { type AuthMode } from "../layout/AuthLayout.tsx";
import LoginForm from "../component/LoginForm";
import RegisterForm from "../component/RegisterForm";

const LoginAndRegister = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <AuthLayout mode={mode}>
      {mode === "login" ? (
        <LoginForm onSwitch={() => setMode("register")} />
      ) : (
        <RegisterForm onSwitch={() => setMode("login")} />
      )}
    </AuthLayout>
  );
};

export default LoginAndRegister;
