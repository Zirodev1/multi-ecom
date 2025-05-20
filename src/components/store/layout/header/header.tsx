import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Search from "./search/search";
import { cookies } from "next/headers";
import { Country } from "@/lib/types";
import CountryLanguageCurrencySelector from "./country-lang-curr-selector";

export default async function Header() {
  // Set default country
  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  try {
    // Get cookies from the store with proper await
    const cookieStore = await cookies();
    const userCountryCookie = cookieStore.get("userCountry");

    // If cookie exists, update the user country
    if (userCountryCookie?.value) {
      userCountry = JSON.parse(userCountryCookie.value) as Country;
    }
  } catch (error) {
    console.error("Error parsing country cookie:", error);
    // Continue with default country if there's an error
  }

  return (
    <>
      <div className="bg-red-500 text-white text-center p-2">
        <p>This is a demo website. Please do not attempt to make any purchases.</p>
      </div>
      <div className="bg-gradient-to-r from-slate-500 to-slate-800">
        <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
          <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" >
                <h1 className="font-extrabold text-3xl font-mono">ZShop</h1>
              </Link>
              <div className="flex lg:hidden">
                <UserMenu />
                <Cart />
              </div>
            </div>
            <Search />
          </div>
          <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
            <div className="lg:flex">
              <DownloadApp />
            </div>
            <CountryLanguageCurrencySelector userCountry={userCountry} />
            <UserMenu />
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
