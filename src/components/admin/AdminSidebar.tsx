import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  LogOut,
  BarChart3
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user: User | null;
  onSignOut: () => void;
}

const menuItems = [
  { id: "dashboard", title: "لوحة المعلومات", icon: LayoutDashboard },
  { id: "orders", title: "إدارة الطلبات", icon: ShoppingCart },
  { id: "products", title: "إدارة المنتجات", icon: Package },
];

export function AdminSidebar({ activeSection, setActiveSection, user, onSignOut }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {/* User Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel>المستخدم</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.email || 'المسؤول'}
                  </p>
                  <p className="text-xs text-muted-foreground">مسؤول</p>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out Button */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <Button 
              variant="ghost" 
              onClick={onSignOut}
              className="w-full justify-start"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="mr-2">تسجيل الخروج</span>}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}