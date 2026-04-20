type Step = "email" | "otp" | "password";

type Props = {
  step: Step;
  email: string;
  setEmail: (value: string) => void;
  otp: string;
  setOtp: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: () => void;
  onResendOtp: () => void;
  loading: boolean;
  resendLoading: boolean;
  resetLoading: boolean;
};

const ResetPassForm = ({
  step,
  email,
  setEmail,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  onResendOtp,
  loading,
  resendLoading,
  resetLoading,
}: Props) => {
  const isEmailStep = step === "email";
  const isOtpStep = step === "otp";
  const isPasswordStep = step === "password";

  const stepLabel = isEmailStep ? "1/3" : isOtpStep ? "2/3" : "3/3";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-2">Quên mật khẩu</p>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold text-slate-900">Khôi phục mật khẩu</h2>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            {stepLabel}
          </span>
        </div>
        <div className="flex gap-2 pt-2">
          <div className={`h-2 flex-1 rounded-full ${isEmailStep ? "bg-orange-500" : "bg-orange-200"}`} />
          <div className={`h-2 flex-1 rounded-full ${isOtpStep ? "bg-orange-500" : isPasswordStep ? "bg-orange-200" : "bg-orange-100"}`} />
          <div className={`h-2 flex-1 rounded-full ${isPasswordStep ? "bg-orange-500" : "bg-orange-100"}`} />
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {isEmailStep && (
          <>
            <p className="text-sm text-slate-500 pb-2">Nhập email của bạn để nhận mã OTP.</p>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        {isOtpStep && (
          <>
            <p className="text-sm text-slate-500 pb-2">Vui lòng nhập mã OTP được gửi đến email của bạn.</p>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </>
        )}

        {isPasswordStep && (
          <>
            <p className="text-sm text-slate-500 pb-2">Nhập mật khẩu mới để hoàn tất quy trình.</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự</p>
            )}
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-600">Mật khẩu xác nhận không khớp</p>
            )}
          </>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || resendLoading || resetLoading}
            className="w-2/3 cursor-pointer rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 transition duration-150 hover:scale-[1.02] hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isEmailStep && (loading ? "Đang gửi..." : "Gửi mã OTP")}
            {isOtpStep && (loading ? "Đang xác minh..." : "Xác minh OTP")}
            {isPasswordStep && (resetLoading ? "Đang xử lý..." : "Đặt lại mật khẩu")}
          </button>
        </div>

        {isOtpStep && (
          <p className="text-sm text-slate-600 text-center">
            Không nhận được mã?{" "}
            <button
              type="button"
              disabled={loading || resendLoading}
              className="font-semibold text-orange-600 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onResendOtp}
            >
              {resendLoading ? "Đang gửi lại..." : "Gửi lại"}
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassForm;