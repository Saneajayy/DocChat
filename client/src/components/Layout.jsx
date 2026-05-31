import { Outlet, Link } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BookOpen, LayoutDashboard, PlusCircle } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between h-[72px] px-8">
          
          {/* Left: Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center justify-center bg-black text-white w-10 h-10 font-bold text-xl tracking-tighter">
            D
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-black">
            <SignedIn>
              <Link to="/dashboard" className="hover:opacity-70 transition-opacity">
                Dashboard
              </Link>
              <Link to="/" className="hover:opacity-70 transition-opacity">
                Upload PDF
              </Link>
              <Link to="/about" className="hover:opacity-70 transition-opacity">
                About
              </Link>
            </SignedIn>
            <SignedOut>
              <Link to="/about" className="hover:opacity-70 transition-opacity mr-4">
                About
              </Link>
              <span className="text-black/60">Sign in to start chatting with your PDFs</span>
            </SignedOut>
          </nav>

          {/* Right: Auth */}
          <div className="flex items-center justify-end w-10">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-black",
                  }
                }}
              />
            </SignedIn>
          </div>
          
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
