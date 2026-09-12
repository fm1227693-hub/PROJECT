import { AdminApplicationDetail } from "@/components/admin/AdminViews";

export const metadata = { title: "Application review" };

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminApplicationDetail id={id} />;
}
