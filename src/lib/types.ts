import { Prisma } from "@/generated/client";
import { getAllSubCategories } from "@/queries/subCategory";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}


// SubCategory with parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<typeof getAllSubCategories>[0]