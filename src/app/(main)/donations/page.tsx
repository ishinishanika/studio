import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDonationRequests } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export default function DonationsPage() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Opportunities</CardTitle>
          <CardDescription>
            Find donation requests that match your criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Input placeholder="Enter location (e.g., city, zip)..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockDonationRequests.map((request) => (
          <Card key={request.id} className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4">
              <div className="flex-grow">
                <CardTitle>{request.hospital}</CardTitle>
                <CardDescription>{request.location}</CardDescription>
              </div>
              <Badge
                variant={
                  request.urgency === "Urgent" ? "destructive" : "secondary"
                }
              >
                {request.urgency}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">Blood Type Needed</p>
              <p className="text-5xl font-bold text-primary">
                {request.bloodType}
              </p>
            </CardContent>
            <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
               <p>{formatDistanceToNow(request.created, { addSuffix: true })}</p>
              <Button variant="outline">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
