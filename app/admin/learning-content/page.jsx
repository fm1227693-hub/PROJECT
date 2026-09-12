import { AdminLearningContent } from "@/components/admin/AdminContent";

export const metadata = { title: "Learning content", description: "Manage the lessons, practice sets and review units behind every topic." };

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  return <AdminLearningContent initialSubject={sp?.subject === "english" ? "english" : "math"} initialTopic={sp?.topic ?? null} />;
}
