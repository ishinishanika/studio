'use client';
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function BloodyNetLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
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
