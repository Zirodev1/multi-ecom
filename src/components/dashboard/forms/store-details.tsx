"use client";

import { FC, useEffect } from "react";
import { Shop, ShopStatus } from "../../../generated/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StoreFormSchema } from "@/lib/schemas";
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

interface ShopDetailsProps {
  data?: Shop;
}

const ShopDetails: FC<ShopDetailsProps> = ({ data }) => {
  const { toast } = useToast();
  const router = useRouter();

  // Make sure default values are always strings, not undefined
  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
    email: data?.email || "",
    phone: data?.phone || "",
    logo: data?.logo ? [{ url: data?.logo }] : [],
    cover: data?.cover ? [{ url: data?.cover }] : [],
    url: data?.url || "",
    featured: data?.featured ?? false,
    status: data?.status?.toString() || "PENDING",
  };

  const form = useForm<z.infer<typeof StoreFormSchema>>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;

  // Reset form data if parent data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        email: data.email || "",
        phone: data.phone || "",
        logo: data.logo ? [{ url: data.logo }] : [],
        cover: data.cover ? [{ url: data.cover }] : [],
        url: data.url || "",
        featured: data.featured ?? false,
        status: data.status?.toString() || "PENDING",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    try {
      console.log("FORM VALUES SUBMITTED:", values);

      // Validate name is provided
      const shopName = values.name?.trim() || "";
      if (!shopName) {
        toast({
          variant: "destructive",
          title: "Shop name is required",
          description: "Please enter a valid shop name",
        });
        return;
      }

      // Create shop data with correct formatting
      const shopData = {
        id: data?.id || v4(),
        name: shopName,
        description: values.description?.trim() || "",
        email: values.email?.trim() || "",
        phone: values.phone?.trim() || "",
        // Extract the URL string from the array and ensure it's not undefined
        logo: values.logo && values.logo[0] ? values.logo[0].url : "",
        cover: values.cover && values.cover[0] ? values.cover[0].url : "",
        url: values.url?.trim() || "",
        featured: Boolean(values.featured),
        status: values.status as ShopStatus,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date()
      };

      console.log("Sending to server:", shopData);

      await upsertShop(shopData);
      console.log("Shop data processed");

      toast({
        title: data?.id
          ? "Shop has been updated."
          : `Congrats! Your shop "${shopName}" has been created.`,
      });

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/seller/shops");
      }
    } catch (err: any) {
      console.error("Error saving shop:", err);
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
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name || ""} shop information.`
              : "Let's create a Shop. You can edit the shop later from the shop settings tab."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10">
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={(field.value || []).map((image) => image.url || "")}
                          disabled={isLoading}
                          onChange={(url) => {
                            console.log("Logo changed:", url);
                            field.onChange([{ url }]);
                          }}
                          onRemove={(url) => {
                            console.log("Logo removed:", url);
                            field.onChange([
                              ...(field.value || []).filter(
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
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={(field.value || []).map((image) => image.url || "")}
                          disabled={isLoading}
                          onChange={(url) => {
                            console.log("Cover changed:", url);
                            field.onChange([{ url }]);
                          }}
                          onRemove={(url) => {
                            console.log("Cover removed:", url);
                            field.onChange([
                              ...(field.value || []).filter(
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
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shop Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email..." 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value || "")}
                          type="email" 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shop Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone..." 
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
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shop URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/shop-url" 
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
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={(checked) => field.onChange(checked || false)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Shop will appear on the home page
                      </FormDescription>
                    </div>
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
                  : data?.id
                  ? "Save Shop Information"
                  : "Create Shop"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDescription>
  );
};

export default ShopDetails;
