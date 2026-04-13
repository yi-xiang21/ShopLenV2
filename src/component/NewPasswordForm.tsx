// import { useState } from 'react';

// type Props = {
//   newPassword: string;
//   setNewPassword: React.Dispatch<React.SetStateAction<string>>;
//   confirmPassword: string;
//   setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
//   onSubmit: () => void;
//   isLoading: boolean;
//   onBack: () => void;
// };

// const NewPasswordForm = ({
//   newPassword,
//   setNewPassword,
//   confirmPassword,
//   setConfirmPassword,
//   onSubmit,
//   isLoading,
//   onBack,
// }: Props) => {

//   return (
//     <div className="space-y-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 pb-4">Đặt mật khẩu mới</p>
//       <h2 className="text-3xl font-semibold text-slate-900 pb-3">Mật khẩu mới</h2>
//       <p className="text-sm text-slate-500 pb-6">Nhập mật khẩu mới để hoàn tất quy trình.</p>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//             onSubmit();
//         }}
//         className="space-y-4"
//       >
//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Mật khẩu mới"
//             className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
//           >
//             {showPassword ? '🙈' : '👁️'}
//           </button>
//         </div>

//         {newPassword && newPassword.length < 6 && (
//           <p className="text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự</p>
//         )}

//         <div className="relative">
//           <input
//             type={showConfirm ? 'text' : 'password'}
//             placeholder="Xác nhận mật khẩu"
//             className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirm(!showConfirm)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
//           >
//             {showConfirm ? '🙈' : '👁️'}
//           </button>
//         </div>

//         {confirmPassword && !passwordMatch && (
//           <p className="text-xs text-red-600">Mật khẩu không trùng khớp</p>
//         )}

//         <button
//           type="submit"
//           disabled={isLoading || !passwordMatch || !passwordValid}
//           className="w-full cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-95 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-4 font-semibold text-white shadow-lg shadow-orange-300/40 hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
//         >
//           {isLoading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
//         </button>
//       </form>

//       <button
//         type="button"
//         onClick={onBack}
//         className="w-full cursor-pointer transition duration-150 rounded-xl border border-slate-200 px-4 py-4 font-semibold text-slate-600 hover:bg-slate-50"
//       >
//         Quay lại
//       </button>
//     </div>
//   );
// };

// export default NewPasswordForm;
