import { WeatherWide } from '@/components/sections/WeatherWide'
import { ExitIntentOffer } from '@/components/ui/ExitIntentOffer'
import { releasePolicy } from '@/lib/release-policy'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { HeroSection } from '@/components/sections/HeroSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { PopularSaunasSection } from '@/components/sections/PopularSaunasSection'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { InteriorPhotosSection } from '@/components/sections/InteriorPhotosSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ArticlesSection } from '@/components/sections/ArticlesSection'
import { CTASection } from '@/components/sections/CTASection'
import { ProcessStorySection } from '@/components/sections/ProcessStorySection'

export default function HomePage() {
  return (
    <>
      <WeatherWide />
      <HeroSection />
      {releasePolicy.promotionalOffer && <ExitIntentOffer />}
      <ScrollReveal><CategoriesSection /></ScrollReveal>
      <ScrollReveal><PopularSaunasSection /></ScrollReveal>
      <ScrollReveal><WhyUsSection /></ScrollReveal>
      <ScrollReveal><ProcessStorySection /></ScrollReveal>
      <ScrollReveal><HowItWorksSection /></ScrollReveal>
      <ScrollReveal><ProjectsSection /></ScrollReveal>
      <ScrollReveal><InteriorPhotosSection /></ScrollReveal>
      <ScrollReveal><ArticlesSection /></ScrollReveal>
      <ScrollReveal><CTASection /></ScrollReveal>
    </>
  )
}
