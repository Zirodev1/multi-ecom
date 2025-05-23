"use client";

// React, Next.js
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import {
  Category,
  Country,
  OfferTag,
  ShippingFeeMethod,
  SubCategory,
} from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ProductFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "react-multi-select-component";

// Queries
import { upsertProduct } from "@/queries/product";
import { getAllCategoriesForCategory } from "@/queries/category";

// ReactTags
import { WithOutContext as ReactTags } from "react-tag-input";

// Utils
import { v4 } from "uuid";

// Types
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// Jodit text editor
import JoditEditor from "jodit-react";
import { NumberInput } from "@tremor/react";
import InputFieldset from "../shared/input-fieldset";
import { ArrowRight, Dot } from "lucide-react";
import { useTheme } from "next-themes";

const shippingFeeMethods = [
  {
    value: ShippingFeeMethod.ITEM,
    description: "ITEM (Fees calculated based on number of products.)",
  },
  {
    value: ShippingFeeMethod.WEIGHT,
    description: "WEIGHT (Fees calculated based on product weight)",
  },
  {
    value: ShippingFeeMethod.FIXED,
    description: "FIXED (Fees are fixed.)",
  },
];

interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  offerTags: OfferTag[];
  storeUrl: string;
  countries: Country[];
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  offerTags,
  storeUrl,
  countries,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Is new variant page
  const isNewVariantPage = data?.productId && !data?.variantId;

  // Jodit editor refs
  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // Jodit configuration
  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      theme: theme === "dark" ? "dark" : "default",
    }),
    [theme]
  );

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
  );

  // Temporary state for images
  const [images, setImages] = useState<{ url: string }[]>([]);

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // State for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // State for product variant specs
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ProductFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.variantName || "",
      variantDescription: data?.variantDescription || "",
      images: data?.images || [],
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [{ url: "" }],
      categoryId: data?.categoryId || "",
      offerTagId: data?.offerTagId || "none",
      subCategoryId: data?.subCategoryId || "",
      brand: data?.brand || "",
      sku: data?.sku || "",
      colors: data?.colors || [],
      sizes: data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }],
      product_specs: data?.product_specs || [],
      variant_specs: data?.variant_specs || [],
      keywords: data?.keywords || [],
      questions: data?.questions || [],
      isSale: data?.isSale || false,
      weight: data?.weight || 0.01,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      freeShippingForAllCountries: data?.freeShippingForAllCountries || false,
      freeShippingCountriesIds: data?.freeShippingCountriesIds || [],
      shippingFeeMethod: data?.shippingFeeMethod || ShippingFeeMethod.ITEM,
    },
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

  // UseEffect to get subCategories when user pick/change a category
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllCategoriesForCategory(form.watch().categoryId);
      setSubCategories(res);
    };
    getSubCategories();
  }, [form.watch().categoryId]);

  // Extract errors state from form
  const errors = form.formState.errors;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        variantImage: data.variantImage ? [{ url: data.variantImage }] : [],
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // Get the current form values directly from the form state (most reliable)
      const currentValues = form.getValues();
      
      // Use current form values as the primary source of truth
      // Only fall back to 'values' parameter if current values are missing
      const finalValues = {
        // Start with parameter values as base
        ...values,
        // Override with current form values (more reliable)
        ...currentValues,
        // Ensure arrays and objects are properly handled
        images: currentValues.images?.length > 0 ? currentValues.images : (values.images || []),
        colors: currentValues.colors?.length > 0 ? currentValues.colors : (values.colors || []),
        sizes: currentValues.sizes?.length > 0 ? currentValues.sizes : (values.sizes || []),
        variantImage: currentValues.variantImage?.length > 0 ? currentValues.variantImage : (values.variantImage || []),
      };

      // Validate required fields before submission
      if (!isNewVariantPage) {
        if (!finalValues.categoryId || finalValues.categoryId === "" || finalValues.categoryId === "none") {
          toast({
            variant: "destructive",
            title: "Missing Category",
            description: "Please select a product category before submitting.",
          });
          return;
        }
        
        if (!finalValues.subCategoryId || finalValues.subCategoryId === "" || finalValues.subCategoryId === "none") {
          toast({
            variant: "destructive",
            title: "Missing Subcategory", 
            description: "Please select a product subcategory before submitting.",
          });
          return;
        }
      }

      // Validate product name
      if (!finalValues.name || finalValues.name.trim() === "") {
        toast({
          variant: "destructive",
          title: "Missing Product Name",
          description: "Please enter a product name.",
        });
        return;
      }

      // Validate variant name
      if (!finalValues.variantName || finalValues.variantName.trim() === "") {
        toast({
          variant: "destructive",
          title: "Missing Variant Name",
          description: "Please enter a variant name.",
        });
        return;
      }

      // Validate images
      if (!finalValues.images || finalValues.images.length < 3) {
        toast({
          variant: "destructive",
          title: "Missing Images",
          description: "Please upload at least 3 product images.",
        });
        return;
      }

      // Validate variant image
      if (!finalValues.variantImage || finalValues.variantImage.length === 0 || !finalValues.variantImage[0]?.url) {
        toast({
          variant: "destructive",
          title: "Missing Variant Image",
          description: "Please upload a variant image.",
        });
        return;
      }

      // Validate colors
      if (!finalValues.colors || finalValues.colors.length === 0 || finalValues.colors.some(c => !c.color)) {
        toast({
          variant: "destructive",
          title: "Missing Colors",
          description: "Please add at least one color.",
        });
        return;
      }

      // Validate sizes
      if (!finalValues.sizes || finalValues.sizes.length === 0 || finalValues.sizes.some(s => !s.size || s.price <= 0 || s.quantity <= 0)) {
        toast({
          variant: "destructive",
          title: "Invalid Sizes",
          description: "Please add at least one size with valid price and quantity.",
        });
        return;
      }

      // If it's a new variant for an existing product, ensure we use the existing product's brand
      const brandValue = isNewVariantPage && data?.brand ? data.brand : finalValues.brand;
      
      // Prepare the product data with proper validation
      const productData = {
        // Only set IDs if we're updating an existing product
        ...(data?.productId && data?.variantId ? {
          productId: data.productId,
          variantId: data.variantId,
        } : {}),
        name: finalValues.name || "",
        description: finalValues.description || "",
        variantName: finalValues.variantName || "",
        variantDescription: finalValues.variantDescription || "",
        images: finalValues.images.map(img => ({ url: img.url })),
        variantImage: finalValues.variantImage[0].url,
        categoryId: finalValues.categoryId || "",
        subCategoryId: finalValues.subCategoryId || "",
        offerTagId: finalValues.offerTagId === "none" ? "" : (finalValues.offerTagId || ""),
        isSale: finalValues.isSale || false,
        saleEndDate: finalValues.saleEndDate || "",
        brand: brandValue || "",
        sku: finalValues.sku || "",
        weight: finalValues.weight || 0.01,
        colors: finalValues.colors.filter(c => c.color.trim() !== ""),
        sizes: finalValues.sizes.filter(s => s.size.trim() !== "" && s.price > 0 && s.quantity > 0),
        product_specs: finalValues.product_specs?.filter(spec => spec.name.trim() !== "" && spec.value.trim() !== "") || [],
        variant_specs: finalValues.variant_specs?.filter(spec => spec.name.trim() !== "" && spec.value.trim() !== "") || [],
        keywords: finalValues.keywords || [],
        questions: finalValues.questions?.filter(q => q.question.trim() !== "" && q.answer.trim() !== "") || [],
        shippingFeeMethod: finalValues.shippingFeeMethod || "ITEM",
        freeShippingForAllCountries: finalValues.freeShippingForAllCountries || false,
        freeShippingCountriesIds: finalValues.freeShippingCountriesIds || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Upserting product data
      const response = await upsertProduct(productData, storeUrl);

      // Displaying success message
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product has been updated."
            : `Congratulations! Product has been created successfully.`,
      });

      // Redirect or Refresh data
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error: any) {
      // Handling form submission errors
      console.error("Product submission error:", error);
      toast({
        variant: "destructive",
        title: "Failed to save product",
        description: error.message || "An unexpected error occurred. Please try again.",
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

  // Add a ref to track if component has mounted
  const hasInitialized = useRef(false);

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    // Skip the first render to avoid setState during render
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    // Update form values after component has initialized
    form.setValue("colors", colors, { shouldDirty: false, shouldTouch: false });
    form.setValue("sizes", sizes, { shouldDirty: false, shouldTouch: false });
    form.setValue("keywords", keywords, { shouldDirty: false, shouldTouch: false });
    form.setValue("product_specs", productSpecs, { shouldDirty: false, shouldTouch: false });
    form.setValue("variant_specs", variantSpecs, { shouldDirty: false, shouldTouch: false });
    form.setValue("questions", questions, { shouldDirty: false, shouldTouch: false });
  }, [colors, sizes, keywords, productSpecs, questions, variantSpecs, form]);

  //Countries options
  type CountryOption = {
    label: string;
    value: string;
  };

  const countryOptions: CountryOption[] = countries.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const handleDeleteCountryFreeShipping = (index: number) => {
    const currentValues = form.getValues().freeShippingCountriesIds;
    const updatedValues = currentValues.filter((_, i) => i !== index);
    form.setValue("freeShippingCountriesIds", updatedValues);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isNewVariantPage
              ? `Add a new variant to ${data.name}`
              : "Create a new product"}
          </CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name} product information.`
              : " Lets create a product. You can edit product later from the product page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images - colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={data?.colors || colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Name */}
              <InputFieldset label="Name">
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Variant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>
              {/* Product and variant description editors (tabs) */}
              <InputFieldset
                label="Description"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product description is the main description for the product (Will display in every variant page). You can add an extra description specific to this variant using 'Variant description' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variant" : "product"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="product">
                        Product description
                      </TabsTrigger>
                      <TabsTrigger value="variant">
                        Variant description
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="product">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={productDescEditor}
                              config={config}
                              value={form.getValues().description}
                              onChange={(content) => {
                                form.setValue("description", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="variant">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="variantDescription"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={variantDescEditor}
                              config={config}
                              value={form.getValues().variantDescription || ""}
                              onChange={(content) => {
                                form.setValue("variantDescription", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </InputFieldset>
              {/* Category - SubCategory - offer*/}
              {!isNewVariantPage && (
                <InputFieldset label="Category">
                  <div className="flex gap-4">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                          <Select
                            disabled={isLoading || categories.length == 0}
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Force update the form value to ensure it's captured
                              form.setValue("categoryId", value, { 
                                shouldValidate: true, 
                                shouldDirty: true,
                                shouldTouch: true 
                              });
                              // Clear subcategory when category changes
                              form.setValue("subCategoryId", "", { 
                                shouldValidate: true, 
                                shouldDirty: true,
                                shouldTouch: true 
                              });
                            }}
                            value={field.value || ""}
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="subCategoryId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Subcategory <span className="text-red-500">*</span></FormLabel>
                          <Select
                            disabled={
                              isLoading ||
                              categories.length == 0 ||
                              !form.getValues().categoryId ||
                              subCategories.length === 0
                            }
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Force update the form value to ensure it's captured
                              form.setValue("subCategoryId", value, { 
                                shouldValidate: true, 
                                shouldDirty: true,
                                shouldTouch: true 
                              });
                            }}
                            value={field.value || ""}
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder={
                                    !form.getValues().categoryId 
                                      ? "Select a category first"
                                      : subCategories.length === 0
                                      ? "Loading subcategories..."
                                      : "Select a sub-category"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Offer Tag */}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="offerTagId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={isLoading || categories.length == 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select an offer (Optional)"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No offer</SelectItem>
                              {offerTags &&
                                offerTags.map((offer) => (
                                  <SelectItem key={offer.id} value={offer.id}>
                                    {offer.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </InputFieldset>
              )}
              {/* Brand, Sku, Weight */}
              <InputFieldset
                label={isNewVariantPage ? "Brand, Sku, Weight" : "Brand, Sku, Weight"}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Product brand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value || 0.01}
                            onValueChange={(value) => field.onChange(value || 0.01)}
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
              </InputFieldset>
              {/* Variant image - Keywords*/}
              <div className="flex items-center gap-10 py-14">
                {/* Variant image */}
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14">Variant Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
                            type="profile"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) => field.onChange([{ url }])}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </FormControl>
                        <FormMessage className="!mt-4" />
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
                        <FormLabel>Product Keywords (Optional)</FormLabel>
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
              </div>
              {/* Sizes*/}
              <InputFieldset label="Sizes, Quantities, Prices, Disocunts">
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputs
                    details={sizes}
                    setDetails={setSizes}
                    initialDetail={{
                      size: "",
                      quantity: 1,
                      price: 0.01,
                      discount: 0,
                    }}
                    containerClassName="flex-1"
                    inputClassName="w-full"
                  />
                  {errors.sizes && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.sizes.message}
                    </span>
                  )}
                </div>
              </InputFieldset>
              {/* Product and variant specs*/}
              <InputFieldset
                label="Specifications"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: Product and variant specifications are optional."
                }
              >
                <Tabs
                  defaultValue={
                    isNewVariantPage ? "variantSpecs" : "productSpecs"
                  }
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="productSpecs">
                        Product Specifications (Optional)
                      </TabsTrigger>
                      <TabsTrigger value="variantSpecs">
                        Variant Specifications (Optional)
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="productSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={productSpecs}
                        setDetails={setProductSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.product_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.product_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="variantSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        details={variantSpecs}
                        setDetails={setVariantSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.variant_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.variant_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </InputFieldset>
              {/* Questions*/}
              {!isNewVariantPage && (
                <InputFieldset label="Questions & Answers (Optional)">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={questions}
                      setDetails={setQuestions}
                      initialDetail={{
                        question: "",
                        answer: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.questions && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.questions.message}
                      </span>
                    )}
                  </div>
                </InputFieldset>
              )}
              {/* Is On Sale */}
              <InputFieldset
                label="Sale"
                description="Is your product on sale ?"
              >
                <div>
                  <label
                    htmlFor="yes"
                    className="ml-5 flex items-center gap-x-2 cursor-pointer"
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
              </InputFieldset>
              {/* Shipping fee method */}
              {!isNewVariantPage && (
                <InputFieldset label="Product shipping fee method">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="shippingFeeMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Shipping Fee Calculation method"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingFeeMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </InputFieldset>
              )}
              {/* Fee Shipping */}
              {!isNewVariantPage && (
                <InputFieldset
                  label="Free Shipping (Optional)"
                  description="Free Shipping Worldwide ?"
                >
                  <div>
                    <label
                      htmlFor="freeShippingForAll"
                      className="ml-5 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FormField
                        control={form.control}
                        name="freeShippingForAllCountries"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  type="checkbox"
                                  id="freeShippingForAll"
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
                  </div>
                  <div>
                    <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                      <Dot className="-me-1" />
                      If not select the countries you want to ship this product
                      to for free
                    </p>
                  </div>
                  <div className="">
                    {!form.getValues().freeShippingForAllCountries && (
                      <div>
                        <FormField
                          control={form.control}
                          name="freeShippingCountriesIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MultiSelect
                                  className="!max-w-[800px]"
                                  options={countryOptions} // Array of options, each with `label` and `value`
                                  value={field.value} // Pass the array of objects directly
                                  onChange={(selected: CountryOption[]) => {
                                    field.onChange(selected);
                                  }}
                                  labelledBy="Select"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                          <Dot className="-me-1" />
                          List of countries you offer free shipping for this
                          product :&nbsp;
                          {form.getValues().freeShippingCountriesIds &&
                            form.getValues().freeShippingCountriesIds.length ===
                              0 &&
                            "None"}
                        </p>
                        {/* Free shipping counties */}
                        <div className="flex flex-wrap gap-1">
                          {form
                            .getValues()
                            .freeShippingCountriesIds?.map((country, index) => (
                              <div
                                key={country.id}
                                className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-primary rounded-md gap-x-2"
                              >
                                <span>{country.label}</span>
                                <span
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleDeleteCountryFreeShipping(index)
                                  }
                                >
                                  x
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InputFieldset>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`w-full ${
                  (!isNewVariantPage && (!form.getValues().categoryId || !form.getValues().subCategoryId)) ||
                  !form.getValues().images?.length ||
                  form.getValues().images?.length < 3 ||
                  !form.getValues().variantImage?.[0]?.url ||
                  !form.getValues().colors?.length ||
                  !form.getValues().sizes?.length
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isLoading
                  ? "Creating Product..."
                  : data?.productId && data.variantId
                  ? "Update Product"
                  : "Create Product"}
              </Button>
              
              {/* Validation Summary */}
              {!isLoading && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Product Creation Checklist:</h4>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${
                      form.getValues().name ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().name ? '✓' : '✗'} Product Name
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().variantName ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().variantName ? '✓' : '✗'} Variant Name
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().description && form.getValues().description.length >= 200 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().description && form.getValues().description.length >= 200 ? '✓' : '✗'} Description (min 200 chars)
                    </div>
                    {!isNewVariantPage && (
                      <>
                        <div className={`flex items-center gap-2 ${
                          form.getValues().categoryId ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {form.getValues().categoryId ? '✓' : '✗'} Category Selected
                        </div>
                        <div className={`flex items-center gap-2 ${
                          form.getValues().subCategoryId ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {form.getValues().subCategoryId ? '✓' : '✗'} Subcategory Selected
                        </div>
                      </>
                    )}
                    <div className={`flex items-center gap-2 ${
                      form.getValues().brand ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().brand ? '✓' : '✗'} Brand
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().sku ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().sku ? '✓' : '✗'} SKU
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().images && form.getValues().images.length >= 3 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().images && form.getValues().images.length >= 3 ? '✓' : '✗'} 
                      Product Images ({form.getValues().images?.length || 0}/3 minimum)
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().variantImage?.[0]?.url ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().variantImage?.[0]?.url ? '✓' : '✗'} Variant Image
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().colors && form.getValues().colors.length > 0 && form.getValues().colors.every(c => c.color.trim() !== '') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().colors && form.getValues().colors.length > 0 && form.getValues().colors.every(c => c.color.trim() !== '') ? '✓' : '✗'} 
                      Colors ({form.getValues().colors?.filter(c => c.color.trim() !== '').length || 0} added)
                    </div>
                    <div className={`flex items-center gap-2 ${
                      form.getValues().sizes && form.getValues().sizes.length > 0 && form.getValues().sizes.every(s => s.size.trim() !== '' && s.price > 0 && s.quantity > 0) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {form.getValues().sizes && form.getValues().sizes.length > 0 && form.getValues().sizes.every(s => s.size.trim() !== '' && s.price > 0 && s.quantity > 0) ? '✓' : '✗'} 
                      Sizes ({form.getValues().sizes?.filter(s => s.size.trim() !== '' && s.price > 0 && s.quantity > 0).length || 0} valid)
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
