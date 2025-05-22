"use client";
import { Dispatch, SetStateAction } from "react";

import Link from "next/link";
import Image from "next/image";
import { ProductType, SimpleProduct } from "@/lib/types";

export default function ProductCard({ 
  product,
  images = [],
  activeImage = null,
  setActiveImage = () => {},
}: { 
  product: SimpleProduct | ProductType
  images?: { url: string }[];
  activeImage?: { url: string } | null;
  setActiveImage?: Dispatch<SetStateAction<{ url: string } | null>>;
}) {
  // Check if this is a demo product
  const isDemoProduct = product.slug?.toString().startsWith('demo-product-');
  
  // Determine image source
  const imageSource = 
    (activeImage && activeImage.url) || 
    (images.length > 0 && images[0].url) ||
    (product as SimpleProduct).image ||
    ((product as ProductType).variants && (product as ProductType).variants[0]?.images?.[0]?.url) ||
    "/assets/images/placeholder.png";
  
  // Determine the product price
  const productPrice = (product as SimpleProduct).price || 
    ((product as ProductType).variants && (product as ProductType).variants[0]?.sizes?.[0]?.price) || 
    0;
  
  return (
    <div className="relative">
      {isDemoProduct && (
        <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Demo
        </div>
      )}
      <Link href={`/product/${product.slug}${(product as SimpleProduct).variantSlug ? `?variant=${(product as SimpleProduct).variantSlug}` : ''}`}>
        <div 
          className="w-[178px] h-[178px] relative"
          onMouseEnter={() => images.length > 0 && setActiveImage(images[0])}
        >
          <Image
            src={imageSource}
            fill
            alt={product.name}
            sizes="178px"
          />
        </div>
      </Link>

      <div className="p-2">
        <Link href={`/product/${product.slug}${(product as SimpleProduct).variantSlug ? `?variant=${(product as SimpleProduct).variantSlug}` : ''}`}>
          <p className="text-sm font-medium text-gray-800 h-10 overflow-hidden">
            {product.name}
          </p>
        </Link>
        <div>
          <p className="text-lg font-bold text-gray-900">
            ${typeof productPrice === 'number' ? productPrice.toFixed(2) : productPrice}
          </p>
        </div>
      </div>

      <div className="px-2 pb-2 flex justify-between items-center">
        <button className="bg-blue-600 text-white text-xs font-medium py-2 px-4 rounded-full w-[70%]">
          Add to Cart
        </button>
        <button className="flex justify-center items-center h-[36px] w-[36px] border rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
