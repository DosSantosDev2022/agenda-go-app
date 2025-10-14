'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { BaggageClaim, Calendar, Home, Menu, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggleButton } from "../global";
import { DashboardNav } from "./dashboard-nav";
import { UserNav } from "./user-nav";

// Você pode importar os 'navItems' de um arquivo central para não repetir
const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Agenda',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    label: 'Serviços',
    href: '/dashboard/services',
    icon: BaggageClaim,
  },
  {
    label: 'Clientes',
    href: '/dashboard/customers',
    icon: User,
  }
];

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <Link href="/dashboard" className="flex items-center">
                  <span className="text-xl font-bold tracking-tight">AgendaGo</span>
                </Link>
              </SheetHeader>
              <div className="px-3">
                <DashboardNav items={navItems} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggleButton />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export { Header };
