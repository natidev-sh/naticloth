import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="NatiCloth Logo" width={140} height={35} className="h-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              High-fashion statements for the unapologetically bold.
            </p>
          </div>
          <div className="grid grid-cols-2 col-span-2 gap-8">
            <div>
              <h3 className="font-bold mb-4 tracking-wider uppercase">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">All Products</Link></li>
                <li><Link href="/shop?category=Men" className="text-sm text-muted-foreground hover:text-foreground">Men</Link></li>
                <li><Link href="/shop?category=Women" className="text-sm text-muted-foreground hover:text-foreground">Women</Link></li>
                <li><Link href="/shop?category=Accessories" className="text-sm text-muted-foreground hover:text-foreground">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 tracking-wider uppercase">Info</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-dashed pt-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NatiCloth Inc. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <a href="https://natiweb.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground">nati</a>
          </p>
        </div>
      </div>
    </footer>
  )
}