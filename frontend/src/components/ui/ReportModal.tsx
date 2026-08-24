"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'user' | 'project' | 'community' | 'post';
}

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await api.post('/reports', {
        targetId,
        targetType,
        reason,
        details
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setReason("");
        setDetails("");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {success ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Report Submitted</h3>
                <p className="text-muted mt-2">Thank you for helping keep Sangam safe. Our trust & safety team will review this shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-6 border-b border-border bg-rose-50/30">
                  <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Report Content
                  </h3>
                  <button onClick={onClose} className="text-muted hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <p className="text-sm text-muted mb-2">
                    Please select the reason for reporting this {targetType}. False reports may lead to account restrictions.
                  </p>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Reason *</label>
                    <select 
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all"
                    >
                      <option value="">Select a reason...</option>
                      <option value="spam">Spam or scam</option>
                      <option value="harassment">Harassment or bullying</option>
                      <option value="inappropriate">Inappropriate content</option>
                      <option value="fake">Fake profile or impersonation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Additional Details</label>
                    <textarea 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={3}
                      placeholder="Please provide any additional context..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !reason}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Report"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
