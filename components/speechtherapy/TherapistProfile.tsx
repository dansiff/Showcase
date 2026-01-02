'use client';

import { Award, GraduationCap, MapPin, Globe } from 'lucide-react';

export default function TherapistProfile() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-2xl opacity-15"></div>
            <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center">
                <Award className="w-24 h-24 text-indigo-300 mx-auto mb-4" />
                <p className="text-slate-500">Professional Photo</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Esmeralda Sánchez, M.A. CCC-SLP/L
            </h2>
            <p className="text-lg text-indigo-600 font-semibold mb-6">
              Licensed Speech-Language Pathologist
            </p>

            <p className="text-slate-700 text-lg mb-8 leading-relaxed">
              With over 12 years of experience in early intervention, public schools, and private practice, I specialize in supporting children and adults with diverse communication needs. My mission is to empower individuals to build confidence and develop lifelong communication skills.
            </p>

            {/* Credentials */}
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Master's Degree</h4>
                  <p className="text-slate-600">Communication Sciences & Disorders, Indiana University</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Bachelor's Degrees</h4>
                  <p className="text-slate-600">Speech-Language Pathology, Spanish & Women's Studies, Saint Xavier University</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Bilingual Specialization</h4>
                  <p className="text-slate-600">Spanish-English bilingual speech therapy training & expertise</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Licensed in Illinois</h4>
                  <p className="text-slate-600">Serving Chicago and surrounding suburbs</p>
                </div>
              </div>
            </div>

            <p className="text-slate-700 text-base leading-relaxed">
              Recognizing the need for specialized speech therapy services in the Chicago area, I founded Bilingual and Brilliant Speech Therapy LLC to better serve families throughout the metropolitan region. Every client receives individualized, compassionate care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
