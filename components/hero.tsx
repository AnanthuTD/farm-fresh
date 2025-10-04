import { BannerSlider } from "./banner-slider";
import { FeaturesSection } from "./features-section";

export function Hero() {
  return (
    <>
      <section className="relative bg-background">
        {/* Banner Slider */}
        <div className="h-96">
          <BannerSlider />
        </div>
      </section>
    </>
  );
}
