"use client";

// React
import { FC, useEffect, useState } from "react";

// Prisma model
import { Category, SubCategory } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { SubCategoryFormSchema } from "@/lib/schemas";

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
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";

// Queries
import { upsertSubCategory } from "@/queries/subCategory";

// Utils
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  categories,
}) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  
  // Local state for form values
  const [formName, setFormName] = useState<string>(data?.name || "");
  const [formUrl, setFormUrl] = useState<string>(data?.url || "");
  const [formCategoryId, setFormCategoryId] = useState<string>(data?.categoryId || "");
  const [debugValues, setDebugValues] = useState<any>(null);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(SubCategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId || "",
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Watch form values for changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values updated:", value);
      setDebugValues(value);
      
      // Keep local state in sync
      if (value.name !== undefined) setFormName(value.name);
      if (value.url !== undefined) setFormUrl(value.url);
      if (value.categoryId !== undefined) setFormCategoryId(value.categoryId);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
        categoryId: data.categoryId,
      });
      setFormName(data?.name || "");
      setFormUrl(data?.url || "");
      setFormCategoryId(data.categoryId || "");
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      // Debug form state
      console.log("Form state:", form.getValues());
      console.log("Form errors:", form.formState.errors);
      console.log("Form values received in handleSubmit:", values);
      
      // Get values from local state as fallback
      const name = values.name || formName;
      const url = values.url || formUrl;
      const categoryId = values.categoryId || formCategoryId;
      
      console.log("Using name:", name);
      console.log("Using url:", url);
      console.log("Using categoryId:", categoryId);
      
      if (!values.image || values.image.length === 0) {
        toast({
          variant: "destructive",
          title: "Image Required",
          description: "Please upload a subcategory image.",
        });
        return;
      }

      if (!name || name.trim() === '') {
        toast({
          variant: "destructive",
          title: "Name Required",
          description: "Please enter a subcategory name.",
        });
        return;
      }

      if (!url || url.trim() === '') {
        toast({
          variant: "destructive",
          title: "URL Required",
          description: "Please enter a subcategory URL.",
        });
        return;
      }
      
      if (!categoryId) {
        toast({
          variant: "destructive",
          title: "Category Required",
          description: "Please select a parent category.",
        });
        return;
      }
      
      // Create subcategory data object
      const subcategoryData = {
        id: data?.id ? data.id : v4(),
        name: name.trim(),
        image: values.image[0].url,
        url: url.trim(),
        featured: values.featured || false,
        categoryId: categoryId,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      console.log("Subcategory data being submitted:", subcategoryData);

      // Upserting subcategory data
      const response = await upsertSubCategory(subcategoryData);

      // Displaying success message
      toast({
        title: data?.id
          ? "SubCategory has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
      }
    } catch (error: any) {
      // Handling form submission errors
      console.error("SubCategory creation error:", error);
      
      toast({
        variant: "destructive",
        title: "Error Saving SubCategory",
        description: error.message || "There was a problem creating the subcategory. Please try again.",
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} SubCategory information.`
              : " Lets create a subCategory. You can edit subCategory later from the subCategories table or the subCategory page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Debug section - only visible during development */}
          {process.env.NODE_ENV === 'development' && debugValues && (
            <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
              <p>Debug - Current Form Values:</p>
              <pre>{JSON.stringify(debugValues, null, 2)}</pre>
              <p>Local state:</p>
              <pre>{JSON.stringify({ name: formName, url: formUrl, categoryId: formCategoryId }, null, 2)}</pre>
            </div>
          )}
          
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SubCategory Image</FormLabel>
                    <FormControl>
                      <ImageUpload
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name" 
                        {...field} 
                        value={field.value || formName}
                        onChange={(e) => {
                          console.log("Name field changed:", e.target.value);
                          setFormName(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory url</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/subCategory-url" 
                        {...field} 
                        value={field.value || formUrl}
                        onChange={(e) => {
                          setFormUrl(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length == 0}
                      onValueChange={(value) => {
                        setFormCategoryId(value);
                        field.onChange(value);
                      }}
                      value={field.value || formCategoryId}
                      defaultValue={field.value || formCategoryId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
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
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This SubCategory will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save SubCategory information"
                  : "Create SubCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
