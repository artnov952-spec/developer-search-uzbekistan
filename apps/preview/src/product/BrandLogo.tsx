import type { SVGProps } from 'react'

type BrandLogoProps = SVGProps<SVGSVGElement> & { compact?: boolean; tone?: 'ink'|'inverse'|'accent' }

/** Cloudplus brand lockup: cloud, rising stroke and spark. */
export function BrandLogo({ compact=false,tone='ink',className,...props }:BrandLogoProps){
 const common={role:'img','aria-label':'Cloudplus',className:`${className??''} brand-logo brand-logo--${tone}`.trim(),...props}
 return <svg viewBox={compact?'0 0 52 42':'0 0 196 42'} {...common}>
  <defs><linearGradient id="cp-gradient" x1="4" y1="38" x2="47" y2="3" gradientUnits="userSpaceOnUse"><stop stopColor="#1557D5"/><stop offset="1" stopColor="#25B7F4"/></linearGradient></defs>
  <path fill="url(#cp-gradient)" d="M8.5 35.5h27.2c7 0 12.3-4.7 12.3-11 0-5.8-4.4-10.2-10.3-10.9C35.5 7.7 30.6 4 24.5 4 16.9 4 10.8 9.7 10 17.1 4.2 18.1 1 21.8 1 26.5c0 5.1 3.2 9 7.5 9Z" opacity=".2"/>
  <path fill="none" stroke="url(#cp-gradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M8 34h28c6 0 10-4 10-9s-4-9-10-9h-1C33 10 29 7 24 7c-7 0-12 5-12 12h-2c-5 0-8 3-8 7s2 7 6 8Z"/>
  <path fill="none" stroke="url(#cp-gradient)" strokeWidth="4" strokeLinecap="round" d="M18 29c8-2 14-7 19-15"/><path fill="url(#cp-gradient)" d="m40 5 1.7 3.8L46 10.5l-4.3 1.7L40 16l-1.7-3.8-4.3-1.7 4.3-1.7L40 5Z"/>
  {!compact&&<text x="59" y="29" fill="currentColor" fontFamily="Onest,Inter,system-ui,sans-serif" fontSize="24" fontWeight="720" letterSpacing="-.8">Cloudplus</text>}
 </svg>
}
