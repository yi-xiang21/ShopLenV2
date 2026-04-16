import { useState } from 'react';
import ResetPasswordLayout from '../layout/ResetPasswordLayout';
import ResetPasswordForm from '../component/ResetPasswordForm';
import OTPVerification from '../component/OTPVerification';
import { getApiUrl } from '../config/api';
import { API_CONFIG } from '../config/api';
import axios from 'axios';
import AuthMessage from '../component/AuthMessage';
import NewPasswordForm from '../component/NewPasswordForm';
import { useNavigate } from 'react-router-dom';

type Step = 'email' | 'otp' | 'password';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [apiMessage, setApiMessage] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPasswordSubmit = () => {
    const resetPasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD);
    setApiMessage('');
    const normalizedPassword = newPassword.trim();
    if (!normalizedPassword) {
      setApiMessage('Vui long nhap mat khau moi');
      return;
    } 
    if (normalizedPassword.length < 6) {
      setApiMessage('Mat khau moi phai co it nhat 6 ky tu');
      return;
    }
    axios.post(resetPasswordUrl, {
      identifier: email,
      new_password: normalizedPassword,
      reset_session_token: resetToken,
    })
      .then((response) => {
        const message = response.data?.message ;
        console.log('Password reset successfully:', response.data);
        setApiMessage(message);
        setStep('email'); 
        setEmail('');
        setOtp('');
        setResetToken('');
        setNewPassword('');
        navigate('/login');
      }
      )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || error.message || 'Dat mat khau moi that bai';
          setApiMessage(message);
          console.error('Password reset failed:', error.response?.data || error.message);
          return;
        }
        setApiMessage('Dat mat khau moi that bai');
        console.error('Password reset failed:', error);
      });
  };

  const handleOtpSubmit = () => {
    const verifyOtpUrl = getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_OTP);
    setApiMessage('');
      const normalizedOtp = otp.trim();
    if (!normalizedOtp) {
      setApiMessage('Vui long nhap ma OTP');
      return;
    }
    axios.post(verifyOtpUrl, { identifier: email, otp: normalizedOtp })
      .then((response) => {
        const message = response.data?.message || 'Xac thuc OTP thanh cong';
        console.log('OTP verified successfully:', response.data);
        setResetToken(response.data?.reset_session_token || '');
        setApiMessage(message);
        setStep('password');
      }
      )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || error.message || 'Xac thuc OTP that bai';
          setApiMessage(message);
          console.error('OTP verification failed:', error.response?.data || error.message);
          return;
        }
        setApiMessage('Xac thuc OTP that bai');
        console.error('OTP verification failed:', error);
      });
  };

  const handleEmailSubmit = async () => {
    const forgotPasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
    setApiMessage('');

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setApiMessage('Vui long nhap email');
      return;
    }

    try {
      const response = await axios.post(forgotPasswordUrl, { identifier : normalizedEmail });
      const message = response.data?.message || 'Gui ma OTP thanh cong';
      console.log('OTP sent successfully:', response.data);
      setApiMessage(message);
      setStep('otp');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || 'Gui ma OTP that bai';
        setApiMessage(message);
        console.error('Forgot password failed:', error.response?.data || error.message);
        return;
      }
      setApiMessage('Gui ma OTP that bai');
      console.error('Forgot password failed:', error);
    }
  };
  return (
    <ResetPasswordLayout> 
        <AuthMessage message={apiMessage} />
      {step === 'email' && (
        <ResetPasswordForm
          email={email}
          setEmail={setEmail}
          onSubmit={handleEmailSubmit}
        />
      )}

      {step === 'otp' && (
        <OTPVerification
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleOtpSubmit}
          requestOTP={handleEmailSubmit}  
        />
      )}

      {step === 'password' && (
        <NewPasswordForm
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onSubmitNewPassword={handleResetPasswordSubmit}
        />
      )}
    </ResetPasswordLayout>
  );
};

export default ResetPassword;
