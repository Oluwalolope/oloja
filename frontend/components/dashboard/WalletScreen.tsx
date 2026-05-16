import React, { useState, useEffect } from "react";
import { Menu, Eye, Download, Send, Plus, PiggyBank, BarChart3, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, EyeOff, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";

const API_BASE = "https://oloja-production.up.railway.app";

interface WalletScreenProps {
  onOpenMenu: () => void;
}

export function WalletScreen({ onOpenMenu }: WalletScreenProps) {
  const { user } = useUser();
  const [showWalletAmount, setShowWalletAmount] = useState(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [isLoadingTrust, setIsLoadingTrust] = useState(true);

  const walletBalance = "₦0.00";

  const handleShowWalletAmount = () => {
    setShowWalletAmount(prev => !prev);
  };

  // Fetch trust score for the wallet view
  useEffect(() => {
    const fetchTrustScore = async () => {
      const acctNum = user?.virtualAccount?.virtual_account_number;
      if (!acctNum) {
        setTrustScore(user?.trustScore ?? null);
        setIsLoadingTrust(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/trust/${acctNum}`);
        if (!response.ok) throw new Error('Failed to fetch trust score');
        const data = await response.json();
        setTrustScore(data.trustScore);
        setTransactionCount(data.transactionCount ?? 0);
      } catch (err) {
        console.error(err);
        setTrustScore(user?.trustScore ?? null);
      } finally {
        setIsLoadingTrust(false);
      }
    };
    fetchTrustScore();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] text-zinc-100 relative overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center p-6 pb-2 w-full">
        <button onClick={onOpenMenu} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors shrink-0">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center pr-8">My Wallet</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar w-full max-w-2xl mx-auto space-y-5">
        
        {/* Main Wallet Card */}
        <div className="bg-[#8b5cf6] rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-white/80 text-sm font-medium">Available Balance</span>
            <button onClick={handleShowWalletAmount} className="text-white/80 hover:text-white transition-colors">
              {showWalletAmount ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-[38px] leading-none font-bold tracking-tight mb-8 relative z-10 text-white">
            {showWalletAmount ? walletBalance : '**********'}
          </div>
          
          <div className="flex gap-3 relative z-10">
            <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-3 flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
              <Download className="w-4 h-4" /> Withdraw
            </button>
            <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-3 flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
              <Send className="w-4 h-4" /> Send
            </button>
            <button className="flex-1 bg-white text-[#8b5cf6] hover:bg-white/90 transition-colors rounded-xl py-3 flex flex-col items-center justify-center gap-1.5 text-[11px] font-medium shadow-lg">
              <Plus className="w-4 h-4" /> Save
            </button>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        </div>

        {/* Account Info */}
        <div className="bg-[#18181b] border border-zinc-800/50 rounded-[20px] p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Account Details</h3>
              <p className="text-zinc-500 text-xs">{user?.virtualAccount?.bank || "Squad MFB"}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Account Name</span>
            <span className="font-medium">{user?.virtualAccount?.account_name || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || "Oluwalolope Adeleye"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Account Number</span>
            <span className="font-medium font-mono">{user?.virtualAccount?.virtual_account_number || "2416090603"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Trust Score</span>
            <span className="font-medium text-emerald-500">
              {isLoadingTrust ? "..." : trustScore !== null ? trustScore : "0"}
            </span>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="bg-[#18181b] border border-zinc-800/50 rounded-[20px] p-5 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Savings Progress</h3>
                <p className="text-zinc-500 text-xs">Building your future</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-500 font-medium text-sm">₦0</div>
              <div className="text-zinc-500 text-[10px]">Total saved</div>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            <div className="h-1.5 flex-[0] bg-emerald-500 rounded-full"></div>
            <div className="h-1.5 flex-[10] bg-zinc-800 rounded-full"></div>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-zinc-500 text-[11px] max-w-[200px] leading-relaxed">
              Complete jobs to unlock 8% monthly interest on savings
            </p>
            <button className="text-[#8b5cf6] text-[11px] font-medium hover:underline shrink-0">
              Learn more
            </button>
          </div>
        </div>

        {/* Financial Activity */}
        <div className="bg-[#18181b] border border-zinc-800/50 rounded-[20px] p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Financial Activity</h3>
              <p className="text-zinc-500 text-xs">
                {transactionCount > 0 ? `${transactionCount} transactions recorded` : "No activity yet"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Total Earned</span>
              <span className="font-medium text-emerald-500">₦0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Total Saved</span>
              <span className="font-medium text-[#8b5cf6]">₦0</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-4 border-t border-zinc-800/50">
              <span className="text-zinc-500">Available Now</span>
              <span className="font-semibold">₦0</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="pt-2 pb-6">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-base font-semibold">Recent Transactions</h2>
            <button className="text-[#8b5cf6] text-xs font-medium hover:underline">See all</button>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm font-medium mb-1">No transactions yet</p>
              <p className="text-zinc-600 text-xs max-w-[220px]">
                Your transaction history will appear here once you start earning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TransactionProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  amount: string;
  status: string;
  statusColor: string;
  statusIcon?: React.ReactNode;
}

function Transaction({ icon, title, time, amount, status, statusColor, statusIcon }: TransactionProps) {
  return (
    <div className={`bg-[#18181b] border border-zinc-800/50 rounded-2xl p-4 flex items-center gap-3`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-zinc-800/50`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate mb-0.5">{title}</h4>
        <div className="text-zinc-500 text-[11px]">{time}</div>
      </div>
      <div className="text-right shrink-0">
        <div className={`font-medium text-sm mb-1 ${amount.startsWith('+') ? 'text-emerald-500' : 'text-zinc-300'}`}>
          {amount}
        </div>
        <div className={`text-[10px] flex items-center justify-end ${statusColor}`}>
          {statusIcon}
          {status}
        </div>
      </div>
    </div>
  );
}
