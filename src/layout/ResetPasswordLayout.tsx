type Props = {
  children: React.ReactNode;
};

const ResetPasswordLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default ResetPasswordLayout;
