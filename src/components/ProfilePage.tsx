import React, { useState } from 'react';
import {
  Edit3,
  Wallet,
  History,
  Users,
  Settings,
  Headphones,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  Upload,
  PhoneCall,
  Send,
  Mail,
  MessageSquare,
} from 'lucide-react';
import {
  EarningRecord,
  PaymentMethod,
  ProfileSubPage,
  ReferralEntry,
  UserProfile,
  WithdrawalRequest,
} from '../types';
import { ASSETS } from '../data/initialData';

interface ProfilePageProps {
  user: UserProfile | null;
  withdrawals: WithdrawalRequest[];
  referrals: ReferralEntry[];
  earnings: EarningRecord[];
  onOpenSignIn: () => void;
  onUpdateProfile: (name: string, avatar: string) => void;
  onSubmitWithdraw: (method: PaymentMethod, mobile: string, amount: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  withdrawals,
  referrals,
  earnings,
  onOpenSignIn,
  onUpdateProfile,
  onSubmitWithdraw,
}) => {
  const [subPage, setSubPage] = useState<ProfileSubPage>('overview');

  // Withdraw state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>('বিকাশ');
  const [wdMobile, setWdMobile] = useState(user?.mobile || '');
  const [wdAmount, setWdAmount] = useState('');
  const [wdError, setWdError] = useState('');

  // Settings / Edit Profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || ASSETS.defaultAvatar);
  const [saveBanner, setSaveBanner] = useState(false);

  if (!user) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          আপনার প্রোফাইল দেখতে সাইন-ইন করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          নিজের নাম এবং মোবাইল নাম্বার দিয়ে সাইন-ইন করার সাথে সাথে আপনার ইউজার আইডি এবং রেফার কোড তৈরি হয়ে যাবে।
        </p>
        <button
          type="button"
          onClick={onOpenSignIn}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          এখনই সাইন-ইন করুন
        </button>
      </div>
    );
  }

  const myWithdrawals = withdrawals.filter((w) => w.userId === user.id);
  const myReferrals = referrals.filter(
    (r) => r.referrerId === user.id || r.referrerCode === user.code
  );

  // Group referrals by date ("তার নিচে কোন তারিখে কতজন রেফারেন্সে যুক্ত হয়েছে তা দেখা যাবে")
  const referralsByDate = myReferrals.reduce<Record<string, number>>((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});

  const openSettings = () => {
    setEditName(user.name);
    setEditAvatar(user.avatar);
    setSubPage('settings');
  };

  const handleWithdrawFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWdError('');
    if (!selectedMethod) {
      setWdError('অনুগ্রহ করে বিকাশ, রকেট অথবা নগদ যেকোনো একটি মাধ্যম সিলেক্ট করুন।');
      return;
    }
    const cleanPhone = wdMobile.trim();
    if (cleanPhone.length < 11) {
      setWdError('সঠিক ১১ ডিজিটের মোবাইল ব্যাংকিং নাম্বার দিন।');
      return;
    }
    const amt = Number(wdAmount);
    if (!amt || amt < 500) {
      setWdError('সর্বনিম্ন ৫০০ টাকা উত্তোলন রিকুয়েষ্ট করা যাবে। ৫০০ টাকার কম উত্তোলন করা যাবে না।');
      return;
    }
    if (amt > user.currentBalance) {
      setWdError(
        `আপনার বর্তমান ব্যালেন্স (৳ ${user.currentBalance}) এর চেয়ে বেশি টাকা উত্তোলন করা যাবে না।`
      );
      return;
    }
    onSubmitWithdraw(selectedMethod, cleanPhone, amt);
    setWdAmount('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateProfile(editName.trim(), editAvatar.trim() || ASSETS.defaultAvatar);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Profile Header Card: Left photo, Right name, below name ID, below ID code, beside it Edit option */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* বাম পাশে ছবি */}
            <img
              src={user.avatar || ASSETS.defaultAvatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            {/* ডান পাশে নাম, নামের নিচে আইডি এবং তার নিচে কোড */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user.name}
              </h1>
              <div className="text-xs sm:text-sm text-slate-600 font-mono-num">
                ইউজার আইডি: <strong className="text-slate-900">{user.id}</strong>
              </div>
              <div className="text-xs sm:text-sm text-emerald-700 font-mono-num">
                রেফার কোড: <strong>{user.code}</strong>
              </div>
            </div>
          </div>

          {/* তার পাশে এডিট করার অপশন */}
          <button
            type="button"
            onClick={openSettings}
            className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 self-start sm:self-center transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>প্রোফাইল এডিট করুন</span>
          </button>
        </div>

        {/* তার নিচে সে কতটাকা ইনকাম করেছে (Current Balance) এবং তার পাশে সে মোট কতটাকা ইনকাম করেছে (Total Earned) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="text-xs text-emerald-800">
              বর্তমান উত্তোলনযোগ্য ইনকাম ব্যালেন্স
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-emerald-700 mt-1">
              ৳ {user.currentBalance.toLocaleString('bn-BD')}
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-500">মোট কত টাকা ইনকাম করেছেন</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-900 mt-1">
              ৳ {user.totalEarned.toLocaleString('bn-BD')}
            </div>
          </div>
        </div>

        {/* তার নিচে সে কতটা এড দেখেছে, কতজনকে রেফার করেছে এবং রেফার থেকে কতটাকা ইনকাম করেছে */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">মোট এড দেখেছেন</div>
            <div className="text-xl font-bold font-mono-num text-slate-900 mt-0.5">
              {user.adsWatched} টি
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">মোট রেফার করেছেন</div>
            <div className="text-xl font-bold font-mono-num text-slate-900 mt-0.5">
              {user.referralCount} জন
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">রেফার থেকে ইনকাম</div>
            <div className="text-xl font-bold font-mono-num text-emerald-700 mt-0.5">
              ৳ {user.referralEarned.toLocaleString('bn-BD')}
            </div>
          </div>
        </div>

        {/* তার নিচে "Withdraw, Earning History, My Referrals, Settings, Supports" নামে আলাদা আলাদা বাটন */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-500 mb-3">
            প্রোফাইল মেনু — যেকোনো অপশনে ক্লিক করুন:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'withdraw', label: 'Withdraw', icon: Wallet },
              { id: 'earning_history', label: 'Earning History', icon: History },
              { id: 'my_referrals', label: 'My Referrals', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'supports', label: 'Supports', icon: Headphones },
            ].map((btn) => {
              const Icon = btn.icon;
              const active = subPage === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => {
                    if (btn.id === 'settings') {
                      openSettings();
                    } else {
                      setSubPage(btn.id as ProfileSubPage);
                    }
                  }}
                  className={`min-h-[48px] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sub-Page Content Area */}
      {subPage !== 'overview' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubPage('overview')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>প্রোফাইল ওভারভিউতে ফিরে যান</span>
          </button>
        </div>
      )}

      {/* 1. WITHDRAW PAGE */}
      {(subPage === 'withdraw' || subPage === 'overview') && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Withdraw — মোবাইল ব্যাংকিংয়ের মাধ্যমে টাকা উত্তোলন করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              বিকাশ, রকেট অথবা নগদ যেকোনো একটি মাধ্যম সিলেক্ট করে আপনার নাম্বার এবং টাকার পরিমাণ দিন।
            </p>
          </div>

          {/* Mobile Banking Selector: বিকাশ, রকেট, নগদ */}
          <div className="grid grid-cols-3 gap-3">
            {(['বিকাশ', 'রকেট', 'নগদ'] as PaymentMethod[]).map((method) => {
              const isSelected = selectedMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold">{method}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      isSelected ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    পার্সোনাল নাম্বার
                  </div>
                </button>
              );
            })}
          </div>

          {selectedMethod && (
            <form onSubmit={handleWithdrawFormSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    আপনার {selectedMethod} মোবাইল নাম্বার *
                  </label>
                  <input
                    type="tel"
                    value={wdMobile}
                    onChange={(e) => setWdMobile(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    টাকার পরিমাণ / এমাউন্ট (সর্বনিম্ন ৫০০ ৳) * (বর্তমান ব্যালেন্স: ৳ {user.currentBalance})
                  </label>
                  <input
                    type="number"
                    value={wdAmount}
                    onChange={(e) => setWdAmount(e.target.value)}
                    placeholder="সর্বনিম্ন ৫০০ টাকা"
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              {wdError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                  {wdError}
                </p>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[46px] px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Withdraw রিকুয়েষ্ট পাঠান ({selectedMethod})
              </button>
            </form>
          )}
        </section>
      )}

      {/* 2. EARNING HISTORY PAGE */}
      {subPage === 'earning_history' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Earning History — আপনার উত্তোলন রিকুয়েষ্ট ও ইনকাম বিবরণী
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                আপনি মোট কতবার উত্তোলনের রিকুয়েষ্ট দিয়েছেন, কোন নাম্বারে, কত টাকা, কত তারিখে এবং স্ট্যাটাস নিচে দেখুন।
              </p>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-right shrink-0">
              <div className="text-xs text-slate-500">মোট উত্তোলন রিকুয়েষ্ট দিয়েছেন</div>
              <div className="text-lg font-bold font-mono-num text-slate-900">
                {myWithdrawals.length} বার
              </div>
            </div>
          </div>

          {myWithdrawals.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                আপনি এখনো কোনো উত্তোলন রিকুয়েষ্ট পাঠাননি।
              </p>
              <button
                type="button"
                onClick={() => setSubPage('withdraw')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                এখনই প্রথম উত্তোলন রিকুয়েষ্ট দিন
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">কোন মাধ্যমে ও নাম্বারে</th>
                    <th className="py-3 px-4">কত টাকা</th>
                    <th className="py-3 px-4">কত তারিখে</th>
                    <th className="py-3 px-4">স্ট্যাটাস (সফল / পেন্ডিং)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {myWithdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{w.method}</div>
                        <div className="text-xs font-mono-num text-slate-500">
                          নাম্বার: {w.accountNumber}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono-num font-bold text-emerald-700">
                        ৳ {w.amount}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{w.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            w.status === 'সফল'
                              ? 'text-emerald-700'
                              : w.status === 'পেন্ডিং'
                              ? 'text-amber-700'
                              : 'text-red-600'
                          }`}
                        >
                          {w.status === 'সফল' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {w.status === 'সফল'
                              ? 'সফল হয়েছে'
                              : w.status === 'পেন্ডিং'
                              ? 'পেন্ডিং আছে'
                              : 'বাতিল'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Ad & Task Earnings */}
          {earnings.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                সাম্প্রতিক কাজের ইনকাম লগ
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {earnings.slice(0, 10).map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{e.title}</div>
                      <div className="text-xs text-slate-500">
                        {e.category} · {e.date}
                      </div>
                    </div>
                    <div className="font-mono-num font-bold text-emerald-700">
                      + ৳ {e.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. MY REFERRALS PAGE */}
      {subPage === 'my_referrals' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My Referrals — আপনার রেফারেল পরিসংখ্যান ও তারিখভিত্তিক তালিকা
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              আপনার লিংকে ক্লিক দিয়ে কতজন একাউন্ট খুলেছেন এবং কোন তারিখে কতজন যুক্ত হয়েছেন তার সম্পূর্ণ হিসাব।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-xs text-slate-500">
                আপনার লিংকে ক্লিক দিয়ে একাউন্ট খুলেছেন
              </div>
              <div className="text-2xl font-bold font-mono-num text-slate-900 mt-1">
                {user.referralCount} জন
              </div>
            </div>
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="text-xs text-emerald-800">
                রেফার থেকে মোট ইনকাম করেছেন
              </div>
              <div className="text-2xl font-bold font-mono-num text-emerald-700 mt-1">
                ৳ {user.referralEarned.toLocaleString('bn-BD')}
              </div>
            </div>
          </div>

          {/* Date-wise Summary ("তার নিচে কোন তারিখে কতজন রেফারেন্সে যুক্ত হয়েছে তা দেখা যাবে") */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              তারিখ অনুযায়ী রেফারেন্সে যুক্ত হওয়া সদস্য সংখ্যা:
            </h3>
            {Object.keys(referralsByDate).length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                এখনো কোনো নতুন সদস্য যুক্ত হননি। Refer পেইজ থেকে আপনার লিংক শেয়ার করুন অথবা টেস্ট করুন।
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {Object.entries(referralsByDate).map(([dateStr, count]) => (
                  <div
                    key={dateStr}
                    className="p-3.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="font-medium text-slate-800">তারিখ: {dateStr}</span>
                    <span className="font-mono-num font-bold text-emerald-700">
                      {count} জন যুক্ত হয়েছেন (+৳ {count * 50})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Referred Users */}
          {myReferrals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                রেফারকৃত সদস্যদের তালিকা:
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {myReferrals.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{r.newUserName}</div>
                      <div className="text-xs text-slate-500 font-mono-num">
                        আইডি: {r.newUserId} · তারিখ: {r.date}
                      </div>
                    </div>
                    <div className="font-mono-num font-bold text-emerald-700">
                      + ৳ {r.commission}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. SETTINGS / PROFILE CHANGE PAGE */}
      {subPage === 'settings' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Settings — প্রোফাইল ছবি এবং নাম পরিবর্তন পেইজ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              এখান থেকে আপনি আপনার প্রোফাইল ছবি এবং নাম পরিবর্তন করতে পারবেন। মোবাইল নাম্বার, ইউজার আইডি এবং কোড পরিবর্তনযোগ্য নয়।
            </p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5 max-w-xl">
            <div className="flex items-center gap-4">
              <img
                src={editAvatar || ASSETS.defaultAvatar}
                alt="প্রোফাইল ছবি"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>নতুন প্রোফাইল ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  JPG, PNG বা যেকোনো ছবি সিলেক্ট করলে সাথে সাথে প্রিভিউ আপডেট হবে।
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                আপনার নাম (পরিবর্তনযোগ্য) *
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            {/* Read-only fields: Mobile Number, User ID, Code */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-slate-500">
                স্থায়ী একাউন্ট তথ্য (পরিবর্তন করা যাবে না):
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  মোবাইল নাম্বার (অপরিবর্তনযোগ্য)
                </label>
                <input
                  type="text"
                  value={user.mobile}
                  disabled
                  className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    ইউজার আইডি (অপরিবর্তনযোগ্য)
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    disabled
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    রেফার কোড (অপরিবর্তনযোগ্য)
                  </label>
                  <input
                    type="text"
                    value={user.code}
                    disabled
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {saveBanner && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                আপনার প্রোফাইল নাম ও ছবি সফলভাবে আপডেট করা হয়েছে!
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              পরিবর্তন সেভ করুন
            </button>
          </form>
        </section>
      )}

      {/* 5. SUPPORTS PAGE */}
      {subPage === 'supports' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Supports — আমাদের সম্পর্কে বিস্তারিত এবং যোগাযোগের মাধ্যমসমূহ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              <strong>সহজে ইনকাম (Sohoje Income)</strong> বাংলাদেশের একটি আধুনিক ডিজিটাল বিজ্ঞাপন ভিউ এবং সোশ্যাল মাইক্রো-টাস্ক প্ল্যাটফর্ম। আমরা বিভিন্ন দেশি ও আন্তর্জাতিক ব্র্যান্ডের প্রমোশনাল এড এবং সোশ্যাল ক্যাম্পেইন আমাদের ভেরিফাইড সদস্যদের মাধ্যমে সম্পন্ন করে থাকি এবং তার লভ্যাংশ সরাসরি সদস্যদের সাথে শেয়ার করি।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/8801700889900"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl flex items-start gap-3.5 transition-colors"
            >
              <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  অফিসিয়াল হোয়াটসঅ্যাপ সাপোর্ট
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-mono-num">
                  +880 1700-889900 (সকাল ৯টা – রাত ১১টা)
                </p>
              </div>
            </a>

            <a
              href="https://t.me/sohoje_income_official"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-slate-50 hover:bg-sky-50/60 border border-slate-200 rounded-2xl flex items-start gap-3.5 transition-colors"
            >
              <Send className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  টেলিগ্রাম হেল্পডেস্ক ও চ্যানেল
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-mono-num">
                  @sohoje_income_official
                </p>
              </div>
            </a>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">ইমেইল সাপোর্ট</h3>
                <p className="text-xs text-slate-600 mt-0.5 font-mono-num">
                  support@sohoje-income.com
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  অটোমেটিক লাইভ চ্যাটবট
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  হোমপেইজের ডান পাশের চ্যাটবট বাটনে ক্লিক করে যেকোনো প্রশ্নের তাৎক্ষণিক উত্তর পান।
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
