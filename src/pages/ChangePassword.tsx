
import { useState } from "react";
import { getApiUrl } from "../config/api";
import { API_CONFIG } from "../config/api";
import axios from "axios";
import AuthMessage from "../component/AuthMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<string>("");

  const handleChangePasswordSubmit = () => {
    const changePasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD);
    const normalizedNewPassword = newPassword.trim();
    const normalizedCurrentPassword = currentPassword.trim();

    setApiMessage("");

    if (!normalizedCurrentPassword) {
      setApiMessage("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (!normalizedNewPassword) {
      setApiMessage("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (normalizedNewPassword.length < 6) {
      setApiMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (!accessToken) {
      setApiMessage("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
      return;
    }

    axios.post(changePasswordUrl, { 
      currentPassword: normalizedCurrentPassword,
      newPassword: normalizedNewPassword,
      confirmPassword: confirmPassword.trim(),
    },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
      .then((response) => {
        console.log("Password changed successfully:", response.data);
        setApiMessage(response.data?.message );
        if (response.data?.message === "Đổi mật khẩu thành công") {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          navigate("/profile");
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || error.message || "Đổi mật khẩu thất bại";
          console.error("Password change failed:", error.response?.data || error.message);
          setApiMessage(message);
          return;
        }
        setApiMessage("Doi mat khau that bai");
        console.error("Password change failed:", error);
      });
  };

  return (
    <div>
      <div className="space-y-4">
        <p className="pb-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
          Tài khoản
        </p>
        <h2 className="pb-3 text-3xl font-semibold text-slate-900">Doi mat khau</h2>
        <p className="pb-6 text-sm text-slate-500">
            Nhập mật khẩu hiện tại và mật khẩu mới để hoàn tất quy trình đổi mật khẩu.
        </p>

        {apiMessage && <AuthMessage message={apiMessage} />}

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePasswordSubmit();
          }}
        >
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Mat khau hien tai"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-16 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              {showCurrentPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Mat khau moi"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-16 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              {showNewPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xac nhan mat khau moi"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-16 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 transition duration-150 hover:scale-[1.02] hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Đổi mật khẩu
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile/account")}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Quay lại cài đặt tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
