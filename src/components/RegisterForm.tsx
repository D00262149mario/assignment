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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Separator } from "./ui/separator";

const RegisterForm = () => {
  const router = useRouter();
  const registerSchema = z
    .object({
      name: z.string().min(1, { message: "Name cannot be empty" }),
      email: z
        .string()
        .min(1, "Email cannot be empty")
        .email("Invalid email address"),
      password: z.string().min(8, "Password should be at least 8 characters"),
      confirmPassword: z.string(),
      terms: z.literal(true, {
        errorMap: () => ({ message: "You must accept Terms and Conditions" }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const { name, email, password } = data;
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }).then((res) => res.json());

      if (response.status === 400) {
        toast.error("Registration failed: ", response);
      } else {
        toast.success(
          "Registration successful. Please login to access your account"
        );
        router.push("/login");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Registration failed: ", error);
      toast.error("Registration failed: ", error);
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
        <div className="max-w-sm">
          <h2 className="mt-6 text-center text-3xl font-medium text-slate-800">
            Create an Account
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="name"
              />

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
                    <FormLabel>Confirm Password</FormLabel>
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
                name="confirmPassword"
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
                      <p className="text-xs ">
                        I accept <span>Terms & Conditions</span>
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="terms"
              />

              <Button type="submit" className="max-w-sm">
                Register
              </Button>
              <div className="flex md:max-w-sm items-center gap-4 justify-center">
                <Separator className="w-1/3 h-[2px]" />
                <p className="text-center">or</p>
                <Separator className="w-1/3 h-[2px]" />
              </div>
              <div className="flex md:max-w-sm items-center gap-1 justify-center text-xs">
                <p>Already have an account?</p>
                <Link className="text-indigo-600" href="/login">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
