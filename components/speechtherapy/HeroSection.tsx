'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:gap-8 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Speech & Language Pathology</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Confident Communication 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Starts Here</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Expert bilingual speech therapy services for children and adults in the Chicago area. Over 12 years of specialized experience in supporting diverse communication needs with compassionate, individualized care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg h-12"
              >
                Schedule Your Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg h-12"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">12+</p>
                <p className="text-sm text-slate-600">Years Experience</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">2</p>
                <p className="text-sm text-slate-600">Languages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">MA</p>
                <p className="text-sm text-slate-600">Master's Degree</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-32 h-32 text-indigo-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">Professional Hero Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
