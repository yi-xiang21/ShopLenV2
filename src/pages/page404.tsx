

import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ArrowLeft } from 'lucide-react';
import catAnimation from '@/assets/animation/404 error page with cat.json';

const PageNotFound = () => {
  const navigate = useNavigate();
  const LottieComponent = Lottie as any;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
             
              <LottieComponent.default
                animationData={catAnimation}
                loop
                autoplay
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center md:text-left">
            <h1 className="text-6xl md:text-7xl font-bold text-indigo-600 mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Oops! Trang không tồn tại
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Xin lỗi, trang bạn tìm kiếm không thể tìm thấy. Có thể URL không chính xác hoặc trang đã bị xóa.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Quay về Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
