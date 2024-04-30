"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="container mx-auto flex w-full justify-between p-4">
      <div className="flex gap-2 items-center justify-start">
        <Image src="/images/logo.png" width={40} height={40} alt="logo" />
        <h1 className="text-xl font-semibold text-primary">TodoGo</h1>
      </div>

      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default Navbar;
