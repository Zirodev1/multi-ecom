import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-full flex gap-x-5 justify-end">
        <UserButton />
        <ThemeToggle />
      </div>
        <h1 className="text-4xl font-barlow font-bold">Hello World</h1>
    </div>
  );
}
