"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  Wallet,
  Settings,
  LogOut,
  Star
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Upload Center", href: "/upload", icon: UploadCloud },
  { name: "Negotiation", href: "/negotiation", icon: FileText },
  { name: "Funds & Ledger", href: "/funds", icon: Wallet },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-screen w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/60 relative z-50 text-slate-300 shadow-[20px_0_40px_rgba(0,0,0,0.3)]"
    >
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.4)]">
            <Star className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">Heineken OS</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Off Trade Sales</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer",
                  isActive
                    ? "text-white bg-slate-800/60 border border-slate-700/50 shadow-inner"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60 hover:translate-x-1"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-green-500 rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                )}
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-green-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="font-medium text-sm tracking-wide">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/60 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/30">
            VC
          </div>
          <div>
            <div className="text-xs font-bold text-white">Victor C.</div>
            <div className="text-[10px] text-slate-500">Sales Executive</div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 relative z-10">
          <LogOut className="h-3.5 w-3.5" />
          Sair do Sistema
        </Button>
      </div>
    </motion.div>
  );
}
