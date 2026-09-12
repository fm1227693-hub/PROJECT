import AdminGate from "@/components/admin/AdminGate";

export const metadata = { title: { default: "Admin console", template: "%s · Admin · Prisma" }, robots: { index: false } };

export default function AdminLayout({ children }) {
  return <AdminGate>{children}</AdminGate>;
}
