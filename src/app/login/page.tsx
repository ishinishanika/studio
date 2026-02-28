
'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";

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
import { LifeFlowLogo } from "@/components/icons";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const initialState = {
  status: "idle" as const,
  message: "",
};

export default function LoginPage() {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/dashboard");
    }
  }, [state.status, router]);
  
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    const formData = new FormData(e.currentTarget);
    const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      setState({
        status: "error",
        message: validatedFields.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const { email, password } = validatedFields.data;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setState({ status: "success", message: "Login successful! Redirecting..." });
    } catch (error: any) {
      let message = "Invalid email or password.";
      if (error.code === 'auth/invalid-credential') {
        message = "Invalid email or password.";
      }
      setState({ status: "error", message });
    }
  };

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
          <form onSubmit={handleSignIn}>
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={state.status === 'loading'}>
                {state.status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
               <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
