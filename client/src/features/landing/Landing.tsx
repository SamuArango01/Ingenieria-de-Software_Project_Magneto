import { Header } from "./components/Header";
import { Prices } from "./components/Prices";
import { Info } from "./components/Info";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Info />
      <Prices />
    </main>
  );
}
