import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-black tracking-tighter">Admin Panel</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Welcome, Admin! This is where you will manage products, orders, and users.
      </p>
      {/* Product management UI will go here */}
    </div>
  )
}