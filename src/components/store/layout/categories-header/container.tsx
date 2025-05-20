"use client";
import { useState } from "react";
import { Category, OfferTag, SubCategory } from "@prisma/client";
import CategoriesMenu from "./categories-menu";
import OfferTagsLinks from "./offerTags-links";
import FeaturedSubCategories from "./featured-subcategories";

export default function CategoriesHeaderContainer({
  categories,
  offerTags,
  featuredSubCategories,
}: {
  categories: Category[];
  offerTags: OfferTag[];
  featuredSubCategories: SubCategory[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* Category menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
      
      {/* Featured SubCategories */}
      <div className="border-l border-gray-400 pl-3 ml-2">
        <FeaturedSubCategories subCategories={featuredSubCategories} open={open} />
      </div>
      
      {/* Offer tags links */}
      <OfferTagsLinks offerTags={offerTags} open={open} />
    </div>
  );
}
