import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const COPPA = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Kid-Safe from Day One</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Our commitment to COPPA compliance and children's privacy
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">COPPA Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paliyo is fully compliant with the Children's Online Privacy Protection Act (COPPA), a U.S. federal law designed to protect children's privacy online. We are committed to providing a safe, transparent experience that puts parents in control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What is COPPA?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                COPPA requires websites and online services directed at children under 13 to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Obtain verifiable parental consent before collecting personal information from children</li>
                <li>Provide clear privacy policies explaining data collection practices</li>
                <li>Give parents control over their children's information</li>
                <li>Maintain reasonable security measures to protect collected data</li>
                <li>Retain children's information only as long as necessary</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How Paliyo Complies</h2>
              
              <h3 className="text-xl font-semibold mb-3">1. Verifiable Parental Consent</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before any child interaction, we require parents to:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>Create a parent account with verified email address</li>
                <li>Review and accept our Privacy Policy and Terms of Service</li>
                <li>Actively create and configure each child profile</li>
                <li>Approve all content sources and topic packs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2. Information Collection</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect minimal information from children:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li><strong>First name only</strong> (no last names or full names)</li>
                <li><strong>Age</strong> (to provide age-appropriate content)</li>
                <li><strong>Chat interactions</strong> (for safety monitoring and service improvement)</li>
                <li><strong>No direct identifiers:</strong> We never collect addresses, phone numbers, social security numbers, or photos of children</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3. Parent Control Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Parents have complete oversight through:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li><strong>Full conversation logs:</strong> View every chat in detail</li>
                <li><strong>Content controls:</strong> Approve topics, themes, and learning packs</li>
                <li><strong>Instant alerts:</strong> Notifications for flagged content or new topics</li>
                <li><strong>Export tools:</strong> Download all data associated with your child</li>
                <li><strong>Deletion rights:</strong> Request complete data removal at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We protect children's information with:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>Industry-standard encryption (TLS/SSL) for all data transmission</li>
                <li>Secure cloud storage with access controls and audit logs</li>
                <li>Regular security audits by third-party experts</li>
                <li>Employee training on COPPA requirements and child safety</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5. No Third-Party Sharing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We do not share, sell, or rent children's personal information to third parties. Data is used solely to provide our services and may only be shared with service providers under strict contracts that prohibit further use or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Parent Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under COPPA, parents have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Review:</strong> Request to see all information collected about your child</li>
                <li><strong>Delete:</strong> Request deletion of your child's information</li>
                <li><strong>Refuse:</strong> Refuse further collection or use of your child's information</li>
                <li><strong>Revoke:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, visit your Parent Dashboard or contact us at <a href="mailto:privacy@paliyo.com" className="text-primary hover:underline">privacy@paliyo.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Additional Safeguards</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Beyond COPPA requirements, Paliyo implements extra protections:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>AI Safety Filter:</strong> All responses pass through child-appropriate content filters</li>
                <li><strong>Closed Knowledge Sandbox:</strong> AI can only access parent-approved content sources</li>
                <li><strong>Empathy-First Responses:</strong> AI trained to use kind, supportive language</li>
                <li><strong>Gentle Redirects:</strong> Off-topic questions are redirected without making children feel bad</li>
                <li><strong>No Ads:</strong> Zero advertising or commercial marketing to children</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Annual Audits</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paliyo undergoes annual third-party audits to verify COPPA compliance. Our most recent audit report is available upon request at <a href="mailto:compliance@paliyo.com" className="text-primary hover:underline">compliance@paliyo.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We're here to address any concerns about your child's privacy. Contact our compliance team at <a href="mailto:privacy@paliyo.com" className="text-primary hover:underline">privacy@paliyo.com</a> or visit our Support page for immediate assistance.
              </p>
              <Button onClick={() => navigate("/support")} size="lg">
                Contact Support
              </Button>
            </section>

            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> January 2025 | <strong>Next Audit:</strong> December 2025
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default COPPA;
