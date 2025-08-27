"use client";
// app/contact/page.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Example — replace with your own API/email service
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert("Message sent! We'll be in touch soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We’d love to hear from you! Whether you’re looking to start a
            project, need support, or just want to say hello.
          </p>
        </div>

        {/* Contact Form + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" name="name" placeholder="Your Name" required />
                <Input type="email" name="email" placeholder="Your Email" required />
                <Input type="text" name="subject" placeholder="Subject" />
                <Textarea name="message" placeholder="Your Message" rows={5} required />
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Our Info</h2>
                <p className="text-gray-700">
                  <strong>Email:</strong> contact@sandovalbros.com
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> (312) 555-1234
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> Chicago, IL
                </p>
              </CardContent>
            </Card>

            {/* Optional Google Maps */}
            <Card className="overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.624...yourMapEmbedCodeHere..."
                width="100%"
                height="200"
                loading="lazy"
                className="border-0"
              ></iframe>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Looking for a partner?</h3>
          <p className="text-gray-600 mb-4">
            Let’s collaborate and build something great together.
          </p>
          <Button variant="primary">Schedule a Free Consultation</Button>
        </div>
      </div>
    </div>
  );
}
