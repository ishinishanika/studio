
"use server";

import { z } from "zod";
import {
  aiEligibilityChecker,
  AiEligibilityCheckerInput,
  AiEligibilityCheckerOutput,
} from "@/ai/flows/ai-eligibility-checker";
import { getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

// --- Eligibility Checker Action ---

const AiEligibilityCheckerInputSchema = z.object({
  age: z.coerce.number().int().min(16).max(99),
  weightKg: z.coerce.number().min(45).max(200),
  hasTattooOrPiercingInLast6Months: z.boolean(),
  traveledToMalariaRiskAreaInLastYear: z.boolean(),
  hasFeverOrFluSymptomsToday: z.boolean(),
  isPregnantOrBreastfeeding: z.boolean(),
  hasChronicDisease: z.boolean(),
  hasReceivedBloodTransfusionInLastYear: z.boolean(),
});

type EligibilityFormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  result?: AiEligibilityCheckerOutput;
};

export async function checkEligibilityAction(
  prevState: EligibilityFormState,
  formData: FormData
): Promise<EligibilityFormState> {
  const validatedFields = AiEligibilityCheckerInputSchema.safeParse({
    age: formData.get("age"),
    weightKg: formData.get("weightKg"),
    hasTattooOrPiercingInLast6Months: formData.get("hasTattooOrPiercingInLast6Months") === "on",
    traveledToMalariaRiskAreaInLastYear: formData.get("traveledToMalariaRiskAreaInLastYear") === "on",
    hasFeverOrFluSymptomsToday: formData.get("hasFeverOrFluSymptomsToday") === "on",
    isPregnantOrBreastfeeding: formData.get("isPregnantOrBreastfeeding") === "on",
    hasChronicDisease: formData.get("hasChronicDisease") === "on",
    hasReceivedBloodTransfusionInLastYear: formData.get("hasReceivedBloodTransfusionInLastYear") === "on",
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid form data. Please check your inputs.",
    };
  }
  
  const inputData: AiEligibilityCheckerInput = validatedFields.data;

  try {
    const result = await aiEligibilityChecker(inputData);
    return {
      status: "success",
      message: "Assessment complete.",
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

// --- Auth Actions ---

type AuthFormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const SignUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUpAction(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      status: "error",
      message: validatedFields.error.errors.map(e => e.message).join(', '),
    };
  }

  const { name, email, password } = validatedFields.data;
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');
  
  try {
    const { auth, firestore } = initializeFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profileData = {
      userId: user.uid,
      email: user.email!,
      firstName,
      lastName,
    };
    
    // Create a donor profile document
    await addDoc(collection(firestore, 'users', user.uid, 'donorProfile'), profileData);

    return { status: "success", message: "Registration successful! Redirecting..." };

  } catch (error: any) {
    let message = "An unexpected error occurred.";
    if (error.code === 'auth/email-already-in-use') {
      message = "This email is already registered. Please log in.";
    }
    return { status: "error", message };
  }
}

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function signInAction(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid email or password format.",
      };
    }

    const { email, password } = validatedFields.data;

    try {
      const { auth } = initializeFirebase();
      await signInWithEmailAndPassword(auth, email, password);
      return { status: "success", message: "Login successful! Redirecting..." };
    } catch (error: any) {
      return { status: "error", message: "Invalid email or password." };
    }
}

    