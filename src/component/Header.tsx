import { useCallback, useEffect, useState } from "react";
import {
  FaBars,
  FaRegUser,
  FaShoppingCart,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/Logo.png";
import HeaderDesktopMenu from "@/component/HeaderDesktopMenu";
import HeaderMobileMenu from "@/component/HeaderMobileMenu";
import Badge from "antd/es/badge/Badge";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck";
import type { ProductSearch } from "@/pages/Admin/managerProducts/type/products";
import {ProductApi} from "@/pages/Admin/managerProducts/api/products_api";
import { getCart, syncCart } from "@/pages/User/cart/store/cart_thunck";
import type { cart ,CartSync} from "@/pages/User/Cart/types/cart";
import { WorkshopApi } from "@/pages/Admin/managerWorkshop/api/workShop_api";
export type ActiveMenuKey = "home" | "shop" | "about" | "workshop";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { items: cartItems } = useAppSelector((state) => state.Cart);

  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<ProductSearch[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        const res =
        {
          keyword: keyword.trim(),
          page: 1,
          limit: 20
        }
        ProductApi.filter(res)
          .then((response) => {
          
            
            setProducts(response.data.data.products || [] );
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
          });
        WorkshopApi.getAll(res)
        .then((response) => {
          
          setProducts((prev)=>[...prev, ...response.data.data.workshops || []]);
        })
        .catch((error) => {
          console.error("Error fetching workshops:", error);
        });
        
        
      } else {
        setProducts([]);
      }
      
    }, 1000);
    

    return () => clearTimeout(timer);
  } 
  , [keyword]);


const handleLoginSuccess = useCallback(async () => {
  try {
    const localCartStr = localStorage.getItem('localCart');
    const localCartData: cart[] = localCartStr ? JSON.parse(localCartStr) : [];

    if (localCartData.length > 0) {
      const syncPayload: CartSync = {
        local_cart: 
          localCartData.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
      };
      
      await dispatch(syncCart(syncPayload)).unwrap();
      localStorage.removeItem('localCart');
    } else {
      dispatch(getCart());
    }
  } catch (error) {
    console.error("Lỗi đồng bộ giỏ hàng:", error);
  }
}, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getWishlistThunk());
      handleLoginSuccess();
    }
  }, [user, dispatch, handleLoginSuccess]);
  const router = () => {
    if (!user) return "/auth/login";

    if (user.role === "admin") return "/admin";
    else if (user.role === "shipper") return "/shipper";
    return "/profile";
  };

  const location = useLocation();
  const getActiveMenu = (): ActiveMenuKey => {
  const path = location.pathname;

  if (path.startsWith("/shop"))
    return "shop";

  if (path.startsWith("/about"))
    return "about";

  if (path.startsWith("/workshop"))
    return "workshop";

  return "home";
};
  const activeMenu = getActiveMenu();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }> =
    [
      { key: "home", label: "Trang chủ", link: "/" },
      { key: "shop", label: "Cửa hàng", link: "/shop" },
      { key: "about", label: "Giới thiệu", link: "/about" },
      { key: "workshop", label: "workshop", link: "/workshop" },
    ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };



  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-sm ">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-1 py-1">
          <button
            className="rounded-md p-2 text-gray-700 hover:bg-rose-200 md:hidden"
            onClick={() => {
              setIsMobileMenuOpen((prev) => {
                return !prev;
              });
            }}
            type="button"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-4 w-4" />
            ) : (
              <FaBars className="h-4 w-4" />
            )}
          </button>

          <a className="text-xl font-black tracking-wider md:text-2xl" href="/">
            <img
              alt="ShopLen"
              className="h-10 w-auto object-contain md:h-20"
              src={logo}
            />
          </a>

          <div className="flex-1">
            <div className="relative mx-auto w-4/5">
              <div>
                <input
                  className={`w-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs outline-none transition-all duration-200 focus:bg-white focus:shadow-sm md:text-sm ${
                    keyword.trim() && isFocused
                      ? "rounded-t-2xl rounded-b-none"
                      : "rounded-full"
                  }`}
                  placeholder="Tìm kiếm sản phẩm..."
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiSearch
                    aria-hidden="true"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                  />
                </span>
              </div>
              {isFocused  && keyword.trim() && (
                <div className="max-h-80 overflow-y-auto rounded-b-2xl w-full absolute top-full left-0 bg-white shadow-lg z-10 border-x border-b border-gray-200 flex flex-col">
                  {products.length > 0 ? (
                    <ul className="py-2 w-full">
                      {products.map((product) => (
                        <li
                          key={product.product_id}
                          className="px-4 py-2 w-full hover:bg-gray-200 hover:cursor-pointer"
                          onMouseDown={() => {
                            if(product.workshop_id)
                            {
                              navigate(`/workshop-detail/${product.workshop_id}`);
                            }else{
                                navigate(`/detail/${product.product_id}`);
                            }
                            setIsFocused(false);
                            setKeyword("");
                          }
                          }
                        >
                          {product.workshop_id ? product.title : product.product_name} 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-2 py-2 text-gray-500">
                      Không tìm thấy sản phẩm
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              aria-label="Tai khoan"
              className="rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800"
              type="button"
              to={router()}
            >
              <FaRegUser aria-hidden="true" className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Yêu thích"
              className="rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800"
              to={"/wishlist"}
            >
              <Badge count={wishlistItems.length}>
                <FaHeart aria-hidden="true" className="h-5 w-5" />
              </Badge>
            </Link>
            <button
              aria-label="Gio hang"
              className="relative rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800 hover:cursor-pointer"
              type="button"
              onClick={() => {
                navigate("/cart");
              }}
            >
              <Badge count={cartItems.length}>
                <FaShoppingCart aria-hidden="true" className="h-5 w-5" />
              </Badge>
            </button>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm h-auto">
        <div className="bg-white">
          <HeaderDesktopMenu
            activeMenu={activeMenu}
            menuItems={menuItems}
          />
        </div>

        <HeaderMobileMenu
          activeMenu={activeMenu}
          isOpen={isMobileMenuOpen}
          menuItems={menuItems}
          onCloseMenu={closeMobileMenu}
        />
      </header>
    </>
  );
};

export default Header;
