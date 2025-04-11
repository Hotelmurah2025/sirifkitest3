import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { useAuth } from '../../hooks/useAuth';

import {
  LayoutDashboard,
  Hotel,
  Bed,
  Calendar,
  BookOpen,
  Receipt,
  Tag,
  Settings,
  Users,
  Menu,
  LogOut
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();


  const routes = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      variant: 'default',
      access: ['admin', 'owner', 'staff']
    },
    {
      title: 'Manajemen Hotel',
      href: '/hotels',
      icon: Hotel,
      variant: 'ghost',
      access: ['admin', 'owner']
    },
    {
      title: 'Manajemen Kamar',
      href: '/rooms',
      icon: Bed,
      variant: 'ghost',
      access: ['admin', 'owner', 'staff']
    },
    {
      title: 'Ketersediaan Kamar',
      href: '/availability',
      icon: Calendar,
      variant: 'ghost',
      access: ['admin', 'owner', 'staff']
    },
    {
      title: 'Reservasi',
      href: '/reservations',
      icon: BookOpen,
      variant: 'ghost',
      access: ['admin', 'owner', 'staff']
    },
    {
      title: 'Laporan Keuangan',
      href: '/transactions',
      icon: Receipt,
      variant: 'ghost',
      access: ['admin', 'owner']
    },
    {
      title: 'Promo & Penawaran',
      href: '/promotions',
      icon: Tag,
      variant: 'ghost',
      access: ['admin', 'owner', 'staff']
    },
    {
      title: 'Pengguna',
      href: '/users',
      icon: Users,
      variant: 'ghost',
      access: ['admin']
    },
    {
      title: 'Pengaturan',
      href: '/settings',
      icon: Settings,
      variant: 'ghost',
      access: ['admin', 'owner', 'staff']
    }
  ];

  const filteredRoutes = routes.filter(route => 
    route.access.includes(user?.role || '')
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">
                Extranet Hotel
              </h2>
              <div className="space-y-1">
                {filteredRoutes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={location.pathname === route.href ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.title}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-screen border-r bg-background", className)}>
        <div className="flex w-60 flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/dashboard" className="flex items-center font-semibold">
              <Hotel className="mr-2 h-6 w-6" />
              <span className="text-lg">Extranet Hotel</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              {filteredRoutes.map((route) => (
                <Link key={route.href} to={route.href}>
                  <Button
                    variant={location.pathname === route.href ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.title}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-2">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="text-sm font-medium">{user?.nama}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
