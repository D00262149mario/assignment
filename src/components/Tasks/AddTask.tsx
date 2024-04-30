"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const AddTask = ({ setOpen, mutate }) => {
  const { data: session } = useSession();
  const taskSchema = z.object({
    name: z.string().min(1, "Title cannot be empty"),
    description: z.string(),
    color: z.string(),
    priority: z.string(),
  });
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#1d4ed8",
      priority: "LOW",
    },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    const { name, description, color, priority } = data;
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          userId: session?.token?.sub,
          color: color,
          priority: priority,
        }),
      }).then((res) => res.json());
      console.log(response);
      if (response.status === 400 || response.status === 500) {
        toast.error("Error: " + response?.message);
      } else {
        toast.success("Task added successfully");
        form.reset();
      }
    } catch (error: any) {
      toast.error("Failed while adding task: ", error);
    } finally {
      setOpen(false);
      mutate();
    }
  };
  return (
    <Form {...form}>
      <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Go Shopping" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          control={form.control}
          name="description"
        />
        <div className="flex items-center justify-start gap-4">
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#374151">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#374151]" />
                          <p>Gray</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#b91c1c">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#b91c1c]" />
                          <p>Red</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#b45309">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#b45309]" />
                          <p>Amber</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#15803d">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#15803d]" />
                          <p>Green</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#1d4ed8">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#1d4ed8]" />
                          <p>Blue</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#7e22ce">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#7e22ce]" />
                          <p>Purple</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="#be185d">
                        <div className="flex gap-2 items-center w-full">
                          <div className="w-6 h-6 rounded-full bg-[#be185d]" />
                          <p>Pink</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="color"
          />
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="priority"
          />
        </div>

        <Button>Add</Button>
      </form>
    </Form>
  );
};

export default AddTask;
