import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OdometerCounter from './components/OdometerCounter';
import TrustedBy from './components/TrustedBy';
import FeatureGrid from './components/FeatureGrid';
import SplitFeature from './components/SplitFeature';
import BenefitsSection from './components/BenefitsSection';
import ReviewsSection from './components/ReviewsSection';
import BlogSection from './components/BlogSection';
import CtaBanner from './components/CtaBanner';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Hero />
        <OdometerCounter />
        <TrustedBy />
        <FeatureGrid />
        <SplitFeature />
        <BenefitsSection />
        <ReviewsSection />
        <BlogSection />
        <CtaBanner />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
