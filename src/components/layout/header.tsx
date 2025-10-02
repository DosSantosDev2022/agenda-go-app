'use client';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BaggageClaim, Calendar, Home, Menu, Settings, User } from "lucide-react";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { DashboardNav } from "./dashboard-nav";

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

export function Header() {
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
              <Link href="/dashboard" className="mb-4 flex items-center">
                <span className="text-xl font-bold tracking-tight">AgendaGo</span>
              </Link>
              <DashboardNav items={navItems} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}