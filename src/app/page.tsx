import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LifeFlowLogo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LifeFlowLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">
            LifeFlow Connect
          </span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Give the Gift of Life, One Drop at a Time
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join our community of heroes. Find local donation centers,
                    get notified of urgent needs, and track your life-saving
                    journey with LifeFlow Connect.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Get Started
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} LifeFlow Connect. All rights reserved.
      </footer>
    </div>
  );
}
