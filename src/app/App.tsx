import { useState } from "react";
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Sun,
  Sparkles,
} from "lucide-react";
import { SidebarNav } from "./components/sidebar-nav";
import { KpiCards, QuickStats } from "./components/kpi-cards";
import { EmailVolumeChart, HourlyDistribution } from "./components/email-volume-chart";
import { ClassificationChart } from "./components/classification-chart";
import { RecentEmails } from "./components/recent-emails";
import { AiPerformance } from "./components/ai-performance";
import { CompliancePanel } from "./components/compliance-panel";
import { ActivityFeed } from "./components/activity-feed";
import { SettingsPanel } from "./components/settings-panel";
import { NotificationPanel } from "./components/notification-panel";
import { EmailReviewModal } from "./components/email-review-modal";
import type { EmailItem } from "./types/email";
import { CATEGORY_COLORS } from "./constants/categories";
import { initialEmails } from "./data/mock-emails";

function TopBar({ onNotificationClick, pendingCount }: { onNotificationClick: () => void; pendingCount: number }) {
  return (
    <header className="h-[64px] bg-white border-b border-black/5 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] text-[#1B1B2F]" style={{ fontWeight: 700, lineHeight: 1.2 }}>
            Dashboard de Monitoring
          </h1>
          <p className="text-[12px] text-[#9CA3AF] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#449850]" />
            Tri automatique des emails
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-9 pr-4 py-2 bg-[#F7F8FA] rounded-lg text-[12px] w-[220px] border border-transparent focus:border-[#449850]/20 focus:bg-white transition-all outline-none"
          />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 bg-[#F7F8FA] rounded-lg px-3 py-2 text-[12px] text-[#6B7280]">
          <Calendar size={14} />
          <span>11 mars 2026</span>
        </div>

        {/* Notifications */}
        <button 
          onClick={onNotificationClick}
          className="relative w-9 h-9 rounded-lg bg-[#F7F8FA] flex items-center justify-center text-[#6B7280] hover:text-[#1B1B2F] hover:bg-[#ECEDF1] transition-colors"
        >
          <Bell size={16} />
          {pendingCount > 0 && (
            <>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#449850] text-white text-[9px] rounded-full flex items-center justify-center animate-pulse" style={{ fontWeight: 700 }}>
                {pendingCount}
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#449850] rounded-full animate-ping opacity-75" />
            </>
          )}
        </button>
      </div>
    </header>
  );
}

interface EmailViewProps {
  emails: EmailItem[];
  onValidate: (id: string) => void;
  onCorrect: (id: string, newCategory: string, newMailbox: string, reason: string) => void;
}

function DashboardView({ emails, onValidate, onCorrect }: EmailViewProps) {
  return (
    <div className="space-y-5">
      {/* KPIs */}
      <KpiCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <EmailVolumeChart />
        </div>
        <div className="xl:col-span-2">
          <ClassificationChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RecentEmails emails={emails} onValidate={onValidate} onCorrect={onCorrect} />
        </div>
        <div className="xl:col-span-1 space-y-5">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

function EmailsView({ emails, onValidate, onCorrect }: EmailViewProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3">
          <RecentEmails emails={emails} onValidate={onValidate} onCorrect={onCorrect} />
        </div>
        <div className="xl:col-span-1">
          <QuickStats />
        </div>
      </div>
    </div>
  );
}

function ClassificationView({ emails, onValidate, onCorrect }: EmailViewProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ClassificationChart />
        <AiPerformance />
      </div>
      <RecentEmails emails={emails} onValidate={onValidate} onCorrect={onCorrect} />
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-5">
      <KpiCards />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <EmailVolumeChart />
        <HourlyDistribution />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <ClassificationChart />
        <div className="xl:col-span-2">
          <AiPerformance />
        </div>
      </div>
    </div>
  );
}

function ComplianceView() {
  return <CompliancePanel />;
}

function SettingsView() {
  return <SettingsPanel />;
}

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  const pendingEmails = emails.filter((e) => e.status === "pending" || e.status === "error");
  const pendingCount = pendingEmails.length;

  const handleValidate = (id: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "validated", destination: e.destination === "En attente de validation" ? "Sous-boite " + e.category : e.destination }
          : e
      )
    );
    setSelectedEmail(null);
  };

  const handleCorrect = (id: string, newCategory: string, newMailbox: string, reason: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "corrected",
              category: newCategory,
              categoryColor: CATEGORY_COLORS[newCategory] ?? "#6B7280",
              destination: newMailbox,
            }
          : e
      )
    );
    setSelectedEmail(null);
  };

  const renderView = () => {
    const emailProps = { emails, onValidate: handleValidate, onCorrect: handleCorrect };
    switch (activeView) {
      case "emails":         return <EmailsView {...emailProps} />;
      case "classification": return <ClassificationView {...emailProps} />;
      case "analytics":      return <AnalyticsView />;
      case "compliance":     return <ComplianceView />;
      case "settings":       return <SettingsView />;
      default:               return <DashboardView {...emailProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <SidebarNav
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        onNotificationClick={() => setNotificationPanelOpen(true)}
        pendingCount={pendingCount}
      />

      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <TopBar
          onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
          pendingCount={pendingCount}
        />
        <main className="p-6">
          {renderView()}
        </main>
      </div>

      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        emails={emails}
        onEmailClick={(email: EmailItem) => {
          setSelectedEmail(email);
          setNotificationPanelOpen(false);
        }}
      />

      {selectedEmail && (
        <EmailReviewModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onValidate={handleValidate}
          onCorrect={handleCorrect}
        />
      )}
    </div>
  );
}