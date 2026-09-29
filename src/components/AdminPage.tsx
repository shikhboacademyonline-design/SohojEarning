import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Trophy,
  LogOut,
  Sparkles,
  Send,
  Edit3,
  ExternalLink,
  Search,
  Users,
  Wallet,
  Compass,
  Lock,
  Check,
  X,
  Download,
} from 'lucide-react';
import {
  AdItem,
  DiscoverTask,
  PaymentMethod,
  TaskCategory,
  UserProfile,
  WithdrawalRequest,
  WithdrawalStatus,
} from '../types';
import { AUTO_CAPTIONS } from '../data/initialData';

interface AdminPageProps {
  isAdminLoggedIn: boolean;
  ads: AdItem[];
  users: UserProfile[];
  withdrawals: WithdrawalRequest[];
  tasks: DiscoverTask[];
  onAdminLoginSubmit: (username: string, password: string) => boolean;
  onAddAd: (
    title: string,
    url: string,
    caption: string,
    reward: number,
    sponsor: string
  ) => void;
  onUpdateAd: (updatedAd: AdItem) => void;
  onDeleteAd: (adId: string) => void;
  onUpdateWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
  onDeleteWithdrawal: (id: string) => void;
  onAdminCreateWithdrawal: (
    userName: string,
    userId: string,
    method: PaymentMethod,
    accountNumber: string,
    amount: number,
    status?: WithdrawalStatus
  ) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onDeleteUser: (userId: string) => void;
  onAddTask: (
    category: TaskCategory,
    title: string,
    description: string,
    url: string,
    reward: number
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenCodeDownload?: () => void;
}

type AdminSectionTab = 'all' | 'ads' | 'withdrawals' | 'users' | 'tasks';

export const AdminPage: React.FC<AdminPageProps> = ({
  isAdminLoggedIn,
  ads,
  users,
  withdrawals,
  tasks,
  onAdminLoginSubmit,
  onAddAd,
  onUpdateAd,
  onDeleteAd,
  onUpdateWithdrawalStatus,
  onDeleteWithdrawal,
  onAdminCreateWithdrawal,
  onUpdateUserBalance,
  onDeleteUser,
  onAddTask,
  onDeleteTask,
  onAdminLogout,
  onOpenCodeDownload,
}) => {
  // Inline Login State (when not logged in)
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Active Section Filter
  const [sectionTab, setSectionTab] = useState<AdminSectionTab>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Ad state
  const [adTitle, setAdTitle] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [adSponsor, setAdSponsor] = useState('');
  const [adReward, setAdReward] = useState('25');
  const [adCaption, setAdCaption] = useState('');

  // Edit Ad state
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [editAdTitle, setEditAdTitle] = useState('');
  const [editAdUrl, setEditAdUrl] = useState('');
  const [editAdReward, setEditAdReward] = useState('25');
  const [editAdCaption, setEditAdCaption] = useState('');

  // Withdrawal Filter & Create state
  const [wdFilter, setWdFilter] = useState<'সব' | WithdrawalStatus>('সব');
  const [wdUserName, setWdUserName] = useState('');
  const [wdUserId, setWdUserId] = useState('SI-9901');
  const [wdMethod, setWdMethod] = useState<PaymentMethod>('বিকাশ');
  const [wdAccount, setWdAccount] = useState('');
  const [wdAmount, setWdAmount] = useState('500');
  const [wdInitialStatus, setWdInitialStatus] =
    useState<WithdrawalStatus>('সফল');

  // Users search & balance edit state
  const [userSearch, setUserSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editBalanceVal, setEditBalanceVal] = useState('');

  // Add Discover Task state
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('telegram');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskUrl, setTaskUrl] = useState('');
  const [taskReward, setTaskReward] = useState('30');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    const ok = onAdminLoginSubmit(loginUser.trim(), loginPass.trim());
    if (!ok) {
      setLoginErr('ভুল ইউজার আইডি অথবা পাসওয়ার্ড! সঠিক এডমিন তথ্য দিন।');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md mx-auto my-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              এডমিন কন্ট্রোল প্যানেল লগইন
            </h1>
            <p className="text-xs text-slate-500">
              সকল এড, উত্তোলন এবং একাউন্ট নিয়ন্ত্রণ করতে লগইন করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleInlineLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              এডমিন ইউজার আইডি
            </label>
            <input
              type="text"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              placeholder="ইউজার আইডি লিখুন"
              autoComplete="off"
              className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              এডমিন পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white"
              required
            />
          </div>

          {loginErr && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
              {loginErr}
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              এডমিন পেইজে প্রবেশ করুন
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Metrics Calculation
  const totalAdsCount = ads.length;
  const totalClicksCount = ads.reduce((sum, a) => sum + (Number(a.clicks) || 0), 0);
  // Platform revenue from sponsors (৳ 45 per click)
  const totalPlatformIncome = totalClicksCount * 45;
  // Total expense (paid + pending user withdrawals)
  const totalWithdrawalExpense = withdrawals
    .filter((w) => w.status !== 'বাতিল')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
  const totalAccountsCount = users.length;

  // Calculate Top Withdrawer ("কে বেশি টাকা উত্তোলন করেছে")
  const withdrawalTotalsByUser = withdrawals
    .filter((w) => w.status !== 'বাতিল')
    .reduce<
      Record<
        string,
        { name: string; userId: string; total: number; count: number }
      >
    >((acc, w) => {
      const key = w.userId || w.userName;
      if (!acc[key]) {
        acc[key] = {
          name: w.userName,
          userId: w.userId,
          total: 0,
          count: 0,
        };
      }
      acc[key].total += Number(w.amount) || 0;
      acc[key].count += 1;
      return acc;
    }, {});

  const topWithdrawersList = Object.values(withdrawalTotalsByUser).sort(
    (a, b) => b.total - a.total
  );
  const topWithdrawer = topWithdrawersList[0] || null;

  const handleGenerateCaption = () => {
    const randomCaption =
      AUTO_CAPTIONS[Math.floor(Math.random() * AUTO_CAPTIONS.length)];
    setAdCaption(randomCaption);
    showToast('অটোমেটিক আকর্ষণীয় ক্যাপশন তৈরি করা হয়েছে!');
  };

  const handleAddAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adUrl.trim()) return;
    const finalCaption =
      adCaption.trim() || AUTO_CAPTIONS[ads.length % AUTO_CAPTIONS.length];
    const formattedUrl = adUrl.trim().startsWith('http')
      ? adUrl.trim()
      : `https://${adUrl.trim()}`;

    onAddAd(
      adTitle.trim(),
      formattedUrl,
      finalCaption,
      Number(adReward) || 20,
      adSponsor.trim() || 'Sohoje Income Partner'
    );
    setAdTitle('');
    setAdUrl('');
    setAdSponsor('');
    setAdCaption('');
    showToast('নতুন এড লিংক সফলভাবে যুক্ত হয়েছে এবং লাইভ করা হয়েছে!');
  };

  const startEditAd = (ad: AdItem) => {
    setEditingAdId(ad.id);
    setEditAdTitle(ad.title);
    setEditAdUrl(ad.url);
    setEditAdReward(String(ad.reward));
    setEditAdCaption(ad.caption);
  };

  const handleSaveEditAd = (ad: AdItem) => {
    if (!editAdTitle.trim() || !editAdUrl.trim()) return;
    const formattedUrl = editAdUrl.trim().startsWith('http')
      ? editAdUrl.trim()
      : `https://${editAdUrl.trim()}`;
    onUpdateAd({
      ...ad,
      title: editAdTitle.trim(),
      url: formattedUrl,
      reward: Number(editAdReward) || ad.reward,
      caption: editAdCaption.trim() || ad.caption,
    });
    setEditingAdId(null);
    showToast('এড লিংকটি সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleAdminWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(wdAmount);
    if (!wdUserName.trim() || !wdAccount.trim() || !numericAmount || numericAmount <= 0) {
      return;
    }
    onAdminCreateWithdrawal(
      wdUserName.trim(),
      wdUserId.trim() || 'SI-9901',
      wdMethod,
      wdAccount.trim(),
      numericAmount,
      wdInitialStatus
    );
    setWdUserName('');
    setWdAccount('');
    setWdAmount('500');
    showToast(
      `৳ ${numericAmount} উত্তোলন রিকুয়েষ্ট (${wdInitialStatus}) সফলভাবে তৈরি ও হোমপেইজ পপআপে যুক্ত হয়েছে!`
    );
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskUrl.trim()) return;
    const formattedUrl = taskUrl.trim().startsWith('http')
      ? taskUrl.trim()
      : `https://${taskUrl.trim()}`;
    onAddTask(
      taskCategory,
      taskTitle.trim(),
      taskDesc.trim() ||
        'লিংকে ক্লিক করে কাজটি সম্পন্ন করুন এবং তাৎক্ষণিক বোনাস টাকা আপনার একাউন্টে যোগ করুন।',
      formattedUrl,
      Number(taskReward) || 25
    );
    setTaskTitle('');
    setTaskDesc('');
    setTaskUrl('');
    showToast('নতুন ডিসকভার টাস্ক সফলভাবে যুক্ত করা হয়েছে!');
  };

  const filteredWithdrawals =
    wdFilter === 'সব'
      ? withdrawals
      : withdrawals.filter((w) => w.status === wdFilter);

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Live Feedback Toast Banner */}
      {toastMessage && (
        <div className="sticky top-16 z-40 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-emerald-400 font-mono-num">
            এডমিন ইউজার আইডি: yeakub · সক্রিয় ক্লাউড ডাটাবেস কন্ট্রোল প্যানেল
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            সহজে ইনকাম — এডমিন কন্ট্রোল ড্যাশবোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            এড লিংক যুক্ত/ডিলেট, ক্লিক ও আয়-ব্যয় হিসাব, সকল ডিভাইসের একাউন্ট তালিকা এবং উত্তোলন স্ট্যাটাস নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          {onOpenCodeDownload && (
            <button
              type="button"
              onClick={onOpenCodeDownload}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>কোড ডাউনলোড (.ZIP / Live)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAdminLogout}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>এডমিন লগআউট</span>
          </button>
        </div>
      </div>

      {/* Interactive Admin Section Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'সবগুলো অপশন (All View)' },
          { id: 'ads', label: `এড লিংক ম্যানেজমেন্ট (${ads.length})` },
          {
            id: 'withdrawals',
            label: `উত্তোলন ও পেমেন্ট (${withdrawals.length})`,
          },
          { id: 'users', label: `সকল সদস্য একাউন্ট (${users.length})` },
          { id: 'tasks', label: `ডিসকভার টাস্ক (${tasks.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSectionTab(tab.id as AdminSectionTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              sectionTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 6 Core Admin Metrics Grid (Clickable to filter sections) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setSectionTab('ads')}
          className="text-left bg-white hover:border-emerald-500 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-slate-500">কতটি এড যুক্ত আছে</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-900 mt-1">
            {totalAdsCount} টি এড
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            হোমপেইজ ও Videos পেইজে সক্রিয় (ম্যানেজ করতে ক্লিক করুন) →
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSectionTab('ads')}
          className="text-left bg-white hover:border-emerald-500 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-slate-500">
            কতবার ক্লিক করা হয়েছে (মোট এড ভিউ)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-900 mt-1">
            {totalClicksCount.toLocaleString('bn-BD')} বার
          </div>
          <div className="text-xs text-slate-500 mt-1">
            সকল বিজ্ঞাপনের সম্মিলিত ক্লিক সংখ্যা
          </div>
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs text-slate-500">
            কত টাকা ইনকাম হয়েছে (প্ল্যাটফর্ম আয়)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-num text-emerald-700 mt-1">
            ৳ {totalPlatformIncome.toLocaleString('bn-BD')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            স্পন্সর ও এড নেটওয়ার্ক থেকে মোট আয়
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSectionTab('withdrawals')}
          className="text-left bg-white hover:border-amber-500 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-slate-500">
            কত টাকা ব্যয় হয়েছে (মোট পেমেন্ট ও উত্তোলন)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-num text-amber-700 mt-1">
            ৳ {totalWithdrawalExpense.toLocaleString('bn-BD')}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            উত্তোলন তালিকা দেখতে ক্লিক করুন →
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSectionTab('users')}
          className="text-left bg-white hover:border-emerald-500 border border-slate-200 rounded-2xl p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-slate-500">কতজন একাউন্ট খুলেছে</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-900 mt-1">
            {totalAccountsCount} জন
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            সকল ডিভাইসের একাউন্ট দেখতে ক্লিক করুন →
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSectionTab('withdrawals')}
          className="text-left bg-emerald-50/80 hover:bg-emerald-50 border border-emerald-200 rounded-2xl p-5 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">
              কে বেশি টাকা উত্তোলন করেছে (শীর্ষ উত্তোলনকারী)
            </span>
            <Trophy className="w-4 h-4 text-emerald-700" />
          </div>
          {topWithdrawer ? (
            <>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {topWithdrawer.name}
              </div>
              <div className="text-xs text-emerald-800 font-mono-num mt-0.5">
                মোট উত্তোলন:{' '}
                <strong>
                  ৳ {topWithdrawer.total.toLocaleString('bn-BD')}
                </strong>{' '}
                ({topWithdrawer.count} বার) · আইডি: {topWithdrawer.userId}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-600 mt-1">কোনো তথ্য নেই</div>
          )}
        </button>
      </section>

      {/* SECTION 1: Add New Ad Link & Manage/Edit/Delete Ads */}
      {(sectionTab === 'all' || sectionTab === 'ads') && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Ad Form */}
          <form
            onSubmit={handleAddAdSubmit}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>নতুন এড লিংক যুক্ত করুন</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                এডের শিরোনাম (Title) *
              </label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="উদাঃ দারাজ ঈদ মেগা সেল বিজ্ঞাপন"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                এড লিংক (URL) *
              </label>
              <input
                type="text"
                value={adUrl}
                onChange={(e) => setAdUrl(e.target.value)}
                placeholder="https://example.com/promo"
                className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্পন্সর নাম
                </label>
                <input
                  type="text"
                  value={adSponsor}
                  onChange={(e) => setAdSponsor(e.target.value)}
                  placeholder="Brand Name"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ইউজার ইনকাম (৳)
                </label>
                <input
                  type="number"
                  value={adReward}
                  onChange={(e) => setAdReward(e.target.value)}
                  min={1}
                  className="w-full px-3.5 py-2 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  এড ক্যাপশন (খালি রাখলে অটোমেটিক ক্যাপশন বসবে)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateCaption}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>অটো ক্যাপশন তৈরি করুন</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={adCaption}
                onChange={(e) => setAdCaption(e.target.value)}
                placeholder="অটোমেটিক আকর্ষণীয় ক্যাপশন তৈরি হবে..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              এড লিংক প্রকাশ করুন
            </button>
          </form>

          {/* Active Ads List, Edit & Delete */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                সকল যুক্তকৃত এড লিংক, এডিট ও ডিলেট ({ads.length}টি)
              </h2>
            </div>

            {ads.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-xl">
                বর্তমানে কোনো এড লিংক নেই। বাম পাশের ফর্ম থেকে নতুন এড যুক্ত করুন।
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto pr-1">
                {ads.map((ad, idx) => (
                  <div key={ad.id} className="py-4 space-y-3">
                    {editingAdId === ad.id ? (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-slate-800">
                          এড লিংক এডিট করুন (সিরিয়াল #{idx + 1})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={editAdTitle}
                            onChange={(e) => setEditAdTitle(e.target.value)}
                            placeholder="শিরোনাম"
                            className="sm:col-span-2 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg"
                          />
                          <input
                            type="number"
                            value={editAdReward}
                            onChange={(e) => setEditAdReward(e.target.value)}
                            placeholder="রিওয়ার্ড (৳)"
                            className="px-3 py-2 text-xs sm:text-sm font-mono-num bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <input
                          type="text"
                          value={editAdUrl}
                          onChange={(e) => setEditAdUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs font-mono-num bg-white border border-slate-200 rounded-lg"
                        />
                        <textarea
                          rows={2}
                          value={editAdCaption}
                          onChange={(e) => setEditAdCaption(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEditAd(ad)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>সেভ করুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingAdId(null)}
                            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="text-xs text-slate-500 font-mono-num">
                            সিরিয়াল #{String(idx + 1).padStart(2, '0')} · ক্লিক:{' '}
                            <strong>{ad.clicks} বার</strong> · রিওয়ার্ড:{' '}
                            <strong className="text-emerald-700">
                              ৳ {ad.reward}
                            </strong>
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {ad.title}
                          </div>
                          <div className="text-xs text-slate-600 line-clamp-2">
                            {ad.caption}
                          </div>
                          <a
                            href={ad.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono-num text-emerald-700 hover:underline truncate max-w-full"
                          >
                            <span>{ad.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditAd(ad)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>এডিট</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteAd(ad.id);
                              showToast(
                                `"${ad.title.slice(0, 25)}..." এড লিংকটি ডিলেট করা হয়েছে!`
                              );
                            }}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ডিলেট</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: All Withdrawal Requests, Status Update & Direct Admin Withdrawal Request */}
      {(sectionTab === 'all' || sectionTab === 'withdrawals') && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                টাকা উত্তোলনের রিকুয়েষ্টসমূহ এবং স্ট্যাটাস আপডেট ({filteredWithdrawals.length}টি)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                যেকোনো উত্তোলন রিকুয়েষ্টের স্ট্যাটাস এক ক্লিকে "সফল", "পেন্ডিং" অথবা "বাতিল" হিসেবে আপডেট কিংবা ডিলেট করুন।
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['সব', 'পেন্ডিং', 'সফল', 'বাতিল'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setWdFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    wdFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Top Withdrawers Leaderboard Summary */}
          {topWithdrawersList.length > 0 && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <Trophy className="w-4 h-4 text-emerald-700" />
                <span>সবচেয়ে বেশি টাকা উত্তোলনকারী শীর্ষ সদস্যগণ:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {topWithdrawersList.slice(0, 3).map((tw, index) => (
                  <div
                    key={tw.userId + index}
                    className="bg-white border border-emerald-200/80 rounded-lg px-3.5 py-2.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        #{index + 1} {tw.name}
                      </div>
                      <div className="text-[11px] font-mono-num text-slate-500">
                        {tw.userId} · {tw.count} বার উত্তোলন
                      </div>
                    </div>
                    <div className="text-sm font-bold font-mono-num text-emerald-700">
                      ৳ {tw.total.toLocaleString('bn-BD')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">সদস্য ও ইউজার আইডি</th>
                  <th className="py-3 px-4">মাধ্যম ও নাম্বার</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">বর্তমান স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">স্ট্যাটাস আপডেট ও অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {w.userName}
                      </div>
                      <div className="text-xs font-mono-num text-slate-500">
                        {w.userId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {w.method}
                      </div>
                      <div className="text-xs font-mono-num text-slate-500">
                        {w.accountNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num font-bold text-emerald-700">
                      ৳ {w.amount.toLocaleString('bn-BD')}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {w.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          w.status === 'সফল'
                            ? 'text-emerald-700'
                            : w.status === 'পেন্ডিং'
                            ? 'text-amber-700'
                            : 'text-red-600'
                        }`}
                      >
                        {w.status === 'সফল' && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {w.status === 'পেন্ডিং' && (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {w.status === 'বাতিল' && (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{w.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateWithdrawalStatus(w.id, 'সফল');
                            showToast(
                              `${w.userName}-এর ৳ ${w.amount} উত্তোলন রিকুয়েষ্ট "সফল" করা হয়েছে!`
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            w.status === 'সফল'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          সফল করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateWithdrawalStatus(w.id, 'পেন্ডিং');
                            showToast(
                              `${w.userName}-এর উত্তোলন স্ট্যাটাস "পেন্ডিং" করা হয়েছে!`
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            w.status === 'পেন্ডিং'
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                          }`}
                        >
                          পেন্ডিং
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateWithdrawalStatus(w.id, 'বাতিল');
                            showToast(
                              `${w.userName}-এর উত্তোলন রিকুয়েষ্ট "বাতিল" করা হয়েছে!`
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            w.status === 'বাতিল'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-50 hover:bg-red-100 text-red-700'
                          }`}
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteWithdrawal(w.id);
                            showToast('উত্তোলন রিকুয়েষ্টটি ডিলেট করা হয়েছে।');
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="ডিলেট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Admin Direct Withdrawal Request Creation ("টাকা উত্তোলনের রিকুয়েষ্ট করা") */}
          <form
            onSubmit={handleAdminWithdrawSubmit}
            className="pt-6 border-t border-slate-200 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>
                এডমিন প্যানেল থেকে নতুন টাকা উত্তোলনের রিকুয়েষ্ট তৈরি করুন (হোমপেইজ পপআপেও দেখাবে)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <input
                type="text"
                value={wdUserName}
                onChange={(e) => setWdUserName(e.target.value)}
                placeholder="সদস্যের নাম *"
                className="px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
              <input
                type="text"
                value={wdUserId}
                onChange={(e) => setWdUserId(e.target.value)}
                placeholder="ইউজার আইডি (SI-...)"
                className="px-3.5 py-2.5 text-xs sm:text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl"
              />
              <select
                value={wdMethod}
                onChange={(e) => setWdMethod(e.target.value as PaymentMethod)}
                className="px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="বিকাশ">বিকাশ (bKash)</option>
                <option value="রকেট">রকেট (Rocket)</option>
                <option value="নগদ">নগদ (Nagad)</option>
              </select>
              <input
                type="tel"
                value={wdAccount}
                onChange={(e) => setWdAccount(e.target.value)}
                placeholder="মোবাইল নাম্বার *"
                className="px-3.5 py-2.5 text-xs sm:text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
              <input
                type="number"
                value={wdAmount}
                onChange={(e) => setWdAmount(e.target.value)}
                placeholder="টাকার পরিমাণ *"
                min={1}
                className="px-3.5 py-2.5 text-xs sm:text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
              <div className="flex gap-2">
                <select
                  value={wdInitialStatus}
                  onChange={(e) =>
                    setWdInitialStatus(e.target.value as WithdrawalStatus)
                  }
                  className="px-2.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="সফল">সফল</option>
                  <option value="পেন্ডিং">পেন্ডিং</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                >
                  যুক্ত করুন
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* SECTION 3: Registered Users across all devices + Balance Edit & Delete */}
      {(sectionTab === 'all' || sectionTab === 'users') && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  নিবন্ধিত সকল সদস্যের তালিকা ও নিয়ন্ত্রণ ({users.length} জন)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                যেকোনো ডিভাইস থেকে সাইন-ইন করা একাউন্ট এখানে অটোমেটিক যুক্ত হয়। এখান থেকে সদস্যদের ব্যালেন্স আপডেট বা একাউন্ট ডিলেট করতে পারবেন।
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="নাম, মোবাইল বা আইডি খুঁজুন..."
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">নাম ও যোগদানের তারিখ</th>
                  <th className="py-3 px-4">ইউজার আইডি ও রেফার কোড</th>
                  <th className="py-3 px-4">মোবাইল নাম্বার</th>
                  <th className="py-3 px-4">দেখা এড</th>
                  <th className="py-3 px-4">মোট রেফার</th>
                  <th className="py-3 px-4">বর্তমান / মোট ইনকাম</th>
                  <th className="py-3 px-4 text-right">এডমিন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {u.joinedDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-num text-xs text-slate-600">
                      {u.id} ·{' '}
                      <span className="text-emerald-700 font-semibold">
                        {u.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono-num text-xs text-slate-600">
                      {u.mobile}
                    </td>
                    <td className="py-3 px-4 font-mono-num">
                      {u.adsWatched} টি
                    </td>
                    <td className="py-3 px-4 font-mono-num">
                      {u.referralCount} জন (৳ {u.referralEarned})
                    </td>
                    <td className="py-3 px-4 font-mono-num">
                      {editingUserId === u.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editBalanceVal}
                            onChange={(e) => setEditBalanceVal(e.target.value)}
                            className="w-24 px-2 py-1 text-xs font-mono-num bg-white border border-emerald-500 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nextBal = Math.max(
                                0,
                                Number(editBalanceVal) || 0
                              );
                              onUpdateUserBalance(u.id, nextBal);
                              setEditingUserId(null);
                              showToast(
                                `${u.name}-এর ব্যালেন্স ৳ ${nextBal} এ আপডেট করা হয়েছে!`
                              );
                            }}
                            className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-lg font-semibold cursor-pointer"
                          >
                            সেভ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg cursor-pointer"
                          >
                            বাতিল
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-emerald-700">
                            ৳ {u.currentBalance}
                          </span>{' '}
                          <span className="text-xs text-slate-400">
                            / ৳ {u.totalEarned}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextBal = u.currentBalance + 100;
                            onUpdateUserBalance(u.id, nextBal);
                            showToast(
                              `${u.name}-এর একাউন্টে +৳ ১০০ বোনাস যোগ করা হয়েছে!`
                            );
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          title="১০০ টাকা বোনাস যোগ করুন"
                        >
                          +৳ ১০০
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUserId(u.id);
                            setEditBalanceVal(String(u.currentBalance));
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Wallet className="w-3 h-3" />
                          <span>ব্যালেন্স এডিট</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteUser(u.id);
                            showToast(`${u.name}-এর একাউন্ট ডিলেট করা হয়েছে।`);
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="একাউন্ট ডিলেট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 4: Discover Social Tasks Management */}
      {(sectionTab === 'all' || sectionTab === 'tasks') && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleAddTaskSubmit}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>নতুন ডিসকভার টাস্ক যুক্ত করুন</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কাজের ধরন (Category)
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) =>
                    setTaskCategory(e.target.value as TaskCategory)
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="telegram">টেলিগ্রাম চ্যানেল জয়েন</option>
                  <option value="facebook">ফেসবুক পেইজ লাইক</option>
                  <option value="youtube_sub">ইউটিউব চ্যানেল সাবস্ক্রাইব</option>
                  <option value="youtube_video">ইউটিউব ভিডিও ভিউ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ইউজার রিওয়ার্ড (৳)
                </label>
                <input
                  type="number"
                  value={taskReward}
                  onChange={(e) => setTaskReward(e.target.value)}
                  min={1}
                  className="w-full px-3 py-2 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের শিরোনাম (Title) *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="উদাঃ অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কাজের লিংক (URL) *
              </label>
              <input
                type="text"
                value={taskUrl}
                onChange={(e) => setTaskUrl(e.target.value)}
                placeholder="https://t.me/..."
                className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বিবরণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={2}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="কাজের সংক্ষিপ্ত নির্দেশনা..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              ডিসকভার টাস্ক প্রকাশ করুন
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              সক্রিয় ডিসকভার টাস্ক তালিকা ({tasks.length}টি)
            </h2>
            <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="py-3.5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-semibold text-emerald-700">
                      {t.categoryLabel} · রিওয়ার্ড: ৳ {t.reward} · অংশগ্রহণ:{' '}
                      {t.participants} জন
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {t.title}
                    </div>
                    <div className="text-xs font-mono-num text-slate-500 truncate">
                      {t.url}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTask(t.id);
                      showToast('ডিসকভার টাস্কটি ডিলেট করা হয়েছে!');
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলেট</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
