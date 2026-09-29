export type NavTab = 'home' | 'video' | 'proofs' | 'discover' | 'refer' | 'profile' | 'admin';

export type ProfileSubPage =
  | 'overview'
  | 'withdraw'
  | 'earning_history'
  | 'my_referrals'
  | 'settings'
  | 'supports';

export type PaymentMethod = 'বিকাশ' | 'রকেট' | 'নগদ';

export type WithdrawalStatus = 'পেন্ডিং' | 'সফল' | 'বাতিল';

export interface AdItem {
  id: string;
  title: string;
  caption: string;
  url: string;
  reward: number;
  durationSec: number;
  clicks: number;
  sponsor: string;
  createdAt: string;
}

export interface DiscoverTask {
  id: string;
  category: 'telegram' | 'facebook' | 'youtube_sub' | 'youtube_video';
  categoryLabel: string;
  title: string;
  description: string;
  url: string;
  reward: number;
  participants: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  accountNumber: string;
  method: PaymentMethod;
  amount: number;
  date: string;
  status: WithdrawalStatus;
}

export interface ReferralEntry {
  id: string;
  referrerId: string;
  referrerCode: string;
  newUserName: string;
  newUserId: string;
  newUserMobile: string;
  date: string;
  commission: number;
}

export interface UserReview {
  id: string;
  userName: string;
  role: string;
  organization: string;
  withdrawnAmount: number;
  method: PaymentMethod;
  comment: string;
  date: string;
}

export interface EarningRecord {
  id: string;
  userId: string;
  title: string;
  category: 'এড ইনকাম' | 'ডিসকভার টাস্ক' | 'রেফার বোনাস' | 'ওয়েলকাম বোনাস';
  amount: number;
  date: string;
}

export interface UserProfile {
  id: string;
  code: string;
  name: string;
  mobile: string;
  avatar: string;
  currentBalance: number;
  totalEarned: number;
  adsWatched: number;
  watchedAdIds: string[];
  completedTaskIds: string[];
  referralCount: number;
  referralEarned: number;
  joinedDate: string;
  referredBy?: string;
}
