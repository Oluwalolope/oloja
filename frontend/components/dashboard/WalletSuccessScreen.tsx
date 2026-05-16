"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, Sparkles, ArrowDownLeft, Send, LineChart, Shield, Lock } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function WalletSuccessScreen({ onContinue }: { onContinue: () => void }) {
  const [copied, setCopied] = useState(false);

  const saveToClipboard = (text:string) => {
   navigator.clipboard.writeText(text);
   setCopied(true);
   setTimeout(() => setCopied(false), 2000);
  }

  // Add useUser to get user data
  const { user } = useUser();
  
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090b] text-zinc-900 dark:text-white relative">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32 no-scrollbar">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Wallet Successfully Created!</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Your virtual account is ready to use</p>
        </div>

        <div className="bg-[#8b5cf6] rounded-2xl p-6 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="flex items-center gap-2 text-zinc-600 dark:text-white/80 text-sm mb-4">
            <div className="w-4 h-4 rounded border border-white/40 flex items-center justify-center text-[10px]">💳</div>
            Virtual Account Details
          </div>
          <div className="mb-4">
            <div className="text-zinc-500 dark:text-white/70 text-xs mb-1">Account Name</div>
            <div className="text-lg font-semibold">{user?.virtualAccount?.account_name || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'N/A'}</div>
          </div>
          <div className="mb-4 flex justify-between items-end">
            <div>
              <div className="text-zinc-500 dark:text-white/70 text-xs mb-1">Account Number</div>
              <div className="text-2xl font-bold tracking-wider">{user?.virtualAccount?.virtual_account_number ? user?.virtualAccount?.virtual_account_number : '2416090676'}</div>
            </div>
            <button 
              onClick={() => saveToClipboard(user?.virtualAccount?.virtual_account_number ?? '2416090676')}
              className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/20 flex items-center justify-center hover:bg-black/20 dark:bg-white/30 transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-zinc-900 dark:text-white" />
              )}
            </button>
          </div>
          <div>
            <div className="text-zinc-500 dark:text-white/70 text-xs mb-1">Bank Name</div>
            <div className="font-medium">{user?.virtualAccount?.bank || 'Squad MFB'}</div>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-[#13101c] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Financial Identity Setup</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Building your economic profile</p>
            </div>
          </div>
          <div className="flex gap-1 mb-2">
            <div className="h-1.5 flex-[2] bg-[#8b5cf6] rounded-full"></div>
            <div className="h-1.5 flex-[3] bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
          </div>
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Step 2 of 5 complete</span>
            <span className="text-[#8b5cf6]">40%</span>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">What Your Virtual wallet Helps You Do</h2>
        <div className="space-y-3">
          <FeatureCard
            icon={<ArrowDownLeft className="w-5 h-5" />}
            title="Receive Payments"
            description="Get paid directly into your wallet for work done, with instant notifications."
          />
          <FeatureCard
            icon={<Send className="w-5 h-5" />}
            title="Send Money"
            description="Transfer funds to any bank account or mobile wallet instantly"
          />
          <FeatureCard
            icon={<LineChart className="w-5 h-5" />}
            title="Build Transaction History"
            description="Every transaction strengthens your financial identity and credit score"
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" />}
            title="Unlock Financial Services"
            description="Access savings accounts, credit, and insurance as you grow"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white dark:from-[#09090b] dark:via-[#09090b] to-transparent pt-12">
        <button
          onClick={onContinue}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-4 rounded-xl font-medium text-lg transition-all active:scale-[0.98] mb-4"
        >
          Continue to Dashboard
        </button>
        <div className="flex justify-center items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
          <Lock className="w-3 h-3" /> Powered by Squad
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/50">
      <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800/80 flex items-center justify-center text-emerald-500 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-sm mb-1">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
