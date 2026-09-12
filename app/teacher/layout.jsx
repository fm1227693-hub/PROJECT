import AppShell from "@/components/layout/AppShell";

export const metadata = { title: "Teacher workspace" };

export default function TeacherLayout({ children }) {
  return (
    <AppShell navKey="teacher" title="Teacher workspace" breadcrumb={["Prisma", "Teacher"]}>
      {children}
    </AppShell>
  );
}
