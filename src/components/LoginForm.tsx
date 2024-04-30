"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const LoginForm = () => {
  const router = useRouter();
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email cannot be empty")
      .email("Invalid email address"),
    password: z.string().min(1, "Password cannot be empty"),
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const response: any = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!response?.error) {
      router.push("/");
      router.refresh();
    }

    if (response.ok) {
      toast.success("Login Success");
    } else {
      toast.error("Login Failed: " + response.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 gap-8">
      <div className="hidden md:flex md:w-1/2 item">
        <Image
          src="/images/login_illustration.svg"
          width={600}
          height={0}
          alt="Login"
        />
      </div>
      <div className="w-1/2 max-w-md space-y-8">
        <div className="md:max-w-sm">
          <h2 className="mt-6 text-center text-3xl font-medium text-slate-800">
            Sign in to your account
          </h2>
        </div>
        <Form {...form}>
          <form
            className="mt-8 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 max-w-sm">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="email"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="password"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-x-2 items-center">
                      <FormControl>
                        <Checkbox
                          onCheckedChange={field.onChange}
                          checked={field.value}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs ">Remember me</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="remember"
              />
              <Button className="max-w-sm">Sign-in</Button>
              <div className="flex md:max-w-sm items-center gap-4 justify-center">
                <Separator className="w-1/3 h-[2px]" />
                <p className="text-center">or</p>
                <Separator className="w-1/3 h-[2px]" />
              </div>
              <div className="flex md:max-w-sm items-center gap-1 justify-center text-xs">
                <p>Are you new?</p>
                <Link className="text-indigo-600" href="/register">
                  Create an Account
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
