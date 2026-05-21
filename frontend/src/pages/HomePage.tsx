import HeroSection from './sections/HeroSection'
import TrustSection from './sections/TrustSection'
import ScheduleSection from './sections/ScheduleSection'
import SpecialtiesSection from './sections/SpecialtiesSection'
import OffersSection from './sections/OffersSection'
import HowToOrderSection from './sections/HowToOrderSection'
import PizzaPartyCTASection from './sections/PizzaPartyCTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustSection />
      <ScheduleSection />
      <SpecialtiesSection />
      <OffersSection />
      <HowToOrderSection />
      <PizzaPartyCTASection />
    </main>
  )
}
