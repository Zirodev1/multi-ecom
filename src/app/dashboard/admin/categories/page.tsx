import React from 'react'
import DataTable from '@/components/ui/data-table';
import { getAllCategories } from '@/queries/category'
import { Plus } from 'lucide-react';
import CategoryDetails from '@/components/dashboard/forms/category-details';
import { columns } from './columns';

export default async function AdminCategoriesPage() {

  const categories = await getAllCategories();

  if (!categories) return null;

  return (
    <DataTable 
      actionButtonText={
        <>
          <Plus size={15}/>
          Create Category
        </>
      }
      modalChildren={<CategoryDetails />}
      filterValue='name'
      newTabLink='/dashboard/admin/categories/new'
      data={categories}
      searchPlaceholder='Search category name...'
      columns={columns}
    />
  )
}
