import SubCategoryDetails from '@/components/dashboard/forms/subCategory-details';
import DataTable from '@/components/ui/data-table';
import { getAllCategories } from '@/queries/category';
import { getAllSubCategories } from '@/queries/subCategory'
import { Plus } from 'lucide-react';
import React from 'react'
import { columns } from './columns';

export default async function AdminSubCategoryPage() {
  // Fetch subCategories from form databse
  const subCategories = await getAllSubCategories();

  if(!subCategories) return null;

  // Fetching categories from database
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15}/>
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      filterValue='name'
      newTabLink='/dashboard/admin/subCategories/new'
      data={subCategories}
      searchPlaceholder='Search subCategory...'
      columns={columns}
    />
  )
}
