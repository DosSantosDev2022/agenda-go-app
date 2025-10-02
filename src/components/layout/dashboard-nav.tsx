'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardNavProps {
  items: {
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              buttonVariants({ variant: item.href === pathname ? 'default' : 'ghost' }),
              'w-full justify-start'
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}