"use client"

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ChevronsUpDown, StoreIcon, Check, PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef< typeof PopoverTrigger >;

interface ShopSwitcherProps extends PopoverTriggerProps {
  shops: Record<string, any>[];
};

const ShopSwitcher : FC<ShopSwitcherProps> = ({ shops, className }) => {
  const params = useParams();
  const router = useRouter();

  const formattedItems = shops.map((shop) => ({
    label: shop.name,
    value: shop.url,
  }))

  const [open, setOpen] = useState(false);

  const activeShop = formattedItems.find(
  (shop) => shop.value === params.shopUrl
  )

  const onShopSelect = (shop: {label: string; value: string}) => {
    setOpen(false);
    router.push(`/dashboard/seller/shops/${shop.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a shop"
          className={cn("w-[250px] justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
            Switch Shops
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search shops..."/>
            <CommandEmpty>No shop selected</CommandEmpty>
            <CommandGroup heading="Shops">
              {
                formattedItems.map((shop) => (
                  <CommandItem
                    key={shop.value}
                    onSelect={() => onShopSelect(shop)}
                    className="text-sm cursor-pointer"
                  >
                    <StoreIcon className="mr-2 w-4 h-4" />
                    {shop.label}
                    <Check 
                      className={cn("ml-auto h-4 w-4 opacity-0", {
                        "opacity-100" : activeShop?.value === shop.value
                      })}
                    />
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem 
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push("/dashboard/seller/shops/new")
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5"/>
              Create Shop
            </CommandItem>
          </CommandList>
        </Command>

      </PopoverContent>
    </Popover>
  )
}

export default ShopSwitcher;
