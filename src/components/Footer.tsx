import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">NatiCloth</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Modern clothing for the modern individual.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">All</Link></li>
                <li><Link href="/shop?category=Men" className="text-sm text-muted-foreground hover:text-foreground">Men</Link></li>
                <li><Link href="/shop?category=Women" className="text-sm text-muted-foreground hover:text-foreground">Women</Link></li>
                <li><Link href="/shop?category=Accessories" className="text-sm text-muted-foreground hover:text-foreground">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Our Story</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Sustainability</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Facebook</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NatiCloth. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Made with{" "}
            <a
              href="https://natiweb.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              nati
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}