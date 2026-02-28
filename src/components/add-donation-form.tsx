'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection } from 'firebase/firestore';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Schema for add donation form validation
const addDonationFormSchema = z.object({
  donationDate: z.date({
    required_error: 'A donation date is required.',
  }),
  locationName: z.string().min(1, 'Location is required'),
  donatedBloodType: z.string().min(1, 'Blood type is required'),
  donatedComponents: z.string().min(1, 'Donated components are required'),
});

type AddDonationFormValues = z.infer<typeof addDonationFormSchema>;

interface AddDonationFormProps {
  onSave: () => void; // Callback to close the dialog
}

export function AddDonationForm({ onSave }: AddDonationFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AddDonationFormValues>({
    resolver: zodResolver(addDonationFormSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: AddDonationFormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to add a donation.',
      });
      return;
    }
    setIsSaving(true);
    
    const donationEventsCollectionRef = collection(firestore, 'users', user.uid, 'donationEvents');

    try {
      await addDoc(donationEventsCollectionRef, {
        ...data,
        donatedComponents: data.donatedComponents.split(',').map(s => s.trim()),
        donationDate: data.donationDate.toISOString(),
        donorId: user.uid,
      });

      toast({
        title: 'Donation Added',
        description: 'Your donation history has been updated.',
      });
      onSave(); // Close the dialog
    } catch (error) {
      console.error('Error adding donation:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="donationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Donation Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City General Hospital" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donatedBloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donated Blood Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. A+" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donatedComponents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donated Components</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Whole Blood, Platelets" {...field} />
              </FormControl>
              <FormDescription>
                Enter components separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Donation
        </Button>
      </form>
    </Form>
  );
}
