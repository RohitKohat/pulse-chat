import React from 'react';
import type { UserStatus } from '../../types/chat';
import { cn } from '../../utils/cn';

interface AvatarProps {
  src: string;
  alt: string;
  status?: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  isGroup?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  status,
  size = 'md',
  isGroup = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  }[size];

  const statusColor = {
    online: 'bg-emerald-500',
    away: 'bg-amber-400',
    offline: 'bg-slate-400',
  }[status || 'offline'];

  return (
    <div className="relative inline-flex shrink-0">
      <img
        src={src}
        alt={alt}
        className={cn(
          sizeClasses,
          isGroup ? 'rounded-xl' : 'rounded-full',
          'object-cover ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800'
        )}
      />
      {status && !isGroup && (
        <span
          title={`Status: ${status}`}
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900',
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3',
            statusColor
          )}
        />
      )}
    </div>
  );
};