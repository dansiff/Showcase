'use client';

import { Star, MessageSquare } from 'lucide-react';

const testimonials = [
  {
    content: 'We are so happy that we found Esmeralda! Since day one, she has been incredibly helpful and dedicated in working with our son. She not only listens to our concerns about his speech but provides great advice and strategies that have made a real difference. Our son has developed a wonderful relationship with her.',
    author: 'Suleiny M.',
    relationship: 'Parent',
    rating: 5
  },
  {
    content: 'Esmeralda is professional, knowledgeable, and genuinely cares about her clients. The strategies she provided have helped my daughter gain confidence in her communication skills. Highly recommend!',
    author: 'Maria G.',
    relationship: 'Parent',
    rating: 5
  },
  {
    content: 'As a fellow speech-language pathologist, I appreciate Esmeralda\'s evidence-based approach and dedication to her clients. Her bilingual expertise is exceptional.',
    author: 'Dr. Patricia L.',
    relationship: 'Speech-Language Pathologist',
    rating: 5
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Hear from Our Brilliant Community
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real results from families and clients we've had the privilege to serve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Message Icon */}
              <MessageSquare className="w-10 h-10 text-indigo-300 mb-4" />

              {/* Content */}
              <p className="text-slate-700 mb-6 text-base leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-600">{testimonial.relationship}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
