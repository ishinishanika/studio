'use client';

import { useState } from "react";
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
import { mockDonationRequests, DonationRequest } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export default function DonationsPage() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [locationFilter, setLocationFilter] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>(mockDonationRequests);

  const handleSearch = () => {
    let requests = mockDonationRequests;

    if (locationFilter) {
      requests = requests.filter((req) =>
        req.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (bloodTypeFilter) {
      requests = requests.filter((req) => req.bloodType === bloodTypeFilter);
    }

    setFilteredRequests(requests);
  };

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
            <Input 
              placeholder="Enter location (e.g., city, zip)..." 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Select onValueChange={setBloodTypeFilter} value={bloodTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Blood Types</SelectItem>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
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
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No donation requests match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
