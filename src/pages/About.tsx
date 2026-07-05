
import {
  Heart,
  Users,
  Flower2,
  Sparkles,
} from "lucide-react";
import { CiInstagram   } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import sectionAbout from "../assets/sectionAbout.jpg";
import BannerAbout from "../assets/BannerAbout.png";
import Discover from "../assets/section3.jpg";
import ParallaxSection from "../component/ParallaxSection";
import AboutSocial from "../assets/AboutSocial.jpg";
const About = () => {
  return (
    <div className="bg-[#faf7f3] text-[#4a3b33]">
      {/* HERO */}
      <section className="relative flex h-250 items-center justify-center overflow-hidden">
        <img
          src={BannerAbout}
          alt=""
          className="absolute inset-0 h-full w-full object-center "
        />
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm uppercase tracking-widest text-amber-700">
              Câu chuyện của chúng tôi
            </p>

            <h2 className="mb-6 text-4xl font-light">
              Từ đam mê thủ công đến cộng đồng yêu len
            </h2>

            <p className="mb-4 leading-8 text-slate-600">
              Shop được tạo ra với mong muốn mang đến những loại len chất lượng,
              mềm mại và phù hợp cho cả người mới bắt đầu lẫn những người yêu
              thích đan móc lâu năm.
            </p>

            <p className="leading-8 text-slate-600">
              Không chỉ bán sản phẩm, chúng tôi còn muốn xây dựng một cộng đồng
              nơi mọi người có thể chia sẻ thành phẩm, học hỏi kỹ thuật mới và
              tìm thấy cảm hứng sáng tạo mỗi ngày.
            </p>
          </div>

          <div>
            <img
              src={sectionAbout}
              alt="a"
              className="h-full w-full rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>


      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-light">Giá trị chúng tôi theo đuổi</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-[#faf7f3] p-8 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10" />
              <h3 className="mb-3 text-xl font-semibold">Tận tâm</h3>
              <p className="text-slate-600">
                Mỗi sản phẩm đều được lựa chọn kỹ lưỡng trước khi đến tay khách
                hàng.
              </p>
            </div>

            <div className="rounded-3xl bg-[#faf7f3] p-8 text-center">
              <Flower2 className="mx-auto mb-4 h-10 w-10" />
              <h3 className="mb-3 text-xl font-semibold">Sáng tạo</h3>
              <p className="text-slate-600">
                Luôn cập nhật mẫu len, phụ kiện và workshop mới.
              </p>
            </div>

            <div className="rounded-3xl bg-[#faf7f3] p-8 text-center">
              <Users className="mx-auto mb-4 h-10 w-10" />
              <h3 className="mb-3 text-xl font-semibold">Cộng đồng</h3>
              <p className="text-slate-600">
                Kết nối những người yêu thích đan móc trên khắp mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </section>


      <ParallaxSection image={AboutSocial}>
        <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h1 className="mb-2 text-sm uppercase tracking-widest">
            Community
          </h1>
          <p className="mb-4 text-amber-300">
            Tham gia cộng đồng của chúng tôi
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <a
            href="#"
            className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2"
          >
            <FaFacebook className="mb-4 h-10 w-10 text-blue-600" />

            <h3 className="mb-2 text-2xl font-semibold">
              Facebook Community
            </h3>

            <p className="text-slate-600">
              Chia sẻ thành phẩm, hỏi đáp kỹ thuật và tham gia các hoạt động của
              cộng đồng yêu len.
            </p>
          </a>

          <a
            href="#"
            className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2"
          >
            <CiInstagram className="mb-4 h-10 w-10 text-pink-500" />

            <h3 className="mb-2 text-2xl font-semibold">
              Instagram Inspiration
            </h3>

            <p className="text-slate-600">
              Khám phá các tác phẩm nổi bật, xu hướng màu sắc và ý tưởng handmade
              mới nhất.
            </p>
          </a>
        </div>
        </div>
      </ParallaxSection>


      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10" />

          <h2 className="mb-4 text-4xl font-light">
            Workshop & Sự kiện định kỳ
          </h2>

          <p className="mx-auto max-w-2xl text-slate-600 leading-8">
            Chúng tôi thường xuyên tổ chức các workshop làm hoa len, thú len và
            các sản phẩm thủ công dành cho cả người mới bắt đầu lẫn người đã có
            kinh nghiệm.
          </p>
        </div>
      </section>


      <ParallaxSection 
        image={Discover}
      >
        <div className="mx-auto max-w-4xl rounded-[40px] px-8 py-16 text-center"
       
        >
          <h2 className="mb-4 text-4xl text-white font-light">
            Cùng tạo nên những điều đẹp đẽ từ sợi len
          </h2>

          <p className="mb-8 text-black text-lg leading-8 ">
            Khám phá các sản phẩm mới nhất hoặc tham gia cộng đồng của chúng tôi.
          </p>

          <button className="button_user">
            Khám phá sản phẩm
          </button>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default About;