"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AddTask from "./AddTask";
import Task from "./Task";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TaskList = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR(
    [`/api/task?id=${session?.token?.sub}`],
    fetcher,
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );

  if (error) {
    return <p className="text-center mt-10">Loading failed...</p>;
  }

  if (!data) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  return (
    <div className="container ms-auto flex flex-col w-full mt-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-[160px]">
            <PlusIcon className="mr-2" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new task</DialogTitle>
            <AddTask setOpen={setOpen} mutate={mutate} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Tabs defaultValue="pending" className="w-full mt-4">
        <TabsList className="grid w-[60%] grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent
          value="pending"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {data?.data.map((item: any, idx: number) => {
            console.log(item);
            return (
              item?.status === "PENDING" && (
                <Task mutate={mutate} key={idx} data={item} />
              )
            );
          })}
        </TabsContent>
        <TabsContent
          value="completed"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {data?.data.map((item: any, idx: number) => {
            console.log(item);
            return (
              item?.status === "COMPLETED" && (
                <Task mutate={mutate} key={idx} data={item} />
              )
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
