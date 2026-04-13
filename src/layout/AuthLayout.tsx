import type { ReactNode } from "react";
import loginImage from "../assets/login.jpg";
import registerImage from "../assets/register.jpg";

export type AuthMode = "login" | "register";

type Props = {
  mode: AuthMode;
  children: ReactNode;
};

const AuthLayout = ({ mode, children }: Props) => {
  const imageSrc = mode === "login" ? loginImage : registerImage;
  const bounceClass =
    mode === "login"
      ? "animate-[authBounceIn_900ms_cubic-bezier(0.2,0.9,0.2,1.08)]"
      : "animate-[authBounceOut_900ms_cubic-bezier(0.2,0.9,0.2,1.08)]";

  return (
    
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12">
        <div
          className={`grid w-full overflow-hidden rounded-[28px] border border-orange-200/60 bg-white/90 shadow-2xl shadow-orange-200/45 backdrop-blur-sm md:min-h-160 md:grid-cols-[1.05fr_0.95fr] ${bounceClass}`}
        >
          <div className="relative hidden md:order-1 md:block h-160">
            <img src={imageSrc} alt="Auth visual" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center justify-center bg-white/85 p-6 md:order-2 ">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </div>
  );
};

export default AuthLayout;
