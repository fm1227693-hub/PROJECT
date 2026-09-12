import { AdminAnnouncements } from "@/components/admin/AdminContent";

export const metadata = { title: "Announcements", description: "Publish the site-wide banner and push it to every bell." };

export default function Page() {
  return <AdminAnnouncements />;
}
