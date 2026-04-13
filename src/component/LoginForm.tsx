import type { LoginProps } from "../pages/LoginAndRegister";
import { useState } from "react";
type Props = {
  formLogin: LoginProps;
  setFromLogin: React.Dispatch<React.SetStateAction<LoginProps>>;
  onLogin: () => void;
  onSwitch: () => void;
};

const LoginForm = ({ formLogin, setFromLogin, onLogin, onSwitch }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex flex-col gap-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">Chào quay trở lại</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Đăng nhập</h2>
      <p className="text-sm text-slate-500 pb-4">Nhập thông tin để tiếp tục mua sắm.</p>
      <input
        type="text"
        placeholder="Username"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        value={formLogin.email}
        onChange={(e) => setFromLogin({ ...formLogin, email: e.target.value })}
      />
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={formLogin.password}
          onChange={(e) => setFromLogin({ ...formLogin, password: e.target.value })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center p-0 leading-none text-slate-500 hover:text-slate-700"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      
      <div className="text-sm mb-2 p-0 text-left">
        <a  onClick={onSwitch} className="font-semibold text-orange-600 underline underline-offset-4 " href="/reset-password">
          Quên mật khẩu?
        </a>
      </div>

      <button
        type="button"
        onClick={onLogin}
        className="w-full cursor-pointer duration-150 hover:scale-[1.02] active:scale-95 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40  transition hover:brightness-105 "
      >
        Đăng nhập
      </button>

      <p className="text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-orange-600 underline underline-offset-4 cursor-pointer ">
          Đăng ký
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
