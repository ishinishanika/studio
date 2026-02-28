'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkEligibilityAction, type EligibilityFormState } from '@/app/actions';
import { BloodDropEmotionIcon } from './icons';

const initialFormState: EligibilityFormState = {
  status: 'idle',
  message: '',
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

  const questions = [
    { name: 'hasTattooOrPiercingInLast6Months', label: 'Have you received a tattoo or piercing in the last 6 months?' },
    { name: 'traveledToMalariaRiskAreaInLastYear', label: 'Have you traveled to a malaria-risk area in the last year?' },
    { name: 'hasFeverOrFluSymptomsToday', label: 'Do you have a fever, flu, or other acute illness symptoms today?' },
    { name: 'isPregnantOrBreastfeeding', label: 'Are you currently pregnant or breastfeeding?' },
    { name: 'hasChronicDisease', label: 'Do you have a chronic disease (e.g., heart condition, diabetes)?' },
    { name: 'hasReceivedBloodTransfusionInLastYear', label: 'Have you received a blood transfusion in the last year?' },
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
          <form
            action={formAction}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age (in years)</Label>
                <Input id="age" name="age" type="number" placeholder="e.g., 25" defaultValue={20} />
                <p className="text-sm text-muted-foreground">Minimum age is 20.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (in kg)</Label>
                <Input id="weightKg" name="weightKg" type="number" placeholder="e.g., 70" defaultValue={70} />
                <p className="text-sm text-muted-foreground">Minimum weight is 60 kg.</p>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.name} className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={q.name} className="text-base">{q.label}</Label>
                  </div>
                  <Switch id={q.name} name={q.name} />
                </div>
              ))}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.status === 'success' && state.result && (
        <Alert variant={state.result.isEligible ? 'success' : 'destructive'}>
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex-grow basis-3/4">
              <AlertTitle>
                {state.result.isEligible ? 'Likely Eligible to Donate' : 'Potential Deferral'}
              </AlertTitle>
              <AlertDescription>
                <p className="font-semibold">AI Assessment:</p>
                {state.result.reasons}
              </AlertDescription>
            </div>
            <div className="basis-1/4 flex justify-center items-center">
                <BloodDropEmotionIcon 
                    isEligible={state.result.isEligible} 
                    className="h-12 w-12 flex-shrink-0 drop-shadow-lg"
                />
            </div>
          </div>
        </Alert>
      )}
       {state.status === 'error' && (
        <Alert variant="destructive">
           <div className="flex w-full items-start justify-between gap-4">
            <div className="flex-grow basis-3/4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </div>
            <div className="basis-1/4 flex justify-center items-center">
                <BloodDropEmotionIcon 
                    isEligible={false} 
                    className="h-12 w-12 flex-shrink-0 drop-shadow-lg"
                />
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
