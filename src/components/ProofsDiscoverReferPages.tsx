import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ExternalLink,
  UserPlus,
  Send,
  ThumbsUp,
  Youtube,
  Video,
  Share2,
  MessageSquarePlus,
} from 'lucide-react';
import {
  DiscoverTask,
  PaymentMethod,
  ReferralEntry,
  UserProfile,
  UserReview,
  WithdrawalRequest,
} from '../types';

interface ProofsPageProps {
  withdrawals: WithdrawalRequest[];
  reviews: UserReview[];
  user: UserProfile | null;
  onAddReview: (comment: string, withdrawnAmount: number, method: PaymentMethod) => void;
  onOpenSignIn: () => void;
}

export const ProofsPage: React.FC<ProofsPageProps> = ({
  withdrawals,
  reviews,
  user,
  onAddReview,
  onOpenSignIn,
}) => {
  const [filterMethod, setFilterMethod] = useState<'all' | PaymentMethod>('all');
  const [newComment, setNewComment] = useState('');
  const [newAmount, setNewAmount] = useState('1000');
  const [newMethod, setNewMethod] = useState<PaymentMethod>('বিকাশ');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const filteredWithdrawals =
    filterMethod === 'all'
      ? withdrawals
      : withdrawals.filter((w) => w.method === filterMethod);

  const totalPaidAmount = withdrawals.reduce((acc, w) => acc + w.amount, 0);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenSignIn();
      return;
    }
    if (!newComment.trim()) return;
    onAddReview(newComment.trim(), Number(newAmount) || 500, newMethod);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="space-y-10 pb-8">
      {/* Top Withdrawal Proofs Section */}
      <section className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs text-slate-500">
              ভেরিফাইড পেমেন্ট রেকর্ড · বিকাশ, রকেট ও নগদ
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Proofs — কারা কত টাকা উত্তোলন করেছেন তার লাইভ তালিকা
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              বিগত সময়ে এবং আজ যারা টাকা উত্তোলনের জন্য আবেদন করেছেন তাদের নাম, পেমেন্ট মাধ্যম এবং উত্তোলনের পরিমাণ নিচে বিস্তারিত দেওয়া হলো।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500">মোট উত্তোলন আবেদন</div>
              <div className="text-xl font-bold font-mono-num text-slate-900">
                {withdrawals.length} জন
              </div>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="text-xs text-emerald-800">মোট উত্তোলিত অর্থ</div>
              <div className="text-xl font-bold font-mono-num text-emerald-700">
                ৳ {totalPaidAmount.toLocaleString('bn-BD')}
              </div>
            </div>
          </div>
        </div>

        {/* Method Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            ০১. বিগত সময়ের উত্তোলন আবেদন ও পেমেন্ট তালিকা
          </h2>
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            {(['all', 'বিকাশ', 'নগদ', 'রকেট'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMethod(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterMethod === m
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'all' ? 'সকল মাধ্যম' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals Table / List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">সদস্যের নাম ও আইডি</th>
                  <th className="py-3.5 px-4">পেমেন্ট মাধ্যম</th>
                  <th className="py-3.5 px-4">মোবাইল নাম্বার</th>
                  <th className="py-3.5 px-4">আবেদনের তারিখ ও সময়</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">উত্তোলনের পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{w.userName}</div>
                      <div className="text-xs font-mono-num text-slate-500">
                        আইডি: {w.userId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {w.method}
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-xs text-slate-600">
                      {w.accountNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{w.date}</td>
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
                        <span>{w.status === 'সফল' ? 'সফল হয়েছে' : w.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-num font-bold text-emerald-700">
                      ৳ {w.amount.toLocaleString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom Reviews Section ("এবং রিভিউসমূহ নিচের দিকে থাকবে") */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            ০২. সম্মানিত সদস্যদের পেমেন্ট রিভিউসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            যারা নিয়মিত কাজ করে বিকাশ, নগদ ও রকেটে পেমেন্ট পেয়েছেন তাদের অভিজ্ঞতা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2.5">
                  <span>{rev.method} পেমেন্ট প্রুফ</span>
                  <span className="font-mono-num font-bold text-emerald-700">
                    ৳ {rev.withdrawnAmount.toLocaleString('bn-BD')} উত্তোলন
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-900">{rev.userName}</div>
                <div className="text-xs text-slate-500">
                  {rev.role} · {rev.organization} · {rev.date}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Add Review Box */}
        <form
          onSubmit={handleReviewSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
            <span>আপনার পেমেন্ট রিভিউ যুক্ত করুন</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কত টাকা উত্তোলন করেছেন (৳)
              </label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                min={500}
                className="w-full px-3.5 py-2 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                কোন মাধ্যমে পেমেন্ট পেয়েছেন
              </label>
              <select
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                <option value="বিকাশ">বিকাশ (bKash)</option>
                <option value="নগদ">নগদ (Nagad)</option>
                <option value="রকেট">রকেট (Rocket)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              আপনার মতামত লিখুন
            </label>
            <textarea
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="আপনার কাজের অভিজ্ঞতা এবং পেমেন্ট পাওয়ার অনুভূতি লিখুন..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            {reviewSubmitted ? (
              <span className="text-xs font-semibold text-emerald-700">
                আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                সাইন-ইন করা সদস্যরা সরাসরি রিভিউ পোস্ট করতে পারবেন।
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              রিভিউ সাবমিট করুন
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

interface DiscoverPageProps {
  tasks: DiscoverTask[];
  user: UserProfile | null;
  onCompleteTask: (task: DiscoverTask) => void;
  onOpenSignIn: () => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  tasks,
  user,
  onCompleteTask,
  onOpenSignIn,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'telegram' | 'facebook' | 'youtube_sub' | 'youtube_video'
  >('all');
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);

  const filteredTasks =
    selectedCategory === 'all'
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);

  const handleTaskAction = (task: DiscoverTask) => {
    if (!user) {
      onOpenSignIn();
      return;
    }
    window.open(task.url, '_blank', 'noopener,noreferrer');
    setVerifyingTaskId(task.id);
    setTimeout(() => {
      onCompleteTask(task);
      setVerifyingTaskId(null);
    }, 1200);
  };

  const getCategoryIcon = (cat: DiscoverTask['category']) => {
    switch (cat) {
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-600" />;
      case 'facebook':
        return <ThumbsUp className="w-5 h-5 text-blue-600" />;
      case 'youtube_sub':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'youtube_video':
        return <Video className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="text-xs text-slate-500">
          সোশ্যাল মিডিয়া এনগেজমেন্ট ও বোনাস কাজ
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Discover — নতুন নতুন কাজ সম্পন্ন করে বাড়তি ইনকাম করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          টেলিগ্রাম চ্যানেল জয়েন, ফেসবুক পেইজ লাইক, ইউটিউব চ্যানেল সাবস্ক্রাইব এবং ইউটিউব ভিডিও দেখার মাধ্যমে প্রতিদিন অতিরিক্ত টাকা আয় করুন।
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {[
            { id: 'all', label: 'সকল নতুন কাজ' },
            { id: 'telegram', label: 'টেলিগ্রাম চ্যানেল জয়েন' },
            { id: 'facebook', label: 'ফেসবুক পেইজ লাইক' },
            { id: 'youtube_sub', label: 'ইউটিউব চ্যানেল সাবস্ক্রাইব' },
            { id: 'youtube_video', label: 'ইউটিউব ভিডিও' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const isDone = user?.completedTaskIds.includes(task.id) ?? false;
          const isVerifying = verifyingTaskId === task.id;

          return (
            <div
              key={task.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      {getCategoryIcon(task.category)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        {task.categoryLabel}
                      </div>
                      <div className="text-xs text-slate-400 font-mono-num">
                        {task.participants} জন সম্পন্ন করেছেন
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">কাজের বোনাস</div>
                    <div className="text-lg font-bold font-mono-num text-emerald-700">
                      ৳ {task.reward}
                    </div>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900">{task.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-mono-num text-slate-400 truncate">
                  {task.url}
                </span>

                <button
                  type="button"
                  disabled={isDone || isVerifying}
                  onClick={() => handleTaskAction(task)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : isVerifying
                      ? 'bg-slate-200 text-slate-700 cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সম্পন্ন হয়েছে (+৳ {task.reward})</span>
                    </>
                  ) : isVerifying ? (
                    <span>ভেরিফাই হচ্ছে...</span>
                  ) : (
                    <>
                      <span>কাজটি সম্পন্ন করুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ReferPageProps {
  user: UserProfile | null;
  referrals: ReferralEntry[];
  onOpenSignIn: () => void;
  onSimulateReferralJoin?: (friendName: string, friendMobile: string) => void;
}

export const ReferPage: React.FC<ReferPageProps> = ({
  user,
  referrals,
  onOpenSignIn,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate unique Unicode Referral Link exclusively for this User ID & Code
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://sohoje-income.app';
  const uniqueUnicodeReferLink = user
    ? `${origin}/?ref=${encodeURIComponent(user.code)}&আইডি=${encodeURIComponent(user.id)}`
    : `${origin}/?ref=সাইন-ইন-করুন`;

  const myReferrals = user
    ? referrals.filter(
        (r) => r.referrerCode === user.code || r.referrerId === user.id
      )
    : [];

  const totalReferCount = user ? user.referralCount : 0;
  const totalReferIncome = user ? user.referralEarned : 0;

  const handleCopyLink = () => {
    if (!user) {
      onOpenSignIn();
      return;
    }
    navigator.clipboard.writeText(uniqueUnicodeReferLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Main Referral Link Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs text-emerald-700 font-semibold">
            ইউনিকোড পার্সোনাল রেফারেল প্রোগ্রাম · প্রতি রেফারে নিশ্চিত ৳ ৫০ কমিশন
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Refer — আপনার ইউনিক রেফার লিংক শেয়ার করে আনলিমিটেড আয় করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            নিচের ইউনিকোড রেফার লিংকটি শুধুমাত্র আপনার ইউজার আইডির জন্য তৈরি। কেউ এই লিংকে ক্লিক করে সাইন-ইন করলেই সাথে সাথে <strong>৫০ টাকা কমিশন</strong> আপনার মূল ইনকামের সাথে যোগ হয়ে যাবে।
          </p>
        </div>

        {/* Unique Unicode Referral Link + Copy Button Next to It */}
        <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {user
                ? `আপনার একাউন্ট (${user.name} · ${user.id}) এর জন্য ডেডিকেটেড ইউনিকোড রেফার লিংক:`
                : 'আপনার নিজস্ব রেফার লিংক পেতে প্রথমে সাইন-ইন করুন:'}
            </span>
            {user && (
              <span className="font-mono-num font-semibold text-slate-800">
                রেফার কোড: {user.code}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl font-mono-num text-xs sm:text-sm text-slate-900 select-all overflow-x-auto whitespace-nowrap">
              {uniqueUnicodeReferLink}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[46px] px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>লিংক কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>লিংক কপি করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Below Referral Link: How many accounts created & How much earned from Refer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="text-xs text-slate-500">
              এই লিংক ব্যবহার করে একাউন্ট তৈরি করেছেন
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-900">
              {totalReferCount} জন
            </div>
            <div className="text-xs text-slate-500">
              ভেরিফাইড রেফারেল সদস্য সংখ্যা
            </div>
          </div>

          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
            <div className="text-xs text-emerald-800">
              রেফার থেকে মোট ইনকাম হয়েছে
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-emerald-700">
              ৳ {totalReferIncome.toLocaleString('bn-BD')}
            </div>
            <div className="text-xs text-emerald-700">
              প্রতি সফল সাইন-ইনে ৳ ৫০ করে কমিশন যুক্ত
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Referral Rules & Commission Information ("তার নিচে রেফারেন্স এর নিয়মাবলি এবং কমিশন সম্পর্কে বিস্তারিত লিখা থাকবে") */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          রেফারেন্স এর নিয়মাবলি এবং কমিশন সম্পর্কে বিস্তারিত
        </h2>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900">
              ০১. ইউনিক রেফার লিংক ব্যবহারের নিয়ম
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              প্রতিটি ভেরিফাইড একাউন্টের জন্য একটি স্বতন্ত্র ইউনিকোড রেফার লিংক এবং রেফার কোড তৈরি হয়। উপরের "লিংক কপি করুন" বাটনে ক্লিক করে আপনার লিংকটি ফেসবুক, মেসেঞ্জার, হোয়াটসঅ্যাপ কিংবা টেলিগ্রামে বন্ধুদের সাথে শেয়ার করুন।
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900">
              ০২. তাৎক্ষণিক ৫০ টাকা রেফার কমিশন
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              আপনার শেয়ার করা রেফার লিংকে ক্লিক করে যখনই কোনো নতুন ব্যবহারকারী নিজের নাম এবং মোবাইল নাম্বার দিয়ে সাইন-ইন সম্পন্ন করবেন, সাথে সাথে আপনার একাউন্টের মূল ব্যালেন্সে এবং রেফার ইনকাম খাতে <strong>৫০ টাকা (৳ ৫০)</strong> স্বয়ংক্রিয়ভাবে যোগ হয়ে যাবে।
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900">
              ০৩. আনলিমিটেড রেফার ও সরাসরি উত্তোলন সুবিধা
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              আপনি প্রতিদিন যত খুশি ততজনকে রেফার করতে পারবেন—রেফার করার কোনো নির্দিষ্ট সীমা নেই। ১০ জনকে রেফার করলেই ৫০০ টাকা এবং ২০ জনকে রেফার করলেই ১,০০০ টাকা সরাসরি বিকাশ, নগদ অথবা রকেটের মাধ্যমে উত্তোলন করতে পারবেন।
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900">
              ০৪. এক ডিভাইস নীতি ও স্বচ্ছতা
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              সিস্টেমের নিরাপত্তার স্বার্থে একটি ডিভাইসে শুধুমাত্র একটি স্থায়ী একাউন্ট খোলা যাবে। প্রকৃত বন্ধু বা নতুন ডিভাইস থেকে সাইন-ইন হলেই রেফার কমিশন স্থায়ীভাবে অনুমোদিত হবে এবং আপনার Profile-এর "My Referrals" পেইজে তারিখসহ তালিকা দেখতে পাবেন।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
