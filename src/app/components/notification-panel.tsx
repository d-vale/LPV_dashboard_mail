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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-[64px] border-b border-black/5 px-6 flex items-center justify-between bg-gradient-to-r from-[#449850]/5 to-transparent">
          <div>
            <h2 className="text-[16px] text-[#1B1B2F]" style={{ fontWeight: 700 }}>
              Notifications
            </h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              {alertCount} email{alertCount !== 1 ? "s" : ""} en attente de validation
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F7F8FA] flex items-center justify-center text-[#6B7280] hover:text-[#1B1B2F] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Alert Summary */}
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[13px] text-amber-900" style={{ fontWeight: 600 }}>
                {alertCount} alerte{alertCount !== 1 ? "s" : ""} active{alertCount !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Ces emails nécessitent une validation manuelle avant traitement
              </p>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {pendingEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center px-6">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                <Mail size={24} className="text-[#9CA3AF]" />
              </div>
              <p className="text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
                Aucun email en attente
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Tous les emails ont été traités
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {pendingEmails.map((email) => {
                const isError = email.status === "error";
                const isPending = email.status === "pending";

                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      onEmailClick(email);
                      onClose();
                    }}
                    className="p-4 hover:bg-[#F7F8FA] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isError ? "bg-red-50" : "bg-amber-50"
                        }`}
                      >
                        {isError ? (
                          <AlertTriangle size={16} className="text-red-500" />
                        ) : (
                          <Clock size={16} className="text-amber-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider ${
                              isError
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {isError ? "À vérifier" : "En attente"}
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">{email.time}</span>
                        </div>

                        {/* Subject */}
                        <p className="text-[12px] text-[#1B1B2F] mb-1 truncate" style={{ fontWeight: 500 }}>
                          {email.subject}
                        </p>

                        {/* From */}
                        <p className="text-[11px] text-[#6B7280] mb-2 truncate">{email.from}</p>

                        {/* Category & Confidence */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white"
                            style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                          >
                            {email.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${email.confidence}%`,
                                  backgroundColor:
                                    email.confidence >= 90
                                      ? "#449850"
                                      : email.confidence >= 70
                                      ? "#F59E0B"
                                      : "#DC2626",
                                }}
                              />
                            </div>
                            <span
                              className="text-[10px]"
                              style={{
                                color:
                                  email.confidence >= 90
                                    ? "#449850"
                                    : email.confidence >= 70
                                    ? "#F59E0B"
                                    : "#DC2626",
                                fontWeight: 600,
                              }}
                            >
                              {email.confidence.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
                          <ArrowRight size={10} />
                          <span>{email.destination}</span>
                        </div>

                        {/* Attachment */}
                        {email.hasAttachment && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#6B7280]">
                            <Paperclip size={10} />
                            <span>{email.attachmentType}</span>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          className={`mt-3 w-full py-2 rounded-lg text-[11px] transition-all ${
                            isError
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                          style={{ fontWeight: 600 }}
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
        <div className="border-t border-black/5 p-4 bg-[#F7F8FA]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#6B7280]">Dernière mise à jour</span>
            <span className="text-[#1B1B2F]" style={{ fontWeight: 500 }}>
              Il y a quelques secondes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}