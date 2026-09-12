import AppShell from "@/components/layout/AppShell";

export const metadata = { title: "Student workspace" };

export default function StudentLayout({ children }) {
  return (
    <AppShell navKey="student" title="Student workspace" breadcrumb={["Prisma", "Student"]}>
      {children}
    </AppShell>
  );
}
