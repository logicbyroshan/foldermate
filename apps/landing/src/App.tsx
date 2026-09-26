import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import FeatureGrid from './components/FeatureGrid';
import SplitFeature from './components/SplitFeature';
import BenefitsSection from './components/BenefitsSection';
import ReviewsSection from './components/ReviewsSection';
import BlogSection from './components/BlogSection';
import CtaBanner from './components/CtaBanner';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import PrivacyModal from './components/PrivacyModal';

export default function App() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <FeatureGrid />
        <SplitFeature />
        <BenefitsSection />
        <ReviewsSection />
        <BlogSection />
        <CtaBanner />
        <FaqSection />
      </main>
      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}

