"use client"
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { BaggageClaim, Calendar, Home, Settings, User } from 'lucide-react';
import Link from 'next/link';

// Defina os itens de navegação em um só lugar
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

export function Sidebar() {
  return (
    // Classes de shadcn/ui para cores e bordas
    <aside className="hidden h-full flex-col border-r bg-background lg:flex lg:w-72">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          AgendaGo
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <DashboardNav items={navItems} />
      </div>
      <div className="mt-auto p-4">
        <DashboardNav items={[{
          label: 'Configurações',
          href: '/dashboard/settings',
          icon: Settings,
        }]} />
      </div>
    </aside>
  );
}