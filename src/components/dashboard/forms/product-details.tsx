"use client";

import { FC, useEffect, useState } from "react";
import { Category, Shop, ShopStatus } from "../../../generated/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormSchema } from "@/lib/schemas";
import { AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { upsertShop } from "@/queries/store";
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  shopUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({ data, categories, shopUrl }) => {
  const { toast } = useToast();
  const router = useRouter();


  // Temp state for images
  const [images, setImages] = useState<{ url: string }[]>([])

  // Make sure default values are always strings, not undefined
  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
    variantName: data?.variantName || "",
    variantDescription: data?.variantDescription || "",
    images: data?.images || [],
    variantImage: data?.variantImage || [],
    categoryId: data?.categoryId || "",
    offerTagId: data?.offerTagId || undefined,
    subCategoryId: data?.subCategoryId || "",
    brand: data?.brand || "",
    sku: data?.sku || "",
    weight: data?.weight || 0,
    colors: data?.colors || [{ color: ""}],
    sizes: data?.sizes || [],
    product_specs: data?.product_specs || [{ name: "", value: "" }],
    variant_specs: data?.variant_specs || [{ name: "", value: "" }],
    keywords: data?.keywords || [],
    questions: data?.questions || [{ question: "", answer: "" }],
    isSale: data?.isSale || false,
    saleEndDate: data?.saleEndDate || undefined,
    freeShippingForAllCountries: data?.freeShippingForAllCountries || false,
    freeShippingCountriesIds: data?.freeShippingCountriesIds || [],
  };

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  // Reset form data if parent data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        description: data?.description,
        variantName: data?.variantName,
        variantDescription: data?.variantDescription ?? undefined,
        images: data?.images,
        categoryId: data?.categoryId,
        subCategoryId: data?.subCategoryId,
        brand: data?.brand,
        sku: data?.sku,
        colors: data?.colors,
        sizes: data?.sizes,
        keywords: data?.keywords,
        isSale: data?.isSale
      });
    }
  }, [data, form]);

  // const onSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
  //   try {
  //     console.log("FORM VALUES SUBMITTED:", values);

  //     // Validate name is provided
  //     const shopName = values.name?.trim() || "";
  //     if (!shopName) {
  //       toast({
  //         variant: "destructive",
  //         title: "Shop name is required",
  //         description: "Please enter a valid shop name",
  //       });
  //       return;
  //     }

  //     // Create shop data with correct formatting
  //     const shopData = {
  //       name: shopName,
  //       description: values.description?.trim() || "",

  //       // Extract the URL string from the array and ensure it's not undefined

 
  //       createdAt: data?.createdAt || new Date(),
  //       updatedAt: new Date()
  //     };

  //     console.log("Sending to server:", shopData);

  //     await upsertShop(shopData);
  //     console.log("Shop data processed");

  //     toast({
  //       title: data?.id
  //         ? "Shop has been updated."
  //         : `Congrats! Your shop "${shopName}" has been created.`,
  //     });

  //     if (data?.id) {
  //       router.refresh();
  //     } else {
  //       router.push("/dashboard/seller/shops");
  //     }
  //   } catch (err: any) {
  //     console.error("Error saving shop:", err);
  //     toast({
  //       variant: "destructive",
  //       title: "Oops!",
  //       description: err.toString(),
  //     });
  //   }
  // };

  return (
    <AlertDescription>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name || ""} product information.`
              : "Let's create a product. You can edit the product later in the products tab."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form  className="space-y-4">
              <div className="relative py-2 mb-10">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl><>
                        <ImagesPreviewGrid 
                          images={form.getValues().images} 
                          onRemove={(url) => {
                            const updatedImages = images.filter((img) => img.url !== url)
                            setImages(updatedImages);
                            field.onChange(updatedImages);
                          }}
                          colors={colors}
                          setColors={setColors}
                          />
                      <FormMessage className="!mt-4"/>
                        <ImageUpload
                          dontShowPreview
                          type="standard"
                          value={(field.value || []).map((image) => image.url || "")}
                          disabled={isLoading}
                          onChange={(url) => {
                            setImages((prevImages) => {
                              const updatedImages = [...prevImages, {url}];
                              field.onChange(updatedImages);
                              return updatedImages
                            })
                          }}
                          onRemove={(url) => {
                            field.onChange([
                              ...(field.value || []).filter(
                                (current) => current.url !== url
                              ),
                            ]);
                          }}
                          />
                          </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name..." 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value || "")}
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description..." 
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => field.onChange(e.target.value || "")}
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading
                  ? "Loading..."
                  : data?.productId && data?.variantId
                  ? "Save Product Information"
                  : "Create Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDescription>
  );
};

export default ProductDetails;
