import AppShell from "@/components/layout/AppShell";

export const metadata = { title: "School workspace" };

export default function SchoolLayout({ children }) {
  return (
    <AppShell navKey="school" title="School workspace" breadcrumb={["Prisma", "School"]}>
      {children}
    </AppShell>
  );
}
