
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Bell,
  ChevronDown,
  HeartPulse,
  LayoutGrid,
  LogOut,
  Search,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { LifeFlowLogo } from "@/components/icons";
import { useAuth, useUser } from "@/firebase";
import { ThemeToggleButton } from "./theme-toggle-button";

type AppLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/donations", icon: Search, label: "Find Donations" },
  { href: "/eligibility", icon: HeartPulse, label: "Eligibility Check" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const getPageTitle = () => {
    const currentItem = navItems.find((item) => pathname.startsWith(item.href));
    return currentItem?.label || "LifeFlow Connect";
  }

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LifeFlowLogo className="size-8 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-primary">
                LifeFlow
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Connect
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggleButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <p className="font-medium">Urgent: O- Needed</p>
                    <p className="text-xs text-muted-foreground">
                      City General Hospital
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <p className="font-medium">New Drive Nearby</p>
                    <p className="text-xs text-muted-foreground">
                      Community Center Blood Drive
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 focus-visible:ring-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || ''} data-ai-hint="person smiling" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.displayName || user?.email}</span>
                  <ChevronDown className="h-4 w-4 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
