
type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
};

const ResetPasswordForm = ({ email, setEmail, onSubmit }: Props) => {
    
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">Quên mật khẩu</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Đặt lại mật khẩu</h2>
      <p className="text-sm text-slate-500 pb-6">Nhập email của bạn để nhận mã OTP.</p>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-95 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Gửi mã otp
        </button>
      </form>

      <p className="text-sm text-slate-600 text-center mt-6">
        Nhớ được mật khẩu?{" "}
        <a href="/login" className="font-semibold text-orange-600 underline underline-offset-4 hover:text-orange-700">
          Đăng nhập
        </a>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
