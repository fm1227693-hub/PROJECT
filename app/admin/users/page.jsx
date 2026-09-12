import { AdminUsers } from "@/components/admin/AdminViews";

export const metadata = { title: "All users", description: "Every student, teacher and administrator account on the platform." };

export default function Page() {
  return <AdminUsers />;
}
