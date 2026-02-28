'use client';
import { AppLayout } from "@/components/app-layout";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </aside>
          <main className="flex-1 p-4 sm:p-6">
            <Skeleton className="h-full w-full" />
          </main>
        </div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}

    