'use client';

import React from 'react';
import { captureEvent } from '@/utils/telemetry';

interface TrackedDownloadLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  platform: 'macos' | 'windows' | 'linux' | 'android' | 'ios' | 'web' | 'all';
  format?: string;
  channel?: 'github' | 'app_store' | 'play_store' | 'direct';
  children: React.ReactNode;
}

export function TrackedDownloadLink({
  platform,
  format,
  channel = 'direct',
  href,
  children,
  onClick,
  ...rest
}: TrackedDownloadLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    captureEvent('yomi_download_clicked', {
      platform,
      format,
      channel,
      target_url: href,
    });
    if (onClick) onClick(e);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
