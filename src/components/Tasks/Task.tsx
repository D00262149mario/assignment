"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
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

const Task = ({ data, mutate }) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const taskUpdateSchema = z.object({
    name: z.string().min(1, "Title cannot be empty"),
    description: z.string(),
    color: z.string(),
    priority: z.string(),
    status: z.string(),
  });
  const form = useForm<z.infer<typeof taskUpdateSchema>>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
      color: data?.color,
      priority: data?.priority,
      status: data?.status,
    },
  });

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/task?id=${data?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (response.status === 400 || response.status === 500) {
        toast.error("Error: " + response?.message);
      } else {
        toast.success("Task deleted successfully");
      }
    } catch (error: any) {
      toast.error("Failed while deleting task: ", error);
    } finally {
      setOpen(false);
      mutate();
    }
  };

  const onSubmit = async (formData: z.infer<typeof taskUpdateSchema>) => {
    const { name, description, color, priority, status } = formData;
    try {
      const response = await fetch("/api/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          color: color,
          priority: priority,
          status: status,
          userId: session?.token?.sub,
          id: data?.id,
        }),
      }).then((res) => res.json());

      if (response.status === 400 || response.status === 500) {
        toast.error("Error: " + response?.message);
      } else {
        toast.success("Task updated successfully");
      }
    } catch (error: any) {
      toast.error("Failed while updating task: ", error);
    } finally {
      setOpen(false);
      mutate();
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className={cn(
            "w-full text-white cursor-pointer hover:scale-105 transition-transform duration-300",
            `bg-[${data?.color}]`
          )}
        >
          <CardHeader className="flex flex-col gap-1s">
            <CardTitle>{data?.name}</CardTitle>
            <CardDescription className="text-white">
              {data?.description}
            </CardDescription>
            <p className="flex items-center justify-center p-0.5 bg-red-200 text-red-700 text-xs w-[60px] rounded-[12px] capitalize">
              {data?.priority}
            </p>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form className="mt-8 space-y-6">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Go Shopping"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Write your description"
                          {...field}
                        />
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
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                  name="status"
                />
              </form>
            </Form>
            <div className="flex justify-between items-center mt-8">
              <Button onClick={form.handleSubmit(onSubmit)} type="submit">
                Update
              </Button>
              <Button onClick={onDelete} variant="destructive">
                Delete Task
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Task;
