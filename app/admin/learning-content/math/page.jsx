import { AdminLearningContent } from "@/components/admin/AdminContent";

export const metadata = { title: "Learning content · Mathematics" };

export default function Page() {
  return <AdminLearningContent initialSubject="math" />;
}
