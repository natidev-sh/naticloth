import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductTable } from '@/components/admin/ProductTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { CategoryTable } from '@/components/admin/CategoryTable'
import { CategoryForm } from '@/components/admin/CategoryForm'

export default async function AdminPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=You must be logged in to view this page.')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-black tracking-tighter">Access Denied</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You do not have the necessary permissions to view this page.
        </p>
      </div>
    )
  }

  const productsData = supabase.from('natishop_products').select('*').order('created_at', { ascending: false });
  const categoriesData = supabase.from('natishop_categories').select('*').order('name', { ascending: true });

  const [{ data: products }, { data: categories }] = await Promise.all([productsData, categoriesData]);

  return (
    <div className="container py-16">
      <div className="grid gap-16">
        <section>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Manage Products</h2>
              <p className="mt-1 text-lg text-muted-foreground">
                Add, edit, or delete products.
              </p>
            </div>
            <ProductForm categories={categories ?? []} />
          </div>
          <ProductTable products={products ?? []} categories={categories ?? []} />
        </section>

        <section>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Manage Categories</h2>
              <p className="mt-1 text-lg text-muted-foreground">
                Add or remove product categories.
              </p>
            </div>
            <CategoryForm />
          </div>
          <CategoryTable categories={categories ?? []} />
        </section>
      </div>
    </div>
  )
}