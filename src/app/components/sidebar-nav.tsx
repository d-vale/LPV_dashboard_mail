import { useState } from "react";
import {
  LayoutDashboard,
  Mail,
  Brain,
  Settings,
  BarChart3,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";

import logoImg from "@/assets/4ea7ed1a57257e515d74c8098b969d763b89b082.png";
import userImg from "@/assets/6f815d2c5f11c5b6fd721ae75a00cba0b82e4b4c.png";


interface SidebarNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onNotificationClick: () => void;
  pendingCount: number;
}

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "emails", label: "Emails entrants", icon: Mail },
  { id: "classification", label: "Classification", icon: Brain },
  { id: "analytics", label: "Analytiques", icon: BarChart3 },
  { id: "compliance", label: "Conformite nLPD", icon: Shield },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export function SidebarNav({ activeView, onViewChange, collapsed, onCollapse, onNotificationClick, pendingCount }: SidebarNavProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#162021] text-white z-50 transition-all duration-300 flex flex-col ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
          <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[13px] text-white/90 truncate" style={{ fontWeight: 600 }}>Ligue Pulmonaire</p>
            <p className="text-[11px] text-white/50 truncate">Monitoring emails</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[13px] ${
                isActive
                  ? "bg-[#449850] text-white shadow-lg shadow-[#449850]/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontWeight: isActive ? 600 : 400 }}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Notifications */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <button 
            onClick={onNotificationClick}
            className="w-full bg-[#449850]/10 border border-[#449850]/20 rounded-lg p-3 hover:bg-[#449850]/15 transition-colors cursor-pointer text-left relative"
          >
            {pendingCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#449850] text-white text-[9px] rounded-full flex items-center justify-center animate-pulse" style={{ fontWeight: 700 }}>
                {pendingCount}
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <Bell size={14} className="text-[#449850]" />
              <span className="text-[11px] text-[#449850]" style={{ fontWeight: 600 }}>
                {pendingCount} alerte{pendingCount !== 1 ? "s" : ""} active{pendingCount !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-[10px] text-white/50">
              {pendingCount} email{pendingCount !== 1 ? "s" : ""} en attente de validation
            </p>
          </button>
        </div>
      )}

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img src={userImg} alt="Utilisateur" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/90 truncate" style={{ fontWeight: 500 }}>J. Balsiger</p>
              <p className="text-[10px] text-white/40 truncate">Administrateur</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-white/30 hover:text-white/70 transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#162021] border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}