import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDonationHistory, mockUser } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatarUrl} data-ai-hint="person smiling"/>
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
              <CardDescription>{mockUser.email}</CardDescription>
              <div className="mt-2">
                <Badge variant="default" className="text-base">Blood Type: {mockUser.bloodType}</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>
            A record of your life-saving contributions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDonationHistory.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {format(donation.date, "PPP")}
                  </TableCell>
                  <TableCell>{donation.location}</TableCell>
                  <TableCell>{donation.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
