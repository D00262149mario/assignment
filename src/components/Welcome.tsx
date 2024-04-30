"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Welcome = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-6 justify-start items-center container mx-auto w-[90%] rounded-[8px] h-auto p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
      <Image
        src="/images/welcome.svg"
        width={200}
        height={300}
        alt="welcome"
        className="hidden md:block"
      />
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-3xl">Welcome back, {session?.token?.name}!</h1>
        <p className="text-md w-[60%]">
          It&apos;s great to see you here. You&apos;re all set to stay organized
          and productive with our Todo app.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
