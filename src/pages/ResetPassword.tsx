import ResetPasswordLayout from "../layout/ResetPasswordLayout";
import { useState } from "react";
import ResetPassForm from "../component/ResetPassForm";
import { getApiUrl } from "../config/api";
import { API_CONFIG } from "../config/api";
import axios from "axios";
import AuthMessage from "../component/AuthMessage";
import { useNavigate } from "react-router-dom";

type Step = "email" | "otp" | "password";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [apiMessage, setApiMessage] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleResetPasswordSubmit = () => {
    if (isResettingPassword) return;

    const resetPasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD);
    setIsResettingPassword(true);
    setApiMessage("");
    const normalizedPassword = newPassword.trim();
    if (!normalizedPassword) {
      setApiMessage("Vui long nhap mat khau moi");
      setIsResettingPassword(false);
      return;
    }
    if (normalizedPassword.length < 6) {
      setApiMessage("Mat khau moi phai co it nhat 6 ky tu");
      setIsResettingPassword(false);
      return;
    }
    if (normalizedPassword !== confirmPassword.trim()) {
      setApiMessage("Mat khau moi va xac nhan mat khau khong khop");
      setIsResettingPassword(false);
      return;
    }

    setIsResettingPassword(true);
    axios
      .post(resetPasswordUrl, {
        identifier: email,
        new_password: normalizedPassword,
        reset_session_token: resetToken,
      })
      .then((response) => {
        setApiMessage(response.data?.message);
        setStep("email");
        setEmail("");
        setOtp("");
        setResetToken("");
        setNewPassword("");
        navigate("/login");
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setApiMessage(error.response?.data?.message);
          return;
        }
        setApiMessage("Dat mat khau moi that bai");
        console.error("Password reset failed:", error);
      })
      .finally(() => {
        setIsResettingPassword(false);
      });
  };

  const handleOtpSubmit = () => {
    if (isVerifyingOtp) return;

    const verifyOtpUrl = getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_OTP);
    setIsVerifyingOtp(true);
    setApiMessage("");
    const normalizedOtp = otp.trim();
    if (!normalizedOtp) {
      setApiMessage("Vui long nhap ma OTP");
      setIsVerifyingOtp(false);
      return;
    }
    axios
      .post(verifyOtpUrl, { identifier: email, otp: normalizedOtp })
      .then((response) => {
        setResetToken(response.data?.reset_session_token || "");
        setApiMessage(response.data?.message);
        setStep("password");
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setApiMessage(error.response?.data?.message);
          return;
        }
        setApiMessage("Xac thuc OTP that bai");
        console.error("OTP verification failed:", error);
      })
      .finally(() => {
        setIsVerifyingOtp(false);
      });
  };

  const handleEmailSubmit = async () => {
    const forgotPasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
    if (isSendingOtp) return;

    setIsSendingOtp(true);
    setApiMessage("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setApiMessage("Vui long nhap email");
      setIsSendingOtp(false);
      return;
    }
    try {
      const response = await axios.post(forgotPasswordUrl, {
        identifier: normalizedEmail,
      });
      setApiMessage( response.data?.message);
      setStep("otp");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiMessage(error.response?.data?.message);
        return;
      }
      setApiMessage("Gui ma OTP that bai");
      console.error("Forgot password failed:", error);
    } finally {
      setIsSendingOtp(false);
    }
  };
  return (
    <ResetPasswordLayout>
      <AuthMessage message={apiMessage} />
      <ResetPassForm
        step={step}
        email={email}
        setEmail={setEmail}
        otp={otp}
        setOtp={setOtp}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={step === "email" ? handleEmailSubmit : step === "otp" ? handleOtpSubmit : handleResetPasswordSubmit}
        onResendOtp={handleEmailSubmit}
        loading={step === "email" ? isSendingOtp : step === "otp" ? isVerifyingOtp : false}
        resendLoading={isSendingOtp}
        resetLoading={isResettingPassword}
      />
    </ResetPasswordLayout>
  );
};

export default ResetPassword;
