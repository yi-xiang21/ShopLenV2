import type {  RegisterProps } from "../pages/LoginAndRegister";
import { useState } from "react";
type Props = {
  setFromRegister: React.Dispatch<React.SetStateAction<RegisterProps>>;
  formRegister: RegisterProps;
  onRegister: () => void;
  onSwitch: () => void;

};

const RegisterForm = ({ setFromRegister, formRegister, onRegister,  onSwitch }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-3">Đăng ký ngay</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Đăng ký</h2>
      <p className="text-sm text-slate-500 pb-4">Tạo tài khoản mới để theo dõi đơn hàng và ưu đãi.</p>

      <input
        type="text"
        placeholder="Username"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        value={formRegister.username}
        onChange={(e) => setFromRegister({...formRegister, username: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        value={formRegister.email}
        onChange={(e) => setFromRegister({...formRegister, email: e.target.value})}
      />
      <input
        type="number"
        placeholder="Phone"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        value={formRegister.phone_number}
        onChange={(e) => setFromRegister({...formRegister, phone_number: e.target.value})}
      />
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-11 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={formRegister.password}
          onChange={(e) => setFromRegister({...formRegister, password: e.target.value})}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <button
        type="button"
        className=" cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-95 w-full rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 transition hover:brightness-105"
        onClick={onRegister}
      >
        Đăng ký
      </button>

      <p className="text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-orange-600 underline underline-offset-4">
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
