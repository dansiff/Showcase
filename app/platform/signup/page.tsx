export const metadata = {
  title: "Sign Up — FusionSpace",
  description: "Join as a creator or fan and start connecting",
};

import { Suspense } from "react";
import PlatformSignupForm from "./PlatformSignupForm";

export default function PlatformSignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
      <PlatformSignupForm />
    </Suspense>
  );
}
