import Link from "next/link"
import { ShoppingBag, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SearchModal } from "@/components/SearchModal"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import AuthButton from "./AuthButton"
import { createClient } from "@/lib/supabase/server"
import React from "react"
import { cn } from "@/lib/utils"
import { CartButton } from "./CartButton"

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none">{title}</div>
          {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export async function Navbar() {
  const supabase = createClient()
  const { data: products } = await supabase.from('natishop_products').select('id, name')
  const { data: categories } = await supabase.from('natishop_categories').select('name').order('name')

  const categoryLinks = categories?.map(c => ({ href: `/shop?category=${c.name}`, label: c.name })) ?? []
  const allNavLinks = [{ href: "/shop", label: "Shop All" }, ...categoryLinks]

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background">
      <div className="container flex h-20 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r-2 border-foreground">
              <Link href="/" className="mb-8 flex items-center">
                <ShoppingBag className="h-6 w-6 mr-2" />
                <span className="text-lg font-bold">NatiCloth</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {allNavLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xl font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-black tracking-tighter">
              NatiCloth
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="mx-auto hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-[.75fr_1fr] gap-3 p-4 md:w-[500px] lg:w-[700px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="https://natiweb.vercel.app/pro/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="mb-2 mt-4 text-lg font-bold text-primary">
                            Get Nati Pro
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Build and deploy modern web apps with an AI co-pilot.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                    <ul className="col-start-2 grid grid-cols-2 gap-3">
                      <ListItem href="/shop" title="Shop All" />
                      {categoryLinks.map((link) => (
                        <ListItem
                          key={link.href}
                          href={link.href}
                          title={link.label}
                        />
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                 <NavigationMenuLink asChild>
                    <Link href="/about" className={ "group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"}>
                      About
                    </Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <SearchModal products={products ?? []}>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </SearchModal>
          <CartButton />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}