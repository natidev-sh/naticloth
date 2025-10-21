import Link from "next/link"
import { ShoppingBag, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { CartDrawer } from "@/components/CartDrawer"
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

export function Navbar() {
  const navLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/shop?category=Men", label: "Men" },
    { href: "/shop?category=Women", label: "Women" },
    { href: "/shop?category=Accessories", label: "Accessories" },
  ]

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
                {navLinks.map(link => (
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
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <a
                            href={link.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-bold leading-none">{link.label}</div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                 <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={ "group inline-flex h-10 w-max items-center justify-center rounded-sm bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"}>
                      About
                    </NavigationMenuLink>
                  </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <SearchModal>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </SearchModal>
          <CartDrawer>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </CartDrawer>
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}