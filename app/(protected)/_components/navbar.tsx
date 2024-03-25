"use client";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-secondary flex justify-between items-center p-4 shadow-sm absolute top-0 left-0 right-0 h-16">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/admin" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/settings">Settings</Link>
        </Button>

        <Button
          asChild
          variant={pathname === "/marrow" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/marrow">Marrow report</Link>
        </Button>
      </div>
      <UserButton />
    </div>
  );
};
