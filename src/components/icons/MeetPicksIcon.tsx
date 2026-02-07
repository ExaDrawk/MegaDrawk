import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * MeetPicks service icon.
 *
 * Uses a unique gradient ID ('meetpicks-grad') to prevent SVG ID collisions
 * when multiple SVG icons are rendered on the same page.
 *
 * The component is purely presentational; parent should set aria-hidden
 * or an appropriate aria-label depending on context.
 */
export const MeetPicksIcon: React.FC<IconProps> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        role="img"
        aria-label="MeetPicks"
        {...props}
    >
        <defs>
            <linearGradient id="meetpicks-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="white" />
        <rect width="90" height="90" x="5" y="5" rx="20" fill="url(#meetpicks-grad)" />
        <path
            d="M25 65V35l25 25 25-25v30"
            stroke="white"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M40 75h20"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
        />
    </svg>
);
