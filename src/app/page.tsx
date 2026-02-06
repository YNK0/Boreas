import { Metadata } from 'next';
import Header from '@/components/common/header';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import ProblemSolutionSection from '@/components/landing/problem-solution';
import Footer from '@/components/common/footer';
// Analytics tracking components
import { ScrollTracker, SectionTracker } from '@/components/analytics/tracking-components';
import { ConsentBanner } from '@/components/analytics/posthog-provider';
// Intersection observer-based lazy components
import {
  LazyCaseStudies,
  LazyTestimonials,
  LazyContactForm,
  LazyFAQ
} from '@/components/ui/lazy-section';

export const metadata: Metadata = {
  title: "Automatización WhatsApp para Salones, Restaurantes y Clínicas",
  description: "Aumenta 40% tus citas automatizando WhatsApp. Casos reales: Salón Carmen, Restaurante Miguel. Demo gratuita en 15 minutos.",
  keywords: [
    "automatización whatsapp negocio",
    "whatsapp business automático",
    "agendar citas whatsapp",
    "automatizar mensajes whatsapp"
  ],
  alternates: {
    canonical: "https://boreas.mx"
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Analytics tracking components */}
      <ScrollTracker />

      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <SectionTracker sectionName="hero">
          <HeroSection />
        </SectionTracker>

        {/* Features Section */}
        <SectionTracker sectionName="features">
          <FeaturesSection />
        </SectionTracker>

        {/* Problem-Solution Section */}
        <SectionTracker sectionName="problem-solution">
          <ProblemSolutionSection />
        </SectionTracker>

        {/* Case Studies Section - Intersection Observer Lazy Loading */}
        <SectionTracker sectionName="case-studies">
          <LazyCaseStudies id="cases" />
        </SectionTracker>

        {/* Testimonials Section - Intersection Observer Lazy Loading */}
        <SectionTracker sectionName="testimonials">
          <LazyTestimonials />
        </SectionTracker>

        {/* Contact Form Section - Intersection Observer Lazy Loading */}
        <SectionTracker sectionName="contact-form">
          <LazyContactForm id="contact" />
        </SectionTracker>

        {/* FAQ Section - Intersection Observer Lazy Loading */}
        <SectionTracker sectionName="faq">
          <LazyFAQ />
        </SectionTracker>

        {/* Footer */}
        <Footer />
      </main>

      {/* GDPR Consent Banner */}
      <ConsentBanner />
    </div>
  );
}