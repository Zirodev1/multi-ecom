"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Record<string, any>[];
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const params = useParams();
  const router = useRouter();

  // Debug: Log the received stores
  useEffect(() => {
    console.log('StoreSwitcher received stores:', stores);
    console.log('Params:', params);
  }, [stores, params]);

  // Format stores data and ensure URL values are not empty
  const formattedItems = stores.map((store) => ({
    label: store.name || `Store ${store.id.substring(0, 6)}`,
    value: store.url || store.id, // Use ID as fallback if URL is empty
    id: store.id,
    isEmptyUrl: !store.url
  }));

  const [open, setOpen] = useState(false);

  // Get the active store by matching either URL or ID
  const activeStore = formattedItems.find(
    (store) => 
      store.value === params.storeUrl || 
      (store.isEmptyUrl && params.storeUrl === store.id)
  );

  // Debug: Log formatted items and active store
  useEffect(() => {
    console.log('Formatted items:', formattedItems);
    console.log('Active store:', activeStore);
    console.log('Current storeUrl param:', params.storeUrl);
  }, [formattedItems, activeStore, params.storeUrl]);

  const onStoreSelect = (store: { label: string; value: string; id: string; isEmptyUrl: boolean }) => {
    setOpen(false);
    
    // If the store URL is empty, use the ID as the URL parameter
    const urlParam = store.isEmptyUrl ? store.id : store.value;
    
    console.log(`Navigating to store: ${store.label} with URL param: ${urlParam}`);
    router.push(`/dashboard/seller/stores/${urlParam}`);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[250px] justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {activeStore?.label || "Select a store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search stores..." />
            <CommandEmpty>No stores found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.length > 0 ? (
                formattedItems.map((store) => (
                  <CommandItem
                    key={store.id}
                    onSelect={() => onStoreSelect(store)}
                    className="text-sm cursor-pointer"
                  >
                    <StoreIcon className="mr-2 w-4 h-4" />
                    {store.label}
                    {store.isEmptyUrl && <span className="ml-2 text-xs text-amber-500">(No URL)</span>}
                    <Check
                      className={cn("ml-auto h-4 w-4 opacity-0", {
                        "opacity-100": activeStore?.id === store.id,
                      })}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No stores available</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
