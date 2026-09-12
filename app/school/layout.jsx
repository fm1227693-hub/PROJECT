import AppShell from "@/components/layout/AppShell";
import RoleGate from "@/components/auth/RoleGate";

export const metadata = { title: "School workspace" };

export default function SchoolLayout({ children }) {
  return (
    <RoleGate require="school">
      <AppShell navKey="school" title="School workspace" breadcrumb={["Prisma", "School"]}>
        {children}
      </AppShell>
    </RoleGate>
  );
}
