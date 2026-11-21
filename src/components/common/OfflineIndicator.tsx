import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface Props {
  isFa: boolean;
}

export const OfflineIndicator: React.FC<Props> = ({ isFa }) => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      className="bg-amber-950/90 border-b border-amber-500/40 px-3 py-1.5 text-[11px] text-amber-200 flex items-center justify-center gap-2 select-none"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>
        {isFa
          ? 'حالت آفلاین فعال است — کلیه محاسبات LRFD، نقشه‌های CAD و ذخیره فایل *.SNDA بدون نیاز به اینترنت در دسترس هستند.'
          : 'Offline Mode Active — All LRFD calculations, CAD sections & *.SNDA file saves work locally.'}
      </span>
    </div>
  );
};
