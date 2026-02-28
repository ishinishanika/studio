
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
import { BloodyNetLogo } from "@/components/icons";
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const initialState = {
  status: "idle" as const,
  message: "",
};

export default function RegisterPage() {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/dashboard");
    }
  }, [state.status, router]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: 'loading', message: '' });

    const formData = new FormData(e.currentTarget);
    const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      setState({
        status: "error",
        message: validatedFields.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const { name, email, password } = validatedFields.data;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profileData = {
        userId: user.uid,
        email: user.email!,
        firstName,
        lastName,
      };
      
      const profileDocRef = doc(firestore, 'users', user.uid, 'donorProfile', user.uid);
      
      setDoc(profileDocRef, profileData)
        .then(() => {
          setState({ status: "success", message: "Registration successful! Redirecting..." });
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: profileDocRef.path,
            operation: 'create',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
          setState({ status: "error", message: "Account created, but failed to set up user profile. Please contact support." });
        });

    } catch (error: any) {
      let message = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please log in.";
      }
      setState({ status: "error", message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <BloodyNetLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">
              bloody.net
            </span>
          </Link>
        </div>
        <Card>
          <form onSubmit={handleSignUp}>
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
