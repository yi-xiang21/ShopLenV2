import { useState } from 'react';
import ResetPasswordLayout from '../layout/ResetPasswordLayout';
import ResetPasswordForm from '../component/ResetPasswordForm';
import OTPVerification from '../component/OTPVerification';
// import { getApiUrl } from '../config/api';
// import { API_CONFIG } from '../config/api';
// import axios from 'axios';
// import AuthMessage from '../component/AuthMessage';
// import NewPasswordForm from '../component/NewPasswordForm';

type Step = 'email' | 'otp' | 'password';

const ResetPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
//   const [apiMessage, setApiMessage] = useState<string>('');

  const handleOtpSubmit = () => {
    setStep('password');
  };

  const handleEmailSubmit = async () => {
    // const forgotPasswordUrl = getApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
    // setApiMessage('');

    // const normalizedEmail = email.trim();
    // if (!normalizedEmail) {
    //   setApiMessage('Vui long nhap email');
    //   return;
    // }

    // try {
    //   const response = await axios.post(forgotPasswordUrl, { email: normalizedEmail });
    //   const message = response.data?.message || 'Gui ma OTP thanh cong';
    //   console.log('OTP sent successfully:', response.data);
    //   setApiMessage(message);
    //   setStep('otp');
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     const message =
    //       error.response?.data?.message || error.message || 'Gui ma OTP that bai';
    //     setApiMessage(message);
    //     console.error('Forgot password failed:', error.response?.data || error.message);
    //     return;
    //   }
    //   setApiMessage('Gui ma OTP that bai');
    //   console.error('Forgot password failed:', error);
    // }
  };
  return (
    <ResetPasswordLayout> 
        {/* <AuthMessage message={apiMessage} /> */}
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

      {/* {step === 'password' && (
        <NewPasswordForm
          
        />
      )} */}
    </ResetPasswordLayout>
  );
};

export default ResetPassword;
