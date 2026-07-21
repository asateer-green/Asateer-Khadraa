import { FeaturedWork } from "./components/FeaturedWork";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";

export function Home() {
  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-primary)" }}
    >
      <Hero />
      <FeaturedWork />
      <Services />

      <Features />
    </div>
  );
}

export default Home;
