"use client";
import { FeaturedCategoryType } from "@/lib/types";
import CategoryCard from "./category-card";
import { useEffect, useState } from "react";
import { getHomeFeaturedCategories } from "@/queries/home";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<FeaturedCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const featuredCategories = await getHomeFeaturedCategories();
        setCategories(featuredCategories);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch featured categories:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  // If there's no data and we're not loading, don't render the component
  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
        <span>Featured Categories</span>
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
      </div>
      {/* List */}
      <div className="grid min-[770px]:grid-cols-2 min-[1120px]:grid-cols-3 gap-4 w-full mt-7">
        {loading ? (
          // Loading state
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-md"></div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Unable to load featured categories</p>
          </div>
        ) : (
          // Data loaded successfully
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        )}
      </div>
    </div>
  );
}
