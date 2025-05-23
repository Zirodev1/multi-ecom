import ProductFilters from "@/components/store/browse-page/filters";
import ProductSort from "@/components/store/browse-page/sort";
import ProductCard from "@/components/store/cards/product/product-card";
import Header from "@/components/store/layout/header/header";
import { FiltersQueryType } from "@/lib/types";
import { getProducts } from "@/queries/product";
import { getFilteredSizes } from "@/queries/size";

// Updated for Next.js 15 compatibility
interface PageProps {
  params: Record<string, string>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrowsePage({
  searchParams,
}: PageProps) {
  // Await searchParams first
  const searchParamsResolved = await searchParams;
  
  const {
    category,
    offer,
    search,
    size,
    sort,
    subCategory,
    maxPrice,
    minPrice,
    color,
  } = searchParamsResolved as unknown as FiltersQueryType;
  
  const products_data = await getProducts(
    {
      search: search as string,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
      category: category as string,
      subCategory: subCategory as string,
      offer: offer as string,
      size: Array.isArray(size)
        ? size
        : size
        ? [size as string] // Convert single size string to array
        : undefined, // If no size, keep it undefined
      color: Array.isArray(color)
        ? color
        : color
        ? [color as string] // Convert single color string to array
        : undefined, // If no color, keep it undefined
    },
    sort as string
  );
  const { products } = products_data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ProductFilters queries={searchParamsResolved as unknown as FiltersQueryType} />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {category || subCategory ? 
                      `${category ? category.charAt(0).toUpperCase() + category.slice(1) : ''} ${subCategory ? '- ' + subCategory.charAt(0).toUpperCase() + subCategory.slice(1) : ''}`.trim()
                      : 'All Products'
                    }
                  </h1>
                  <span className="text-sm text-gray-500">
                    ({products.length} {products.length === 1 ? 'product' : 'products'})
                  </span>
                </div>
                <ProductSort />
              </div>
            </div>

            {/* Product Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id + product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8-4 4-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
