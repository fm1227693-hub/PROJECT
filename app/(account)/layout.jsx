import AppShell from "@/components/layout/AppShell";

export const metadata = { title: "Account" };

/** Settings and billing sit outside any single role but keep the same chrome. */
export default function AccountLayout({ children }) {
  return (
    <AppShell navKey="account" title="Account" breadcrumb={["Prisma", "Account"]}>
      {children}
    </AppShell>
  );
}
