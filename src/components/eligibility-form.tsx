
"use client";

import * as React from "react";
import { useFormStatus, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkEligibilityAction, type EligibilityFormState } from "@/app/actions";

const formSchema = z.object({
  age: z.coerce.number().int().min(20, "Must be at least 20").max(99, "Must be under 100"),
  weightKg: z.coerce.number().min(60, "Must be at least 60 kg").max(200, "Must be under 200 kg"),
  hasTattooOrPiercingInLast6Months: z.boolean().default(false),
  traveledToMalariaRiskAreaInLastYear: z.boolean().default(false),
  hasFeverOrFluSymptomsToday: z.boolean().default(false),
  isPregnantOrBreastfeeding: z.boolean().default(false),
  hasChronicDisease: z.boolean().default(false),
  hasReceivedBloodTransfusionInLastYear: z.boolean().default(false),
});

type EligibilityFormValues = z.infer<typeof formSchema>;

const initialFormState: EligibilityFormState = {
  status: "idle",
  message: "",
  result: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : (
        <Sparkles className="mr-2" />
      )}
      Check Eligibility
    </Button>
  );
}

export function EligibilityForm() {
  const [state, formAction] = useActionState(checkEligibilityAction, initialFormState);
  
  const form = useForm<EligibilityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 20,
      weightKg: 70,
      hasTattooOrPiercingInLast6Months: false,
      traveledToMalariaRiskAreaInLastYear: false,
      hasFeverOrFluSymptomsToday: false,
      isPregnantOrBreastfeeding: false,
      hasChronicDisease: false,
      hasReceivedBloodTransfusionInLastYear: false,
    },
  });

  const formRef = React.useRef<HTMLFormElement>(null);

  const questions = [
    { name: "hasTattooOrPiercingInLast6Months" as const, label: "Have you received a tattoo or piercing in the last 6 months?" },
    { name: "traveledToMalariaRiskAreaInLastYear" as const, label: "Have you traveled to a malaria-risk area in the last year?" },
    { name: "hasFeverOrFluSymptomsToday" as const, label: "Do you have a fever, flu, or other acute illness symptoms today?" },
    { name: "isPregnantOrBreastfeeding" as const, label: "Are you currently pregnant or breastfeeding?" },
    { name: "hasChronicDisease" as const, label: "Do you have a chronic disease (e.g., heart condition, diabetes)?" },
    { name: "hasReceivedBloodTransfusionInLastYear" as const, label: "Have you received a blood transfusion in the last year?" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Eligibility Screener</CardTitle>
          <CardDescription>
            Answer a few questions for an initial eligibility assessment. This is not
            a final medical decision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              action={formAction}
              onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (in years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                      <FormDescription>Minimum age is 20.</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (in kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 70" {...field} />
                      </FormControl>
                      <FormDescription>Minimum weight is 60 kg.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                {questions.map((q) => (
                  <FormField
                    key={q.name}
                    control={form.control}
                    name={q.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{q.label}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>

      {state.status === "success" && state.result && (
        <Alert variant={state.result.isEligible ? "success" : "destructive"}>
           {state.result.isEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>
            {state.result.isEligible ? "Likely Eligible to Donate" : "Potential Deferral"}
          </AlertTitle>
          <AlertDescription>
            <p className="font-semibold">AI Assessment:</p>
            {state.result.reasons}
          </AlertDescription>
        </Alert>
      )}
       {state.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
