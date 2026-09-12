import { AdminLearningContent } from "@/components/admin/AdminContent";

export const metadata = { title: "Learning content · English" };

export default function Page() {
  return <AdminLearningContent initialSubject="english" />;
}
