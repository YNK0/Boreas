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
// Temporarily disabled analytics
// import { ScrollTracker, SectionTracker } from '@/components/analytics/tracking-components';
// import { ConsentBanner } from '@/components/analytics/posthog-provider';

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
      {/* Analytics tracking components - temporarily disabled */}
      {/* <ScrollTracker /> */}

      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        {/* <SectionTracker sectionName="hero"> */}
          <HeroSection />
        {/* </SectionTracker> */}

        {/* Features Section */}
        {/* <SectionTracker sectionName="features"> */}
          <FeaturesSection />
        {/* </SectionTracker> */}

        {/* Problem-Solution Section */}
        {/* <SectionTracker sectionName="problem-solution"> */}
          <ProblemSolutionSection />
        {/* </SectionTracker> */}

        {/* Case Studies Section */}
        {/* <SectionTracker sectionName="case-studies"> */}
          <CaseStudiesSection />
        {/* </SectionTracker> */}

        {/* Testimonials Section */}
        {/* <SectionTracker sectionName="testimonials"> */}
          <TestimonialsSection />
        {/* </SectionTracker> */}

        {/* Contact Form Section */}
        {/* <SectionTracker sectionName="contact-form"> */}
          <ContactFormSection />
        {/* </SectionTracker> */}

        {/* FAQ Section */}
        {/* <SectionTracker sectionName="faq"> */}
          <FAQSection />
        {/* </SectionTracker> */}

        {/* Footer */}
        <Footer />
      </main>

      {/* GDPR Consent Banner - temporarily disabled */}
      {/* <ConsentBanner /> */}
    </div>
  );
}