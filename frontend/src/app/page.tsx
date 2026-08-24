"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Target, Users, ShieldCheck, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xl">S</div>
          <span className="text-xl font-bold tracking-tight text-foreground">Sangam</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary-hover transition-colors shadow-sm">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background glow elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-accent/10 blur-[80px] rounded-full -z-10" />

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The #1 Network for Nepali Students</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Build Your Career.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Connect with Purpose.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto">
            Sangam is the exclusive ecosystem for Nepali students at home and abroad to discover AI-matched opportunities, build projects, and find mentorship.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:-translate-y-0.5">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/discover" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-border text-foreground px-8 py-4 rounded-full font-medium hover:bg-surface-hover transition-all">
              Explore Opportunities
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup/Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-border bg-white shadow-2xl shadow-primary/5 overflow-hidden flex flex-col"
        >
          {/* Mockup Header */}
          <div className="h-12 bg-slate-50 border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="mx-auto bg-white border border-border rounded-md px-32 py-1 text-xs text-muted">
              sangam.network/dashboard
            </div>
          </div>
          {/* Mockup Content */}
          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="h-32 bg-white rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-48 bg-white rounded-xl border border-border p-5 space-y-4">
                <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-20 w-full bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-full bg-white rounded-xl border border-border p-5 space-y-4">
                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 w-full bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
          {[
            { label: "Active Students", value: "10,000+" },
            { label: "Universities", value: "50+" },
            { label: "Organizations", value: "200+" },
            { label: "Opportunities", value: "1,500+" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</span>
              <span className="text-sm font-medium text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Matrix */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">Sangam replaces fragmented Facebook groups and disjointed portals with one unified, premium platform.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Target className="w-6 h-6 text-primary" />,
              title: "AI-Curated Opportunities",
              description: "Stop scrolling endlessly. Our AI matches your skills with the perfect jobs, internships, and hackathons."
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Purposeful Networking",
              description: "Connect with peers based on shared interests, skills, and exact collaboration goals (e.g., 'Looking for a Cofounder')."
            },
            {
              icon: <Briefcase className="w-6 h-6 text-primary" />,
              title: "Project Marketplace",
              description: "Pitch your ideas, assemble a dream team from verified students, and build something incredible together."
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-primary" />,
              title: "Verified Trust",
              description: "No fake profiles. All students and organizations are verified via college emails or manual ID checks."
            },
            {
              icon: <Sparkles className="w-6 h-6 text-primary" />,
              title: "AI Career Copilot",
              description: "Chat with our intelligent copilot to generate tailored resumes, portfolios, and step-by-step career roadmaps."
            },
            {
              icon: <ArrowRight className="w-6 h-6 text-primary" />,
              title: "Mentorship & Growth",
              description: "Find alumni and industry professionals willing to guide you. Book sessions and grow your network."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to accelerate your career?</h2>
            <p className="text-primary-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Join thousands of Nepali students already building their future on Sangam. It takes less than 2 minutes to verify your college email.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all hover:scale-105">
              Create Free Account
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-sm">S</div>
            <span className="text-lg font-bold text-foreground">Sangam</span>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Nepali Students Network. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm font-medium text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
