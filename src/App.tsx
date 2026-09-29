import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Award,
  Compass,
  Share2,
  User,
  Shield,
  Download,
} from 'lucide-react';
import {
  AdItem,
  DiscoverTask,
  EarningRecord,
  NavTab,
  PaymentMethod,
  ReferralEntry,
  TaskCategory,
  UserProfile,
  UserReview,
  WithdrawalRequest,
  WithdrawalStatus,
} from './types';
import {
  ASSETS,
  AUTO_CAPTIONS,
  INITIAL_ADS,
  INITIAL_DISCOVER_TASKS,
  INITIAL_EARNINGS,
  INITIAL_REFERRALS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_WITHDRAWALS,
  hasDoneToday,
  makeDailyStamp,
} from './data/initialData';
import {
  db,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  OperationType,
  handleFirestoreError,
} from './firebase';
import { FloatingWidgets } from './components/FloatingWidgets';
import {
  AdViewerModal,
  SignInModal,
  WithdrawSuccessModal,
} from './components/Modals';
import { HomePage, VideosPage } from './components/HomeAndVideosPages';
import {
  DiscoverPage,
  ProofsPage,
  ReferPage,
} from './components/ProofsDiscoverReferPages';
import { ProfilePage } from './components/ProfilePage';
import { AdminPage } from './components/AdminPage';
import { CodeDownloadModal } from './components/CodeDownloadModal';

const STORAGE_KEYS = {
  DEVICE_USER_ID: 'sohoje_income_device_user_id_v2',
  DEVICE_USER: 'sohoje_income_device_user_v1',
  USERS_CACHE: 'sohoje_income_users_cache_v2',
  ADS_CACHE: 'sohoje_income_ads_cache_v2',
  TASKS_CACHE: 'sohoje_income_tasks_cache_v2',
  WITHDRAWALS_CACHE: 'sohoje_income_withdrawals_cache_v2',
  REFERRALS_CACHE: 'sohoje_income_referrals_cache_v2',
  REVIEWS_CACHE: 'sohoje_income_reviews_cache_v2',
  EARNINGS_CACHE: 'sohoje_income_earnings_cache_v2',
  ADMIN_AUTH: 'sohoje_income_admin_auth_v1',
  SEEDED_FLAG: 'sohoje_income_cloud_seeded_v3',
  DELETED_IDS: 'sohoje_income_deleted_ids_v3',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getStoredDeletedIds(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.DELETED_IDS, []);
}

function filterOutDeleted<T extends { id: string }>(
  items: T[],
  deletedIds: string[]
): T[] {
  if (!deletedIds.length) return items;
  const delSet = new Set(deletedIds);
  return items.filter((item) => !delSet.has(item.id));
}

function sanitizeUserForFirestore(user: UserProfile): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    id: user.id.slice(0, 64),
    code: user.code.slice(0, 64),
    name: user.name.slice(0, 120),
    mobile: user.mobile.slice(0, 32),
    avatar: (user.avatar || ASSETS.defaultAvatar).slice(0, 490000),
    currentBalance: Math.max(0, Number(user.currentBalance) || 0),
    totalEarned: Math.max(0, Number(user.totalEarned) || 0),
    adsWatched: Math.max(0, Number(user.adsWatched) || 0),
    watchedAdIds: (user.watchedAdIds || []).slice(0, 500),
    completedTaskIds: (user.completedTaskIds || []).slice(0, 500),
    referralCount: Math.max(0, Number(user.referralCount) || 0),
    referralEarned: Math.max(0, Number(user.referralEarned) || 0),
    joinedDate: (user.joinedDate || '২৮ সেপ্টেম্বর ২০২৬').slice(0, 64),
  };
  if (user.referredBy) {
    payload.referredBy = user.referredBy.slice(0, 64);
  }
  return payload;
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  telegram: 'টেলিগ্রাম চ্যানেল জয়েন',
  facebook: 'ফেসবুক পেইজ লাইক',
  youtube_sub: 'ইউটিউব চ্যানেল সাবস্ক্রাইব',
  youtube_video: 'ইউটিউব ভিডিও',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const deletedIdsRef = useRef<string[]>(getStoredDeletedIds());

  // Local device permanent user + Cloud Firestore state with localStorage fallback cache
  const [deviceUser, setDeviceUser] = useState<UserProfile | null>(() => {
    const u = loadFromStorage<UserProfile | null>(STORAGE_KEYS.DEVICE_USER, null);
    if (u && getStoredDeletedIds().includes(u.id)) return null;
    return u;
  });
  const [users, setUsers] = useState<UserProfile[]>(() =>
    filterOutDeleted(
      loadFromStorage<UserProfile[]>(STORAGE_KEYS.USERS_CACHE, INITIAL_USERS),
      getStoredDeletedIds()
    )
  );
  const [ads, setAds] = useState<AdItem[]>(() =>
    filterOutDeleted(
      loadFromStorage<AdItem[]>(STORAGE_KEYS.ADS_CACHE, INITIAL_ADS),
      getStoredDeletedIds()
    )
  );
  const [tasks, setTasks] = useState<DiscoverTask[]>(() =>
    filterOutDeleted(
      loadFromStorage<DiscoverTask[]>(
        STORAGE_KEYS.TASKS_CACHE,
        INITIAL_DISCOVER_TASKS
      ),
      getStoredDeletedIds()
    )
  );
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    filterOutDeleted(
      loadFromStorage<WithdrawalRequest[]>(
        STORAGE_KEYS.WITHDRAWALS_CACHE,
        INITIAL_WITHDRAWALS
      ),
      getStoredDeletedIds()
    )
  );
  const [referrals, setReferrals] = useState<ReferralEntry[]>(() =>
    filterOutDeleted(
      loadFromStorage<ReferralEntry[]>(
        STORAGE_KEYS.REFERRALS_CACHE,
        INITIAL_REFERRALS
      ),
      getStoredDeletedIds()
    )
  );
  const [reviews, setReviews] = useState<UserReview[]>(() =>
    filterOutDeleted(
      loadFromStorage<UserReview[]>(STORAGE_KEYS.REVIEWS_CACHE, INITIAL_REVIEWS),
      getStoredDeletedIds()
    )
  );
  const [earnings, setEarnings] = useState<EarningRecord[]>(() =>
    loadFromStorage<EarningRecord[]>(
      STORAGE_KEYS.EARNINGS_CACHE,
      INITIAL_EARNINGS
    )
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  // Modals & Popups State
  const [signInOpen, setSignInOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<'user' | 'admin'>('user');
  const [urlRefCode, setUrlRefCode] = useState('');
  const [activeAdModal, setActiveAdModal] = useState<AdItem | null>(null);
  const [latestWithdrawalPopup, setLatestWithdrawalPopup] =
    useState<WithdrawalRequest | null>(() => {
      const initialWds = filterOutDeleted(
        loadFromStorage<WithdrawalRequest[]>(
          STORAGE_KEYS.WITHDRAWALS_CACHE,
          INITIAL_WITHDRAWALS
        ),
        getStoredDeletedIds()
      );
      return initialWds[0] || null;
    });
  const [withdrawSuccessInfo, setWithdrawSuccessInfo] = useState<{
    open: boolean;
    amount: number;
    method: string;
    mobile: string;
  }>({ open: false, amount: 0, method: 'বিকাশ', mobile: '' });

  const seededRef = useRef<boolean>(
    loadFromStorage<boolean>(STORAGE_KEYS.SEEDED_FLAG, false)
  );

  const markDatabaseSeeded = () => {
    seededRef.current = true;
    localStorage.setItem(STORAGE_KEYS.SEEDED_FLAG, 'true');
  };

  const registerDeletedId = async (id: string) => {
    markDatabaseSeeded();
    if (!deletedIdsRef.current.includes(id)) {
      deletedIdsRef.current = [...deletedIdsRef.current, id];
      localStorage.setItem(
        STORAGE_KEYS.DELETED_IDS,
        JSON.stringify(deletedIdsRef.current)
      );
    }
    try {
      await setDoc(doc(db, 'test', 'system_state'), {
        seeded: true,
        deletedIds: deletedIdsRef.current.slice(-500),
      });
    } catch {
      // Ignore transient network errors for system_state
    }
  };

  // Sync state to localStorage cache so actions are always instant and persistent
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_USER, JSON.stringify(deviceUser));
    if (deviceUser?.id) {
      localStorage.setItem(STORAGE_KEYS.DEVICE_USER_ID, deviceUser.id);
    }
  }, [deviceUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS_CACHE, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS_CACHE, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.WITHDRAWALS_CACHE,
      JSON.stringify(withdrawals)
    );
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.REFERRALS_CACHE,
      JSON.stringify(referrals)
    );
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS_CACHE, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EARNINGS_CACHE, JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_AUTH,
      JSON.stringify(isAdminLoggedIn)
    );
  }, [isAdminLoggedIn]);

  // Real-time Firestore Synchronization across all devices
  useEffect(() => {
    // 0. System State (tracks permanent deletions & seed status across all devices)
    const unsubSystemState = onSnapshot(
      doc(db, 'test', 'system_state'),
      async (docSnap) => {
        if (docSnap.exists()) {
          markDatabaseSeeded();
          const data = docSnap.data() as {
            seeded?: boolean;
            deletedIds?: string[];
          };
          if (Array.isArray(data.deletedIds) && data.deletedIds.length > 0) {
            const merged = Array.from(
              new Set([...deletedIdsRef.current, ...data.deletedIds])
            );
            deletedIdsRef.current = merged;
            localStorage.setItem(
              STORAGE_KEYS.DELETED_IDS,
              JSON.stringify(merged)
            );
            setUsers((prev) => filterOutDeleted(prev, merged));
            setAds((prev) => filterOutDeleted(prev, merged));
            setWithdrawals((prev) => {
              const next = filterOutDeleted(prev, merged);
              setLatestWithdrawalPopup((curr) =>
                curr && merged.includes(curr.id) ? next[0] || null : curr
              );
              return next;
            });
            setTasks((prev) => filterOutDeleted(prev, merged));
            setReferrals((prev) => filterOutDeleted(prev, merged));
            setReviews((prev) => filterOutDeleted(prev, merged));
          }
        } else {
          markDatabaseSeeded();
          try {
            await setDoc(doc(db, 'test', 'system_state'), {
              seeded: true,
              deletedIds: deletedIdsRef.current,
            });
          } catch {
            // Ignore
          }
        }
      },
      () => {
        // Ignore system_state read errors
      }
    );

    // 1. Users Collection
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const u of INITIAL_USERS) {
              if (!deletedIdsRef.current.includes(u.id)) {
                await setDoc(
                  doc(db, 'users', u.id),
                  sanitizeUserForFirestore(u)
                );
              }
            }
            if (
              deviceUser &&
              !deletedIdsRef.current.includes(deviceUser.id)
            ) {
              await setDoc(
                doc(db, 'users', deviceUser.id),
                sanitizeUserForFirestore(deviceUser)
              );
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'users');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        snapshot.docs.forEach((d) => {
          if (delSet.has(d.id)) {
            deleteDoc(doc(db, 'users', d.id)).catch(() => {});
          }
        });

        const loadedUsers = snapshot.docs
          .map((d) => d.data() as UserProfile)
          .filter((u) => !delSet.has(u.id));

        setUsers(loadedUsers);

        const myDeviceId =
          localStorage.getItem(STORAGE_KEYS.DEVICE_USER_ID) || deviceUser?.id;
        if (myDeviceId) {
          if (delSet.has(myDeviceId)) {
            setDeviceUser(null);
            localStorage.removeItem(STORAGE_KEYS.DEVICE_USER);
            localStorage.removeItem(STORAGE_KEYS.DEVICE_USER_ID);
          } else {
            const matched = loadedUsers.find((u) => u.id === myDeviceId);
            if (matched) {
              setDeviceUser(matched);
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      }
    );

    // 2. Ads Collection
    const unsubAds = onSnapshot(
      collection(db, 'ads'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const ad of INITIAL_ADS) {
              if (!deletedIdsRef.current.includes(ad.id)) {
                await setDoc(doc(db, 'ads', ad.id), ad);
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'ads');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        snapshot.docs.forEach((d) => {
          if (delSet.has(d.id)) {
            deleteDoc(doc(db, 'ads', d.id)).catch(() => {});
          }
        });

        const loadedAds = snapshot.docs
          .map((d) => d.data() as AdItem)
          .filter((a) => !delSet.has(a.id))
          .sort((a, b) => a.id.localeCompare(b.id));
        setAds(loadedAds);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'ads');
      }
    );

    // 3. Withdrawals Collection
    const unsubWithdrawals = onSnapshot(
      collection(db, 'withdrawals'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const w of INITIAL_WITHDRAWALS) {
              if (!deletedIdsRef.current.includes(w.id)) {
                await setDoc(doc(db, 'withdrawals', w.id), w);
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'withdrawals');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        snapshot.docs.forEach((d) => {
          if (delSet.has(d.id)) {
            deleteDoc(doc(db, 'withdrawals', d.id)).catch(() => {});
          }
        });

        const loadedWds = snapshot.docs
          .map((d) => d.data() as WithdrawalRequest)
          .filter((w) => !delSet.has(w.id))
          .sort((a, b) => b.id.localeCompare(a.id));
        setWithdrawals(loadedWds);
        setLatestWithdrawalPopup(loadedWds[0] || null);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'withdrawals');
      }
    );

    // 4. Referrals Collection
    const unsubReferrals = onSnapshot(
      collection(db, 'referrals'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const r of INITIAL_REFERRALS) {
              if (!deletedIdsRef.current.includes(r.id)) {
                await setDoc(doc(db, 'referrals', r.id), r);
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'referrals');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        const loadedRefs = snapshot.docs
          .map((d) => d.data() as ReferralEntry)
          .filter((r) => !delSet.has(r.id))
          .sort((a, b) => b.id.localeCompare(a.id));
        setReferrals(loadedRefs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'referrals');
      }
    );

    // 5. Reviews Collection
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const rev of INITIAL_REVIEWS) {
              if (!deletedIdsRef.current.includes(rev.id)) {
                await setDoc(doc(db, 'reviews', rev.id), rev);
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'reviews');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        const loadedRevs = snapshot.docs
          .map((d) => d.data() as UserReview)
          .filter((r) => !delSet.has(r.id))
          .sort((a, b) => b.id.localeCompare(a.id));
        setReviews(loadedRevs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reviews');
      }
    );

    // 6. Earnings Collection
    const unsubEarnings = onSnapshot(
      collection(db, 'earnings'),
      (snapshot) => {
        const loadedEarns = snapshot.docs
          .map((d) => d.data() as EarningRecord)
          .sort((a, b) => b.id.localeCompare(a.id));
        setEarnings(loadedEarns);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'earnings');
      }
    );

    // 7. Tasks Collection
    const unsubTasks = onSnapshot(
      collection(db, 'tasks'),
      async (snapshot) => {
        if (
          snapshot.empty &&
          !seededRef.current &&
          deletedIdsRef.current.length === 0
        ) {
          markDatabaseSeeded();
          try {
            for (const t of INITIAL_DISCOVER_TASKS) {
              if (!deletedIdsRef.current.includes(t.id)) {
                await setDoc(doc(db, 'tasks', t.id), t);
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, 'tasks');
          }
          return;
        }

        if (!snapshot.empty) {
          markDatabaseSeeded();
        }

        const delSet = new Set(deletedIdsRef.current);
        snapshot.docs.forEach((d) => {
          if (delSet.has(d.id)) {
            deleteDoc(doc(db, 'tasks', d.id)).catch(() => {});
          }
        });

        const loadedTasks = snapshot.docs
          .map((d) => d.data() as DiscoverTask)
          .filter((t) => !delSet.has(t.id));
        setTasks(loadedTasks);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tasks');
      }
    );

    return () => {
      unsubSystemState();
      unsubUsers();
      unsubAds();
      unsubWithdrawals();
      unsubReferrals();
      unsubReviews();
      unsubEarnings();
      unsubTasks();
    };
  }, []);

  // Detect ?ref=... in URL for referral commission
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setUrlRefCode(refParam);
      if (!deviceUser) {
        setSignInMode('user');
        setSignInOpen(true);
      }
    }
  }, [deviceUser]);

  const openSignInModal = (mode: 'user' | 'admin' = 'user') => {
    setSignInMode(mode);
    setSignInOpen(true);
  };

  const [pendingAdAfterSignIn, setPendingAdAfterSignIn] =
    useState<AdItem | null>(null);

  const triggerAutoOpenUrl = (url: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback handled by modal iframe
    }
  };

  // Permanent Device Sign-In Handler (Syncs locally + to Cloud Firestore)
  const handleUserSignIn = async (
    name: string,
    mobile: string,
    referralCodeInput: string
  ) => {
    if (deviceUser) return;

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `SI-${randomDigits}`;
    const generatedCode = `SHJ-${String(randomDigits).slice(0, 4)}`;
    const todayStr = '২৮ সেপ্টেম্বর ২০২৬';

    const initialWatchedAds = pendingAdAfterSignIn
      ? [pendingAdAfterSignIn.id, makeDailyStamp(pendingAdAfterSignIn.id)]
      : [];
    if (pendingAdAfterSignIn) {
      unrewardedAdStampRef.current.add(makeDailyStamp(pendingAdAfterSignIn.id));
    }

    const newUser: UserProfile = {
      id: generatedId,
      code: generatedCode,
      name,
      mobile,
      avatar: ASSETS.defaultAvatar,
      currentBalance: 50,
      totalEarned: 50,
      adsWatched: 0,
      watchedAdIds: initialWatchedAds,
      completedTaskIds: [],
      referralCount: 0,
      referralEarned: 0,
      joinedDate: todayStr,
      referredBy: referralCodeInput || undefined,
    };

    const welcomeEarn: EarningRecord = {
      id: `earn-${Date.now()}`,
      userId: newUser.id,
      title: 'নতুন একাউন্ট সাইন-ইন স্বাগতম বোনাস',
      category: 'ওয়েলকাম বোনাস',
      amount: 50,
      date: todayStr,
    };

    // Instant local state update
    setDeviceUser(newUser);
    setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id)]);
    setEarnings((prev) => [welcomeEarn, ...prev]);
    localStorage.setItem(STORAGE_KEYS.DEVICE_USER_ID, newUser.id);

    if (pendingAdAfterSignIn) {
      triggerAutoOpenUrl(pendingAdAfterSignIn.url);
      setActiveAdModal(pendingAdAfterSignIn);
      setPendingAdAfterSignIn(null);
    }

    try {
      await setDoc(
        doc(db, 'users', newUser.id),
        sanitizeUserForFirestore(newUser)
      );
      await setDoc(doc(db, 'earnings', welcomeEarn.id), welcomeEarn);

      if (referralCodeInput) {
        const targetCode = referralCodeInput.toUpperCase();
        const referrer = users.find(
          (u) =>
            u.code.toUpperCase() === targetCode ||
            u.id.toUpperCase() === targetCode
        );
        if (referrer) {
          const updatedReferrer: UserProfile = {
            ...referrer,
            currentBalance: referrer.currentBalance + 50,
            totalEarned: referrer.totalEarned + 50,
            referralCount: referrer.referralCount + 1,
            referralEarned: referrer.referralEarned + 50,
          };
          const newRefEntry: ReferralEntry = {
            id: `ref-${Date.now()}`,
            referrerId: referrer.id,
            referrerCode: referrer.code,
            newUserName: newUser.name,
            newUserId: newUser.id,
            newUserMobile: newUser.mobile,
            date: todayStr,
            commission: 50,
          };

          setUsers((prev) =>
            prev.map((u) => (u.id === referrer.id ? updatedReferrer : u))
          );
          setReferrals((prev) => [newRefEntry, ...prev]);

          await setDoc(
            doc(db, 'users', referrer.id),
            sanitizeUserForFirestore(updatedReferrer)
          );
          await setDoc(doc(db, 'referrals', newRefEntry.id), newRefEntry);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  // Admin Login Handler (yeakub / 135426 - case-insensitive username)
  const handleAdminSignIn = (username: string, password: string): boolean => {
    if (
      username.trim().toLowerCase() === 'yeakub' &&
      password.trim() === '135426'
    ) {
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
      return true;
    }
    return false;
  };

  const unrewardedAdStampRef = useRef<Set<string>>(new Set());

  // Ad Click Handler (Once per day per ad)
  const handleAdClick = async (ad: AdItem, openedByAnchor = false) => {
    if (!deviceUser) {
      setPendingAdAfterSignIn(ad);
      openSignInModal('user');
      return;
    }
    if (hasDoneToday(deviceUser.watchedAdIds, ad.id)) {
      return;
    }
    const stamp = makeDailyStamp(ad.id);
    unrewardedAdStampRef.current.add(stamp);

    const updatedUserWithStamp: UserProfile = {
      ...deviceUser,
      watchedAdIds: Array.from(
        new Set([...deviceUser.watchedAdIds, ad.id, stamp])
      ).slice(-450),
    };
    setDeviceUser(updatedUserWithStamp);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === updatedUserWithStamp.id ? updatedUserWithStamp : u
      )
    );

    if (!openedByAnchor) {
      triggerAutoOpenUrl(ad.url);
    }
    setActiveAdModal(ad);

    try {
      await setDoc(
        doc(db, 'users', updatedUserWithStamp.id),
        sanitizeUserForFirestore(updatedUserWithStamp)
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  // Ad Completion Handler (Once per day per ad)
  const handleCompleteAd = async (ad: AdItem) => {
    if (!deviceUser) return;
    const stamp = makeDailyStamp(ad.id);
    if (
      hasDoneToday(deviceUser.watchedAdIds, ad.id) &&
      !unrewardedAdStampRef.current.has(stamp)
    ) {
      setActiveAdModal(null);
      return;
    }
    unrewardedAdStampRef.current.delete(stamp);
    const todayStr = '২৮ সেপ্টেম্বর ২০২৬';

    const updatedAd: AdItem = {
      ...ad,
      clicks: ad.clicks + 1,
    };

    const updatedUser: UserProfile = {
      ...deviceUser,
      currentBalance: deviceUser.currentBalance + ad.reward,
      totalEarned: deviceUser.totalEarned + ad.reward,
      adsWatched: deviceUser.adsWatched + 1,
      watchedAdIds: Array.from(
        new Set([...deviceUser.watchedAdIds, ad.id, makeDailyStamp(ad.id)])
      ).slice(-450),
    };

    const earnEntry: EarningRecord = {
      id: `earn-${Date.now()}`,
      userId: updatedUser.id,
      title: ad.title,
      category: 'এড ইনকাম',
      amount: ad.reward,
      date: todayStr,
    };

    setDeviceUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setAds((prev) => prev.map((a) => (a.id === updatedAd.id ? updatedAd : a)));
    setEarnings((prev) => [earnEntry, ...prev]);
    setActiveAdModal(null);

    try {
      await setDoc(doc(db, 'ads', updatedAd.id), updatedAd);
      await setDoc(
        doc(db, 'users', updatedUser.id),
        sanitizeUserForFirestore(updatedUser)
      );
      await setDoc(doc(db, 'earnings', earnEntry.id), earnEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  };

  // Refresh Auto Captions on Videos Page
  const handleRefreshAutoCaptions = async () => {
    const updatedList = ads.map((ad, idx) => ({
      ...ad,
      caption:
        AUTO_CAPTIONS[
          (idx + Math.floor(Math.random() * AUTO_CAPTIONS.length)) %
            AUTO_CAPTIONS.length
        ],
    }));
    setAds(updatedList);
    try {
      for (const item of updatedList) {
        await setDoc(doc(db, 'ads', item.id), item);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  };

  // Complete Discover Task (Once per day per task)
  const handleCompleteTask = async (task: DiscoverTask) => {
    if (!deviceUser) return;
    if (hasDoneToday(deviceUser.completedTaskIds, task.id)) return;

    const todayStr = '২৮ সেপ্টেম্বর ২০২৬';
    const updatedUser: UserProfile = {
      ...deviceUser,
      currentBalance: deviceUser.currentBalance + task.reward,
      totalEarned: deviceUser.totalEarned + task.reward,
      completedTaskIds: Array.from(
        new Set([
          ...deviceUser.completedTaskIds,
          task.id,
          makeDailyStamp(task.id),
        ])
      ).slice(-450),
    };

    const updatedTask: DiscoverTask = {
      ...task,
      participants: task.participants + 1,
    };

    const earnEntry: EarningRecord = {
      id: `earn-${Date.now()}`,
      userId: updatedUser.id,
      title: task.title,
      category: 'ডিসকভার টাস্ক',
      amount: task.reward,
      date: todayStr,
    };

    setDeviceUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updatedTask : t))
    );
    setEarnings((prev) => [earnEntry, ...prev]);

    try {
      await setDoc(
        doc(db, 'users', updatedUser.id),
        sanitizeUserForFirestore(updatedUser)
      );
      await setDoc(doc(db, 'tasks', updatedTask.id), updatedTask);
      await setDoc(doc(db, 'earnings', earnEntry.id), earnEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  // Simulate Referral Join (+50 TK to current user's account)
  const handleSimulateReferralJoin = async (
    friendName: string,
    friendMobile: string
  ) => {
    if (!deviceUser) return;
    const todayStr = '২৮ সেপ্টেম্বর ২০২৬';
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const friendUser: UserProfile = {
      id: `SI-${randomDigits}`,
      code: `SHJ-${String(randomDigits).slice(0, 4)}`,
      name: friendName,
      mobile: friendMobile,
      avatar: ASSETS.defaultAvatar,
      currentBalance: 50,
      totalEarned: 50,
      adsWatched: 1,
      watchedAdIds: [],
      completedTaskIds: [],
      referralCount: 0,
      referralEarned: 0,
      joinedDate: todayStr,
      referredBy: deviceUser.code,
    };

    const updatedUser: UserProfile = {
      ...deviceUser,
      currentBalance: deviceUser.currentBalance + 50,
      totalEarned: deviceUser.totalEarned + 50,
      referralCount: deviceUser.referralCount + 1,
      referralEarned: deviceUser.referralEarned + 50,
    };

    const newRefEntry: ReferralEntry = {
      id: `ref-${Date.now()}`,
      referrerId: deviceUser.id,
      referrerCode: deviceUser.code,
      newUserName: friendName,
      newUserId: friendUser.id,
      newUserMobile: friendMobile,
      date: todayStr,
      commission: 50,
    };

    const earnEntry: EarningRecord = {
      id: `earn-${Date.now()}`,
      userId: updatedUser.id,
      title: `রেফার কমিশন (${friendName})`,
      category: 'রেফার বোনাস',
      amount: 50,
      date: todayStr,
    };

    setDeviceUser(updatedUser);
    setUsers((prev) => [
      friendUser,
      ...prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    ]);
    setReferrals((prev) => [newRefEntry, ...prev]);
    setEarnings((prev) => [earnEntry, ...prev]);

    try {
      await setDoc(
        doc(db, 'users', friendUser.id),
        sanitizeUserForFirestore(friendUser)
      );
      await setDoc(
        doc(db, 'users', updatedUser.id),
        sanitizeUserForFirestore(updatedUser)
      );
      await setDoc(doc(db, 'referrals', newRefEntry.id), newRefEntry);
      await setDoc(doc(db, 'earnings', earnEntry.id), earnEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'referrals');
    }
  };

  // Update Profile Name & Avatar
  const handleUpdateProfile = async (newName: string, newAvatar: string) => {
    if (!deviceUser) return;
    const updated: UserProfile = {
      ...deviceUser,
      name: newName,
      avatar: newAvatar,
    };
    setDeviceUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      await setDoc(
        doc(db, 'users', updated.id),
        sanitizeUserForFirestore(updated)
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  // Submit Withdrawal Request (Minimum 500 TK for regular users)
  const handleSubmitWithdraw = async (
    method: PaymentMethod,
    mobile: string,
    amount: number
  ) => {
    if (!deviceUser) return;
    const todayStr = '২৮ সেপ্টেম্বর ২০২৬, এইমাত্র';
    const newReq: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: deviceUser.id,
      userName: deviceUser.name,
      accountNumber: mobile,
      method,
      amount,
      date: todayStr,
      status: 'পেন্ডিং',
    };

    const updatedUser: UserProfile = {
      ...deviceUser,
      currentBalance: Math.max(0, deviceUser.currentBalance - amount),
    };

    setDeviceUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setWithdrawals((prev) => [newReq, ...prev]);
    setLatestWithdrawalPopup(newReq);
    setWithdrawSuccessInfo({
      open: true,
      amount,
      method,
      mobile,
    });

    try {
      await setDoc(
        doc(db, 'users', updatedUser.id),
        sanitizeUserForFirestore(updatedUser)
      );
      await setDoc(doc(db, 'withdrawals', newReq.id), newReq);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'withdrawals');
    }
  };

  // Add Review on Proofs Page
  const handleAddReview = async (
    comment: string,
    withdrawnAmount: number,
    method: PaymentMethod
  ) => {
    if (!deviceUser) return;
    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      userName: deviceUser.name,
      role: `ভেরিফাইড সদস্য (${deviceUser.id})`,
      organization: 'সহজে ইনকাম কমিউনিটি',
      withdrawnAmount,
      method,
      comment: comment.slice(0, 950),
      date: '২৮ সেপ্টেম্বর ২০২৬',
    };
    setReviews((prev) => [newRev, ...prev]);
    try {
      await setDoc(doc(db, 'reviews', newRev.id), newRev);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reviews');
    }
  };

  // ================= ADMIN HANDLERS (Instant Local State + Cloud Firestore Sync) =================

  // Admin: Add Ad
  const handleAdminAddAd = async (
    title: string,
    url: string,
    caption: string,
    reward: number,
    sponsor: string
  ) => {
    const newAd: AdItem = {
      id: `ad-${Date.now()}`,
      title: title.slice(0, 240),
      url: url.slice(0, 950),
      caption: caption.slice(0, 580),
      reward: Math.max(1, Number(reward) || 20),
      durationSec: 5,
      clicks: 0,
      sponsor: sponsor.slice(0, 110),
      createdAt: '২৮ সেপ্টেম্বর ২০২৬',
    };
    setAds((prev) => [...prev, newAd]);
    try {
      await setDoc(doc(db, 'ads', newAd.id), newAd);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  };

  // Admin: Update Ad
  const handleAdminUpdateAd = async (updatedAd: AdItem) => {
    markDatabaseSeeded();
    const sanitizedAd: AdItem = {
      id: updatedAd.id.slice(0, 64),
      title: updatedAd.title.slice(0, 240),
      url: updatedAd.url.slice(0, 950),
      caption: updatedAd.caption.slice(0, 580),
      reward: Math.max(0, Number(updatedAd.reward) || 20),
      durationSec: Math.max(1, Number(updatedAd.durationSec) || 5),
      clicks: Math.max(0, Number(updatedAd.clicks) || 0),
      sponsor: (updatedAd.sponsor || 'Sohoje Income Partner').slice(0, 110),
      createdAt: (updatedAd.createdAt || '২৮ সেপ্টেম্বর ২০২৬').slice(0, 64),
    };
    setAds((prev) =>
      prev.map((a) => (a.id === sanitizedAd.id ? sanitizedAd : a))
    );
    setActiveAdModal((curr) =>
      curr?.id === sanitizedAd.id ? sanitizedAd : curr
    );
    try {
      await setDoc(doc(db, 'ads', sanitizedAd.id), sanitizedAd);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  };

  // Admin: Delete Ad
  const handleAdminDeleteAd = async (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
    setActiveAdModal((curr) => (curr?.id === adId ? null : curr));
    await registerDeletedId(adId);
    try {
      await deleteDoc(doc(db, 'ads', adId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'ads');
    }
  };

  // Admin: Update Withdrawal Status
  const handleAdminUpdateWithdrawalStatus = async (
    id: string,
    status: WithdrawalStatus
  ) => {
    markDatabaseSeeded();
    const target = withdrawals.find((w) => w.id === id);
    if (!target) return;
    const updated: WithdrawalRequest = {
      id: target.id.slice(0, 64),
      userId: target.userId.slice(0, 64),
      userName: target.userName.slice(0, 120),
      accountNumber: target.accountNumber.slice(0, 32),
      method: target.method,
      amount: Math.max(1, Number(target.amount) || 500),
      date: target.date.slice(0, 80),
      status,
    };
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? updated : w)));
    setLatestWithdrawalPopup((curr) => (curr?.id === id ? updated : curr));
    try {
      await setDoc(doc(db, 'withdrawals', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'withdrawals');
    }
  };

  // Admin: Delete Withdrawal
  const handleAdminDeleteWithdrawal = async (id: string) => {
    setWithdrawals((prev) => {
      const next = prev.filter((w) => w.id !== id);
      setLatestWithdrawalPopup((curr) =>
        curr?.id === id ? next[0] || null : curr
      );
      return next;
    });
    await registerDeletedId(id);
    try {
      await deleteDoc(doc(db, 'withdrawals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'withdrawals');
    }
  };

  // Admin: Direct Create Withdrawal Request
  const handleAdminCreateWithdrawal = async (
    userName: string,
    userId: string,
    method: PaymentMethod,
    accountNumber: string,
    amount: number,
    status: WithdrawalStatus = 'সফল'
  ) => {
    markDatabaseSeeded();
    const newReq: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: userId.slice(0, 60),
      userName: userName.slice(0, 110),
      accountNumber: accountNumber.slice(0, 30),
      method,
      amount: Math.max(1, Number(amount) || 500),
      date: '২৮ সেপ্টেম্বর ২০২৬, এডমিন এন্ট্রি',
      status,
    };
    setWithdrawals((prev) => [newReq, ...prev]);
    setLatestWithdrawalPopup(newReq);
    try {
      await setDoc(doc(db, 'withdrawals', newReq.id), newReq);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'withdrawals');
    }
  };

  // Admin: Update User Balance
  const handleAdminUpdateUserBalance = async (
    userId: string,
    newBalance: number
  ) => {
    markDatabaseSeeded();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const diff = newBalance - targetUser.currentBalance;
    const updatedUser: UserProfile = {
      ...targetUser,
      currentBalance: Math.max(0, newBalance),
      totalEarned:
        diff > 0
          ? targetUser.totalEarned + diff
          : targetUser.totalEarned,
    };
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? updatedUser : u))
    );
    if (deviceUser?.id === userId) {
      setDeviceUser(updatedUser);
    }
    try {
      await setDoc(
        doc(db, 'users', userId),
        sanitizeUserForFirestore(updatedUser)
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  // Admin: Delete User
  const handleAdminDeleteUser = async (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (deviceUser?.id === userId) {
      setDeviceUser(null);
      localStorage.removeItem(STORAGE_KEYS.DEVICE_USER);
      localStorage.removeItem(STORAGE_KEYS.DEVICE_USER_ID);
    }
    await registerDeletedId(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'users');
    }
  };

  // Admin: Add Discover Task
  const handleAdminAddTask = async (
    category: TaskCategory,
    title: string,
    description: string,
    url: string,
    reward: number
  ) => {
    markDatabaseSeeded();
    const newTask: DiscoverTask = {
      id: `task-${Date.now()}`,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'সোশ্যাল টাস্ক',
      title: title.slice(0, 240),
      description: description.slice(0, 580),
      url: url.slice(0, 950),
      reward: Math.max(1, Number(reward) || 25),
      participants: 1,
    };
    setTasks((prev) => [newTask, ...prev]);
    try {
      await setDoc(doc(db, 'tasks', newTask.id), newTask);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'tasks');
    }
  };

  // Admin: Update Discover Task
  const handleAdminUpdateTask = async (updatedTask: DiscoverTask) => {
    markDatabaseSeeded();
    const sanitizedTask: DiscoverTask = {
      id: updatedTask.id.slice(0, 64),
      category: updatedTask.category,
      categoryLabel: (
        CATEGORY_LABELS[updatedTask.category] ||
        updatedTask.categoryLabel ||
        'সোশ্যাল টাস্ক'
      ).slice(0, 120),
      title: updatedTask.title.slice(0, 240),
      description: updatedTask.description.slice(0, 580),
      url: updatedTask.url.slice(0, 950),
      reward: Math.max(0, Number(updatedTask.reward) || 25),
      participants: Math.max(0, Number(updatedTask.participants) || 1),
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === sanitizedTask.id ? sanitizedTask : t))
    );
    try {
      await setDoc(doc(db, 'tasks', sanitizedTask.id), sanitizedTask);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'tasks');
    }
  };

  // Admin: Delete Discover Task
  const handleAdminDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await registerDeletedId(taskId);
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tasks');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Top Bar Contract: 3 Zones (Brand Title — 4-6 Nav Links — 1-2 Primary Actions) */}
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap"
        >
          সহজে ইনকাম
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              activeTab === 'home'
                ? 'text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-600'
                : ''
            }`}
          >
            হোমপেইজ
          </a>
          <a
            href="#video"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('video');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              activeTab === 'video'
                ? 'text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-600'
                : ''
            }`}
          >
            Video
          </a>
          <a
            href="#proofs"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('proofs');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              activeTab === 'proofs'
                ? 'text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-600'
                : ''
            }`}
          >
            Proofs
          </a>
          <a
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('discover');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              activeTab === 'discover'
                ? 'text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-600'
                : ''
            }`}
          >
            Discover
          </a>
          <a
            href="#refer"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('refer');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              activeTab === 'refer'
                ? 'text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-600'
                : ''
            }`}
          >
            Refer
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {deviceUser ? (
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer font-mono-num"
            >
              ব্যালেন্স: ৳ {deviceUser.currentBalance}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openSignInModal('user')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              সাইন-ইন করুন
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>এডমিন পেইজ</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'home' && (
          <HomePage
            user={deviceUser}
            ads={ads}
            withdrawals={withdrawals}
            onAdClick={handleAdClick}
            onNavigate={setActiveTab}
            onOpenSignIn={openSignInModal}
            onTriggerDemoPopup={(w) => setLatestWithdrawalPopup(w)}
          />
        )}

        {activeTab === 'video' && (
          <VideosPage
            ads={ads}
            user={deviceUser}
            onAdClick={handleAdClick}
            onRefreshAutoCaptions={handleRefreshAutoCaptions}
          />
        )}

        {activeTab === 'proofs' && (
          <ProofsPage
            withdrawals={withdrawals}
            reviews={reviews}
            user={deviceUser}
            onAddReview={handleAddReview}
            onOpenSignIn={() => openSignInModal('user')}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverPage
            tasks={tasks}
            user={deviceUser}
            onCompleteTask={handleCompleteTask}
            onOpenSignIn={() => openSignInModal('user')}
          />
        )}

        {activeTab === 'refer' && (
          <ReferPage
            user={deviceUser}
            referrals={referrals}
            onOpenSignIn={() => openSignInModal('user')}
            onSimulateReferralJoin={handleSimulateReferralJoin}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            user={deviceUser}
            withdrawals={withdrawals}
            referrals={referrals}
            earnings={earnings.filter((e) => e.userId === deviceUser?.id)}
            onOpenSignIn={() => openSignInModal('user')}
            onUpdateProfile={handleUpdateProfile}
            onSubmitWithdraw={handleSubmitWithdraw}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            isAdminLoggedIn={isAdminLoggedIn}
            ads={ads}
            users={users}
            withdrawals={withdrawals}
            tasks={tasks}
            onAdminLoginSubmit={handleAdminSignIn}
            onAddAd={handleAdminAddAd}
            onUpdateAd={handleAdminUpdateAd}
            onDeleteAd={handleAdminDeleteAd}
            onUpdateWithdrawalStatus={handleAdminUpdateWithdrawalStatus}
            onDeleteWithdrawal={handleAdminDeleteWithdrawal}
            onAdminCreateWithdrawal={handleAdminCreateWithdrawal}
            onUpdateUserBalance={handleAdminUpdateUserBalance}
            onDeleteUser={handleAdminDeleteUser}
            onAddTask={handleAdminAddTask}
            onUpdateTask={handleAdminUpdateTask}
            onDeleteTask={handleAdminDeleteTask}
            onOpenAdminLogin={() => openSignInModal('admin')}
            onOpenCodeDownload={() => setCodeModalOpen(true)}
            onAdminLogout={() => {
              setIsAdminLoggedIn(false);
              setActiveTab('home');
            }}
          />
        )}
      </main>

      {/* Floating Homepage Widgets: Top Withdrawal Popup, Left WhatsApp, Right Auto-Chatbot */}
      <FloatingWidgets
        latestWithdrawalPopup={latestWithdrawalPopup}
        onDismissWithdrawalPopup={() => setLatestWithdrawalPopup(null)}
        isHomePage={activeTab === 'home'}
      />

      {/* Modals */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        initialMode={signInMode}
        existingDeviceUser={deviceUser}
        defaultReferralCode={urlRefCode}
        onUserSignIn={handleUserSignIn}
        onAdminSignIn={handleAdminSignIn}
      />

      <AdViewerModal
        ad={activeAdModal}
        onClose={() => setActiveAdModal(null)}
        onCompleteAd={handleCompleteAd}
      />

      <WithdrawSuccessModal
        isOpen={withdrawSuccessInfo.open}
        onClose={() =>
          setWithdrawSuccessInfo((prev) => ({ ...prev, open: false }))
        }
        amount={withdrawSuccessInfo.amount}
        method={withdrawSuccessInfo.method}
        mobile={withdrawSuccessInfo.mobile}
      />

      <CodeDownloadModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      />

      {/* Fixed Bottom Navigation Bar with 5 Required Buttons: Video, Proofs, Discover, Refer, Profile */}
      <nav
        aria-label="নিচের স্থায়ী মেনু"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-16"
      >
        <div className="max-w-3xl mx-auto h-full grid grid-cols-5 items-center px-2">
          {[
            { id: 'video', label: 'Video', icon: Video },
            { id: 'proofs', label: 'Proofs', icon: Award },
            { id: 'discover', label: 'Discover', icon: Compass },
            { id: 'refer', label: 'Refer', icon: Share2 },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
