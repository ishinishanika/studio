'use client';
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function BloodyNetLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}


export function BloodDropEmotionIcon({ isEligible, ...props }: SVGProps<SVGSVGElement> & { isEligible: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
      className={cn("animate-blood-drop-bounce", props.className)}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <g transform="translate(0, 2) rotate(180 12 10)">
        {isEligible ? (
          <>
            {/* Happy Face (Upward Curve) */}
            <circle cx="9.5" cy="9" r="1" fill="white" />
            <circle cx="14.5" cy="9" r="1" fill="white" />
            <path
              d="M9.5 13c.5-1.5 4.5-1.5 5 0"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Sad Face (Downward Curve) */}
            <circle cx="9.5" cy="9" r="1" fill="white" />
            <circle cx="14.5" cy="9" r="1" fill="white" />
            <path
              d="M9.5 14a5 5 0 0 0 5 0"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </g>
    </svg>
  );
}
