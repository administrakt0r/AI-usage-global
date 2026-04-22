import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/aug-logo.svg"
        alt="AI Usage Global logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-sm"
        priority
      />
      <span className="text-primary hidden text-[19px] font-semibold tracking-tight sm:inline">
        AI Usage Global
      </span>
      <span className="text-primary text-[18px] font-semibold tracking-tight sm:hidden">
        AUG
      </span>
    </div>
  );
};

export default Logo;