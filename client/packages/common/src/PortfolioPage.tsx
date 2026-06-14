'use client';

import { ProgressBar, useReveal } from '@jinni/ui';
import type { PortfolioData } from '@jinni/types';
import { PortfolioNav } from './sections/Nav/PortfolioNav';
import { HeroSection } from './sections/Hero/HeroSection';
import { AboutSection } from './sections/About/AboutSection';
import { StackSection } from './sections/Stack/StackSection';
import { ProjectsSection, type ProjectLinkProps } from './sections/Projects/ProjectsSection';
import { CareerSection } from './sections/Career/CareerSection';
import { WritingSection } from './sections/Writing/WritingSection';
import { Footer } from './sections/Footer/Footer';
import styles from './PortfolioPage.module.scss';

export interface PortfolioPageProps {
  data: PortfolioData;
  renderProjectLink: (props: ProjectLinkProps) => React.ReactNode;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
  apiUrl?: string;
}

export function PortfolioPage({ data, renderProjectLink, renderLink, apiUrl }: PortfolioPageProps) {
  useReveal();

  const { skills, careers, projects, posts } = data;

  return (
    <>
      <ProgressBar accent="var(--a1)" />
      <PortfolioNav renderLink={renderLink} apiUrl={apiUrl} />

      <main className={styles.main}>
        <HeroSection />
        <AboutSection />
        <StackSection skills={skills} />
        <ProjectsSection projects={projects} renderProjectLink={renderProjectLink} />
        <CareerSection careers={careers} />
        <WritingSection posts={posts} />
        <Footer />
      </main>
    </>
  );
}
