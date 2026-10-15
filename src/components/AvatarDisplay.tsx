import React, { useState } from 'react';

export const AVATAR_SVGS: Record<string, string> = {
  'apple-aurora': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: radial-gradient(circle at 20% 20%, #A855F7 0%, #3B82F6 50%, #06B6D4 100%)"><circle cx="75" cy="25" r="18" fill="rgba(255,255,255,0.25)" filter="blur(8px)"/><path d="M 15 85 Q 50 45 85 85" stroke="rgba(255,255,255,0.35)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  'apple-sunset': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: radial-gradient(circle at 80% 20%, #F59E0B 0%, #EC4899 50%, #7C3AED 100%)"><circle cx="30" cy="70" r="22" fill="rgba(255,255,255,0.22)" filter="blur(6px)"/><circle cx="70" cy="30" r="12" fill="rgba(255,255,255,0.3)"/></svg>`,
  'apple-cyber': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #D946EF 100%)"><polygon points="50,22 80,78 20,78" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3.5"/><circle cx="50" cy="55" r="8" fill="#FFFFFF"/></svg>`,
  'apple-emerald': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #10B981 0%, #047857 50%, #064E3B 100%)"><circle cx="50" cy="50" r="26" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/><circle cx="50" cy="50" r="13" fill="rgba(255,255,255,0.35)"/></svg>`,
  'apple-midnight': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 70%, #020617 100%)"><path d="M 50 20 A 30 30 0 1 0 80 50 A 24 24 0 1 1 50 20 Z" fill="#FCD34D" opacity="0.9"/></svg>`,
  'apple-gold': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #78350F 100%)"><polygon points="50,20 58,38 78,38 62,50 68,70 50,58 32,70 38,50 22,38 42,38" fill="#FEF08A"/><circle cx="50" cy="50" r="7" fill="#B45309"/></svg>`,
  'netflix-red': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #E50914 0%, #99060D 100%)"><circle cx="32" cy="40" r="6" fill="#FFFFFF"/><circle cx="68" cy="40" r="6" fill="#FFFFFF"/><path d="M 32 62 Q 50 78 68 62" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`,
  'aviator-glasses': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #1E3A5F 0%, #112233 100%)"><path d="M 15 20 Q 50 10 85 20 L 85 30 Q 50 25 15 30 Z" fill="#14181F"/><rect x="18" y="36" width="28" height="22" rx="6" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/><rect x="54" y="36" width="28" height="22" rx="6" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/><line x1="46" y1="44" x2="54" y2="44" stroke="#CA8A04" stroke-width="3"/></svg>`,
  'cine-glasses': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #1E3A5F 0%, #112233 100%)"><path d="M 15 20 Q 50 10 85 20 L 85 30 Q 50 25 15 30 Z" fill="#14181F"/><rect x="18" y="36" width="28" height="22" rx="6" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/><rect x="54" y="36" width="28" height="22" rx="6" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/><line x1="46" y1="44" x2="54" y2="44" stroke="#CA8A04" stroke-width="3"/></svg>`,
  'crown-emerald': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #059669 0%, #064E3B 100%)"><polygon points="25,65 30,35 45,50 50,25 55,50 70,35 75,65" fill="#FBBF24" stroke="#D97706" stroke-width="2"/><circle cx="50" cy="22" r="4" fill="#FDE68A"/></svg>`,
  'director-violet': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)"><rect x="22" y="38" width="56" height="42" rx="4" fill="#1E1B4B" stroke="#A78BFA" stroke-width="2"/><polygon points="46,50 46,68 62,59" fill="#A78BFA"/></svg>`,
  'cine-clapper': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #18181B 0%, #09090B 100%)"><rect x="22" y="38" width="56" height="42" rx="6" fill="#27272A" stroke="#71717A" stroke-width="2"/><path d="M 22 38 L 78 38 L 78 26 L 22 26 Z" fill="#3F3F46"/><line x1="32" y1="26" x2="40" y2="38" stroke="#FFFFFF" stroke-width="3"/><line x1="50" y1="26" x2="58" y2="38" stroke="#FFFFFF" stroke-width="3"/><line x1="68" y1="26" x2="76" y2="38" stroke="#FFFFFF" stroke-width="3"/><polygon points="46,50 46,68 62,59" fill="#A855F7"/></svg>`,
  'cine-popcorn': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #991B1B 0%, #450A0A 100%)"><circle cx="40" cy="34" r="10" fill="#FDE047"/><circle cx="60" cy="34" r="10" fill="#FDE047"/><circle cx="50" cy="28" r="11" fill="#FEF08A"/><polygon points="30,44 70,44 64,82 36,82" fill="#DC2626"/><polygon points="40,44 46,44 44,82 38,82" fill="#FFFFFF"/><polygon points="54,44 60,44 58,82 52,82" fill="#FFFFFF"/></svg>`,
  'popcorn-amber': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #D97706 0%, #78350F 100%)"><circle cx="42" cy="35" r="9" fill="#FDE047"/><polygon points="32,44 68,44 63,80 37,80" fill="#DC2626"/></svg>`,
  'cine-ticket': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background: linear-gradient(135deg, #831843 0%, #500724 100%)"><rect x="22" y="30" width="56" height="40" rx="6" fill="#BE185D" stroke="#F472B6" stroke-width="2"/><circle cx="22" cy="50" r="6" fill="#500724"/><circle cx="78" cy="50" r="6" fill="#500724"/><line x1="50" y1="32" x2="50" y2="68" stroke="#FBCFE8" stroke-width="2" stroke-dasharray="3,3"/><text x="36" y="54" font-size="12" fill="#FFF" font-family="sans-serif" font-weight="bold">VIP</text></svg>`,
  'cosmic-star': `<svg viewBox="0 0 100 100" class="w-full h-full" style="background:linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)"><polygon points="50,22 57,38 74,38 60,49 65,66 50,56 35,66 40,49 26,38 43,38" fill="#FBBF24"/></svg>`,
};

interface AvatarDisplayProps {
  avatar?: string;
  name?: string;
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar = 'netflix-red',
  name = 'Avatar',
  className = 'w-full h-full',
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  // 1. Predefined vector SVG preset
  if (avatar && AVATAR_SVGS[avatar]) {
    return (
      <div
        className={`w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
        dangerouslySetInnerHTML={{ __html: AVATAR_SVGS[avatar] }}
        aria-label={name}
      />
    );
  }

  // 2. Custom photo or local mascot image
  const imageSrc = hasError || !avatar ? '/imgs/icon.png' : avatar;

  return (
    <img
      src={imageSrc}
      alt={name}
      className={`w-full h-full object-cover ${className}`}
      onError={() => {
        if (!hasError) setHasError(true);
      }}
      loading="lazy"
    />
  );
};
