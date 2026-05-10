import HeroSection from './sections/HeroSection'
import ScheduleSection from './sections/ScheduleSection'
import SpecialtiesSection from './sections/SpecialtiesSection'
import OffersSection from './sections/OffersSection'
import PizzaPartyCTASection from './sections/PizzaPartyCTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ScheduleSection />
      <SpecialtiesSection />
      <OffersSection />
      <PizzaPartyCTASection />
    </main>
  )
}
