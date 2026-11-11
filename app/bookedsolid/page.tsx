import type { Metadata } from "next";
import BookedSolidApp from "./bookedsolid-app";

export const metadata: Metadata = {
  title: "BookedSolid | Fade & Glow Studio Demo",
  description: "A sample booking and no-show reduction experience for a Chicago barbershop and beauty studio.",
};

export default function BookedSolidPage() {
  return <BookedSolidApp />;
}
