"use client";

import { FC, useEffect, useState } from "react";
import {NumberInput} from '@tremor/react'
import { Category, Shop, ShopStatus, SubCategory } from "../../../generated/client";
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
import { getAllCategoriesForCategory } from "@/queries/category"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// tags
import { WithOutContext as ReactTags} from "react-tag-input"

import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { upsertProduct } from "@/queries/product";
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInput from "./click-to-add";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Dot } from "lucide-react";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  shopUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({ data, categories, shopUrl }) => {
  const { toast } = useToast();
  const router = useRouter();

  // Is new variant page
  const isNewVariantPage = data?.productId && !data?.variantId;

  // stat for subcategory
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Temp state for images
  const [images, setImages] = useState<{ url: string }[]>([])

  // State for colors
  const [colors, setColors] = useState<{color: string}[]>([{color: ""}]);

  // State for sizes
  const [sizes, setSizes] = useState<{size: string, price: number, quantity: number, discount: number}[]>([{size: "", price: 0, quantity: 1, discount: 0}]);

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

  
  const saleEndDate = form.getValues().saleEndDate || new Date().toISOString();

  const formattedDate = new Date(saleEndDate).toLocaleString("en-Us", {
    weekday: "short", // Abbreviated day name (e.g., "Mon")
    month: "long", // Abbreviated month name (e.g., "Nov")
    day: "2-digit", // Two-digit day (e.g., "25")
    year: "numeric", // Full year (e.g., "2024")
    hour: "2-digit", // Two-digit hour (e.g., "02")
    minute: "2-digit", // Two-digit minute (e.g., "30")
    second: "2-digit", // Two-digit second (optional)
    hour12: false, // 12-hour format (change to false for 24-hour format)
  });

  useEffect(() => {
    const getSubCategories = async () => {
      if (form.watch().categoryId) {
        const res = await getAllCategoriesForCategory(form.watch().categoryId);
        setSubCategories(res);
      }
    }
    
    getSubCategories();
  }, [form.watch().categoryId])

  // Extract errors state from form
  const errors = form.formState.errors;


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

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // Upserting product data
      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          images: values.images,
          variantImage: values.variantImage[0].url,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          offerTagId: values.offerTagId || "",
          isSale: values.isSale,
          saleEndDate: values.saleEndDate,
          brand: values.brand,
          sku: values.sku,
          weight: values.weight,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: values.product_specs,
          variant_specs: values.variant_specs,
          keywords: values.keywords,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        shopUrl
      );

      // Displaying success message
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product has been updated."
            : `Congratulations! product is now created.`,
      });

      // Redirect or Refresh data
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${shopUrl}/products`);
      }
    } catch (error: any) {
      // Handling form submission errors
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };


  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
  }, [colors, sizes, keywords])

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
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div>
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
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInput 
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{color: ""}}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">{errors.colors.message}</span>
                  )}
                </div>
              </div>
              {/* name */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Name</FormLabel>
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
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Name</FormLabel>
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
              {/* Description */}
              <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Product Description</FormLabel>
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
              <FormField
                control={form.control}
                name="variantDescription"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Variant Description</FormLabel>
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
              </div>
              {/* Category - SubCategory */}
              <div className="flex flex-col lg:flex-row gap-4">
                  <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Product Category</FormLabel>
                          <Select
                            disabled={isLoading || categories.length == 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white dark:bg-gray-950">
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-950">
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                      {form.watch().categoryId && (
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="subCategoryId"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Product SubCategory</FormLabel>
                              <Select
                                disabled={isLoading || subCategories.length == 0}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white dark:bg-gray-950">
                                    <SelectValue
                                      defaultValue={field.value}
                                      placeholder="Select a subcategory"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-950">
                                  {subCategories.map((subcategory) => (
                                    <SelectItem
                                      key={subcategory.id}
                                      value={subcategory.id}
                                    >
                                      {subcategory.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
              </div>
              {/* Brans & SKU */}
              <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Product Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Product brand" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product SKU</FormLabel>

                        <FormControl>
                          <Input placeholder="Product sku" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product Weight</FormLabel>
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Product weight"
                            min={0.01}
                            step={0.01}
                            className="!shadow-none rounded-md !text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              {/* Keywords */}
              <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={() => {}}
                            placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              {/* Sizes */}
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInput 
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    price: 0,
                    quantity: 1,
                    discount: 0,
                  }}
                  header="Sizes, Prices, Quantities,  Discounts"
                />
                {errors.sizes && (
                    <span className="text-sm font-medium text-destructive">{errors.sizes.message}</span>
                  )}
              </div>
              {/* Is on Sale */}
              <div>
                  <FormLabel className="mb-2 mt-8">On Sale?</FormLabel>
                  <label
                    htmlFor="yes"
                    className="flex items-center gap-x-2 cursor-pointer"
                  >
                    <FormField
                      control={form.control}
                      name="isSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <input
                                type="checkbox"
                                id="yes"
                                checked={field.value}
                                onChange={field.onChange}
                                hidden
                              />
                              <Checkbox
                                checked={field.value}
                                // @ts-ignore
                                onCheckedChange={field.onChange}
                              />
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>Yes</span>
                  </label>
                  {form.getValues().isSale && (
                    <div className="mt-5">
                      <p className="text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                        <Dot className="-me-1" />
                        When sale does end ?
                      </p>
                      <div className="flex items-center gap-x-5">
                        <FormField
                          control={form.control}
                          name="saleEndDate"
                          render={({ field }) => (
                            <FormItem className="ml-4">
                              <FormControl>
                                <DateTimePicker
                                  className="inline-flex items-center gap-2 p-2 border rounded-md shadow-sm"
                                  calendarIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      📅
                                    </span>
                                  }
                                  clearIcon={
                                    <span className="text-gray-500 hover:text-gray-600">
                                      ✖️
                                    </span>
                                  }
                                  onChange={(date) => {
                                    field.onChange(
                                      date
                                        ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                  value={
                                    field.value ? new Date(field.value) : null
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <ArrowRight className="w-4 text-[#1087ff]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer bg-gray-200 text-black"
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
