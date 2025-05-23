"use client";

// React
import { FC, useEffect, useState } from "react";

// Prisma model
import { Category } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { CategoryFormSchema } from "@/lib/schemas";

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
import { upsertCategory } from "@/queries/category";

// Utils
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  const [debugValues, setDebugValues] = useState<any>(null);
  const [formName, setFormName] = useState<string>(data?.name || "");
  const [formUrl, setFormUrl] = useState<string>(data?.url || "");

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(CategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  });

  // Output form values for debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      setDebugValues(value);
      
      // Keep local state in sync
      if (value.name !== undefined) setFormName(value.name);
      if (value.url !== undefined) setFormUrl(value.url);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
      });
      setFormName(data?.name || "");
      setFormUrl(data?.url || "");
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      
      // Get values from local state as fallback
      const name = values.name || formName;
      const url = values.url || formUrl;

      
      if (!values.image || values.image.length === 0) {
        toast({
          variant: "destructive",
          title: "Image Required",
          description: "Please upload a category image.",
        });
        return;
      }

      if (!name || name.trim() === '') {
        toast({
          variant: "destructive",
          title: "Name Required",
          description: "Please enter a category name.",
        });
        return;
      }

      if (!url || url.trim() === '') {
        toast({
          variant: "destructive",
          title: "URL Required",
          description: "Please enter a category URL.",
        });
        return;
      }
      
      
      // Create category object with explicit name field
      const categoryData = {
        id: data?.id ? data.id : v4(),
        name: name.trim(),
        url: url.trim(),
        image: values.image[0].url,
        featured: values.featured || false,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      
      // Upserting category data
      const response = await upsertCategory(categoryData);

      // Displaying success message
      toast({
        title: data?.id
          ? "Category has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      // Handling form submission errors
      console.error("Category creation error:", error);
      
      toast({
        variant: "destructive",
        title: "Error Saving Category",
        description: error.message || "There was a problem creating the category. Please try again.",
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category information.`
              : " Lets create a category. You can edit category later from the categories table or the category page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Debug section - only visible during development */}
          {process.env.NODE_ENV === 'development' && debugValues && (
            <div className="mb-4 p-2 bg-gray-100 text-xs rounded">
              <p>Debug - Current Form Values:</p>
              <pre>{JSON.stringify(debugValues, null, 2)}</pre>
              <p>Local state:</p>
              <pre>{JSON.stringify({ name: formName, url: formUrl }, null, 2)}</pre>
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
                    <FormLabel>Category Image</FormLabel>
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
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name" 
                        {...field} 
                        value={field.value || formName}
                        onChange={(e) => {
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
                    <FormLabel>Category url</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/category-url" 
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
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
