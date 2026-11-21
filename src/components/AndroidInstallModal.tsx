import React, { useState } from 'react';
import { AppLogo } from './common/AppLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  WifiOff,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types/nailing';

export const OFFICIAL_ANDROID_URL =
  'https://ais-pre-ngd2bk2rvmsm7bvtk2evdd-655471265608.europe-west2.run.app';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<'install' | 'apk' | 'features'>('install');
  const [copied, setCopied] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(OFFICIAL_ANDROID_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    await install();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        dir={isFa ? 'rtl' : 'ltr'}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-200 text-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <AppLogo size="md" className="shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex flex-wrap items-center gap-2">
                <span>{isFa ? 'اپلیکیشن اندروید و نصب موبایل (WebAPK)' : 'Android App & Mobile Installation'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                  Android 6 - 15 / iOS
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isFa
                  ? 'نصب مستقیم روی گوشی به صورت اپلیکیشن مستقل و ۱۰۰٪ آفلاین در کارگاه‌های گودبرداری'
                  : 'Install as a standalone 100% offline mobile app on construction & excavation sites'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isFa ? 'بستن' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/50 px-4 pt-2 gap-1.5 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'install'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isFa ? 'نصب سریع روی گوشی (پیشنهادی)' : 'Quick Mobile Install'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-slate-900 text-cyan-400 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isFa ? 'تولید فایل *.APK (PWABuilder)' : 'Signed *.APK Package'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition flex items-center gap-1.5 border-t-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'features'
                ? 'bg-slate-900 text-amber-400 border-amber-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFa ? 'قابلیت‌های آفلاین کارگاهی' : 'Offline Field Specs'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Direct 1-click install banner when browser fires beforeinstallprompt */}
              {isInstallable && !isInstalled && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-300 text-sm block">
                      {isFa ? 'دستگاه شما آماده نصب مستقیم است!' : 'Ready for Direct 1-Click Install!'}
                    </span>
                    <p className="text-slate-300 text-xs">
                      {isFa
                        ? 'با لمس دکمه زیر، برنامه مستقیماً در صفحه اصلی و لیست برنامه‌های دستگاه شما نصب می‌شود.'
                        : 'Tap the button to install immediately with custom icon and offline support.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isFa ? 'نصب فوری اپلیکیشن' : 'Install App Now'}</span>
                  </button>
                </div>
              )}

              {isInstalled && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    {isFa
                      ? 'برنامه هم‌اکنون به عنوان اپلیکیشن مستقل روی دستگاه شما نصب و فعال است.'
                      : 'App is currently installed and running in standalone mode.'}
                  </span>
                </div>
              )}

              {/* QR Code + Official Android WebAPK Link */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {!qrFailed ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=0f172a&color=f8fafc&data=${encodeURIComponent(OFFICIAL_ANDROID_URL)}`}
                      alt="Android App QR Code"
                      className="w-32 h-32 rounded-lg border border-slate-700"
                      onError={() => setQrFailed(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-lg border border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-2 text-center gap-1">
                      <QrCode className="w-8 h-8 text-amber-400" />
                      <span className="text-[10px]">
                        {isFa ? 'لینک را کپی و در گوشی باز کنید' : 'Copy link below'}
                      </span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-2 font-medium text-center">
                    {isFa ? 'اسکن با دوربین گوشی اندروید' : 'Scan with phone camera'}
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-3">
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>{isFa ? 'آدرس رسمی نصب اپلیکیشن اندروید:' : 'Official Live Android Installation URL:'}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800" dir="ltr">
                    <code className="text-[11px] text-sky-300 truncate flex-1 select-all">
                      {OFFICIAL_ANDROID_URL}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی لینک' : 'Copy')}</span>
                    </button>
                  </div>

                  <ol className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed list-decimal list-inside">
                    <li>
                      {isFa
                        ? 'لینک بالا را در مرورگر Google Chrome یا Samsung Internet گوشی باز کنید (یا QR را اسکن کنید).'
                        : 'Open the URL above in Google Chrome or Samsung Internet on Android.'}
                    </li>
                    <li>
                      {isFa
                        ? 'منوی سه‌نقطه (⋮) را لمس کرده و گزینه «Install app / نصب برنامه» یا «Add to Home screen» را انتخاب کنید.'
                        : 'Tap the menu (⋮) and choose "Install app" or "Add to Home screen".'}
                    </li>
                    <li>
                      {isFa
                        ? 'سیستم‌عامل اندروید در ۵ ثانیه یک WebAPK اختصاصی با آیکون مهندسی نیلینگ می‌سازد و در کشوی برنامه‌ها نصب می‌کند.'
                        : 'Android installs a standalone native WebAPK with custom icon and offline engine.'}
                    </li>
                    {isIOS && (
                      <li className="text-amber-300">
                        {isFa
                          ? 'کاربران آیفون (Safari): دکمه Share را بزنید و گزینه Add to Home Screen را انتخاب کنید.'
                          : 'iOS Safari: Tap Share -> Add to Home Screen.'}
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      {isFa ? 'تولید رایگان و مستقیم فایل *.APK با Microsoft PWABuilder' : 'Generate Free Signed APK with PWABuilder'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                    Cloud APK
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isFa
                    ? 'اگر برای ارسال به همکاران، کارگاه یا آرشیو نرم‌افزاری به فایل فیزیکی امضاشده با پسوند *.apk نیاز دارید، سامانه رسمی Microsoft PWABuilder ظرف ۳۰ ثانیه بدون نیاز به Android Studio فایل APK اختصاصی این برنامه را می‌سازد:'
                    : 'Microsoft PWABuilder packages this verified PWA into a signed standalone Android APK in 30 seconds with zero local SDKs required:'}
                </p>
                <a
                  href={`https://www.pwabuilder.com/?url=${encodeURIComponent(OFFICIAL_ANDROID_URL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isFa ? 'ورود به PWABuilder و دانلود فایل APK' : 'Open PWABuilder & Package APK'}</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <div className="font-bold text-amber-300">
                  {isFa ? 'فایل راهنمای سریع ویندوز: build-apk.bat' : 'Desktop Helper Script: build-apk.bat'}
                </div>
                <p className="text-slate-400">
                  {isFa
                    ? 'در پوشه اصلی سورس پروژه، اسکریپت build-apk.bat و مستندات README_ANDROID_APP.md برای راهنمایی نصب مستقیم و دریافت خروجی APK قرار داده شده‌اند.'
                    : 'Use build-apk.bat and README_ANDROID_APP.md in the project root for automated APK packaging instructions.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <WifiOff className="w-4 h-4" />
                  <span>{isFa ? 'کارکرد ۱۰۰٪ آفلاین در گودبرداری' : '100% Offline in Excavation Pits'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa
                    ? 'کلیه جداول مقاومت پیوستگی qu، روابط LRFD آیین‌نامه AASHTO و FHWA، فونت‌ها و نقشه‌های CAD در کش گوشی ذخیره شده و بدون اینترنت کار می‌کنند.'
                    : 'All AASHTO/FHWA equations, bond tables, fonts, and interactive CAD drawings run seamlessly without cellular signal.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>{isFa ? 'طراحی ارگونومیک لمسی و تمام‌صفحه' : 'Thumb-Friendly Standalone Mobile UI'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa
                    ? 'دارای نوار ناوبری پایین صفحه اختصاصی موبایل، دکمه‌های لمسی استاندارد (≥44px) و نمایشگر تمام‌صفحه بدون نوار آدرس مرورگر.'
                    : 'Features dedicated mobile bottom tab navigation, ≥44px touch targets, and full-screen standalone launch.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isFa ? 'به‌روزرسانی خودکار در پس‌زمینه' : 'Background Auto-Update'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa
                    ? 'به محض دسترسی به اینترنت، نسخه جدید موتور محاسباتی و امکانات بدون نیاز به نصب مجدد به صورت خودکار دریافت می‌شود.'
                    : 'Service worker silently caches updated releases whenever connectivity returns.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>{isFa ? 'تبادل مستقیم فایل *.SNDA با ویندوز' : 'Cross-Platform *.SNDA Files'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa
                    ? 'پروژه‌های ذخیره‌شده با فرمت *.SNDA در نسخه ویندوز عیناً در موبایل اندروید باز و ویرایش شده و گزارش PDF تولید می‌کنند.'
                    : 'Open, inspect, edit, and generate official PDF booklets from *.SNDA files created on Windows.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isFa ? 'سازگار با Android 6.0 تا 15+ و آیفون' : 'Compatible with Android 6.0 to 15+ & iOS'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
