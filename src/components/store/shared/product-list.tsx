import { FC } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "../cards/product/product-card";
import { ProductType } from "@/lib/types";

type Props = {
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
};

const ProductList: FC<Props> = ({ products, title, link, arrow }) => {
  const Title = () => {
    if (link) {
      return (
        <Link href={link} className="inline-block hover:text-blue-600 transition-colors">
          <h2 className="text-main-primary text-xl font-bold">
            {title}&nbsp;
            {arrow && <ChevronRight className="w-5 h-5 inline-block" />}
          </h2>
        </Link>
      );
    } else {
      return (
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-5 h-5 inline-block" />}
        </h2>
      );
    }
  };
  
  return (
    <div className="relative">
      {title && (
        <div className="mb-4">
          <Title />
        </div>
      )}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No products available.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
