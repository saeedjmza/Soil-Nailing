/**
 * DeveloperProfileSection — Standalone, Reusable Developer Identification, Contact, Support & GitHub Card
 * ========================================================================================================
 * Dependencies (only 2 standard packages):
 *   - react (>=18)
 *   - lucide-react
 * Styling:
 *   - Tailwind CSS utility classes (no external CSS file or custom config required)
 *
 * Usage (Zero-config with built-in defaults):
 *   <DeveloperProfileSection lang="fa" />
 *
 * Usage (Customized for any other project):
 *   <DeveloperProfileSection
 *     lang="en"
 *     variant="full"
 *     appVersion="2.0"
 *     developer={{
 *       name: { fa: 'نام توسعه‌دهنده', en: 'Developer Name' },
 *       role: { fa: 'توسعه‌دهنده ارشد', en: 'Lead Engineer' },
 *       degree: { fa: 'دکترای مهندسی', en: 'Ph.D. in Engineering' },
 *       affiliation: { fa: 'دانشگاه ...', en: 'University ...' },
 *       academicEmail: 'dev@university.ac.ir',
 *       personalEmail: 'dev@gmail.com',
 *       phone: '+989120000000',
 *       whatsappUrl: 'https://wa.me/989120000000',
 *     }}
 *     github={{
 *       repoUrl: 'https://github.com/username/my-project',
 *       releasesUrl: 'https://github.com/username/my-project/releases/latest',
 *     }}
 *   />
 */

import React, { useState } from 'react';
import {
  Award,
  Check,
  Coffee,
  Copy,
  ExternalLink,
  Github,
  Heart,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  ShieldCheck,
  Tag,
  UserCheck,
} from 'lucide-react';

export type DeveloperSectionLang = 'fa' | 'en';
export type DeveloperSectionVariant = 'full' | 'compact';

export interface LocalizedLabel {
  fa: string;
  en: string;
}

export interface DeveloperDonationLink {
  id: string;
  title: LocalizedLabel;
  url: string;
  theme?: 'emerald' | 'amber';
}

export interface DeveloperProfileData {
  name: LocalizedLabel;
  role: LocalizedLabel;
  degree?: LocalizedLabel;
  affiliation?: LocalizedLabel;
  academicEmail?: string;
  academicEmailLabel?: LocalizedLabel;
  personalEmail?: string;
  personalEmailLabel?: LocalizedLabel;
  phone?: string;
  whatsappUrl?: string;
}

export interface DeveloperGitHubData {
  repoUrl: string;
  releasesUrl?: string;
  badgeText?: LocalizedLabel;
  description?: LocalizedLabel;
}

export interface DeveloperProfileSectionProps {
  /** UI language ('fa' for RTL Persian, 'en' for LTR English). Default: 'fa' */
  lang?: DeveloperSectionLang;
  /** Layout density: 'full' (detailed cards + copy actions) or 'compact' (3-column summary). Default: 'full' */
  variant?: DeveloperSectionVariant;
  /** Displayed software version tag. Default: '1.0' */
  appVersion?: string;
  /** Optional custom developer profile data (falls back to built-in default profile). */
  developer?: Partial<DeveloperProfileData>;
  /** Optional custom GitHub repository / releases config. */
  github?: Partial<DeveloperGitHubData>;
  /** Optional custom financial support / donation links. */
  donations?: DeveloperDonationLink[];
  /** Custom feedback intro message above donation links. */
  feedbackMessage?: LocalizedLabel;
  /** Toggle visibility of the GitHub updates card. Default: true */
  showGitHub?: boolean;
  /** Toggle visibility of the feedback & donation support card. Default: true */
  showDonations?: boolean;
  /** Optional callback for a "Full Details" button in compact mode. */
  onOpenFullDetails?: () => void;
  /** Optional label override for the "Full Details" button. */
  fullDetailsLabel?: LocalizedLabel;
  /** Optional extra className on root wrapper. */
  className?: string;
}

export const DEFAULT_DEVELOPER_PROFILE: DeveloperProfileData = {
  role: {
    fa: 'مدیر طراحی و سرپرست علمی سامانه',
    en: 'Design Director & Lead Engineer',
  },
  name: {
    fa: 'سعید جمالی زواره',
    en: 'Saeed Jamali Zavareh',
  },
  degree: {
    fa: 'دکترای مهندسی مکانیک سنگ',
    en: 'Ph.D. in Rock Mechanics Engineering',
  },
  affiliation: {
    fa: 'عضو هیئت علمی دانشگاه تربیت مدرس',
    en: 'Faculty Member, Tarbiat Modares University',
  },
  academicEmail: 's.jamali@modares.ac.ir',
  academicEmailLabel: {
    fa: 'دانشگاه تربیت مدرس:',
    en: 'Tarbiat Modares:',
  },
  personalEmail: 'Saeed.jm.za@gmail.com',
  personalEmailLabel: {
    fa: 'ایمیل شخصی (جیمیل):',
    en: 'Personal (Gmail):',
  },
  phone: '+989124282899',
  whatsappUrl: 'https://wa.me/989124282899',
};

export const DEFAULT_DEVELOPER_GITHUB: DeveloperGitHubData = {
  repoUrl: 'https://github.com/saeedjmza/Tunnel-application',
  releasesUrl: 'https://github.com/saeedjmza/Tunnel-application/releases/latest',
  badgeText: {
    fa: 'نسخه‌های جدید APK / EXE',
    en: 'APK / EXE Releases',
  },
  description: {
    fa: 'برای دریافت جدیدترین به‌روزرسانی‌های نرم‌افزار، فایل نصب اندروید (APK) و نسخه ویندوز (EXE)، می‌توانید به صفحه رسمی گیت‌هاب برنامه مراجعه کنید:',
    en: 'Visit the official GitHub repository to download the latest Android APK, Windows EXE, and software updates:',
  },
};

export const DEFAULT_DONATION_LINKS: DeveloperDonationLink[] = [
  {
    id: 'daramet',
    title: {
      fa: 'حمایت مالی در درآمَدَت (Daramet)',
      en: 'Support Development on Daramet',
    },
    url: 'https://daramet.com/saeedjamali',
    theme: 'emerald',
  },
  {
    id: 'hamibash',
    title: {
      fa: 'حمایت از توسعه نرم‌افزار در حامی‌باش',
      en: 'Support Development on Hamibash',
    },
    url: 'https://hamibash.com/tunnelapp',
    theme: 'amber',
  },
];

const DEFAULT_FEEDBACK_MESSAGE: LocalizedLabel = {
  fa: 'توسعه‌دهندگان آماده شنیدن انتقادات و پیشنهادات شما هستند. در صورت رضایت از برنامه و علاقه به توسعه نرم‌افزارهای بیشتر می‌توانید از ما حمایت کنید:',
  en: 'The developers welcome your constructive feedback and suggestions. If you find this software helpful and wish to support further development, you can support us at:',
};

/** Inline WhatsApp glyph to guarantee zero dependency on external icon files. */
const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5.016l-1.406 5.156 5.281-1.391c1.484.813 3.141 1.234 4.75 1.234 5.516 0 9.969-4.453 9.969-9.969 0-2.656-1.031-5.156-2.922-7.047C17.188 3.031 14.688 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.344-1.75-.656-3.063-1.328-5.063-4.422-5.219-4.625-.156-.203-1.25-1.656-1.25-3.156 0-1.5.781-2.234 1.063-2.547.281-.313.609-.391.813-.391.203 0 .406 0 .578.016.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.156.344-.313.531-.156.188-.328.406-.469.547-.156.156-.328.328-.141.641.188.313.844 1.391 1.813 2.25 1.25 1.109 2.297 1.453 2.609 1.609.313.156.5.125.688-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
  </svg>
);

const copyTextSafe = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }
  try {
    if (typeof document !== 'undefined') {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    }
  } catch {
    return false;
  }
  return false;
};

const toPersianDigits = (input: string): string =>
  input.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d);

export const DeveloperProfileSection: React.FC<DeveloperProfileSectionProps> = ({
  lang = 'fa',
  variant = 'full',
  appVersion = '1.0',
  developer: developerOverride,
  github: githubOverride,
  donations = DEFAULT_DONATION_LINKS,
  feedbackMessage = DEFAULT_FEEDBACK_MESSAGE,
  showGitHub = true,
  showDonations = true,
  onOpenFullDetails,
  fullDetailsLabel,
  className = '',
}) => {
  const isFa = lang === 'fa';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const dev: DeveloperProfileData = {
    ...DEFAULT_DEVELOPER_PROFILE,
    ...developerOverride,
    role: developerOverride?.role ?? DEFAULT_DEVELOPER_PROFILE.role,
    name: developerOverride?.name ?? DEFAULT_DEVELOPER_PROFILE.name,
    degree: developerOverride?.degree ?? DEFAULT_DEVELOPER_PROFILE.degree,
    affiliation: developerOverride?.affiliation ?? DEFAULT_DEVELOPER_PROFILE.affiliation,
    academicEmailLabel:
      developerOverride?.academicEmailLabel ?? DEFAULT_DEVELOPER_PROFILE.academicEmailLabel,
    personalEmailLabel:
      developerOverride?.personalEmailLabel ?? DEFAULT_DEVELOPER_PROFILE.personalEmailLabel,
  };

  const gh: DeveloperGitHubData = {
    ...DEFAULT_DEVELOPER_GITHUB,
    ...githubOverride,
    badgeText: githubOverride?.badgeText ?? DEFAULT_DEVELOPER_GITHUB.badgeText,
    description: githubOverride?.description ?? DEFAULT_DEVELOPER_GITHUB.description,
  };

  const versionDisplay = isFa ? `ورژن ${toPersianDigits(appVersion)}` : `Version ${appVersion}`;
  const releaseDisplay = isFa ? `نگارش رسمی ${toPersianDigits(appVersion)}` : `Release v${appVersion}`;

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyTextSafe(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    }
  };

  const renderDonationCard = (compact: boolean) => {
    if (!showDonations || donations.length === 0) return null;

    return (
      <div
        className={
          compact
            ? 'p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-slate-200 text-xs space-y-2.5'
            : 'p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 space-y-3'
        }
      >
        <div className="flex items-start gap-2.5 text-slate-200">
          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className={compact ? 'text-[11px] leading-relaxed' : 'text-[11.5px] leading-relaxed'}>
            {isFa ? feedbackMessage.fa : feedbackMessage.en}
          </p>
        </div>

        <div
          className={
            compact
              ? 'space-y-1.5 pt-1 border-t border-amber-500/20'
              : 'space-y-2 pt-1 border-t border-amber-500/20'
          }
        >
          {donations.map((item) => {
            const isEmerald = item.theme !== 'amber';
            const cardBorder = isEmerald
              ? compact
                ? 'border-emerald-500/25'
                : 'border-emerald-500/30 hover:border-emerald-500/50'
              : compact
                ? 'border-amber-500/25'
                : 'border-amber-500/30 hover:border-amber-500/50';
            const buttonGradient = isEmerald
              ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
              : 'from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-500/20';
            const linkTextClass = isEmerald ? 'text-emerald-300' : 'text-amber-300/90';

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 ${
                  compact ? 'rounded-md' : 'rounded-lg'
                } bg-slate-900/60 border ${cardBorder} transition-colors`}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-${compact ? '1.5' : '2'} ${
                    compact ? 'px-2.5 py-1 rounded-md text-[11px] shadow-sm' : 'px-3 py-1.5 rounded-lg text-xs shadow-md'
                  } bg-gradient-to-r ${buttonGradient} text-white font-bold transition-all cursor-pointer shrink-0`}
                >
                  {isEmerald ? (
                    <Coffee className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-100 shrink-0`} />
                  ) : (
                    <Heart
                      className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-current text-white animate-pulse shrink-0`}
                    />
                  )}
                  <span>{isFa ? item.title.fa : item.title.en}</span>
                  <ExternalLink
                    className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${
                      isEmerald ? 'text-emerald-100' : 'text-amber-100'
                    } shrink-0`}
                  />
                </a>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono ${
                    compact ? 'text-[10.5px] sm:text-left' : 'text-[11px] sm:text-end'
                  } ${linkTextClass} hover:underline select-all break-all text-center`}
                  dir="ltr"
                >
                  {item.url}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGitHubCard = (compact: boolean) => {
    if (!showGitHub || !gh.repoUrl) return null;
    const releasesHref = gh.releasesUrl || `${gh.repoUrl.replace(/\/+$/, '')}/releases/latest`;

    return (
      <div
        className={
          compact
            ? 'p-3 rounded-lg bg-slate-950/85 border border-cyan-500/35 space-y-2'
            : 'p-3.5 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-2.5'
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className={`flex items-center gap-2 font-bold text-xs ${
              compact ? 'text-cyan-300' : 'text-slate-100'
            }`}
          >
            <Github
              className={`w-4 h-4 shrink-0 ${compact ? 'text-cyan-400' : 'text-slate-200'}`}
            />
            <span>
              {isFa
                ? 'مخزن رسمی GitHub و دریافت آخرین آپدیت‌ها'
                : 'Official GitHub Repository & Updates'}
            </span>
          </div>
          {gh.badgeText && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                compact
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              {!compact && <RefreshCw className="w-3 h-3 shrink-0" />}
              <span>{isFa ? gh.badgeText.fa : gh.badgeText.en}</span>
            </span>
          )}
        </div>

        {gh.description && (
          <p
            className={`text-[11px] leading-relaxed ${
              compact ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            {isFa ? gh.description.fa : gh.description.en}
          </p>
        )}

        <div
          className={`flex flex-col sm:flex-row ${
            compact ? 'items-stretch sm:items-center bg-slate-900/90' : 'sm:items-center bg-slate-900'
          } justify-between gap-2 p-2 rounded-lg border border-slate-800`}
        >
          <a
            href={gh.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-mono text-[11px] ${
              compact ? 'text-cyan-300 hover:text-cyan-200 min-w-0 flex-1' : 'text-sky-300'
            } hover:underline break-all select-all`}
            dir="ltr"
          >
            {gh.repoUrl}
          </a>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(gh.repoUrl, 'github')}
              className={`${
                compact
                  ? 'px-2.5 py-1 rounded-md text-[10.5px]'
                  : 'px-2.5 py-1.5 rounded-lg text-[11px]'
              } bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors`}
            >
              {copiedKey === 'github' ? (
                <Check className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-400`} />
              ) : (
                <Copy className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
              )}
              <span>
                {copiedKey === 'github'
                  ? isFa
                    ? 'کپی شد'
                    : 'Copied'
                  : isFa
                    ? 'کپی لینک'
                    : 'Copy'}
              </span>
            </button>
            <a
              href={releasesHref}
              target="_blank"
              rel="noopener noreferrer"
              className={
                compact
                  ? 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10.5px] transition-colors'
                  : 'px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors'
              }
            >
              {compact ? (
                <RefreshCw className="w-3 h-3 shrink-0" />
              ) : (
                <Github className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>
                {compact
                  ? isFa
                    ? 'دریافت آخرین آپدیت'
                    : 'Latest Updates'
                  : isFa
                    ? 'دریافت آپدیت (Releases)'
                    : 'Releases'}
              </span>
              <ExternalLink className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} shrink-0`} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <section
        dir={isFa ? 'rtl' : 'ltr'}
        className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 space-y-3 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-bold text-slate-100 text-xs sm:text-sm">
              {isFa
                ? 'مشخصات تولیدکنندگان و شناسنامه سامانه:'
                : 'System Development & Design Specifications:'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30 shrink-0">
              <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{versionDisplay}</span>
            </span>
            {onOpenFullDetails && (
              <button
                type="button"
                onClick={onOpenFullDetails}
                className="text-[11px] text-indigo-300 hover:text-white underline cursor-pointer"
              >
                {fullDetailsLabel
                  ? isFa
                    ? fullDetailsLabel.fa
                    : fullDetailsLabel.en
                  : isFa
                    ? 'مشاهده شناسنامه کامل'
                    : 'Full Details'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          {/* Identity Card */}
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-0.5 min-w-0">
            <div className="text-slate-400 text-[10px]">
              {isFa ? 'مدیر طراحی:' : 'Design Director:'}
            </div>
            <div className="font-bold text-slate-100">{isFa ? dev.name.fa : dev.name.en}</div>
            {dev.degree && (
              <div className="text-amber-400 font-medium text-[10px]">
                {isFa ? dev.degree.fa : dev.degree.en}
              </div>
            )}
            {dev.affiliation && (
              <div className="text-sky-300 font-semibold text-[10px]">
                {isFa ? dev.affiliation.fa : dev.affiliation.en}
              </div>
            )}
          </div>

          {/* Emails Card */}
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 min-w-0">
            <div className="text-slate-400 text-[10px]">
              {isFa ? 'پست الکترونیک:' : 'Email Addresses:'}
            </div>
            {dev.academicEmail && (
              <a
                href={`mailto:${dev.academicEmail}`}
                className="font-mono text-sky-300 hover:text-sky-200 hover:underline block break-all font-semibold"
                dir="ltr"
                title={isFa ? dev.academicEmailLabel?.fa : dev.academicEmailLabel?.en}
              >
                {dev.academicEmail}
              </a>
            )}
            {dev.personalEmail && (
              <a
                href={`mailto:${dev.personalEmail}`}
                className="font-mono text-slate-300 hover:text-blue-300 hover:underline block break-all text-[10px]"
                dir="ltr"
              >
                {dev.personalEmail}
              </a>
            )}
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 min-w-0">
            <div className="text-slate-400 text-[10px]">
              {isFa ? 'تلفن تماس و پیام‌رسان:' : 'Phone & Messaging:'}
            </div>
            {dev.phone && (
              <a
                href={`tel:${dev.phone}`}
                className="font-mono text-emerald-400 hover:underline font-bold block"
                dir="ltr"
              >
                {dev.phone}
              </a>
            )}
            {dev.whatsappUrl && (
              <a
                href={dev.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold text-[10.5px] transition-colors"
              >
                <WhatsAppGlyph className="w-3 h-3 text-[#25D366] shrink-0" />
                <span>{isFa ? 'پیام در واتس‌اپ' : 'Chat on WhatsApp'}</span>
              </a>
            )}
          </div>
        </div>

        {renderGitHubCard(true)}
        {renderDonationCard(true)}
      </section>
    );
  }

  return (
    <section
      dir={isFa ? 'rtl' : 'ltr'}
      className={`p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3.5 sm:space-y-4 shadow-xl ${className}`}
    >
      {/* Developer Lead Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-900/40 pb-3.5 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-indigo-300 font-medium">
              {isFa ? dev.role.fa : dev.role.en}
            </div>
            <h4 className="text-base font-black text-slate-100 mt-0.5">
              {isFa ? dev.name.fa : dev.name.en}
            </h4>
            {dev.degree && (
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                {isFa ? dev.degree.fa : dev.degree.en}
              </p>
            )}
            {dev.affiliation && (
              <p className="text-[11.5px] text-sky-300 font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>{isFa ? dev.affiliation.fa : dev.affiliation.en}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{releaseDisplay}</span>
          </span>
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Email Card */}
        {(dev.academicEmail || dev.personalEmail) && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {isFa ? 'پست الکترونیک' : 'Email Addresses'}
              </div>
            </div>

            {dev.academicEmail && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/70 border border-sky-500/30 min-w-0">
                <div className="min-w-0 flex-1">
                  {dev.academicEmailLabel && (
                    <div className="text-[9.5px] text-sky-400 font-medium">
                      {isFa ? dev.academicEmailLabel.fa : dev.academicEmailLabel.en}
                    </div>
                  )}
                  <a
                    href={`mailto:${dev.academicEmail}`}
                    className="text-xs font-mono text-sky-200 hover:text-sky-100 transition-colors break-all block font-semibold"
                    dir="ltr"
                  >
                    {dev.academicEmail}
                  </a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(dev.academicEmail!, 'academicEmail')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isFa ? 'کپی ایمیل دانشگاهی' : 'Copy Academic Email'}
                  >
                    {copiedKey === 'academicEmail' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`mailto:${dev.academicEmail}`}
                    className="p-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 transition-colors cursor-pointer"
                    title={isFa ? 'ارسال ایمیل' : 'Send Email'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {dev.personalEmail && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800 min-w-0">
                <div className="min-w-0 flex-1">
                  {dev.personalEmailLabel && (
                    <div className="text-[9.5px] text-slate-400 font-medium">
                      {isFa ? dev.personalEmailLabel.fa : dev.personalEmailLabel.en}
                    </div>
                  )}
                  <a
                    href={`mailto:${dev.personalEmail}`}
                    className="text-xs font-mono text-slate-300 hover:text-blue-300 transition-colors break-all block"
                    dir="ltr"
                  >
                    {dev.personalEmail}
                  </a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(dev.personalEmail!, 'personalEmail')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isFa ? 'کپی ایمیل' : 'Copy Email'}
                  >
                    {copiedKey === 'personalEmail' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`mailto:${dev.personalEmail}`}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition-colors cursor-pointer"
                    title={isFa ? 'ارسال ایمیل' : 'Send Email'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phone & WhatsApp Card */}
        {(dev.phone || dev.whatsappUrl) && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {isFa ? 'تلفن تماس و پیام‌رسان' : 'Direct Phone & Messaging'}
              </div>
            </div>

            {dev.phone && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="min-w-0">
                  <div className="text-[9.5px] text-slate-400 font-medium">
                    {isFa ? 'شماره تماس مستقیم:' : 'Phone Call:'}
                  </div>
                  <a
                    href={`tel:${dev.phone}`}
                    className="text-xs font-mono text-emerald-300 hover:text-emerald-200 font-bold block"
                    dir="ltr"
                  >
                    {dev.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(dev.phone!, 'phone')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={isFa ? 'کپی شماره' : 'Copy Phone'}
                  >
                    {copiedKey === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`tel:${dev.phone}`}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 transition-colors cursor-pointer"
                    title={isFa ? 'تماس' : 'Call'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {dev.whatsappUrl && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <WhatsAppGlyph className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] text-emerald-300 font-medium">
                      {isFa ? 'ارتباط مستقیم در واتس‌اپ:' : 'WhatsApp Chat:'}
                    </div>
                    {dev.phone && (
                      <span className="text-[11px] font-mono text-slate-300 truncate block" dir="ltr">
                        {dev.phone}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={dev.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all hover:scale-[1.03] cursor-pointer shrink-0"
                  title={isFa ? 'ارسال پیام در واتس‌اپ' : 'Chat on WhatsApp'}
                >
                  <WhatsAppGlyph className="w-3.5 h-3.5" />
                  <span>{isFa ? 'واتس‌اپ' : 'WhatsApp'}</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {renderDonationCard(false)}
      {renderGitHubCard(false)}
    </section>
  );
};

export default DeveloperProfileSection;
