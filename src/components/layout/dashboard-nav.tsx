'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardNavProps {
  items: {
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
}

const DashboardNav = ({ items }: DashboardNavProps) => {
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

export { DashboardNav };
