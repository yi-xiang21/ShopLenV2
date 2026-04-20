import { useState } from "react";
import type { AuthMode } from "../layout/AuthLayout.tsx";

export interface AuthFormData {
  email: string;
  password: string;
  username: string;
  phone_number: string;
  role: string;
}

type Props = {
  mode: AuthMode;
  formData: AuthFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>;
  onSubmit: () => void;
  onGoogleLogin?: () => void;
  onSwitch: () => void;
};

const AuthForm = ({ mode, formData, setFormData, onSubmit, onGoogleLogin, onSwitch }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  return (
    <div className="w-full flex flex-col gap-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">
        {isLogin ? "Chào quay trở lại" : "Đăng ký ngay"}
      </p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <p className="text-sm text-slate-500 pb-4">
        {isLogin ? "Nhập thông tin để tiếp tục mua sắm." : "Tạo tài khoản mới để theo dõi đơn hàng và ưu đãi."}
      </p>

      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      {!isLogin && (
        <input
          type="text"
          placeholder="Phone"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        />
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-11 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {isLogin && (
        <div className="text-sm mb-2 p-0 text-left">
          <a href="/reset-password" className="font-semibold text-orange-600 underline underline-offset-4">
            Quên mật khẩu?
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        className="w-full cursor-pointer rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 transition duration-150 hover:scale-[1.02] hover:brightness-105 active:scale-95"
      >
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </button>

      {isLogin && onGoogleLogin && (
        <button
          type="button"
          onClick={onGoogleLogin}
          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
        >
          Đăng nhập với Google
        </button>
      )}

      <p className="text-sm text-slate-600">
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <button type="button" onClick={onSwitch} className="cursor-pointer font-semibold text-orange-600 underline underline-offset-4">
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;