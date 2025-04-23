"use client"

import { FC, useEffect } from "react"
import { Category } from "../../../generated/client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { CategoryFormSchema } from "@/lib/schemas";
import { AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import ImageUpload from "../shared/image-upload"
import { upsertCategory } from "@/queries/category"
import { v4 } from "uuid"
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"

interface CategoryDetailsProps {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails:FC<CategoryDetailsProps> = ({
  data, 
  cloudinary_key
}) => {
  const { toast } = useToast();
  const router = useRouter();

  // Define default values explicitly
  const defaultValues = {
    name: data?.name || "",
    image: data?.image ? [{ url: data?.image }] : [],
    url: data?.url || "",
    featured: data?.featured ?? false
  };

  console.log("Default values:", defaultValues);

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const isLoading = form.formState.isSubmitting;

  // Reset form data if parent data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        image: data.image ? [{ url: data.image }] : [],
        url: data.url || "",
        featured: data.featured ?? false
      });
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      console.log("FORM VALUES SUBMITTED:", values);
      
      if (!values.name || values.name.trim() === "") {
        toast({
          variant: "destructive",
          title: "Category name is required",
          description: "Please enter a valid category name"
        });
        return;
      }

      const categoryData = {
        id: data?.id || v4(),
        name: values.name.trim(),
        image: values.image && values.image[0] ? values.image[0].url : "",
        url: values.url.trim(),
        featured: values.featured ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log("Sending to server:", categoryData);
      
      const response = await upsertCategory(categoryData);

      toast({
        title: data?.id 
          ? "Category has been updated." 
          : `Congrats ${response.name} has now been created.`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (err: any) {
      console.error("Error saving category:", err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: err.toString(),
      });
    }
  };

  return (
    <AlertDescription>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {
              data?.id ? `Update ${data?.name} category information.` :
              "Lets create a category. Editing Category can be done in the category tab."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        cloudinary_key={cloudinary_key}
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
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name" 
                        {...field} 
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
                    <FormLabel>Category Url</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/category-url" 
                        {...field}
                        required
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
              <Button type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading
                  ? "Loading.."
                  : data?.id
                  ? "Save Category Information"
                  : "Create Category"
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDescription>
  );
};

export default CategoryDetails;