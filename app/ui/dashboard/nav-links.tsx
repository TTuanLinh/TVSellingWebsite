'use client'

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon, // Cho Products
  RectangleGroupIcon, // Cho Categories/Brands
  NewspaperIcon, // Cho News/Banners
  InboxStackIcon, // Cho "My Orders"
  ShoppingCartIcon, // Cho "My Cart"
  Cog6ToothIcon, // Cho "My Profile"
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon,
    adminOnly: true,
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: DocumentDuplicateIcon,
    adminOnly: true,
  },
  { 
    name: 'Customers', 
    href: '/dashboard/customers', 
    icon: UserGroupIcon,
    adminOnly: true,
  },
  { 
    name: 'Products', 
    href: '/dashboard/products', 
    icon: ArchiveBoxIcon,
    adminOnly: true,
  },
  { 
    name: 'Brands', 
    href: '/dashboard/brands', 
    icon: ArchiveBoxIcon,
    adminOnly: true,
  },
  { 
    name: 'Categories', 
    href: '/dashboard/categories', 
    icon: ArchiveBoxIcon,
    adminOnly: true,
  },
  { 
    name: 'Profile', 
    href: '/dashboard/profile', 
    icon: Cog6ToothIcon,
    adminOnly: true,
  },


  { 
    name: 'Home', 
    href: '/userDashboard',
    icon: HomeIcon,
    adminOnly: false
  },
  { 
    name: 'My Cart', 
    href: '/userDashboard/cart', 
    icon: ShoppingCartIcon, 
    adminOnly: false
  },
  { 
    name: 'My Orders', 
    href: '/userDashboard/orders', 
    icon: InboxStackIcon, 
    adminOnly: false
  },
  { 
    name: 'My Profile',
    href: '/userDashboard/profile', 
    icon: Cog6ToothIcon, 
    adminOnly: false
  },
];

export default function NavLinks({userRole}: {userRole: number | null | undefined}) {
  const pathname = usePathname();

  const accessibleLinks = links.filter((link) => {
    // Nếu là Admin (role 1) -> hiển thị tất cả link
    if (userRole === 1) return link.adminOnly === true;
    // Nếu là User (role 0) -> chỉ hiển thị link Home
    else{
      return link.adminOnly === false;
    }
  });

  return (
    <>
      {accessibleLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
