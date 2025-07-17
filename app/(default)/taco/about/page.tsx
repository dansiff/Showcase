import AboutPage from "@/components/aboutus";

export const metadata = {
  title: "About Us - Querrepario Tacos",
  description: "Learn about the story, passion, and people behind Querrepario Tacos.",
};  

export default function About() {
  return (
    <div className="min-h-screen bg-orange-50">
      <AboutPage />
    </div>
  );
}