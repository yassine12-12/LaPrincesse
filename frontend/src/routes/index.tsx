import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Vision } from "@/components/site/Vision";
import { Universe } from "@/components/site/Universe";
import { Lab } from "@/components/site/Lab";
import { Journey } from "@/components/site/Journey";
import { Manifesto } from "@/components/site/Manifesto";
import { ComingNext } from "@/components/site/ComingNext";
import { Waitlist } from "@/components/site/Waitlist";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground">
      <Nav />
      <Hero />
      <Vision />
      <Universe />
      <Lab />
      <Journey />
      <ComingNext />
      <Manifesto />
      <Waitlist />
      <Footer />
    </main>
  );
}
