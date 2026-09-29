import React, { useState } from 'react';
import {
  MessageSquare,
  PhoneCall,
  X,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Copy,
  Check,
} from 'lucide-react';
import { WithdrawalRequest } from '../types';

interface FloatingWidgetsProps {
  latestWithdrawalPopup: WithdrawalRequest | null;
  onDismissWithdrawalPopup: () => void;
  isHomePage: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const QUICK_QUESTIONS = [
  {
    q: 'কিভাবে এড দেখে ইনকাম করব?',
    a: 'হোমপেইজ অথবা নিচের "Video" বাটনে ক্লিক করলে সিরিয়াল অনুযায়ী সকল এড দেখতে পাবেন। যেকোনো এডের নিচে "এড ওপেন করুন" বাটনে ক্লিক করে ৫-৬ সেকেন্ড অপেক্ষা করলেই আপনার ব্যালেন্সে সাথে সাথে টাকা যোগ হয়ে যাবে।',
  },
  {
    q: 'রেফার করলে কত টাকা পাব?',
    a: 'নিচের "Refer" বাটনে ক্লিক করলে আপনার নিজস্ব ইউনিক রেফার লিংক পাবেন। আপনার লিংক কপি করে বন্ধুদের শেয়ার করুন। কেউ সেই লিংকে ক্লিক করে সাইন-ইন করলেই আপনার একাউন্টে সাথে সাথে ৫০ টাকা বোনাস যোগ হবে!',
  },
  {
    q: 'টাকা উত্তোলন (Withdraw) করার নিয়ম কী?',
    a: 'প্রোফাইল (Profile) পেইজ থেকে "Withdraw" বাটনে যান। সেখানে বিকাশ, রকেট অথবা নগদ সিলেক্ট করে আপনার মোবাইল নাম্বার এবং টাকার পরিমাণ (সর্বনিম্ন ৫০০ টাকা) দিয়ে সাবমিট করুন। ২৪ ঘন্টার মধ্যে আপনার পেমেন্ট পৌঁছে যাবে।',
  },
  {
    q: 'Discover পেইজের কাজগুলো কী?',
    a: 'Discover পেইজে আমাদের টেলিগ্রাম চ্যানেল জয়েন, ফেসবুক পেইজ লাইক, ইউটিউব চ্যানেল সাবস্ক্রাইব এবং ইউটিউব ভিডিও দেখার মতো সহজ কাজ রয়েছে। প্রতিটি কাজ সম্পন্ন করলেই ২০ থেকে ৪০ টাকা পর্যন্ত তাৎক্ষণিক আয় করতে পারবেন।',
  },
  {
    q: 'সাইন-ইন ও একাউন্টের নিয়ম কী?',
    a: 'নাম এবং মোবাইল নাম্বার দিয়ে এক ক্লিকেই সাইন-ইন করতে পারবেন। একটি ডিভাইসে একবার সাইন-ইন করলে সেটি স্থায়ীভাবে লগইন থাকবে, বারবার লগইন করার ঝামেলা নেই। সাথে সাথে একটি ইউজার আইডি ও কোড পেয়ে যাবেন।',
  },
];

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({
  latestWithdrawalPopup,
  onDismissWithdrawalPopup,
  isHomePage,
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! "সহজে ইনকাম" অটোমেটিক সাপোর্ট বটে আপনাকে স্বাগতম। আমাদের কাজ সম্পর্কে জানতে নিচের যেকোনো প্রশ্নে ক্লিক করুন অথবা আপনার প্রশ্ন লিখুন।',
      time: 'এখন',
    },
  ]);

  const generateAutoReply = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('এড') || q.includes('ভিডিও') || q.includes('ad') || q.includes('video')) {
      return 'আপনি হোমপেইজ অথবা "Video" পেইজে গিয়ে প্রতিটি এডের নিচে থাকা বাটনে ক্লিক করে ৫-৬ সেকেন্ড এড দেখলেই প্রতি এডে ১৫ থেকে ৩০ টাকা পর্যন্ত তাৎক্ষণিক ইনকাম করতে পারবেন।';
    }
    if (q.includes('রেফার') || q.includes('refer') || q.includes('কমিশন') || q.includes('লিংক')) {
      return '"Refer" পেইজে আপনার আইডির জন্য একটি ইউনিক রেফার লিংক দেওয়া আছে। কেউ আপনার লিংকে ক্লিক করে সাইন-ইন করলে আপনি সাথে সাথে ৫০ টাকা রেফার কমিশন পাবেন।';
    }
    if (
      q.includes('উত্তোলন') ||
      q.includes('উইথড্র') ||
      q.includes('withdraw') ||
      q.includes('বিকাশ') ||
      q.includes('নগদ') ||
      q.includes('রকেট') ||
      q.includes('পেমেন্ট')
    ) {
      return 'Profile পেইজে গিয়ে "Withdraw" বাটনে ক্লিক করে বিকাশ, রকেট অথবা নগদের মাধ্যমে টাকা উত্তোলন রিকুয়েষ্ট দিতে পারবেন। রিকুয়েষ্ট দেওয়ার ২৪ ঘন্টার মধ্যে পেমেন্ট সম্পন্ন করা হয়।';
    }
    if (q.includes('ডিসকভার') || q.includes('discover') || q.includes('টেলিগ্রাম') || q.includes('ইউটিউব')) {
      return '"Discover" বাটনে ক্লিক করলে টেলিগ্রাম চ্যানেল জয়েন, ফেসবুক পেইজ লাইক, ইউটিউব চ্যানেল সাবস্ক্রাইব ও ইউটিউব ভিডিও দেখার কাজ পাবেন।';
    }
    return 'ধন্যবাদ আপনার প্রশ্নের জন্য! "সহজে ইনকাম"-এ আপনি প্রতিদিন এড দেখে, Discover পেইজের সোশ্যাল কাজ করে এবং প্রতি রেফারে ৫০ টাকা করে আয় করতে পারবেন। যেকোনো মুহূর্তে বিকাশ, রকেট বা নগদে টাকা উত্তোলন করতে পারবেন।';
  };

  const handleSelectQuickQuestion = (item: { q: string; a: string }) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: item.q,
      time: 'এখন',
    };
    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text: item.a,
      time: 'এখন',
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const text = inputMsg.trim();
    setInputMsg('');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'এখন',
    };
    const replyText = generateAutoReply(text);
    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text: replyText,
      time: 'এখন',
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText('+8801700-889900');
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
  };

  return (
    <>
      {/* Top Withdrawal Popup on Homepage */}
      {isHomePage && latestWithdrawalPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl pointer-events-auto">
          <div className="bg-slate-900 text-white border border-slate-700/80 rounded-xl px-4 py-3 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span>সদ্য উত্তোলন আপডেট</span>
                  <span aria-hidden="true">·</span>
                  <span>{latestWithdrawalPopup.userName}</span>
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  <span className="font-mono-num text-emerald-400">
                    ৳ {latestWithdrawalPopup.amount.toLocaleString('bn-BD')}
                  </span>{' '}
                  উত্তোলন করা হয়েছে{' '}
                  <span className="underline decoration-emerald-400 underline-offset-4">
                    {latestWithdrawalPopup.method}
                  </span>{' '}
                  এর মাধ্যমে
                </p>
              </div>
            </div>
            <button
              onClick={onDismissWithdrawalPopup}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center shrink-0 transition-colors"
              aria-label="পপআপ বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Left Floating WhatsApp Button (Visible on Homepage & across platform) */}
      {isHomePage && (
        <div className="fixed left-4 bottom-20 z-30">
          <button
            onClick={() => {
              setWhatsappOpen((prev) => !prev);
              setChatOpen(false);
            }}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
            aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন"
          >
            <PhoneCall className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              হোয়াটসঅ্যাপ সাপোর্ট
            </span>
          </button>
        </div>
      )}

      {/* Right Floating Chatbot Button (Visible on Homepage & across platform) */}
      {isHomePage && (
        <div className="fixed right-4 bottom-20 z-30">
          <button
            onClick={() => {
              setChatOpen((prev) => !prev);
              setWhatsappOpen(false);
            }}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
            aria-label="অটোমেটিক সাপোর্ট চ্যাটবট"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              কাজের নিয়ম জানুন (চ্যাটবট)
            </span>
          </button>
        </div>
      )}

      {/* WhatsApp Contact Modal/Drawer */}
      {whatsappOpen && (
        <div className="fixed left-4 bottom-36 z-50 w-[320px] sm:w-[360px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-emerald-700 text-white px-4 py-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">হোয়াটসঅ্যাপ সরাসরি যোগাযোগ</h3>
              <p className="text-xs text-emerald-100">২৪/৭ পেমেন্ট ও একাউন্ট হেল্পলাইন</p>
            </div>
            <button
              onClick={() => setWhatsappOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-emerald-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed">
              যেকোনো পেমেন্ট সংক্রান্ত তথ্য, একাউন্ট ভেরিফিকেশন অথবা কাজের সহায়তার জন্য আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নাম্বারে মেসেজ করুন।
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">অফিসিয়াল হোয়াটসঅ্যাপ নাম্বার</div>
                <div className="text-sm font-mono-num font-semibold text-slate-900">
                  +880 1700-889900
                </div>
              </div>
              <button
                onClick={handleCopyWhatsapp}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedWa ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি</span>
                  </>
                )}
              </button>
            </div>
            <a
              href="https://wa.me/8801700889900?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%B8%E0%A6%B9%E0%A6%9C%E0%A7%87%20%E0%A6%87%E0%A6%A8%E0%A6%95%E0%A6%BE%E0%A6%AE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>সরাসরি হোয়াটসঅ্যাপ চ্যাট ওপেন করুন</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Automated Work Assistant Chatbot Window */}
      {chatOpen && (
        <div className="fixed right-4 bottom-36 z-50 w-[335px] sm:w-[380px] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col max-h-[500px] overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-bold">সহজে ইনকাম — অটোমেটিক হেল্পডেস্ক</h3>
              <p className="text-xs text-slate-300">কাজের নিয়ম ও পেমেন্ট সম্পর্কে তাৎক্ষণিক উত্তর</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 overflow-y-auto space-y-3 flex-1 bg-slate-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            <div className="pt-1">
              <p className="text-[11px] font-medium text-slate-500 mb-2">
                জনপ্রিয় প্রশ্নসমূহ (ক্লিক করলে উত্তর পাবেন):
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuickQuestion(item)}
                    className="text-left text-xs px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSendCustom}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="আপনার প্রশ্ন লিখুন..."
              className="flex-1 text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              aria-label="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
