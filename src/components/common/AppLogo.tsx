import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: string;
  showBorder?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  rounded = 'rounded-xl',
  showBorder = true,
}) => {
  const sizeClass = sizeMap[size];
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 select-none shadow-md bg-slate-900 ${sizeClass} ${rounded} ${
        showBorder ? 'border border-amber-500/35 ring-1 ring-slate-800' : ''
      } ${className}`}
    >
      <img
        src="/app-icon.png"
        alt="Soil Nail Design Suite Logo"
        className="w-full h-full object-cover object-center"
        loading="eager"
        onError={(e) => {
          if (e.currentTarget.getAttribute('data-tried') !== 'true') {
            e.currentTarget.setAttribute('data-tried', 'true');
            e.currentTarget.src = './app-icon.png';
          }
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
