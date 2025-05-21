// Clerk
import { UserButton } from "@clerk/nextjs";

// Theme toggle
import ThemeToggle from "@/components/shared/theme-toggle";

export default function Header({ isDemo }: { isDemo?: boolean }) {
  return (
    <div className="fixed z-[20] md:left-[300px] left-0 top-0 right-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]">
      {isDemo && (
        <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium">
          Demo Mode
        </div>
      )}
      <div className="flex items-center gap-2 ml-auto">
        {isDemo ? (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm">D</span>
          </div>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
