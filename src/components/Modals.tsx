import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Clock,
  Lock,
  UserCheck,
} from 'lucide-react';
import { AdItem, UserProfile } from '../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'user' | 'admin';
  existingDeviceUser: UserProfile | null;
  defaultReferralCode: string;
  onUserSignIn: (name: string, mobile: string, referralCode: string) => void;
  onAdminSignIn: (username: string, password: string) => boolean;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'user',
  existingDeviceUser,
  defaultReferralCode,
  onUserSignIn,
  onAdminSignIn,
}) => {
  const [mode, setMode] = useState<'user' | 'admin'>(initialMode);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [refCode, setRefCode] = useState(defaultReferralCode);
  const [userError, setUserError] = useState('');

  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (defaultReferralCode) {
      setRefCode(defaultReferralCode);
    }
  }, [defaultReferralCode]);

  if (!isOpen) return null;

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedName) {
      setUserError('অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(trimmedMobile) && trimmedMobile.length < 11) {
      setUserError('সঠিক ১১ ডিজিটের মোবাইল নাম্বার প্রদান করুন (যেমন: 017XXXXXXXX)।');
      return;
    }

    onUserSignIn(trimmedName, trimmedMobile, refCode.trim());
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const ok = onAdminSignIn(adminId.trim(), adminPass.trim());
    if (!ok) {
      setAdminError('ভুল ইউজার আইডি অথবা পাসওয়ার্ড! সঠিক এডমিন তথ্য দিন।');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">সহজে ইনকাম — একাউন্টে প্রবেশ</h2>
            <p className="text-xs text-slate-300">
              {mode === 'user'
                ? 'একবার সাইন-ইন করলে এই ডিভাইসে স্থায়ীভাবে লগইন থাকবে'
                : 'শুধুমাত্র অনুমোদিত এডমিন কন্ট্রোল প্যানেল লগইন'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('user')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'user'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ইউজার সাইন-ইন
            </button>
            <button
              type="button"
              onClick={() => setMode('admin')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              এডমিন লগইন
            </button>
          </div>
        </div>

        {mode === 'user' ? (
          <div className="p-6">
            {existingDeviceUser ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>এই ডিভাইসে ইতিমধ্যে স্থায়ীভাবে সাইন-ইন করা আছে</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    একটি ডিভাইসে শুধুমাত্র একবারই সাইন-ইন করা যায়। আপনার একাউন্টটি স্থায়ীভাবে সক্রিয় রয়েছে, পুনরায় লগইন করার প্রয়োজন নেই।
                  </p>
                  <div className="pt-2 border-t border-emerald-200/70 text-xs text-slate-700 space-y-1">
                    <div>
                      নাম: <span className="font-semibold">{existingDeviceUser.name}</span>
                    </div>
                    <div>
                      ইউজার আইডি:{' '}
                      <span className="font-mono-num font-semibold">{existingDeviceUser.id}</span>
                    </div>
                    <div>
                      কোড:{' '}
                      <span className="font-mono-num font-semibold">{existingDeviceUser.code}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  ঠিক আছে, কাজ শুরু করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    আপনার সম্পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="উদাঃ মোঃ আরিফুল ইসলাম"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    মোবাইল নাম্বার (১১ ডিজিট) *
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    সতর্কতা: মোবাইল নাম্বার পরবর্তীতে পরিবর্তন করা যাবে না।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    রেফার কোড (ঐচ্ছিক — থাকলে ৫০ টাকা রেফার কমিশন যুক্ত হবে)
                  </label>
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    placeholder="উদাঃ SHJ-5820"
                    className="w-full px-3.5 py-2 text-xs font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                {userError && (
                  <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {userError}
                  </p>
                )}

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                  সাইন-ইন করার সাথে সাথে আপনার জন্য একটি স্বয়ংক্রিয় <strong>ইউজার আইডি</strong> এবং{' '}
                  <strong>রেফার কোড</strong> তৈরি হয়ে যাবে এবং এই ডিভাইসে স্থায়ীভাবে লগইন হয়ে থাকবে।
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  স্থায়ীভাবে সাইন-ইন করুন
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-slate-700 shrink-0" />
              <span>এডমিন ইউজার আইডি ও পাসওয়ার্ড দিয়ে ড্যাশবোর্ডে প্রবেশ করুন।</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                এডমিন ইউজার আইডি
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="ইউজার আইডি লিখুন"
                className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white"
                required
              />
            </div>

            {adminError && (
              <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {adminError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              এডমিন প্যানেলে লগইন করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface AdViewerModalProps {
  ad: AdItem | null;
  onClose: () => void;
  onCompleteAd: (ad: AdItem) => void;
}

export const AdViewerModal: React.FC<AdViewerModalProps> = ({
  ad,
  onClose,
  onCompleteAd,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!ad) return;
    setSecondsLeft(ad.durationSec || 5);
    setCompleted(false);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ad]);

  if (!ad) return null;

  const progressPercent = Math.round(
    (((ad.durationSec || 5) - secondsLeft) / (ad.durationSec || 5)) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold">
              {completed
                ? 'এড দেখা সম্পন্ন হয়েছে!'
                : `এড চলছে — অপেক্ষা করুন (${secondsLeft} সেকেন্ড)`}
            </span>
          </div>
          <button
            onClick={() => (completed ? onCompleteAd(ad) : onClose())}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>স্পন্সর: {ad.sponsor}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num text-emerald-700 font-semibold">
                রিওয়ার্ড: ৳ {ad.reward} (দিনে ১ বার)
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{ad.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{ad.caption}</p>
          </div>

          {/* Auto-Opened Ad Link Live Preview Frame */}
          <div className="rounded-xl bg-slate-900 text-white border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>এডের লিংক ওপেন হয়েছে (দিনে ১ বার প্রযোজ্য)</span>
              </span>
              <span className="font-mono-num text-slate-400 truncate max-w-[220px]">
                {ad.url}
              </span>
            </div>

            <div className="relative w-full h-52 bg-white">
              <iframe
                src={ad.url}
                title={ad.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>

            <div className="p-4 space-y-2.5 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {completed
                    ? 'আপনার ভিউ ভেরিফাই করা হয়েছে! নিচের বাটনে ক্লিক করে টাকা ব্যালেন্সে যোগ করুন।'
                    : 'লিংকটি নতুন ট্যাবে ও প্রিভিউতে ওপেন হয়েছে, টাইমার শেষ হওয়া পর্যন্ত অপেক্ষা করুন...'}
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono-num shrink-0 ml-2">
                  + ৳ {ad.reward}.০০
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!completed}
              onClick={() => onCompleteAd(ad)}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                completed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completed
                  ? `৳ ${ad.reward} ইনকাম ব্যালেন্সে যোগ করুন`
                  : `${secondsLeft} সেকেন্ড অপেক্ষা করুন...`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WithdrawSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  method: string;
  mobile: string;
}

export const WithdrawSuccessModal: React.FC<WithdrawSuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
  method,
  mobile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">উত্তোলন রিকুয়েষ্ট সফল!</h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
            আপনার উত্তোলন রিকুয়েষ্ট গ্রহন করা হয়েছে। ২৪ ঘন্টার মধ্যে আপনার পেমেন্ট পেয়ে যাবেন
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1 text-left">
          <div className="flex justify-between">
            <span>পেমেন্ট মাধ্যম:</span>
            <span className="font-semibold text-slate-900">{method}</span>
          </div>
          <div className="flex justify-between">
            <span>মোবাইল নাম্বার:</span>
            <span className="font-mono-num font-semibold text-slate-900">{mobile}</span>
          </div>
          <div className="flex justify-between">
            <span>উত্তোলনের পরিমাণ:</span>
            <span className="font-mono-num font-bold text-emerald-700">৳ {amount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          পপ-আপ ক্লোজ করুন
        </button>
      </div>
    </div>
  );
};
