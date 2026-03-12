import { X, Mail, AlertTriangle, Clock, ArrowRight, Paperclip } from "lucide-react";
import type { EmailItem } from "../types/email";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailItem[];
  onEmailClick: (email: EmailItem) => void;
}

export function NotificationPanel({ isOpen, onClose, emails, onEmailClick }: NotificationPanelProps) {
  const pendingEmails = emails.filter((e) => e.status === "pending" || e.status === "error");
  const alertCount = pendingEmails.length;

  const panelStyle = {
    background: "rgba(0, 14, 13, 0.97)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderLeft: "1px solid rgba(212, 240, 227, 0.08)",
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] transition-opacity"
          style={{ background: "rgba(0,8,8,0.60)" }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] z-[70] transform transition-transform duration-300 flex flex-col`}
        style={{
          ...panelStyle,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="h-[64px] px-6 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(212, 240, 227, 0.06)" }}
        >
          <div>
            <h2 className="text-[16px]" style={{ fontWeight: 700, color: "#F0FFF8" }}>
              Notifications
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(212,240,227,0.40)" }}>
              {alertCount} email{alertCount !== 1 ? "s" : ""} en attente de validation
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(212,240,227,0.05)",
              border: "1px solid rgba(212,240,227,0.08)",
              color: "rgba(212,240,227,0.50)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Alert Summary */}
        <div
          className="p-4 shrink-0"
          style={{
            background: "rgba(245,158,11,0.06)",
            borderBottom: "1px solid rgba(245,158,11,0.10)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.20)",
                boxShadow: "0 0 16px rgba(245,158,11,0.10)",
              }}
            >
              <AlertTriangle size={18} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <p className="text-[13px]" style={{ fontWeight: 600, color: "#F59E0B" }}>
                {alertCount} alerte{alertCount !== 1 ? "s" : ""} active{alertCount !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(245,158,11,0.70)" }}>
                Ces emails nécessitent une validation manuelle avant traitement
              </p>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {pendingEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(212,240,227,0.06)", border: "1px solid rgba(212,240,227,0.08)" }}
              >
                <Mail size={24} style={{ color: "rgba(212,240,227,0.30)" }} />
              </div>
              <p className="text-[13px]" style={{ fontWeight: 500, color: "rgba(212,240,227,0.60)" }}>
                Aucun email en attente
              </p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(212,240,227,0.30)" }}>
                Tous les emails ont été traités
              </p>
            </div>
          ) : (
            <div>
              {pendingEmails.map((email) => {
                const isError = email.status === "error";

                return (
                  <div
                    key={email.id}
                    onClick={() => { onEmailClick(email); onClose(); }}
                    className="p-4 cursor-pointer transition-all"
                    style={{ borderBottom: "1px solid rgba(212,240,227,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "rgba(212,240,227,0.03)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: isError ? "rgba(227,6,19,0.12)" : "rgba(245,158,11,0.12)",
                          border: isError ? "1px solid rgba(227,6,19,0.20)" : "1px solid rgba(245,158,11,0.20)",
                        }}
                      >
                        {isError
                          ? <AlertTriangle size={16} style={{ color: "#F87171" }} />
                          : <Clock size={16} style={{ color: "#F59E0B" }} />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider"
                            style={{
                              background: isError ? "rgba(227,6,19,0.12)" : "rgba(245,158,11,0.12)",
                              color: isError ? "#F87171" : "#F59E0B",
                              border: isError ? "1px solid rgba(227,6,19,0.20)" : "1px solid rgba(245,158,11,0.20)",
                              fontWeight: 600,
                            }}
                          >
                            {isError ? "À vérifier" : "En attente"}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "rgba(212,240,227,0.30)", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {email.time}
                          </span>
                        </div>

                        <p className="text-[12px] mb-1 truncate" style={{ fontWeight: 500, color: "#F0FFF8" }}>
                          {email.subject}
                        </p>
                        <p className="text-[11px] mb-2 truncate" style={{ color: "rgba(212,240,227,0.45)" }}>
                          {email.from}
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white"
                            style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                          >
                            {email.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: "rgba(212,240,227,0.08)" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${email.confidence}%`,
                                  background: email.confidence >= 90 ? "#48C970" : email.confidence >= 70 ? "#F59E0B" : "#F87171",
                                }}
                              />
                            </div>
                            <span
                              className="text-[10px]"
                              style={{
                                color: email.confidence >= 90 ? "#48C970" : email.confidence >= 70 ? "#F59E0B" : "#F87171",
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {email.confidence.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(212,240,227,0.35)" }}>
                          <ArrowRight size={10} />
                          <span>{email.destination}</span>
                        </div>

                        {email.hasAttachment && (
                          <div className="flex items-center gap-1 mt-2 text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>
                            <Paperclip size={10} />
                            <span>{email.attachmentType}</span>
                          </div>
                        )}

                        <button
                          className="mt-3 w-full py-2 rounded-lg text-[11px] transition-all"
                          style={{
                            background: isError ? "rgba(227,6,19,0.20)" : "rgba(245,158,11,0.20)",
                            border: isError ? "1px solid rgba(227,6,19,0.30)" : "1px solid rgba(245,158,11,0.30)",
                            color: isError ? "#F87171" : "#F59E0B",
                            fontWeight: 600,
                          }}
                        >
                          {isError ? "Vérifier maintenant" : "Valider maintenant"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(212, 240, 227, 0.06)" }}
        >
          <div className="flex items-center justify-between text-[11px]">
            <span style={{ color: "rgba(212,240,227,0.35)" }}>Dernière mise à jour</span>
            <span style={{ color: "#F0FFF8", fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
              Il y a quelques secondes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
