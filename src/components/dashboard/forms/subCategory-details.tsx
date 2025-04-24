"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Category, SubCategory } from "@/generated/client";

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

  // Initialize default values explicitly
  const defaultValues = {
    name: data?.name || "",
    image: data?.image ? [{ url: data?.image }] : [],
    url: data?.url || "",
    featured: data?.featured ?? false,
    categoryId: data?.categoryId || (categories[0]?.id || "")
  };

  console.log("Default values:", defaultValues);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(SubCategoryFormSchema), // Resolver for form validation
    defaultValues,
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Watch all form values for debugging
  const formValues = form.watch();
  console.log("Current form values:", formValues);

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        image: data.image ? [{ url: data.image }] : [],
        url: data.url || "",
        featured: data.featured ?? false,
        categoryId: data.categoryId || "",
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const onSubmit = async (values: z.infer<typeof SubCategoryFormSchema>) => {
    try {
      console.log("FORM VALUES SUBMITTED:", values);
      
      // Validate name field directly
      if (!values.name || values.name.trim() === "") {
        toast({
          variant: "destructive",
          title: "SubCategory name is required",
          description: "Please enter a valid name for the subcategory"
        });
        return;
      }

      // Validate categoryId field
      if (!values.categoryId) {
        toast({
          variant: "destructive", 
          title: "Category selection is required",
          description: "Please select a parent category"
        });
        return;
      }

      // Prepare data with explicit conversions
      const subCategoryData = {
        id: data?.id || v4(),
        name: String(values.name).trim(),
        image: values.image && values.image[0] ? String(values.image[0].url) : "",
        url: String(values.url || "").trim(),
        featured: Boolean(values.featured),
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: String(values.categoryId)
      };
      
      console.log("Sending to server:", subCategoryData);
      
      const response = await upsertSubCategory(subCategoryData);

      toast({
        title: data?.id 
          ? "SubCategory has been updated." 
          : `Congrats ${response.name} has now been created.`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
      }
    } catch (err: any) {
      console.error("Error saving subcategory:", err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: err.toString(),
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => {
                          console.log("Image changed:", url);
                          field.onChange([{ url }]);
                        }}
                        onRemove={(url) => {
                          console.log("Image removed:", url);
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubCategory url</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/subCategory-url" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length === 0}
                      onValueChange={(value) => {
                        console.log("Category selected:", value);
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                      defaultValue={field.value || ""}
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
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          console.log("Featured changed:", checked);
                        }}
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

              <Button type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading
                  ? "Loading..."
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