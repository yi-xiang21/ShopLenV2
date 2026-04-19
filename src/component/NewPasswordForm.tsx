

type Props = {
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    onSubmitNewPassword: () => void;
  loading: boolean;
};

const NewPasswordForm = ({
    showPassword,
    setShowPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    onSubmitNewPassword,
    loading,
}: Props) => {

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">Đặt mật khẩu mới</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Mật khẩu mới</h2>
      <p className="text-sm text-slate-500 pb-6">Nhập mật khẩu mới để hoàn tất quy trình.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
            onSubmitNewPassword();
        }}
        className="space-y-4"
      >
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu mới"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {newPassword && newPassword.length < 6 && (
          <p className="text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự</p>
        )}
        {confirmPassword && confirmPassword !== newPassword && (
          <p className="text-xs text-red-600">Mật khẩu xác nhận không khớp</p>
        )}


        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-95 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
