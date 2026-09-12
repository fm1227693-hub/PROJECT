import PageHeader from "@/components/layout/PageHeader";
import TestRunner from "@/components/test/TestRunner";

export const metadata = { title: "Mathematics diagnostic" };

export default function MathTestPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Mathematics diagnostic"
        description="Fifteen items across arithmetic, algebra and geometry. Answer honestly — the report is only as good as the inputs."
      />
      <TestRunner subject="math" />
    </div>
  );
}
