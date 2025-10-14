import Hero from "./components/hero";
import MissionSection from "./components/mission-section";
import DonationSection from "./components/donation-section";

export const metadata = {
  title: "Our Church | A Home for Foster Children",
  description: "We provide a home for foster children and serve the needy through Christ-centered love.",
};

export default function ChurchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-gray-900 text-white">
      <Hero />
      <MissionSection />
      <DonationSection />
      <footer className="py-10 text-center text-indigo-200/60">
        <p>“Let the children come to me.” — Matthew 19:14</p>
      </footer>
    </main>
  );
}
