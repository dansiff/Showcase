"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Code, Rocket } from "lucide-react";

export default function LearnToCodeCourse() {
  const handleEnroll = () => {
    // TODO: Replace with Stripe Checkout or your payment link
    window.location.href = "/checkout?course=learn-to-code";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-white p-6">
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-10 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl font-bold text-gray-800">
                Learn to Code Websites 🚀
              </h1>
              <p className="text-lg text-gray-600">
                Build your own platform using <span className="font-semibold">Vercel</span> +{" "}
                <span className="font-semibold">React.js</span> — for just{" "}
                <span className="text-orange-600 font-bold">$30</span>.
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code className="w-8 h-8 text-orange-500" />,
                  title: "Hands-on Coding",
                  desc: "Learn by building real-world web apps with React.js.",
                },
                {
                  icon: <Rocket className="w-8 h-8 text-yellow-500" />,
                  title: "Deploy to Vercel",
                  desc: "Go live instantly with modern deployment best practices.",
                },
                {
                  icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                  title: "Your Platform",
                  desc: "A robust starting point to launch your own website idea.",
                },
              ].map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center space-y-3 bg-white p-6 rounded-xl shadow-md"
                >
                  {f.icon}
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-4"
            >
              <p className="text-xl font-semibold text-gray-800">
                Start building your future today 🚀
              </p>
              <Button
                size="lg"
                onClick={handleEnroll}
                className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-10 py-6 rounded-xl shadow-lg transition"
              >
                Enroll Now – $30
              </Button>
              <p className="text-sm text-gray-500">Lifetime access. No recurring fees.</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
