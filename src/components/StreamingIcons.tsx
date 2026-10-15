import React from 'react';
import { StreamingPlatformId } from '../types/index.ts';

interface StreamingIconProps {
  platform: StreamingPlatformId;
  className?: string;
  size?: number;
}

export const StreamingIcon: React.FC<StreamingIconProps> = ({
  platform,
  className = '',
  size = 18,
}) => {
  switch (platform) {
    case 'netflix':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Netflix"
        >
          <path
            d="M4.5 2.5V21.5H8.5V9.5L15.5 21.5H19.5V2.5H15.5V14.5L8.5 2.5H4.5Z"
            fill="#E50914"
          />
        </svg>
      );
    case 'prime':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Prime Video"
        >
          <path
            d="M3 15.5C7.5 19 16.5 19 21 15.5M16.5 14L21 15.5L18.5 18M7.5 7.5C7.5 5 9.5 4 12 4C14.5 4 16.5 5 16.5 7.5V11C16.5 12.5 15.5 13.5 14 13.5C12.5 13.5 12 12.5 12 11"
            stroke="#00A8E1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'max':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Max"
        >
          <rect width="24" height="24" rx="5" fill="#002BE7" />
          <path
            d="M5 16V8L9 14L13 8V16M15 16L18 8H20L17 16H15Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'disney':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Disney+"
        >
          <path
            d="M4 14C4 7 10 4 15 4C18 4 20 6 20 8.5C20 12 16 13.5 12 14C8 14.5 4 17 4 19.5C4 21 6 21.5 8 21.5C13 21.5 18 18 20 16M19 8V12M17 10H21"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'appletv':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Apple TV+"
        >
          <path
            d="M18.7 13.5C18.7 10.8 20.9 9.5 21 9.4C19.7 7.6 17.7 7.3 17 7.2C15.3 7 13.6 8.2 12.7 8.2C11.8 8.2 10.4 7.2 9.1 7.2C7.3 7.2 5.7 8.2 4.8 9.8C2.9 13.1 4.3 18 6.1 20.6C7 21.9 8 23.3 9.4 23.2C10.8 23.1 11.3 22.3 12.9 22.3C14.5 22.3 15 23.2 16.5 23.2C17.9 23.2 18.8 21.9 19.7 20.6C20.7 19.1 21.1 17.7 21.2 17.6C21.1 17.5 18.7 16.6 18.7 13.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M15.5 5.5C16.3 4.5 16.8 3.1 16.6 1.7C15.4 1.8 13.9 2.5 13.1 3.5C12.4 4.3 11.8 5.7 12 7.1C13.3 7.2 14.8 6.5 15.5 5.5Z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'paramount':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Paramount+"
        >
          <path
            d="M12 2.5L3.5 19.5H8.5L12 12.5L15.5 19.5H20.5L12 2.5Z"
            fill="#0080FF"
            stroke="#38BDF8"
            strokeWidth="0.8"
          />
        </svg>
      );
    case 'mubi':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="MUBI"
        >
          <rect width="24" height="24" rx="5" fill="#064E3B" stroke="#37E885" strokeWidth="1.2" />
          <circle cx="7" cy="12" r="3" fill="#37E885" />
          <circle cx="17" cy="12" r="3" fill="#37E885" />
        </svg>
      );
    case 'globoplay':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="Globoplay"
        >
          <circle cx="12" cy="12" r="9" stroke="#FB0A25" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="4.5" fill="#FB0A25" />
        </svg>
      );
    default:
      return null;
  }
};
