import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row items-center justify-center gap-4">
        <h1 className="text-4xl font-barlow font-bold">Hello World</h1>
        <ThemeToggle />
      </div>
    </div>
  );
}
