import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OdometerCounter from './components/OdometerCounter';
import TrustedBy from './components/TrustedBy';
import FeatureGrid from './components/FeatureGrid';
import SplitFeature from './components/SplitFeature';
import BenefitsSection from './components/BenefitsSection';
import CtaBanner from './components/CtaBanner';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OdometerCounter />
        <TrustedBy />
        <FeatureGrid />
        <SplitFeature />
        <BenefitsSection />
        <CtaBanner />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
