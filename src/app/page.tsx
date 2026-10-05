import { HeroSection } from '@/components/sections/HeroSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { PopularSaunasSection } from '@/components/sections/PopularSaunasSection'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { InteriorPhotosSection } from '@/components/sections/InteriorPhotosSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ArticlesSection } from '@/components/sections/ArticlesSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <PopularSaunasSection />
      <WhyUsSection />
      <InteriorPhotosSection />
      <HowItWorksSection />
      <ProjectsSection />
      <ArticlesSection />
      <CTASection />
    </>
  )
}
