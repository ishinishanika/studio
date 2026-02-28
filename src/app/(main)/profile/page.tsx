'use client';
import { useState, useRef } from "react";
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
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, useAuth, useStorage } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProfileForm } from "@/components/profile-edit-form";
import { PlusCircle, Camera, Loader2 } from "lucide-react";
import { AddDonationForm } from "@/components/add-donation-form";
import { useToast } from "@/hooks/use-toast";


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const storage = useStorage();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const profileDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid, "donorProfile", user.uid) : null),
    [user, firestore]
  );
  const { data: profile, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const donationHistoryQuery = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "donationEvents") : null),
    [user, firestore]
  );
  const { data: donationHistory, isLoading: isHistoryLoading } = useCollection(donationHistoryQuery);

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !auth.currentUser) return;

    setIsUploading(true);

    const storageRef = ref(storage, `profile-images/${user.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update auth profile
      await updateProfile(auth.currentUser, { photoURL });
      
      // Update firestore profile
      const profileDocRef = doc(firestore, "users", user.uid, "donorProfile", user.uid);
      await setDoc(profileDocRef, { photoURL }, { merge: true });

      toast({
        title: "Profile photo updated!",
        description: "Your new photo has been saved.",
      });

    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your photo.",
      });
    } finally {
      setIsUploading(false);
    }
  };


  if (isProfileLoading || isHistoryLoading) {
    return (
       <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
                <div className="mt-2">
                  <Skeleton className="h-7 w-32" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
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
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
             <div
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL || undefined} data-ai-hint="person smiling"/>
                <AvatarFallback>{profile?.firstName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="text-white animate-spin" />
                ) : (
                  <Camera className="text-white" />
                )}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">{profile?.firstName} {profile?.lastName}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <div className="mt-2">
                <Badge variant="default" className="text-base">Blood Type: {profile?.bloodType || 'N/A'}</Badge>
              </div>
            </div>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              {profile && <EditProfileForm profile={profile} onSave={() => setIsEditDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>
                A record of your life-saving contributions.
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Donation</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Donation Record</DialogTitle>
                  <DialogDescription>
                    Log a new donation to keep your history up to date.
                  </DialogDescription>
                </DialogHeader>
                <AddDonationForm onSave={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
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
              {donationHistory?.map((donation: any) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.donationDate ? format(new Date(donation.donationDate), "PPP") : 'N/A'}
                  </TableCell>
                  <TableCell>{donation.locationName}</TableCell>
                  <TableCell>{donation.donatedComponents.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    