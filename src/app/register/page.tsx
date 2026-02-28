
'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signUpAction } from "@/app/actions";
import { LifeFlowLogo } from "@/components/icons";

const initialState = {
  status: "idle" as const,
  message: "",
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(signUpAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/dashboard");
    }
  }, [state.status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <LifeFlowLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">
              LifeFlow Connect
            </span>
          </Link>
        </div>
        <Card>
          <form action={formAction}>
            <CardHeader className="text-center">
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Join our community of life-savers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {state.status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Failed</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={state.status === 'loading'}>
                {state.status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
               <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

    