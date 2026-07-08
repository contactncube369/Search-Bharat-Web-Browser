import { Hero } from "@/components/Hero";
import { SmartDownload } from "@/components/SmartDownload";
import { ManualDownloads } from "@/components/ManualDownloads";
import { VersionInfo } from "@/components/VersionInfo";
import { InstallationSteps } from "@/components/InstallationSteps";
import { SecurityTrust } from "@/components/SecurityTrust";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "SearchBharat Browser | Fast & Secure",
  description: "Download SearchBharat Browser. AI-Powered Privacy, Security, and Speed for Windows and macOS.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-brand-500/30">
      <Hero />
      <SmartDownload />
      <ManualDownloads />
      <VersionInfo />
      <InstallationSteps />
      <SecurityTrust />
      <Footer />
    </main>
  );
}
