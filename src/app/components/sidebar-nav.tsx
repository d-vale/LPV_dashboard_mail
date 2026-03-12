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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className="fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 64 : 240,
        background: "rgba(0, 14, 13, 0.97)",
        borderRight: "1px solid rgba(212, 240, 227, 0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 shrink-0"
        style={{
          padding: collapsed ? "20px 12px" : "20px",
          borderBottom: "1px solid rgba(212, 240, 227, 0.06)",
          height: 64,
        }}
      >
        <div
          className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            background: "white",
            boxShadow: "0 0 16px rgba(4,135,64,0.30)",
          }}
        >
          <img src={logoImg} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[13px] truncate" style={{ fontWeight: 600, color: "#F0FFF8" }}>Ligue Pulmonaire</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(212,240,227,0.40)" }}>Monitoring emails</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" style={{ padding: collapsed ? "16px 8px" : "16px 8px" }}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => onViewChange(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-full flex items-center gap-3 rounded-xl transition-all duration-200"
                  style={{
                    padding: collapsed ? "10px 12px" : "10px 12px",
                    background: isActive
                      ? "rgba(4, 135, 64, 0.20)"
                      : isHovered
                      ? "rgba(212, 240, 227, 0.05)"
                      : "transparent",
                    color: isActive ? "#D4F0E3" : "rgba(212,240,227,0.55)",
                    boxShadow: isActive ? "0 0 20px rgba(4,135,64,0.12)" : "none",
                    border: isActive ? "1px solid rgba(4,135,64,0.25)" : "1px solid transparent",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                    style={{ color: isActive ? "#48C970" : "rgba(212,240,227,0.55)" }}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>

                {/* Tooltip on hover when collapsed */}
                {collapsed && isHovered && (
                  <div
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap pointer-events-none"
                    style={{
                      background: "rgba(0, 43, 41, 0.95)",
                      border: "1px solid rgba(212, 240, 227, 0.10)",
                      color: "#F0FFF8",
                      fontWeight: 500,
                      zIndex: 100,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.label}
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2"
                      style={{
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderRight: "5px solid rgba(0, 43, 41, 0.95)",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Notifications button */}
      {!collapsed ? (
        <div className="px-2 pb-2">
          <button
            onClick={onNotificationClick}
            className="w-full rounded-xl p-3 transition-all text-left relative"
            style={{
              background: "rgba(4,135,64,0.08)",
              border: "1px solid rgba(4,135,64,0.18)",
            }}
          >
            {pendingCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 text-white text-[9px] rounded-full flex items-center justify-center"
                style={{ background: "#048740", fontWeight: 700, animation: "bioluminescent-pulse 2s infinite" }}
              >
                {pendingCount}
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <Bell size={14} style={{ color: "#48C970" }} />
              <span className="text-[11px]" style={{ fontWeight: 600, color: "#48C970" }}>
                {pendingCount} alerte{pendingCount !== 1 ? "s" : ""} active{pendingCount !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>
              {pendingCount} email{pendingCount !== 1 ? "s" : ""} en attente
            </p>
          </button>
        </div>
      ) : (
        <div className="px-2 pb-2 flex justify-center">
          <button
            onClick={onNotificationClick}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: "rgba(4,135,64,0.08)",
              border: "1px solid rgba(4,135,64,0.18)",
            }}
          >
            <Bell size={16} style={{ color: "#48C970" }} />
            {pendingCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[9px] rounded-full flex items-center justify-center"
                style={{ background: "#048740", fontWeight: 700 }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* User */}
      <div
        className="p-3 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(212, 240, 227, 0.06)", padding: "12px" }}
      >
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden" style={{ boxShadow: "0 0 10px rgba(4,135,64,0.20)" }}>
          <img src={userImg} alt="Utilisateur" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] truncate" style={{ fontWeight: 500, color: "#F0FFF8" }}>J. Balsiger</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(212,240,227,0.35)" }}>Administrateur</p>
            </div>
            <button style={{ color: "rgba(212,240,227,0.30)" }} className="hover:text-white/70 transition-colors">
              <LogOut size={14} />
            </button>
          </>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute -right-3 top-[76px] w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: "#002B29",
          border: "1px solid rgba(212, 240, 227, 0.10)",
          color: "rgba(212,240,227,0.50)",
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  );
}
