"use client";

// React, Next.js
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import { Store } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { StoreFormSchema } from "@/lib/schemas";

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
  FormDescription,
  FormLabel
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../shared/image-upload";
import { useToast } from "@/components/ui/use-toast";

// Queries
import { upsertStore } from "@/queries/store";

// Utils
import { v4 } from "uuid";

interface StoreDetailsProps {
  data?: Store;
}

const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use state for direct form control
  const [storeName, setStoreName] = useState(data?.name || "");
  const [storeDescription, setStoreDescription] = useState(data?.description || "");
  const [storeEmail, setStoreEmail] = useState(data?.email || "");
  const [storePhone, setStorePhone] = useState(data?.phone || "");
  const [storeUrl, setStoreUrl] = useState(data?.url || "");
  const [storeFeatured, setStoreFeatured] = useState(data?.featured || false);
  const [logoImages, setLogoImages] = useState<{url: string}[]>(
    data?.logo ? [{ url: data.logo }] : []
  );
  const [coverImages, setCoverImages] = useState<{url: string}[]>(
    data?.cover ? [{ url: data.cover }] : []
  );

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logo: data?.logo ? [{ url: data?.logo }] : [],
      cover: data?.cover ? [{ url: data?.cover }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      status: data?.status?.toString() || "PENDING",
    },
  });

  // Update form values when state changes
  useEffect(() => {
    form.setValue("name", storeName);
    form.setValue("description", storeDescription);
    form.setValue("email", storeEmail);
    form.setValue("phone", storePhone);
    form.setValue("url", storeUrl);
    form.setValue("featured", storeFeatured);
    form.setValue("logo", logoImages);
    form.setValue("cover", coverImages);
  }, [
    storeName, 
    storeDescription, 
    storeEmail, 
    storePhone, 
    storeUrl, 
    storeFeatured, 
    logoImages, 
    coverImages, 
    form
  ]);

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting || isSubmitting;

  // Submit handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Check if required fields have values
      if (!storeName || storeName.trim() === "") {
        toast({
          variant: "destructive",
          title: "Store name is required",
          description: "Please enter a valid store name."
        });
        setIsSubmitting(false);
        return;
      }

      if (!storeUrl || storeUrl.trim() === "") {
        toast({
          variant: "destructive",
          title: "Store URL is required",
          description: "Please enter a valid store URL."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!storeEmail || storeEmail.trim() === "") {
        toast({
          variant: "destructive",
          title: "Store email is required",
          description: "Please enter a valid store email."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!storePhone || storePhone.trim() === "") {
        toast({
          variant: "destructive",
          title: "Store phone is required",
          description: "Please enter a valid store phone number."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!storeDescription || storeDescription.trim() === "") {
        toast({
          variant: "destructive",
          title: "Store description is required",
          description: "Please enter a valid store description."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (logoImages.length === 0) {
        toast({
          variant: "destructive",
          title: "Logo is required",
          description: "Please upload a logo for your store."
        });
        setIsSubmitting(false);
        return;
      }

      if (coverImages.length === 0) {
        toast({
          variant: "destructive",
          title: "Cover image is required",
          description: "Please upload a cover image for your store."
        });
        setIsSubmitting(false);
        return;
      }

      // Create store payload
      const storePayload = {
        id: data?.id || v4(),
        name: storeName,
        description: storeDescription,
        email: storeEmail,
        phone: storePhone,
        logo: logoImages[0]?.url || "",
        cover: coverImages[0]?.url || "",
        url: storeUrl,
        featured: storeFeatured,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Upserting store data
      const response = await upsertStore(storePayload);


      // Displaying success message
      toast({
        title: data?.id
          ? "Store has been updated."
          : `Congratulations! Store is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        // Redirect to the specific store URL instead of the stores index
        router.push(`/dashboard/seller/stores/${storeUrl}`);
      }
    } catch (error: unknown) {
      // Handling form submission errors
      console.error("Store creation error:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information.`
              : " Let's create a store. You can edit store later from the store settings page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Logo - Cover */}
              <div className="relative py-2 mb-24">
                <div className="absolute -bottom-20 -left-48 z-10 inset-x-96">
                  <FormLabel>Logo <span className="text-red-500">*</span></FormLabel>
                  <ImageUpload
                    type="profile"
                    value={logoImages.map(img => img.url)}
                    disabled={isLoading}
                    onChange={(url) => setLogoImages([{ url }])}
                    onRemove={() => setLogoImages([])}
                  />
                </div>
                <div>
                  <FormLabel>Cover <span className="text-red-500">*</span></FormLabel>
                  <ImageUpload
                    type="cover"
                    value={coverImages.map(img => img.url)}
                    disabled={isLoading}
                    onChange={(url) => setCoverImages([{ url }])}
                    onRemove={() => setCoverImages([])}
                  />
                </div>
              </div>
              
              {/* Name */}
              <div className="flex-1">
                <FormLabel>Store name <span className="text-red-500">*</span></FormLabel>
                <Input 
                  placeholder="Name" 
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                  }}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              {/* Description */}
              <div className="flex-1">
                <FormLabel>Store description <span className="text-red-500">*</span></FormLabel>
                <Textarea 
                  placeholder="Description" 
                  value={storeDescription}
                  onChange={(e) => {
                    setStoreDescription(e.target.value);
                  }}
                  disabled={isLoading}
                  required 
                />
              </div>
              
              {/* Email - Phone */}
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-1">
                  <FormLabel>Store email <span className="text-red-500">*</span></FormLabel>
                  <Input 
                    placeholder="Email" 
                    type="email"
                    value={storeEmail}
                    onChange={(e) => {
                      setStoreEmail(e.target.value);
                    }}
                    disabled={isLoading}
                    required 
                  />
                </div>
                <div className="flex-1">
                  <FormLabel>Store phone <span className="text-red-500">*</span></FormLabel>
                  <Input 
                    placeholder="Phone" 
                    value={storePhone}
                    onChange={(e) => {
                      setStorePhone(e.target.value);
                    }}
                    disabled={isLoading}
                    required 
                  />
                </div>
              </div>
              
              {/* URL */}
              <div className="flex-1">
                <FormLabel>Store URL <span className="text-red-500">*</span></FormLabel>
                <Input 
                  placeholder="example-store" 
                  value={storeUrl}
                  onChange={(e) => {
                    setStoreUrl(e.target.value);
                  }}
                  disabled={isLoading}
                  required 
                />
                <FormDescription>
                  This will be used in your store&apos;s URL: /store/{storeUrl || "example-store"}
                </FormDescription>
              </div>
              
              {/* Featured */}
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  checked={storeFeatured}
                  onCheckedChange={(checked) => setStoreFeatured(checked === true)}
                  disabled={isLoading}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    This Store will appear on the home page.
                  </FormDescription>
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                  ? "Save store information"
                  : "Create store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
