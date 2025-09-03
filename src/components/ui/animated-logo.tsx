import { cn } from "@/lib/utils";

export function AnimatedLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("animated-logo", className)}
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--chart-1))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--chart-2))", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--chart-3))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--chart-4))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#grad1)"
        strokeWidth="4"
        fill="none"
        className="logo-orbit"
        style={{ animationDelay: '0s' }}
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke="url(#grad2)"
        strokeWidth="4"
        fill="none"
        className="logo-orbit"
        style={{ animationDelay: '-2s', animationDirection: 'reverse' }}
      />
       <circle
        cx="50"
        cy="50"
        r="15"
        fill="hsl(var(--primary))"
        className="logo-core"
      />
    </svg>
  );
}
