"use client";
import { logout } from "@/actions/logout";
// import { signOut } from "next-auth/react"

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export default function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = () => {
    logout();
  };

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}
