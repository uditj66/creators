"use client";
import { ModeToggle } from "@/components/buildComponents/toggleButton";
import { BarLoader } from "react-spinners";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { useStoreUser } from "@/hooks/use-store-user";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
const Navbar = () => {
  const path = usePathname();
  const { isLoading, isAuthenticated } = useStoreUser();
  if (path.includes("/dashboard")) {
    return null;
  }
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2">
        <Link href={isAuthenticated ? "/feed" : "/"}>
          <Image
            src={"/logo.png"}
            width={96}
            height={32}
            alt="logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>

        {path === "/" && (
          <div className="hidden lg:flex space-x-6 flex-1 justify-center">
            <Link
              href={"#features"}
              className="text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer"
            >
              Features
            </Link>
            <Link
              href={"#testimonials"}
              className="text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer"
            >
              Testimonials
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Unauthenticated>
            <SignInButton>
              <Button className="" variant={"ghost"}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant={"primary"} className="whitespace-nowrap">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="hidden sm:flex" size="sm">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline ml-2">DashBoard</span>
              </Button>
            </Link>
            <UserButton />
          </Authenticated>
        </div>

        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width={"95%"} color="#D8B4FE" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
