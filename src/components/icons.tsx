'use client';
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function LifeFlowLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1.11 11.16c-1.3-.5-2.71-.13-3.51.9l-1.48 1.88c-.18.23-.01.55.26.55h11.7c.28 0 .44-.31.26-.55l-1.48-1.88c-.8-1.03-2.21-1.4-3.51-.9-.55.21-1.15.21-1.7 0z" />
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
