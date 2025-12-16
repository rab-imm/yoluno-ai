import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Your Privacy, Our Promise</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Last updated: January 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Paliyo, we understand that your family's privacy is sacred. This Privacy Policy explains how we collect, use, protect, and share information when you use our services. We are committed to transparency and giving you control over your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
              <h3 className="text-xl font-semibold mb-3">What We Collect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Account Information:</strong> Email, name, and payment details for parent accounts</li>
                <li><strong>Child Profile Data:</strong> First name, age, and preferences you provide</li>
                <li><strong>Conversation Logs:</strong> Chat interactions for safety monitoring and service improvement</li>
                <li><strong>Usage Data:</strong> App interactions, feature usage, and technical diagnostics</li>
                <li><strong>Family Content:</strong> Stories, photos, and memories you voluntarily upload (Premium only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Provide and personalize our AI companion services</li>
                <li>Monitor conversations for child safety and content appropriateness</li>
                <li>Generate usage reports and insights for parents</li>
                <li>Improve our AI models and features</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service updates and newsletters (with consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>We do NOT sell or rent your data. Period.</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We only share data in these limited circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate (e.g., cloud hosting, payment processing) under strict contracts</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>With Your Consent:</strong> Any other sharing requires your explicit permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have complete control over your data:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                <li><strong>Correction:</strong> Update inaccurate information anytime</li>
                <li><strong>Deletion:</strong> Request full account and data deletion (GDPR/CCPA compliant)</li>
                <li><strong>Export:</strong> Download conversation logs and uploaded content</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails or withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy (COPPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without verifiable parental consent. All child interactions are monitored by parents through full conversation logs and safety controls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use industry-standard security measures including encryption (at rest and in transit), secure servers, and regular security audits. However, no system is 100% secure—we continuously monitor and improve our protections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about privacy? Email us at <a href="mailto:privacy@paliyo.com" className="text-primary hover:underline">privacy@paliyo.com</a> or visit our Support page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
