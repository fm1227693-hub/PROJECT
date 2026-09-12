import AppShell from "@/components/layout/AppShell";
import RoleGate from "@/components/auth/RoleGate";

export const metadata = { title: "Teacher workspace" };

export default function TeacherLayout({ children }) {
  return (
    <RoleGate require="teacher">
      <AppShell navKey="teacher" title="Teacher workspace" breadcrumb={["Prisma", "Teacher"]}>
        {children}
      </AppShell>
    </RoleGate>
  );
}
