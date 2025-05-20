import { cn } from "@/lib/utils";
import { SubCategory } from "@prisma/client";
import Link from "next/link";

interface FeaturedSubCategoriesProps {
  subCategories: SubCategory[];
  open: boolean; // Whether the main category dropdown is open
}

export default function FeaturedSubCategories({
  subCategories,
  open,
}: FeaturedSubCategoriesProps) {
  return (
    <div className="relative w-fit">
      <div
        className={cn(
          "flex items-center flex-wrap xl:-translate-x-0 transition-all duration-100 ease-in-out",
          {
            "!translate-x-0": open,
          }
        )}
      >
        {subCategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/browse?subcategory=${subcategory.url}`}
            className="font-medium text-center text-white px-3 py-1 mx-1 leading-8 rounded-md hover:bg-[#ffffff33] flex items-center"
          >
            {subcategory.name}
          </Link>
        ))}
      </div>
    </div>
  );
} 