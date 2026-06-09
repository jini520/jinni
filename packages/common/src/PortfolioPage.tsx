'use client';

import { ProgressBar, useReveal } from '@jinni/ui';
import type { PortfolioData } from '@jinni/types';
import { PortfolioNav } from './sections/Nav/PortfolioNav';
import { HeroSection } from './sections/Hero/HeroSection';
import { AboutSection } from './sections/About/AboutSection';
import { StackSection } from './sections/Stack/StackSection';
import { ProjectsSection } from './sections/Projects/ProjectsSection';
import { CareerSection } from './sections/Career/CareerSection';
import { WritingSection } from './sections/Writing/WritingSection';
import { ContactSection } from './sections/Contact/ContactSection';
import { Footer } from './sections/Footer/Footer';
import styles from './PortfolioPage.module.scss';

export interface PortfolioPageProps {
  data: PortfolioData;
  onProjectClick: (id: string, accent: string, idx: string) => void;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
}

export function PortfolioPage({ data, onProjectClick, renderLink }: PortfolioPageProps) {
  useReveal();

  const { skills, careers, projects, posts } = data;

  return (
    <>
      <ProgressBar accent="var(--a1)" />
      <PortfolioNav renderLink={renderLink} />

      <main className={styles.main}>
        <HeroSection />
        <AboutSection />
        <StackSection skills={skills} />
        <ProjectsSection projects={projects} onProjectClick={onProjectClick} />
        <CareerSection careers={careers} />
        <WritingSection posts={posts} />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
