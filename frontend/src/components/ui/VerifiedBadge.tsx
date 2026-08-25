import { ShieldCheck, CheckCircle2, ShieldAlert } from "lucide-react";

type VerifyTier = "unverified" | "manual_pending" | "verified_email" | "verified_manual" | "college" | "manual";

interface VerifiedBadgeProps {
  tier: VerifyTier;
  className?: string;
  showText?: boolean;
}

export function VerifiedBadge({ tier, className = "", showText = false }: VerifiedBadgeProps) {
  if (!tier || tier === "unverified") return null;

  const config = {
    manual_pending: {
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      text: "Verification Pending",
      bg: "bg-amber-50",
      border: "border-amber-200",
      textColor: "text-amber-700"
    },
    verified_email: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      text: "Verified Student",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      textColor: "text-emerald-700"
    },
    verified_manual: {
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
      text: "Verified Identity",
      bg: "bg-blue-50",
      border: "border-blue-200",
      textColor: "text-blue-700"
    },
    college: {
      icon: <CheckCircle2 className="w-4 h-4 text-purple-500" />,
      text: "Verified College",
      bg: "bg-purple-50",
      border: "border-purple-200",
      textColor: "text-purple-700"
    },
    manual: {
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      text: "Verified Manual",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      textColor: "text-indigo-700"
    }
  } as Record<VerifyTier, any>;

  const style = config[tier];
  if (!style) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${style.bg} ${style.border} ${className}`} title={style.text}>
      {style.icon}
      {showText && <span className={`text-xs font-medium ${style.textColor}`}>{style.text}</span>}
    </div>
  );
}
