import { useCallback, useEffect, useState } from 'react';
import AboutSection from '@/components/about-section';
import ContactSection from '@/components/contact-section';
import FaqSection from '@/components/faq-section';
import IntroSection from '@/components/intro-section';
import PhotographyHero from '@/components/photography-hero';
import ProcessSection from '@/components/process-section';
import ProjectModal from '@/components/project-modal';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import Ticker from '@/components/ticker';
import WorkSection from '@/components/work-section';
import { SITE } from '@/data/site';

export default function App() {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const closeProject = useCallback(() => setOpenProject(null), []);

  // Coming from another page with a section in the address (/#contact): go there
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;
    const jump = () => {
      const el = document.getElementById(id);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
    };
    // Once now, once more after images and fonts have settled the layout
    const timers = [window.setTimeout(jump, 50), window.setTimeout(jump, 600)];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* The hero stays pinned while the intro slides over it */}
        <div className="relative">
          <PhotographyHero name={SITE.name} nextSectionId="suite" />
          <IntroSection id="suite" />
        </div>

        <Ticker />
        <WorkSection onOpen={setOpenProject} />
        <ProcessSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />

      <ProjectModal index={openProject} onClose={closeProject} onNavigate={setOpenProject} />

      {/* Film grain over the whole site */}
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.07]" />
    </>
  );
}
