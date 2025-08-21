import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import FoundersCircle from './components/FoundersCircle';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SummarizationModal from './components/SummarizationModal';
import TranslationModal from './components/TranslationModal';
import ImageGenerationModal from './components/ImageGenerationModal';

const App: React.FC = () => {
  const [isSummarizationModalOpen, setIsSummarizationModalOpen] = useState(false);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services 
          onSummarizeDemoClick={() => setIsSummarizationModalOpen(true)}
          onTranslateDemoClick={() => setIsTranslationModalOpen(true)}
          onImageDemoClick={() => setIsImageModalOpen(true)}
        />
        <HowItWorks />
        <FoundersCircle />
        <Contact />
      </main>
      <Footer />
      <SummarizationModal isOpen={isSummarizationModalOpen} onClose={() => setIsSummarizationModalOpen(false)} />
      <TranslationModal isOpen={isTranslationModalOpen} onClose={() => setIsTranslationModalOpen(false)} />
      <ImageGenerationModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} />
    </>
  );
};

export default App;