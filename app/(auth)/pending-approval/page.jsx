import PendingApproval from "@/components/auth/PendingApproval";

export const metadata = {
  title: "Application pending review",
  description: "Your teacher application has been submitted and is awaiting an administrator decision.",
  alternates: { canonical: "/pending-approval" },
};

export default function PendingApprovalPage() {
  return <PendingApproval />;
}
