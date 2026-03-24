import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Droplets, HeartHandshake, MapPin, Calendar, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BloodyNetLogo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="absolute inset-x-0 top-0 z-50 p-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              LifeFlow
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Register</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center">
          <Image
            src={heroImage?.imageUrl || ''}
            alt={heroImage?.description || "A nurse preparing for a blood donation."}
            fill
            className="object-cover"
            data-ai-hint={heroImage?.imageHint}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 container px-4 md:px-6 text-primary-foreground">
            <div className="flex flex-col items-center space-y-6">
               <Badge variant="secondary" className="text-sm py-1 px-3 bg-white/20 border-none backdrop-blur-sm text-primary-foreground">
                Every Drop Counts. Every Donor Matters.
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none font-headline">
                Your Donation Can Save a Life
              </h1>
              <p className="max-w-[700px] text-lg text-primary-foreground/80 md:text-xl">
                Join a network of heroes dedicated to making a difference. LifeFlow connects you with opportunities to give blood and save lives in your community.
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/register">
                    Become a Donor
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                 <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/donations">
                    Find a Drive
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold">10,000+</h3>
                <p className="text-muted-foreground">Active Donors</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Droplets className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold">50,000+</h3>
                <p className="text-muted-foreground">Pints Donated</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <HeartHandshake className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold">150,000+</h3>
                <p className="text-muted-foreground">Lives Potentially Saved</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How to Become a Hero</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our simple process makes it easy for you to make a life-saving impact.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:items-center mt-12">
              <div className="grid gap-1 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <MapPin className="h-8 w-8" />
                 </div>
                <h3 className="text-lg font-bold">Find a Donation Center</h3>
                <p className="text-sm text-muted-foreground">
                  Easily locate nearby blood drives and hospitals in need using our interactive map.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">Schedule an Appointment</h3>
                <p className="text-sm text-muted-foreground">
                  Book a time that works for you, and we'll send you a reminder.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Bell className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">Get Notified & Save Lives</h3>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for urgent needs in your area and become a hero when it matters most.
                </p>
              </div>
            </div>
          </div>
        </section>

         {/* Final CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Make a Difference?</h2>
                    <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Your decision to donate can bring hope and healing to countless lives. Sign up today and start your journey as a life-saver.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                     <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                        <Link href="/register">
                            Join LifeFlow Now
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
