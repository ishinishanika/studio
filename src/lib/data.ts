import { addDays, subDays, subWeeks } from "date-fns";

export type Donation = {
  id: string;
  date: Date;
  location: string;
  type: "Whole Blood" | "Platelets" | "Plasma";
};

export type DonationRequest = {
  id: string;
  hospital: string;
  location: string;
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  urgency: "Urgent" | "High" | "Medium" | "Low";
  created: Date;
};

export const mockDonationRequests: DonationRequest[] = [
  {
    id: "req-1",
    hospital: "City General Hospital",
    location: "Springfield, IL",
    bloodType: "O-",
    urgency: "Urgent",
    created: subDays(new Date(), 1),
  },
  {
    id: "req-2",
    hospital: "County Medical Center",
    location: "Shelbyville, IL",
    bloodType: "A+",
    urgency: "High",
    created: subDays(new Date(), 2),
  },
  {
    id: "req-3",
    hospital: "St. Mary's Hospital",
    location: "Springfield, IL",
    bloodType: "B-",
    urgency: "Medium",
    created: subDays(new Date(), 5),
  },
  {
    id: "req-4",
    hospital: "City General Hospital",
    location: "Springfield, IL",
    bloodType: "AB+",
    urgency: "Low",
    created: subDays(new Date(), 7),
  },
    {
    id: "req-5",
    hospital: "Capital City Clinic",
    location: "Springfield, IL",
    bloodType: "O+",
    urgency: "High",
    created: subDays(new Date(), 3),
  },
];

export const WHOLE_BLOOD_DONATION_INTERVAL_DAYS = 56;

export function getNextDonationDate(lastDonation: Date): Date {
  return addDays(lastDonation, WHOLE_BLOOD_DONATION_INTERVAL_DAYS);
}

    