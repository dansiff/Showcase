import Image from "next/image";

export const metadata = {
  title: "About Us - Querrepario Tacos",
  description: "Learn about the story, passion, and people behind Querrepario Tacos.",
};

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-10 space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-5xl font-brand text-orange-600 mb-4">Our Story</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Born in the heart of Chicago, Querrepario Tacos is a celebration of bold flavors,
          family tradition, and the joy of sharing a good meal.
        </p>
      </div>

      {/* Mission + Image */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">Made with Passion</h2>
          <p className="text-gray-600 text-md leading-relaxed">
            What started as a small food stand on Lake Street grew into a beloved local gem. Our
            secret? Real ingredients, handmade tortillas, and recipes passed down for generations.
            We take pride in every taco served, honoring our roots while bringing fresh flavor to
            every bite.
          </p>
          <p className="text-gray-600 text-md leading-relaxed">
            Whether it's Taco Tuesday or your first time here, you're part of the family. Welcome to
            Querrepario.
          </p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-xl border border-orange-200">
          <Image
            src="/images/family-taco.jpg"
            alt="Taco family tradition"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Location + Map Embed */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">Visit Us</h2>
          <p className="text-gray-600 text-md leading-relaxed">
            We’re located in the vibrant Austin neighborhood. Stop by and enjoy a plate of tacos
            with the people who care about flavor and community.
          </p>
          <div className="text-sm text-gray-700 font-medium">
            <p>📍 4720 W Lake St, Chicago, IL 60644</p>
            <p>📞 (312) 555-1234</p>
            <p>🕐 Open Daily: 11am – 9pm</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg border border-orange-200">
          <iframe
            title="Querrepario Tacos Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.4471282186493!2d-87.74929368430623!3d41.88991417125282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e3420a1d8b6ed%3A0x4a8729fd160b5fcb!2s4720%20W%20Lake%20St%2C%20Chicago%2C%20IL%2060644!5e0!3m2!1sen!2sus!4v1713303374372!5m2!1sen!2sus"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
