type Props = {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  requestOTP: () => void;
  loading: boolean;
  resendLoading: boolean;
};

const OTPVerification = ({
  otp,
  setOtp,
  onSubmit,
  requestOTP,
  loading,
  resendLoading,
}: Props) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">Xác minh OTP</p>
      <h2 className="text-3xl font-semibold text-slate-900 pb-3">Nhập mã OTP</h2>
      <p className="text-sm text-slate-500 pb-6">Vui lòng nhập mã OTP được gửi đến email của bạn.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Nhập mã OTP"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading || resendLoading}
          className="w-full cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-95 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xác minh..." : "Xác minh"}
        </button>
      </form>

      <p className="text-sm text-slate-600 text-center">
        Không nhận được mã?{" "}
        <button
          type="button"
          disabled={loading || resendLoading}
          className="font-semibold text-orange-600 underline underline-offset-4 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={requestOTP}
        >
          {resendLoading ? "Đang gửi lại..." : "Gửi lại"}
        </button>
      </p>
    </div>
  );
};

export default OTPVerification;
