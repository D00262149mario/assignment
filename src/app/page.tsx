import TaskList from "@/components/Tasks/TaskList";
import Welcome from "@/components/Welcome";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <Welcome />
      <TaskList />
    </main>
  );
}
