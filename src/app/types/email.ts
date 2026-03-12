export interface EmailItem {
  id: string;
  from: string;
  subject: string;
  category: string;
  categoryColor: string;
  confidence: number;
  status: "validated" | "pending" | "error" | "corrected";
  time: string;
  hasAttachment: boolean;
  attachmentType?: string;
  destination: string;
  urgency: "haute" | "moyenne" | "basse";
  // optional enrichment
  fromEmail?: string;
  aiReason?: string;
  bodyPreview?: string;
}
