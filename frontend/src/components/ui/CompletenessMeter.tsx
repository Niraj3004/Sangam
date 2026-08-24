import { motion } from "framer-motion";

interface CompletenessMeterProps {
  score: number; // 0 to 100
  className?: string;
}

export function CompletenessMeter({ score, className = "" }: CompletenessMeterProps) {
  // Determine color based on score
  let colorClass = "bg-rose-500";
  if (score >= 40) colorClass = "bg-amber-500";
  if (score >= 70) colorClass = "bg-emerald-500";
  if (score >= 90) colorClass = "bg-primary";

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Profile Completeness</span>
        <span className="text-xs font-bold text-foreground">{score}%</span>
      </div>
      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass} relative`}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </motion.div>
      </div>
      {score < 100 && (
        <p className="text-xs text-muted mt-2">
          Complete your profile to increase your AI matching score and visibility!
        </p>
      )}
    </div>
  );
}
