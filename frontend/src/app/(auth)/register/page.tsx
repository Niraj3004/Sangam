"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, UserCircle2, GraduationCap, ChevronRight } from "lucide-react";

export default function RegisterGateway() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join Sangam</h1>
        <p className="text-gray-500 mt-2">How do you want to use the platform?</p>
      </div>

      <div className="space-y-4">
        <Link href="/register/student" className="block">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-gray-100 p-5 rounded-2xl flex items-center justify-between hover:border-indigo-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">As a Student</h3>
                <p className="text-sm text-gray-500">Build your career and network</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </motion.div>
        </Link>

        <Link href="/register/employer" className="block">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-gray-100 p-5 rounded-2xl flex items-center justify-between hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">As an Employer</h3>
                <p className="text-sm text-gray-500">Hire the top 1% of talent</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </motion.div>
        </Link>

        <Link href="/register/college" className="block">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-gray-100 p-5 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">As an Institution</h3>
                <p className="text-sm text-gray-500">Manage alumni and events</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </motion.div>
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
