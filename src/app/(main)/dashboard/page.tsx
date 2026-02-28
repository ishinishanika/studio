
'use client';

import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, ArrowRight, CalendarClock, HeartPulse } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNextDonationDate, mockDonationRequests } from "@/lib/data";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();
  // TODO: Replace mockUser with real user data from Firestore
  const lastDonation = new Date(); // placeholder
  const nextDonationDate = getNextDonationDate(lastDonation);
  const urgentRequests = mockDonationRequests.filter(req => req.urgency === "Urgent" || req.urgency === "High").slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.displayName || 'Donor'}!</h2>
        <p className="text-muted-foreground">
          Here's a summary of your donation status and opportunities.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="text-primary" />
              <span>Next Donation</span>
            </CardTitle>
            <CardDescription>
              You are eligible to donate whole blood again on this date.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-4xl font-bold text-primary">
              {format(nextDonationDate, "MMM dd, yyyy")}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/donations">Find a Drive</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              <span>Urgent Requests</span>
            </CardTitle>
            <CardDescription>
              These blood types are critically needed in your area.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            {urgentRequests.map(req => (
              <div key={req.id} className="flex justify-between items-center p-2 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-semibold">{req.hospital}</p>
                  <p className="text-sm text-muted-foreground">{req.location}</p>
                </div>
                <Badge variant={req.urgency === 'Urgent' ? 'destructive' : 'default'} className="text-lg w-16 justify-center">{req.bloodType}</Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline">
              <Link href="/donations">View All Requests <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="text-accent" />
              <span>Eligibility Check</span>
            </CardTitle>
            <CardDescription>
              Not sure if you can donate? Use our AI-powered tool for a quick check.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Answer a few simple health questions to get an initial assessment of your eligibility.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/eligibility">Check Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

    