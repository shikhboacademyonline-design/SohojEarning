import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Archive, Loader2 } from 'lucide-react';

import indexHtmlRaw from '../../index.html?raw';
import packageJsonRaw from '../../package.json?raw';
import viteConfigRaw from '../../vite.config.ts?raw';
import tsconfigRaw from '../../tsconfig.json?raw';
import metadataRaw from '../../metadata.json?raw';
import firebaseConfigRaw from '../../firebase-applet-config.json?raw';
import firebaseBlueprintRaw from '../../firebase-blueprint.json?raw';
import firestoreRulesRaw from '../../firestore.rules?raw';
import mainTsxRaw from '../main.tsx?raw';
import firebaseTsRaw from '../firebase.ts?raw';
import appTsxRaw from '../App.tsx?raw';
import typesTsRaw from '../types.ts?raw';
import indexCssRaw from '../index.css?raw';
import initialDataRaw from '../data/initialData.ts?raw';
import homeVideosRaw from './HomeAndVideosPages.tsx?raw';
import proofsDiscoverReferRaw from './ProofsDiscoverReferPages.tsx?raw';
import profilePageRaw from './ProfilePage.tsx?raw';
import adminPageRaw from './AdminPage.tsx?raw';
import modalsRaw from './Modals.tsx?raw';
import floatingWidgetsRaw from './FloatingWidgets.tsx?raw';

import avatarImgUrl from '../assets/images/avatar_default_user_1790610124460.jpg';
import heroImgUrl from '../assets/images/hero_digital_earning_1790610110577.jpg';
import promoImgUrl from '../assets/images/promo_video_campaign_1790610136824.jpg';

interface CodeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SourceFileEntry {
  path: string;
  content: string;
}

const README_CONTENT = `# সহজে ইনকাম (Sohoje Income) — ভেরিফাইড ডিজিটাল মাইক্রো-টাস্ক ও রিওয়ার্ড প্ল্যাটফর্ম

## GitHub Pages-এ সরাসরি লাইভ করার নিয়ম (সাদা স্ক্রিন সমস্যার সমাধানসহ):
1. ডাউনলোড করা জিপ (.ZIP) ফাইলটি আনজিপ (Unzip) করুন।
2. আপনার GitHub Repository-তে গিয়ে "Add file" -> "Upload files" এ ক্লিক করুন।
3. আনজিপ করা ফোল্ডারের ভেতরের ফাইলগুলো (বিশেষ করে index.html, app-bundle.js, app-style.css, 404.html, .nojekyll এবং বাকি ফাইলগুলো) আপলোড করে "Commit changes" দিন।
4. এরপর GitHub Repository-এর "Settings" -> "Pages" এ যান।
5. "Build and deployment" এর নিচে Source হিসেবে "Deploy from a branch" সিলেক্ট করুন এবং Branch হিসেবে "main" (এবং "/root") সিলেক্ট করে Save দিন।
6. ১-২ মিনিটের মধ্যে আপনার ওয়েবসাইটটি সাদা স্ক্রিন ছাড়াই সরাসরি লাইভ হয়ে যাবে!

## পিসি বা লোকাল সার্ভারে কোড এডিট ও রান করার নিয়ম:
1. কোড এডিট করে লোকাল সার্ভারে চালাতে চাইলে index.source.html ফাইলটির নাম পরিবর্তন করে index.html দিন।
2. টার্মিনালে কমান্ড রান করুন:
   npm install
   npm run dev
`;

const GITHUB_WORKFLOW_CONTENT = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main", "master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Prepare source index.html if present
        run: |
          if [ -f index.source.html ]; then cp index.source.html index.html; fi
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

const GITIGNORE_CONTENT = `node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
`;

const ENV_EXAMPLE_CONTENT = `GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
`;

const VERCEL_JSON_CONTENT = `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
`;

const SOURCE_FILES: SourceFileEntry[] = [
  { path: 'README.md', content: README_CONTENT },
  { path: 'index.html', content: indexHtmlRaw },
  { path: 'package.json', content: packageJsonRaw },
  { path: 'vite.config.ts', content: viteConfigRaw },
  { path: 'tsconfig.json', content: tsconfigRaw },
  { path: 'vercel.json', content: VERCEL_JSON_CONTENT },
  { path: 'metadata.json', content: metadataRaw },
  { path: '.gitignore', content: GITIGNORE_CONTENT },
  { path: '.env.example', content: ENV_EXAMPLE_CONTENT },
  { path: '.github/workflows/deploy.yml', content: GITHUB_WORKFLOW_CONTENT },
  { path: 'firebase-applet-config.json', content: firebaseConfigRaw },
  { path: 'firebase-blueprint.json', content: firebaseBlueprintRaw },
  { path: 'firestore.rules', content: firestoreRulesRaw },
  { path: 'src/main.tsx', content: mainTsxRaw },
  { path: 'src/firebase.ts', content: firebaseTsRaw },
  { path: 'src/App.tsx', content: appTsxRaw },
  { path: 'src/types.ts', content: typesTsRaw },
  { path: 'src/index.css', content: indexCssRaw },
  { path: 'src/data/initialData.ts', content: initialDataRaw },
  { path: 'src/components/HomeAndVideosPages.tsx', content: homeVideosRaw },
  { path: 'src/components/ProofsDiscoverReferPages.tsx', content: proofsDiscoverReferRaw },
  { path: 'src/components/ProfilePage.tsx', content: profilePageRaw },
  { path: 'src/components/AdminPage.tsx', content: adminPageRaw },
  { path: 'src/components/Modals.tsx', content: modalsRaw },
  { path: 'src/components/FloatingWidgets.tsx', content: floatingWidgetsRaw },
];

// Standard CRC32 calculation for ZIP format
function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Pure browser-based standard ZIP binary builder (zero external dependencies)
function buildZipBlob(entries: { path: string; data: Uint8Array }[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path);
    const data = entry.data;
    const crc = crc32(data);

    // Local file header (30 bytes + nameBytes)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 flag
    lv.setUint16(8, 0, true); // store method
    lv.setUint16(10, 0, true); // mod time
    lv.setUint16(12, 0x2100, true); // mod date
    lv.setUint32(14, crc, true); // crc32
    lv.setUint32(18, data.length, true); // compressed size
    lv.setUint32(22, data.length, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true); // filename length
    lv.setUint16(28, 0, true); // extra length
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, data);

    // Central directory file header (46 bytes + nameBytes)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0x0800, true); // UTF-8 flag
    cv.setUint16(10, 0, true); // store method
    cv.setUint16(12, 0, true); // mod time
    cv.setUint16(14, 0x2100, true); // mod date
    cv.setUint32(16, crc, true); // crc32
    cv.setUint32(20, data.length, true); // compressed size
    cv.setUint32(24, data.length, true); // uncompressed size
    cv.setUint16(28, nameBytes.length, true); // filename length
    cv.setUint16(30, 0, true); // extra length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk number
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, offset, true); // local header offset
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const cdSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // EOCD signature
  ev.setUint16(4, 0, true); // disk number
  ev.setUint16(6, 0, true); // start disk
  ev.setUint16(8, entries.length, true); // entries on disk
  ev.setUint16(10, entries.length, true); // total entries
  ev.setUint32(12, cdSize, true); // central directory size
  ev.setUint32(16, offset, true); // central directory offset
  ev.setUint16(20, 0, true); // comment length

  return new Blob([...localParts, ...centralParts, eocd], {
    type: 'application/zip',
  });
}

export const CodeDownloadModal: React.FC<CodeDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);
  const [isDownloadingSingleHtml, setIsDownloadingSingleHtml] = useState(false);

  if (!isOpen) return null;

  const currentFile = SOURCE_FILES[selectedFileIndex];

  const handleDownloadStandaloneHtml = async () => {
    try {
      setIsDownloadingSingleHtml(true);
      const res = await fetch('./github-standalone-single.html');
      if (res.ok) {
        const htmlText = await res.text();
        const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'index.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } finally {
      setIsDownloadingSingleHtml(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const encoder = new TextEncoder();
      const zipEntries: { path: string; data: Uint8Array }[] = [];

      // Check if pre-built GitHub Pages production files are available
      let githubReadyHtml: string | null = null;
      let appBundleJs: Uint8Array | null = null;
      let appStyleCss: Uint8Array | null = null;

      try {
        const [htmlRes, jsRes, cssRes] = await Promise.all([
          fetch('./github-ready-index.html'),
          fetch('./app-bundle.js'),
          fetch('./app-style.css'),
        ]);
        if (htmlRes.ok && jsRes.ok && cssRes.ok) {
          githubReadyHtml = await htmlRes.text();
          appBundleJs = new Uint8Array(await jsRes.arrayBuffer());
          appStyleCss = new Uint8Array(await cssRes.arrayBuffer());
        }
      } catch {
        // Fallback to raw source if pre-built assets aren't fetched
      }

      if (githubReadyHtml && appBundleJs && appStyleCss) {
        // Put compiled production index.html at root so GitHub Pages works immediately without a white screen!
        zipEntries.push({
          path: 'index.html',
          data: encoder.encode(githubReadyHtml),
        });
        zipEntries.push({
          path: '404.html',
          data: encoder.encode(githubReadyHtml),
        });
        zipEntries.push({
          path: '.nojekyll',
          data: new Uint8Array(0),
        });
        zipEntries.push({
          path: 'app-bundle.js',
          data: appBundleJs,
        });
        zipEntries.push({
          path: 'app-style.css',
          data: appStyleCss,
        });
        zipEntries.push({
          path: 'index.source.html',
          data: encoder.encode(indexHtmlRaw),
        });

        for (const file of SOURCE_FILES) {
          if (file.path === 'index.html') continue;
          zipEntries.push({
            path: file.path,
            data: encoder.encode(file.content),
          });
        }
      } else {
        for (const file of SOURCE_FILES) {
          zipEntries.push({
            path: file.path,
            data: encoder.encode(file.content),
          });
        }
      }

      // Also include image assets so the project builds out-of-the-box
      const imageAssets = [
        {
          path: 'src/assets/images/avatar_default_user_1790610124460.jpg',
          url: avatarImgUrl,
        },
        {
          path: 'src/assets/images/hero_digital_earning_1790610110577.jpg',
          url: heroImgUrl,
        },
        {
          path: 'src/assets/images/promo_video_campaign_1790610136824.jpg',
          url: promoImgUrl,
        },
      ];

      for (const img of imageAssets) {
        try {
          const res = await fetch(img.url);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            zipEntries.push({ path: img.path, data: new Uint8Array(buf) });
          }
        } catch {
          // Ignore image fetch errors and continue with source files
        }
      }

      const zipBlob = buildZipBlob(zipEntries);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sohoje-income-source-code.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 3500);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAllCombined = () => {
    const combined = SOURCE_FILES.map(
      (f) => `/* ==========================================\n   FILE: ${f.path}\n   ========================================== */\n\n${f.content}`
    ).join('\n\n\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadCombinedTxt = () => {
    const combined = SOURCE_FILES.map(
      (f) => `/* ==========================================\n   FILE: ${f.path}\n   ========================================== */\n\n${f.content}`
    ).join('\n\n\n');
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sohoje-income-all-source-code.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingleFile = (file: SourceFileEntry) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.path.replace(/\//g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              সহজে ইনকাম — সম্পূর্ণ সোর্স কোড ডাউনলোড সেন্টার
            </h2>
            <p className="text-xs text-slate-300">
              এক ক্লিকে সম্পূর্ণ প্রজেক্ট (.ZIP) ডাউনলোড করুন অথবা যেকোনো ফাইলের কোড কপি ও ডাউনলোড করুন
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {isGeneratingZip ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>জিপ ফাইল তৈরি হচ্ছে...</span>
                </>
              ) : zipDownloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>জিপ (.ZIP) ডাউনলোড হয়েছে!</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>সম্পূর্ণ প্রজেক্ট ডাউনলোড (.ZIP — GitHub Live রেডি)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              disabled={isDownloadingSingleHtml}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloadingSingleHtml
                  ? 'ডাউনলোড হচ্ছে...'
                  : 'GitHub ১-ফাইল লাইভ (index.html)'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCombinedTxt}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>সব কোড (.TXT)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyAllCombined}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>সবগুলো ফাইলের কোড কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>সবগুলো কোড একসাথে কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* File Explorer + Code Viewer */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left File List */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 overflow-y-auto p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 px-2 pb-1">
              প্রজেক্টের সকল ফাইলসমূহ ({SOURCE_FILES.length}টি)
            </div>
            {SOURCE_FILES.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono-num flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  selectedFileIndex === idx
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.path}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Right Code Content */}
          <div className="md:col-span-8 flex flex-col min-h-0 bg-slate-950 text-slate-100">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono-num text-emerald-400">
                {currentFile.path}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCurrent}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>এই ফাইল কপি করুন</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadSingleFile(currentFile)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs font-mono-num leading-relaxed overflow-auto flex-1 select-all">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
