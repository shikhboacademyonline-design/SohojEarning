import React from 'react';
import {
  Play,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Lock,
  Wallet,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AdItem, NavTab, UserProfile, WithdrawalRequest } from '../types';
import { ASSETS } from '../data/initialData';

interface HomePageProps {
  user: UserProfile | null;
  ads: AdItem[];
  withdrawals: WithdrawalRequest[];
  onAdClick: (ad: AdItem, openedByAnchor?: boolean) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenSignIn: (mode?: 'user' | 'admin') => void;
  onTriggerDemoPopup: (w: WithdrawalRequest) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  ads,
  withdrawals,
  onAdClick,
  onNavigate,
  onOpenSignIn,
  onTriggerDemoPopup,
}) => {
  return (
    <div className="space-y-10 pb-8">
      {/* Hero Section */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>বাংলাদেশের বিশ্বস্ত মাইক্রো-টাস্ক ও এড প্ল্যাটফর্ম</span>
              <span aria-hidden="true">·</span>
              <span>বিকাশ, নগদ ও রকেট পেমেন্ট</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              প্রতিদিন ভেরিফাইড বিজ্ঞাপন দেখে এবং সহজ টাস্ক সম্পন্ন করে ঘরে বসেই আয় করুন
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              <strong>সহজে ইনকাম</strong> ওয়েবসাইটে নাম ও মোবাইল নাম্বার দিয়ে একবার সাইন-ইন করলেই স্থায়ী একাউন্ট তৈরি হয়ে যাবে। প্রতি এড ভিউতে ১৫–৩০ টাকা এবং প্রতি সফল রেফারে নিশ্চিত ৫০ টাকা সরাসরি আপনার ওয়ালেটে যোগ হবে।
            </p>

            {user ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-500">
                    স্থায়ীভাবে লগইনকৃত একাউন্ট · আইডি: <span className="font-mono-num font-semibold text-slate-800">{user.id}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    স্বাগতম, {user.name} — বর্তমান ব্যালেন্স:{' '}
                    <span className="font-mono-num text-emerald-700">৳ {user.currentBalance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onNavigate('video')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    সকল এড দেখুন
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    টাকা উত্তোলন করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenSignIn('user')}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>নাম ও মোবাইল নাম্বার দিয়ে সাইন-ইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenSignIn('admin')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  এডমিন লগইন
                </button>
              </div>
            )}

            {/* Key Quantitative Trust Strip */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-num">
                  ৳ ১৫–৩০
                </div>
                <div className="text-xs text-slate-500">প্রতি এড ভিউ আয়</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-emerald-700 font-mono-num">
                  ৳ ৫০
                </div>
                <div className="text-xs text-slate-500">প্রতি রেফার কমিশন</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono-num">
                  ২৪ ঘন্টা
                </div>
                <div className="text-xs text-slate-500">গ্যারান্টেড পেমেন্ট সময়</div>
              </div>
            </div>
          </div>

          {/* Hero Image Column */}
          <div className="lg:col-span-5 h-full bg-slate-900 relative min-h-[260px] lg:min-h-[420px]">
            <img
              src={ASSETS.heroBanner}
              alt="সহজে ইনকাম ডিজিটাল ওয়ার্কস্পেস"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="text-xs text-emerald-300 mb-1">
                সর্বশেষ পেমেন্ট আপডেট
              </div>
              {withdrawals[0] && (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{withdrawals[0].userName}</div>
                    <div className="text-xs text-slate-300">
                      {withdrawals[0].method} · {withdrawals[0].date}
                    </div>
                  </div>
                  <button
                    onClick={() => onTriggerDemoPopup(withdrawals[0])}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-xs font-mono-num font-semibold text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ৳ {withdrawals[0].amount} পপআপ দেখুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Homepage Ad Links Section ("হোম পেইজে এড এর লিংকগুলো থাকবে। লিংকগুলোতে ক্লিক দিলে সাইনইন করার অপশন আসবে।") */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ০১. হোমপেইজ ভেরিফাইড এড লিংকসমূহ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {user
                ? 'যেকোনো এড লিংকে ক্লিক করে নির্ধারিত সময় দেখলেই আপনার একাউন্টে টাকা জমা হবে।'
                : 'এড লিংকগুলোতে ক্লিক করলে সাইন-ইন করার অপশন আসবে। একবার সাইন-ইন করেই ইনকাম শুরু করুন।'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('video')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>সিরিয়াল অনুযায়ী সকল ভিডিও এড দেখুন ({ads.length}টি)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {ads.map((ad, index) => {
            const isWatched = user?.watchedAdIds.includes(ad.id) ?? false;
            return (
              <div
                key={ad.id}
                onClick={() => onAdClick(ad)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-mono-num text-xs font-bold flex items-center justify-center shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{ad.sponsor}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{ad.durationSec} সেকেন্ড ভিউ</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{ad.clicks} বার দেখা হয়েছে</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                      {ad.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{ad.caption}</p>
                    <div className="text-xs font-mono-num text-emerald-700 truncate">
                      এড লিংক: {ad.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-500">এড ইনকাম</div>
                    <div className="text-base font-bold font-mono-num text-emerald-700">
                      ৳ {ad.reward}
                    </div>
                  </div>

                  {user ? (
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdClick(ad, true);
                      }}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                        isWatched
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isWatched ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>পুনরায় এড ওপেন করুন</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>এড ওপেন করুন</span>
                        </>
                      )}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdClick(ad);
                      }}
                      className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>সাইন-ইন করে এড ওপেন করুন</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Navigation Highlights */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            ০২. ইনকাম ও উত্তোলনের সকল সুবিধাসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            নিচের ফিক্সড মেনু অথবা এখান থেকে সরাসরি আপনার প্রয়োজনীয় পেইজে প্রবেশ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('video')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 cursor-pointer transition-colors"
          >
            <div className="text-xs text-slate-500">সিরিয়াল এড গ্যালারি</div>
            <h3 className="text-base font-bold text-slate-900">Videos — এড দেখে আয়</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              সকল বিজ্ঞাপন একের পর এক সিরিয়ালে সাজানো আছে। অটোমেটিক ক্যাপশনসহ এক ক্লিকে এড দেখুন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('proofs')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 cursor-pointer transition-colors"
          >
            <div className="text-xs text-slate-500">লাইভ পেমেন্ট রেকর্ড</div>
            <h3 className="text-base font-bold text-slate-900">Proofs — পেমেন্ট প্রুফ ও রিভিউ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              কারা কত টাকা বিকাশ, রকেট ও নগদে উত্তোলন করছেন এবং ব্যবহারকারীদের সত্যিকারের রিভিউ দেখুন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('discover')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 cursor-pointer transition-colors"
          >
            <div className="text-xs text-slate-500">সোশ্যাল বোনাস কাজ</div>
            <h3 className="text-base font-bold text-slate-900">Discover — নতুন নতুন কাজ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              টেলিগ্রাম চ্যানেল জয়েন, ফেসবুক পেইজ লাইক ও ইউটিউব সাবস্ক্রাইব করে বাড়তি ইনকাম করুন।
            </p>
          </div>

          <div
            onClick={() => onNavigate('refer')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 cursor-pointer transition-colors"
          >
            <div className="text-xs text-slate-500">প্রতি রেফারে ৫০ টাকা</div>
            <h3 className="text-base font-bold text-slate-900">Refer — ইউনিক রেফার লিংক</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার নিজস্ব রেফার লিংকে কেউ ক্লিক করে সাইন-ইন করলেই ৫০ টাকা সরাসরি ব্যালেন্সে যোগ হবে।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface VideosPageProps {
  ads: AdItem[];
  user: UserProfile | null;
  onAdClick: (ad: AdItem, openedByAnchor?: boolean) => void;
  onRefreshAutoCaptions: () => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  ads,
  user,
  onAdClick,
  onRefreshAutoCaptions,
}) => {
  return (
    <div className="space-y-8 pb-8">
      {/* Page Banner */}
      <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-3">
            <div className="text-xs text-emerald-400">
              সিরিয়াল অনুযায়ী সাজানো প্রিমিয়াম এড গ্যালারি
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Videos — সকল বিজ্ঞাপন দেখে তাৎক্ষণিক ইনকাম করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              এখানে যত এড যুক্ত আছে সবগুলো একের পর এক সিরিয়ালে সাজানো রয়েছে। প্রতিটি এডের জন্য আকর্ষণীয় অটোমেটিক ক্যাপশন এবং নিচে এড ওপেন করার বাটন দেওয়া আছে।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRefreshAutoCaptions}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                অটোমেটিক ক্যাপশন রিফ্রেশ করুন
              </button>
              <span className="text-xs text-slate-400 font-mono-num">
                মোট সক্রিয় এড: {ads.length}টি
              </span>
            </div>
          </div>
          <div className="lg:col-span-4 h-44 lg:h-full relative">
            <img
              src={ASSETS.videoPromo}
              alt="ভিডিও এড ক্যাম্পেইন"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Sequential List of Ads ("যত এড থাকবে সবগুলো একের পরে এক সিরিয়ালে সাজানো থাকবে") */}
      <div className="space-y-4">
        {ads.map((ad, idx) => {
          const serialNumber = idx + 1;
          const isWatched = user?.watchedAdIds.includes(ad.id) ?? false;

          return (
            <article
              key={ad.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              {/* Top Serial & Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <span className="font-mono-num font-bold text-slate-900">
                    সিরিয়াল এড #{String(serialNumber).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>স্পন্সর: {ad.sponsor}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{ad.durationSec} সেকেন্ড</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-mono-num">
                    মোট ভিউ: {ad.clicks} বার
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="font-mono-num font-bold text-emerald-700 text-sm">
                    আয়: ৳ {ad.reward}
                  </span>
                </div>
              </div>

              {/* Ad Title & Automatic Caption */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {ad.title}
                </h2>
                <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 leading-relaxed">
                  {ad.caption}
                </p>
              </div>

              {/* Bottom Button to Open Ad ("তার নিচে একটি বাটন থাকবে সেখানে ক্লিক দিলে এড ওপেন হবে") */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono-num text-slate-500 truncate">
                  লিংক: {ad.url}
                </span>

                {user ? (
                  <a
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onAdClick(ad, true)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isWatched
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>
                      {isWatched
                        ? `পুনরায় এড ওপেন করুন (৳ ${ad.reward})`
                        : `এড ওপেন করুন ও ৳ ${ad.reward} ইনকাম করুন`}
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdClick(ad)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Play className="w-4 h-4" />
                    <span>এড ওপেন করুন ও ৳ {ad.reward} ইনকাম করুন</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
