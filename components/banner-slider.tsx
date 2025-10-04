"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

const banners = [
  {
    id: 1,
    title: "Premium Quality",
    subtitle: "Meat & Seafood",
    highlight: "Delivered Fresh",
    description:
      "Experience the finest cuts of chicken, beef, and fish sourced from trusted farms and delivered straight to your door with guaranteed freshness.",
    cta: "Shop Now",
    bgImage:
      "https://readdy.ai/api/search-image?query=Premium%20fresh%20meat%20and%20seafood%20display%20with%20chicken%20breast%20beef%20steaks%20and%20salmon%20fish%20arranged%20elegantly%20on%20white%20marble%20background%20with%20soft%20natural%20lighting%20professional%20food%20photography%20clean%20minimalist%20composition&width=1200&height=400&seq=hero001&orientation=landscape",
    bgGradient: "from-primary/10 to-blue-50",
    buttonVariant: "secondary",
  },
  {
    id: 2,
    title: "Farm Fresh",
    subtitle: "Chicken",
    highlight: "Every Day",
    description:
      "Tender, juicy chicken from free-range farms. Hormone-free, antibiotic-free, and raised with care for the perfect family meal.",
    cta: "Shop Chicken",
    bgImage:
      "https://readdy.ai/api/search-image?query=Premium%20organic%20chicken%20cuts%20and%20poultry%20products%20arranged%20beautifully%20on%20rustic%20wooden%20background%20with%20herbs%20and%20spices%20natural%20lighting%20professional%20food%20photography%20clean%20composition&width=1200&height=400&seq=hero002&orientation=landscape",
    bgGradient: "from-secondary/10 to-orange-50",
    buttonVariant: "primary",
  },
  {
    id: 3,
    title: "Prime Grade",
    subtitle: "Beef Cuts",
    highlight: "Expertly Selected",
    description:
      "Hand-selected premium beef from grass-fed cattle. Perfect marbling and tenderness in every cut for the ultimate dining experience.",
    cta: "Shop Beef",
    bgImage:
      "https://readdy.ai/api/search-image?query=Premium%20beef%20steaks%20and%20cuts%20displayed%20on%20dark%20slate%20background%20with%20rosemary%20and%20garlic%20professional%20food%20photography%20dramatic%20lighting%20marbled%20texture%20high%20quality&width=1200&height=400&seq=hero003&orientation=landscape",
    bgGradient: "from-red-50 to-primary/10",
    buttonVariant: "secondary",
  },
  {
    id: 4,
    title: "Ocean Fresh",
    subtitle: "Seafood",
    highlight: "Daily Catch",
    description:
      "Wild-caught and sustainably sourced seafood delivered fresh from dock to door. Rich in flavor and omega-3 nutrients.",
    cta: "Shop Seafood",
    bgImage:
      "https://readdy.ai/api/search-image?query=Fresh%20seafood%20and%20fish%20fillets%20salmon%20tuna%20sea%20bass%20arranged%20on%20ice%20with%20lemon%20and%20herbs%20professional%20food%20photography%20clean%20white%20background%20ocean%20fresh%20quality&width=1200&height=400&seq=hero004&orientation=landscape",
    bgGradient: "from-blue-50 to-cyan-50",
    buttonVariant: "blue",
  },
];

const colors = [
  "var(--color-brand-red)",
  "var(--color-brand-orange)",
  "var(--color-brand-blue)",
];

export function BannerSlider() {
  return (
    <div className="w-full relative h-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        // autoplay={{
        //   delay: 5000,
        //   disableOnInteraction: false,
        // }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-[500px] md:h-[600px]"
        loop={true}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            <div
              className="w-full h-full bg-cover bg-center inset-0 z-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.9), transparent), url('${banner.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="container h-full flex items-center mx-4 md:mx-6">
                <div className="w-full">
                  <div className="max-w-2xl text-start">
                    <h1
                      className="text-2xl md:text-3xl lg:text-[3rem] font-bold text-gray-900 mb-4 leading-tight"
                      style={{ lineHeight: 1 }}
                    >
                      {banner.title} <br />
                      <span
                        className="font-bold"
                        style={{
                          color: colors[(banner.id - 1) % colors.length],
                        }}
                      >
                        {banner.subtitle}
                      </span>{" "}
                      <br />
                      {banner.highlight}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8">
                      {banner.description}
                    </p>
                    <Link
                      href="/products"
                      className="inline-block px-8 py-4 text-lg font-semibold rounded-button whitespace-nowrap transition-colors text-white"
                      style={
                        {
                          backgroundColor:
                            colors[(banner.id - 1) % colors.length],
                          "--tw-bg-opacity": 1,
                          "&:hover": {
                            backgroundColor: `${
                              colors[(banner.id - 1) % colors.length]
                            }E6`, // Slightly transparent on hover
                          },
                        } as React.CSSProperties
                      }
                    >
                      {banner.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
