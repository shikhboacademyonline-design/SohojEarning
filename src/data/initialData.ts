import {
  AdItem,
  DiscoverTask,
  WithdrawalRequest,
  UserReview,
  UserProfile,
  ReferralEntry,
  EarningRecord,
} from '../types';
import defaultAvatarImg from '../assets/images/avatar_default_user_1790610124460.jpg';
import heroBannerImg from '../assets/images/hero_digital_earning_1790610110577.jpg';
import videoPromoImg from '../assets/images/promo_video_campaign_1790610136824.jpg';

export const ASSETS = {
  defaultAvatar: defaultAvatarImg,
  heroBanner: heroBannerImg,
  videoPromo: videoPromoImg,
};

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function makeDailyStamp(itemId: string): string {
  return `${itemId}|${getTodayKey()}`;
}

export function hasDoneToday(
  list: string[] | undefined,
  itemId: string
): boolean {
  if (!Array.isArray(list)) return false;
  return list.includes(makeDailyStamp(itemId));
}

export const AUTO_CAPTIONS: string[] = [
  'মাত্র ১০ সেকেন্ড সম্পূর্ণ ভিডিও এডটি দেখুন এবং তাৎক্ষণিক আপনার ওয়ালেটে ক্যাশ রিওয়ার্ড জমা করুন।',
  'স্পন্সরড প্রিমিয়াম ব্র্যান্ড ক্যাম্পেইন—এডটি ওপেন করে নির্ধারিত সময় অপেক্ষা করলেই নিশ্চিত ইনকাম।',
  'প্রতিদিনের স্পেশাল ভেরিফাইড এড লিংক! এডটি ভিজিট করে আজকের বোনাস পয়েন্ট ও টাকা সংগ্রহ করুন।',
  'ডিজিটাল মার্কেটিং প্রমোশনাল ভিউ—সম্পূর্ণ এডটি দেখলে সাথে সাথে আপনার মূল ব্যালেন্সে টাকা যোগ হবে।',
  'সহজে ইনকাম এক্সক্লুসিভ পার্টনার এড—ক্লিক করে ভিউ সম্পন্ন করুন এবং ঝামেলাহীন পেমেন্ট উপভোগ করুন।',
  'নতুন ই-কমার্স মেগা ক্যাম্পেইন এড! লিংকে প্রবেশ করে ভিউ পূর্ণ করলেই পাচ্ছেন আকর্ষণীয় নগদ রিওয়ার্ড।',
  'হাই-রেট স্পন্সরড ভিডিও বিজ্ঞাপন—এক ক্লিকে ওপেন করুন এবং কয়েক সেকেন্ডেই আপনার আয় নিশ্চিত করুন।',
  'ভেরিফাইড বিজ্ঞাপনদাতা ক্যাম্পেইন—প্রতিদিন নিয়মিত এড দেখে ঘরে বসেই বাড়তি আয়ের সুযোগ নিন।',
];

export const INITIAL_ADS: AdItem[] = [
  {
    id: 'ad-101',
    title: 'দারাজ মেগা ডিসকাউন্ট ফেস্টিভ্যাল ২০২৬ — প্রমোশনাল এড',
    caption:
      'মাত্র ১০ সেকেন্ড সম্পূর্ণ ভিডিও এডটি দেখুন এবং তাৎক্ষণিক আপনার ওয়ালেটে ২৫ টাকা ক্যাশ রিওয়ার্ড জমা করুন।',
    url: 'https://www.daraz.com.bd',
    reward: 25,
    durationSec: 6,
    clicks: 1420,
    sponsor: 'Daraz Bangladesh',
    createdAt: '২৮ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-102',
    title: 'বিকাশ ক্যাশব্যাক অফার — ডিজিটাল পেমেন্ট ক্যাম্পেইন',
    caption:
      'স্পন্সরড প্রিমিয়াম ব্র্যান্ড ক্যাম্পেইন—এডটি ওপেন করে নির্ধারিত সময় অপেক্ষা করলেই নিশ্চিত ২০ টাকা ইনকাম।',
    url: 'https://www.bkash.com',
    reward: 20,
    durationSec: 5,
    clicks: 1185,
    sponsor: 'bKash Limited',
    createdAt: '২৮ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-103',
    title: 'টেন মিনিট স্কুল স্কিল ডেভেলপমেন্ট কোর্স প্রমো',
    caption:
      'প্রতিদিনের স্পেশাল ভেরিফাইড এড লিংক! এডটি ভিজিট করে আজকের ৩০ টাকা বোনাস সংগ্রহ করুন।',
    url: 'https://10minuteschool.com',
    reward: 30,
    durationSec: 6,
    clicks: 980,
    sponsor: '10 Minute School',
    createdAt: '২৭ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-104',
    title: 'নগদ লাখপতি ক্যাম্পেইন — স্পন্সরড ভিউ লিংক',
    caption:
      'ডিজিটাল মার্কেটিং প্রমোশনাল ভিউ—সম্পূর্ণ এডটি দেখলে সাথে সাথে আপনার মূল ব্যালেন্সে ২০ টাকা যোগ হবে।',
    url: 'https://nagad.com.bd',
    reward: 20,
    durationSec: 5,
    clicks: 895,
    sponsor: 'Nagad Digital',
    createdAt: '২৭ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-105',
    title: 'চালডাল গ্রোসারি হোম ডেলিভারি — ডেইলি স্পন্সর এড',
    caption:
      'সহজে ইনকাম এক্সক্লুসিভ পার্টনার এড—ক্লিক করে ভিউ সম্পন্ন করুন এবং ১৫ টাকা তাৎক্ষণিক আয় করুন।',
    url: 'https://chaldal.com',
    reward: 15,
    durationSec: 5,
    clicks: 760,
    sponsor: 'Chaldal Grocery',
    createdAt: '২৬ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-106',
    title: 'পাঠাও রাইড ও কুরিয়ার — এক্সপ্রেস ব্র্যান্ড এডভার্টাইজমেন্ট',
    caption:
      'নতুন ই-কমার্স ও রাইড শেয়ারিং ক্যাম্পেইন এড! লিংকে প্রবেশ করে ভিউ পূর্ণ করলেই পাচ্ছেন ২৫ টাকা রিওয়ার্ড।',
    url: 'https://pathao.com',
    reward: 25,
    durationSec: 6,
    clicks: 645,
    sponsor: 'Pathao Ltd',
    createdAt: '২৬ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-107',
    title: 'রকমারি বইমেলা ও ইলেকট্রনিক্স — স্পেশাল স্পন্সর ভিউ',
    caption:
      'হাই-রেট স্পন্সরড ভিডিও বিজ্ঞাপন—এক ক্লিকে ওপেন করুন এবং কয়েক সেকেন্ডেই ২০ টাকা আয় নিশ্চিত করুন।',
    url: 'https://www.rokomari.com',
    reward: 20,
    durationSec: 5,
    clicks: 590,
    sponsor: 'Rokomari.com',
    createdAt: '২৫ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'ad-108',
    title: 'গ্রামীণফোন মাইজিপি সুপার অফার — ভেরিফাইড এড লিংক',
    caption:
      'ভেরিফাইড বিজ্ঞাপনদাতা ক্যাম্পেইন—প্রতিদিন নিয়মিত এড দেখে ঘরে বসেই ৩০ টাকা বাড়তি আয়ের সুযোগ নিন।',
    url: 'https://www.grameenphone.com',
    reward: 30,
    durationSec: 6,
    clicks: 812,
    sponsor: 'Grameenphone',
    createdAt: '২৫ সেপ্টেম্বর ২০২৬',
  },
];

export const INITIAL_DISCOVER_TASKS: DiscoverTask[] = [
  {
    id: 'task-tg-1',
    category: 'telegram',
    categoryLabel: 'টেলিগ্রাম চ্যানেল জয়েন',
    title: 'সহজে ইনকাম অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন',
    description:
      'প্রতিদিনের নতুন কাজের আপডেট, পেমেন্ট প্রুফ এবং বোনাস কোড পেতে আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে যুক্ত হোন।',
    url: 'https://t.me/sohoje_income_official',
    reward: 30,
    participants: 4820,
  },
  {
    id: 'task-tg-2',
    category: 'telegram',
    categoryLabel: 'টেলিগ্রাম চ্যানেল জয়েন',
    title: 'সহজে ইনকাম ভিআইপি পেমেন্ট আপডেট গ্রুপে যুক্ত হোন',
    description:
      'লাইভ বিকাশ, নগদ ও রকেট পেমেন্ট কনফার্মেশন এবং ২৪/৭ সাপোর্ট কমিউনিটিতে জয়েন করে রিওয়ার্ড নিন।',
    url: 'https://t.me/sohoje_income_vip',
    reward: 25,
    participants: 3190,
  },
  {
    id: 'task-fb-1',
    category: 'facebook',
    categoryLabel: 'ফেসবুক পেইজ লাইক',
    title: 'সহজে ইনকাম অফিসিয়াল ফেসবুক পেইজ লাইক ও ফলো করুন',
    description:
      'আমাদের ভেরিফাইড ফেসবুক পেইজে লাইক দিন এবং নোটিফিকেশন চালু রেখে তাৎক্ষণিক ২৫ টাকা বোনাস সংগ্রহ করুন।',
    url: 'https://facebook.com',
    reward: 25,
    participants: 6150,
  },
  {
    id: 'task-fb-2',
    category: 'facebook',
    categoryLabel: 'ফেসবুক পেইজ লাইক',
    title: 'স্পন্সরড ই-কমার্স পার্টনার পেইজ লাইক ও শেয়ার টাস্ক',
    description:
      'পার্টনার ব্র্যান্ড পেইজটি লাইক করে পিন পোস্টে একটি পজিটিভ রিয়েক্ট দিন এবং আপনার ওয়ালেটে রিওয়ার্ড যোগ করুন।',
    url: 'https://facebook.com',
    reward: 20,
    participants: 2840,
  },
  {
    id: 'task-yt-sub-1',
    category: 'youtube_sub',
    categoryLabel: 'ইউটিউব চ্যানেল সাবস্ক্রাইব',
    title: 'সহজে ইনকাম একাডেমি ইউটিউব চ্যানেল সাবস্ক্রাইব করুন',
    description:
      'চ্যানেলটি সাবস্ক্রাইব করে বেল আইকন অন করুন যাতে নতুন ইনকাম গাইডলাইন ভিডিও সবার আগে দেখতে পান।',
    url: 'https://youtube.com',
    reward: 35,
    participants: 5430,
  },
  {
    id: 'task-yt-sub-2',
    category: 'youtube_sub',
    categoryLabel: 'ইউটিউব চ্যানেল সাবস্ক্রাইব',
    title: 'টেক বাংলা প্রো স্পন্সর চ্যানেল সাবস্ক্রাইব টাস্ক',
    description:
      'আমাদের মিডিয়া পার্টনারের ইউটিউব চ্যানেল সাবস্ক্রাইব করে ৩০ টাকা তাৎক্ষণিক কাজের কমিশন বুঝে নিন।',
    url: 'https://youtube.com',
    reward: 30,
    participants: 2490,
  },
  {
    id: 'task-yt-vid-1',
    category: 'youtube_video',
    categoryLabel: 'ইউটিউব ভিডিও',
    title: 'কীভাবে প্রতিদিন ৫০০ টাকা ইনকাম করবেন — সম্পূর্ণ টিউটোরিয়াল ভিডিও দেখুন',
    description:
      'ইউটিউব ভিডিওটি ওপেন করে দেখুন, একটি লাইক দিন এবং আপনার একাউন্টে ৪০ টাকা বোনাস যোগ করুন।',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    reward: 40,
    participants: 7120,
  },
  {
    id: 'task-yt-vid-2',
    category: 'youtube_video',
    categoryLabel: 'ইউটিউব ভিডিও',
    title: 'বিকাশ ও নগদে লাইভ পেমেন্ট উত্তোলন গাইড ভিডিও ভিউ',
    description:
      'প্রমোশনাল গাইড ভিডিওটি দেখে লাইক কমেন্ট সম্পন্ন করুন এবং ৩৫ টাকা ইনস্ট্যান্ট বোনাস পান।',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    reward: 35,
    participants: 4310,
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wd-901',
    userId: 'SI-204918',
    userName: 'মোঃ তানভীর আহমেদ',
    accountNumber: '01712-849201',
    method: 'বিকাশ',
    amount: 2500,
    date: '২৮ সেপ্টেম্বর ২০২৬, সকাল ১০:১৫',
    status: 'সফল',
  },
  {
    id: 'wd-902',
    userId: 'SI-319482',
    userName: 'নুসরাত জাহান মিম',
    accountNumber: '01845-392014',
    method: 'নগদ',
    amount: 1850,
    date: '২৮ সেপ্টেম্বর ২০২৬, সকাল ০৯:৪০',
    status: 'সফল',
  },
  {
    id: 'wd-903',
    userId: 'SI-582019',
    userName: 'মাহমুদুল হাসান রাকিব',
    accountNumber: '01911-672390',
    method: 'রকেট',
    amount: 3200,
    date: '২৭ সেপ্টেম্বর ২০২৬, রাত ০৮:২০',
    status: 'সফল',
  },
  {
    id: 'wd-904',
    userId: 'SI-748291',
    userName: 'সাদিয়া আফরিন তিশা',
    accountNumber: '01688-410293',
    method: 'বিকাশ',
    amount: 1200,
    date: '২৭ সেপ্টেম্বর ২০২৬, বিকাল ০৫:১২',
    status: 'সফল',
  },
  {
    id: 'wd-905',
    userId: 'SI-639104',
    userName: 'আরিফুল ইসলাম হৃদয়',
    accountNumber: '01799-501827',
    method: 'নগদ',
    amount: 950,
    date: '২৭ সেপ্টেম্বর ২০২৬, দুপুর ০২:৩০',
    status: 'পেন্ডিং',
  },
  {
    id: 'wd-906',
    userId: 'SI-418920',
    userName: 'ফারহানা ইয়াসমিন',
    accountNumber: '01521-493812',
    method: 'বিকাশ',
    amount: 1600,
    date: '২৬ সেপ্টেম্বর ২০২৬, রাত ০৯:০৫',
    status: 'সফল',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'SI-582019',
    code: 'SHJ-5820',
    name: 'মাহমুদুল হাসান রাকিব',
    mobile: '01911672390',
    avatar: defaultAvatarImg,
    currentBalance: 650,
    totalEarned: 3850,
    adsWatched: 84,
    watchedAdIds: ['ad-101', 'ad-102'],
    completedTaskIds: ['task-tg-1', 'task-fb-1'],
    referralCount: 28,
    referralEarned: 1400,
    joinedDate: '১০ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'SI-204918',
    code: 'SHJ-2049',
    name: 'মোঃ তানভীর আহমেদ',
    mobile: '01712849201',
    avatar: defaultAvatarImg,
    currentBalance: 420,
    totalEarned: 2920,
    adsWatched: 62,
    watchedAdIds: ['ad-101'],
    completedTaskIds: ['task-tg-1'],
    referralCount: 19,
    referralEarned: 950,
    joinedDate: '১২ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'SI-319482',
    code: 'SHJ-3194',
    name: 'নুসরাত জাহান মিম',
    mobile: '01845392014',
    avatar: defaultAvatarImg,
    currentBalance: 310,
    totalEarned: 2160,
    adsWatched: 51,
    watchedAdIds: [],
    completedTaskIds: [],
    referralCount: 14,
    referralEarned: 700,
    joinedDate: '১৫ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'SI-418920',
    code: 'SHJ-4189',
    name: 'ফারহানা ইয়াসমিন',
    mobile: '01521493812',
    avatar: defaultAvatarImg,
    currentBalance: 280,
    totalEarned: 1880,
    adsWatched: 44,
    watchedAdIds: [],
    completedTaskIds: [],
    referralCount: 11,
    referralEarned: 550,
    joinedDate: '১৮ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'SI-748291',
    code: 'SHJ-7482',
    name: 'সাদিয়া আফরিন তিশা',
    mobile: '01688410293',
    avatar: defaultAvatarImg,
    currentBalance: 190,
    totalEarned: 1390,
    adsWatched: 36,
    watchedAdIds: [],
    completedTaskIds: [],
    referralCount: 8,
    referralEarned: 400,
    joinedDate: '২০ সেপ্টেম্বর ২০২৬',
  },
];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    userName: 'মাহমুদুল হাসান রাকিব',
    role: 'ভেরিফাইড সদস্য (SI-582019)',
    organization: 'ঢাকা কলেজ, ঢাকা',
    withdrawnAmount: 3200,
    method: 'রকেট',
    comment:
      'আগে অবসর সময়ে শুধু সোশ্যাল মিডিয়া স্ক্রল করতাম। সহজে ইনকাম ওয়েবসাইটে যুক্ত হওয়ার পর প্রতিদিন এড দেখে এবং বন্ধুদের রেফার করে গত মাসে ৩,২০০ টাকা রকেটের মাধ্যমে মাত্র ৩ ঘন্টার মধ্যে পেমেন্ট পেয়েছি।',
    date: '২৭ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'rev-2',
    userName: 'মোঃ তানভীর আহমেদ',
    role: 'ভেরিফাইড সদস্য (SI-204918)',
    organization: 'রাজশাহী পলিটেকনিক ইনস্টিটিউট',
    withdrawnAmount: 2500,
    method: 'বিকাশ',
    comment:
      'এখানকার Discover পেইজের টেলিগ্রাম ও ইউটিউব কাজগুলো খুব সহজ। আজ সকালে ২,৫০০ টাকা বিকাশে উইথড্র দিয়েছিলাম এবং দুপুরের আগেই সম্পূর্ণ টাকা আমার পার্সোনাল বিকাশ নাম্বারে চলে এসেছে।',
    date: '২৮ সেপ্টেম্বর ২০২৬',
  },
  {
    id: 'rev-3',
    userName: 'নুসরাত জাহান মিম',
    role: 'ভেরিফাইড সদস্য (SI-319482)',
    organization: 'চট্টগ্রাম সরকারি মহিলা কলেজ',
    withdrawnAmount: 1850,
    method: 'নগদ',
    comment:
      'প্রতি রেফারে ৫০ টাকা সরাসরি ব্যালেন্সে যোগ হওয়ার ফিচারটি দারুণ। আমি আমার ১৪ জন সহপাঠীকে রেফার লিংক দিয়ে জয়েন করিয়েছি এবং নগদে ১,৮৫০ টাকা সফলভাবে উত্তোলন করেছি।',
    date: '২৮ সেপ্টেম্বর ২০২৬',
  },
];

export const INITIAL_REFERRALS: ReferralEntry[] = [
  {
    id: 'ref-init-1',
    referrerId: 'SI-582019',
    referrerCode: 'SHJ-5820',
    newUserName: 'সাব্বির হোসেন',
    newUserId: 'SI-882104',
    newUserMobile: '01755-928102',
    date: '২৮ সেপ্টেম্বর ২০২৬',
    commission: 50,
  },
  {
    id: 'ref-init-2',
    referrerId: 'SI-582019',
    referrerCode: 'SHJ-5820',
    newUserName: 'রাশেদুল ইসলাম',
    newUserId: 'SI-882910',
    newUserMobile: '01833-102948',
    date: '২৭ সেপ্টেম্বর ২০২৬',
    commission: 50,
  },
];

export const INITIAL_EARNINGS: EarningRecord[] = [];
