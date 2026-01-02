'use client';

import { CheckCircle, Users, BookOpen, Volume2, Brain, Zap } from 'lucide-react';

const services = [
  {
    category: 'For Children',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    specializations: [
      'Autism Spectrum Disorder',
      'ADHD & Executive Functioning',
      'Speech Sound Disorders',
      'Language Development Delays',
      'Stuttering & Fluency',
      'Confidence & Self-Advocacy'
    ]
  },
  {
    category: 'For Adults',
    icon: Volume2,
    color: 'from-indigo-500 to-purple-500',
    specializations: [
      'Cognitive-Communication Therapy',
      'Aphasia & Language Disorders',
      'Public Speaking Coaching',
      'Professional Communication',
      'Voice & Articulation',
      'Swallowing Disorders'
    ]
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Specialized Speech Therapy Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Individualized treatment plans tailored to your unique communication goals, offered in English, Spanish, or bilingually.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.category} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {service.category}
                </h3>

                <ul className="space-y-4">
                  {service.specializations.map((spec) => (
                    <li key={spec} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Approach Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-8">Our Evidence-Based Approach</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <Brain className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Personalized</h4>
                <p className="text-blue-100">Each treatment plan is customized to address your specific goals and learning style.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Practical</h4>
                <p className="text-blue-100">Real-world strategies you can use immediately in daily communication.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <BookOpen className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Evidence-Based</h4>
                <p className="text-blue-100">Built on latest research and best practices in speech-language pathology.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
