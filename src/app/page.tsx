import { Metadata } from 'next';
import Header from '@/components/common/header';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import ProblemSolutionSection from '@/components/landing/problem-solution';
import CaseStudiesSection from '@/components/landing/case-studies';
import TestimonialsSection from '@/components/landing/testimonials';
import ContactFormSection from '@/components/landing/contact-form-section';
import FAQSection from '@/components/landing/faq-section';
import Footer from '@/components/common/footer';

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
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Problem-Solution Section */}
        <ProblemSolutionSection />

      {/* Case Studies Section */}
      <CaseStudiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Form Section */}
      <ContactFormSection />

      {/* FAQ Section */}
      <FAQSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}