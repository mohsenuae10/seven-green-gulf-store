import { User } from '@supabase/supabase-js';
import {
  LayoutDashboard, ShoppingCart, Package,
  LogOut, Truck, UserPlus, Image,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user: User | null;
  onSignOut: () => void;
}

export const menuItems = [
  { id: "dashboard",      label: "الرئيسية",    icon: LayoutDashboard },
  { id: "orders",         label: "الطلبات",     icon: ShoppingCart },
  { id: "shipping",       label: "الشحن",       icon: Truck },
  { id: "products",       label: "المنتجات",    icon: Package },
  { id: "banner",         label: "البنر",       icon: Image },
  { id: "admin-requests", label: "المسؤولين",   icon: UserPlus },
];

/* ── Desktop Sidebar (lg+) ──────────────────────────────── */
export function AdminSidebar({ activeSection, setActiveSection, user, onSignOut }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-l border-gray-100 h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <img
          src="/images/sevengreen-logo.webp"
          alt="Seven Green"
          className="h-9 w-auto object-contain"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <div>
          <p className="text-sm font-black text-primary leading-tight">SEVEN GREEN</p>
          <p className="text-[10px] text-gray-400">لوحة التحكم</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Sign out */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-500 truncate flex-1">{user?.email}</p>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

/* ── Mobile Bottom Nav ──────────────────────────────────── */
export function AdminBottomNav({ activeSection, setActiveSection }: {
  activeSection: string;
  setActiveSection: (s: string) => void;
}) {
  // Show only first 5 items in bottom nav
  const visibleItems = menuItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-bottom">
      <div className="flex">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-all
                ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              {active && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
