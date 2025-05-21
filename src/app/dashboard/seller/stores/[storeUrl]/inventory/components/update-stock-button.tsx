"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface UpdateStockButtonProps {
  productName: string;
  variant: string;
  size: string;
  currentStock: number;
  productId: string;
  variantId: string;
  sizeId: string;
  isDemo?: boolean;
}

export default function UpdateStockButton({
  productName,
  variant,
  size,
  currentStock,
  productId,
  variantId,
  sizeId,
  isDemo = false,
}: UpdateStockButtonProps) {
  const [open, setOpen] = useState(false);
  const [newStock, setNewStock] = useState(currentStock.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStock = async () => {
    setIsLoading(true);
    
    try {
      if (isDemo) {
        // In demo mode, just simulate a successful update
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Stock updated",
          description: `Updated ${productName} (${variant}, ${size}) to ${newStock} units.`,
        });
      } else {
        // In real mode, we would make an API call to update the stock
        // This would be implemented based on your backend structure
        // For example:
        // await updateProductStock(productId, variantId, sizeId, parseInt(newStock));
        
        // For now, just showing a toast
        toast({
          title: "Stock updated",
          description: `Updated ${productName} (${variant}, ${size}) to ${newStock} units.`,
        });
      }
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-800 font-medium p-0 h-auto">
          Update Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Inventory</DialogTitle>
          <DialogDescription>
            Update stock quantity for {productName} ({variant}, {size})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-stock" className="text-right">
              Current Stock
            </Label>
            <Input
              id="current-stock"
              value={currentStock}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-stock" className="text-right">
              New Stock
            </Label>
            <Input
              id="new-stock"
              value={newStock}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '');
                setNewStock(value);
              }}
              className="col-span-3"
              type="number"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleUpdateStock} 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 