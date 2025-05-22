import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-4xl font-bold mb-4">Store or Product Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The store or product you're looking for doesn't exist or you don't have permission to access it.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/dashboard/seller/stores"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stores
        </Link>
      </div>
    </div>
  );
} 