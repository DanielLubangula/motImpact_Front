import React from 'react';

interface MessageNotificationBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MessageNotificationBadge({ 
  count, 
  className = '', 
  size = 'md' 
}: MessageNotificationBadgeProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <span 
      className={`
        ${sizeClasses[size]}
        bg-red-500 text-white 
        rounded-full 
        flex items-center justify-center 
        font-bold 
        animate-pulse
        ${className}
      `}
      title={`${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`}
    >
      {displayCount}
    </span>
  );
}