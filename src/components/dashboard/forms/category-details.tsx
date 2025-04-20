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

interface CategoryDetailsProps {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails:FC<CategoryDetailsProps> = ({data, cloudinary_key}) => {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured ?? false,
    },
  })

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if(data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
      })
    }
  }, [data, form])

  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    console.log(values)
  }

  return (
    <AlertDescription>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {
              data?.id ? `Udate ${data?.name} category information.` :
              "Lets create a category. Editing Category can be done in the category tab."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        cloudinary_key={cloudinary_key}
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
                render={({field}) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
              )}
             />
             <FormField 
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({field}) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category Url</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
              )}
             />
             <FormField 
                control={form.control}
                name="featured"
                render={({field}) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        // @ts-ignore
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
              {
                isLoading
                ? "Loading.."
                : data?.id
                ? "Save Category Infromation"
                : "Create Category"
              }
             </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDescription>
  )
}

export default CategoryDetails;