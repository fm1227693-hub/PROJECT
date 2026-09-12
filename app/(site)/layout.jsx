import SiteNavbar from "@/components/layout/SiteNavbar";
import SiteFooter from "@/components/layout/SiteFooter";

/** Public marketing site: sticky navbar, editorial content, full footer. */
export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SiteNavbar />
      <main id="main" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
