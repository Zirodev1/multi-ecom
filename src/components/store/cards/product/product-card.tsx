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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group w-full max-w-sm">
      {/* Product Image */}
      <div className="relative">
        {isDemoProduct && (
          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Demo
          </div>
        )}
        <Link href={`/product/${product.slug}${(product as SimpleProduct).variantSlug ? `?variant=${(product as SimpleProduct).variantSlug}` : ''}`}>
          <div 
            className="w-full aspect-square relative bg-gray-50 overflow-hidden"
            onMouseEnter={() => images.length > 0 && setActiveImage(images[0])}
          >
            <Image
              src={imageSource}
              fill
              alt={product.name}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <Link href={`/product/${product.slug}${(product as SimpleProduct).variantSlug ? `?variant=${(product as SimpleProduct).variantSlug}` : ''}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ${typeof productPrice === 'number' ? productPrice.toFixed(2) : productPrice}
          </p>
          
          {/* Rating if available */}
          {(product as ProductType).rating && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-600">{(product as ProductType).rating?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors">
            Add to Cart
          </button>
          <button className="flex justify-center items-center w-10 h-8 border border-gray-300 hover:border-gray-400 rounded-md transition-colors group">
            <svg className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
