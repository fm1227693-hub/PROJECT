import PageHeader from "@/components/layout/PageHeader";
import TestRunner from "@/components/test/TestRunner";

export const metadata = { title: "English diagnostic" };

export default function EnglishTestPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="English diagnostic"
        description="Grammar, vocabulary, reading and listening. Read passages fully — inference items reward patience."
      />
      <TestRunner subject="english" />
    </div>
  );
}
