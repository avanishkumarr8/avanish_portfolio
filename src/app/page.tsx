import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Impact } from "@/components/Impact";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { Contact } from "@/components/Contact";
import { CreateStudio } from "@/components/live/CreateStudio";
import { BuildSection } from "@/components/live/BuildSection";

export default function Home() {
  return (
    <CreateStudio>
      <main className="relative flex-1">
        <Navbar />
        <BuildSection id="home">
          <Hero />
        </BuildSection>
        <BuildSection id="work">
          <SelectedWork />
        </BuildSection>
        <BuildSection id="impact">
          <Impact />
        </BuildSection>
        <BuildSection id="about">
          <About />
        </BuildSection>
        <BuildSection id="journey">
          <Journey />
        </BuildSection>
        <BuildSection id="contact">
          <Contact />
        </BuildSection>
      </main>
    </CreateStudio>
  );
}
