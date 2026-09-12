import AppShell from "@/components/layout/AppShell";
import RoleGate from "@/components/auth/RoleGate";

export const metadata = { title: "Student workspace" };

export default function StudentLayout({ children }) {
  return (
    <RoleGate require="student">
      <AppShell navKey="student" title="Student workspace" breadcrumb={["Prisma", "Student"]}>
        {children}
      </AppShell>
    </RoleGate>
  );
}
