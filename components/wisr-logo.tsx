interface WisrLogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function WisrLogo({ className = "", showText = true, size = "md" }: WisrLogoProps) {
  const sizes = {
    sm: { text: "text-lg", powered: "text-xs" },
    md: { text: "text-xl", powered: "text-sm" },
    lg: { text: "text-2xl", powered: "text-base" },
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <span className={`font-bold text-foreground ${sizes[size].text} leading-tight`}>Risk Assure</span>
        {showText && (
          <span className={`font-normal text-muted-foreground ${sizes[size].powered} leading-tight`}>
            Powered by <span className="text-primary font-semibold">wisr</span>
          </span>
        )}
      </div>
    </div>
  )
}

export function WisrLogoMark({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold text-primary text-xl">RA</span>
    </div>
  )
}
