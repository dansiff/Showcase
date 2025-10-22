export const metadata = {
  title: "Sign Up — Showcase",
  description: "Join as a creator or fan",
};

import SignupForm from "./SignupForm";

export default function SignUp() {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-gray-600">
            Join creators and fans building connections
          </p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}

