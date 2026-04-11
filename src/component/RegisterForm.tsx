type Props = {
  onSwitch: () => void;
};

const RegisterForm = ({ onSwitch }: Props) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-3">Đăng ký ngay</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Đăng ký</h2>
      <p className="text-sm text-slate-500 pb-4">Tạo tài khoản mới để theo dõi đơn hàng và ưu đãi.</p>

      <input
        type="text"
        placeholder="Username"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />
      <input
        type="number"
        placeholder="Phone"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
      />

      <button
        type="button"
        className="w-full rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 transition hover:brightness-105"
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
