import AnimatedDeals from "@/components/store/home/animated-deals";
import Featured from "@/components/store/home/main/featured";
import HomeMainSwiper from "@/components/store/home/main/home-swiper";
import HomeUserCard from "@/components/store/home/main/user/user";
import Sideline from "@/components/store/home/sideline/sideline";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import SuperDealsImg from "@/public/assets/images/ads/super-deals.avif";
import MainSwiper from "@/components/store/shared/swiper";
import { SimpleProduct } from "@/lib/types";
import { getHomeDataDynamic, getHomeFeaturedCategories } from "@/queries/home";
import { getProducts } from "@/queries/product";
import Image from "next/image";
import FeaturedCategories from "@/components/store/home/featured-categories";
import ProductCard from "@/components/store/cards/product/product-card";

// Set dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Create fallback data in case database connection fails
  let products = [];
  let products_super_deals = [];
  let products_best_deals = [];
  let products_user_card = [];
  let products_featured = [];

  try {
    // Try to fetch data from the database
    const productsData = await getProducts({}, "", 1, 100);
    products = productsData.products;

    const homeData = await getHomeDataDynamic([
      { property: "offer", value: "best-deals", type: "simple" },
      { property: "offer", value: "super-deals", type: "full" },
      { property: "offer", value: "user-card", type: "simple" },
      { property: "offer", value: "featured", type: "simple" },
    ]);

    products_super_deals = homeData.products_super_deals;
    products_best_deals = homeData.products_best_deals;
    products_user_card = homeData.products_user_card;
    products_featured = homeData.products_featured;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Continue with empty arrays, the UI will handle empty states
  }

  return (
    <>
      <Header />
      <CategoriesHeader />
      <div className="relative w-full">
        <Sideline />
        <div className="relative w-[calc(100%-40px)] h-full bg-[#e3e3e3]">
          <div className="max-w-[1600px] mx-auto min-h-screen p-4">
            {/* Main */}
            <div className="w-full grid gap-2 min-[1170px]:grid-cols-[1fr_350px] min-[1465px]:grid-cols-[200px_1fr_350px]">
              {/* Left */}
              <div
                className="cursor-pointer hidden min-[1465px]:block bg-cover bg-no-repeat rounded-md"
                style={{
                  backgroundImage:
                    "url(/assets/images/ads/winter-sports-clothing.jpg)",
                }}
              />
              {/* Middle */}
              <div className="space-y-2 h-fit">
                {/* Main swiper */}
                <HomeMainSwiper />
                {/* Featured card */}
                {products_featured.length > 0 ? (
                  <Featured
                    products={products_featured.filter(
                      (product): product is SimpleProduct =>
                        "variantSlug" in product
                    )}
                  />
                ) : (
                  <div className="bg-white p-4 rounded-md">
                    <h2 className="text-xl font-bold">Featured Products</h2>
                    <p className="text-gray-500">No products available</p>
                  </div>
                )}
              </div>
              {/* Right */}
              <div className="h-full">
                {products_user_card.length > 0 ? (
                  <HomeUserCard
                    products={products_user_card.filter(
                      (product): product is SimpleProduct =>
                        "variantSlug" in product
                    )}
                  />
                ) : (
                  <div className="bg-white p-4 rounded-md h-full">
                    <h2 className="text-xl font-bold">User Card</h2>
                    <p className="text-gray-500">No products available</p>
                  </div>
                )}
              </div>
            </div>
            {/* Animated deals */}
            <div className="mt-2 hidden min-[915px]:block">
              {products_best_deals.length > 0 ? (
                <AnimatedDeals
                  products={products_best_deals.filter(
                    (product): product is SimpleProduct =>
                      "variantSlug" in product
                  )}
                />
              ) : (
                <div className="bg-white p-4 rounded-md">
                  <h2 className="text-xl font-bold">Best Deals</h2>
                  <p className="text-gray-500">No deals available</p>
                </div>
              )}
            </div>
            <div className="mt-10 space-y-10">
              <div className="bg-white rounded-md">
                {products_super_deals.length > 0 ? (
                  <MainSwiper products={products_super_deals} type="curved">
                    <div className="mb-4 pl-4 flex items-center justify-between">
                      <Image
                        src={SuperDealsImg}
                        alt="Super deals"
                        width={200}
                        height={50}
                      />
                    </div>
                  </MainSwiper>
                ) : (
                  <div className="p-4">
                    <div className="mb-4 pl-4 flex items-center justify-between">
                      <Image
                        src={SuperDealsImg}
                        alt="Super deals"
                        width={200}
                        height={50}
                      />
                    </div>
                    <p className="text-gray-500 text-center py-8">No super deals available</p>
                  </div>
                )}
              </div>

              <FeaturedCategories />

              <div>
                {/* Header */}
                <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                  <span>More to love</span>
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                </div>
                <div className="mt-7 bg-white justify-center flex flex-wrap min-[1530px]:grid min-[1530px]:grid-cols-7 p-4 pb-16 rounded-md">
                  {products.length > 0 ? (
                    products.map((product, i) => (
                      <ProductCard key={i} product={product} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 w-full">No products available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
