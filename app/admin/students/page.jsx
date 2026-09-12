import { AdminStudents } from "@/components/admin/AdminViews";

export const metadata = { title: "Students", description: "The full student directory with scores, trends and access status." };

export default function Page() {
  return <AdminStudents />;
}
