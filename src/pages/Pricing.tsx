import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Book, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import pricingHeroBg from "@/assets/pricing-hero-bg.jpg";
import pricingAddons from "@/assets/pricing-addons.jpg";
import pricingTiers from "@/assets/pricing-tiers.jpg";
import faqSection from "@/assets/faq-section.jpg";
import ctaBackground from "@/assets/cta-background.jpg";
import coppaBadge from "@/assets/coppa-certified-badge.png";
import kidsafeBadge from "@/assets/kidsafe-certified-badge.png";
import encryptedBadge from "@/assets/encrypted-secure-badge.png";
import familyHistoryPreview from "@/assets/family-history-addon-preview.jpg";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try AI-powered Buddy with your family",
      features: [
        "2 AI-generated bedtime stories / month",
        "1 active AI-guided habit journey",
        "50 AI-powered learning questions / month",
        "1 child profile",
        "Story library"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Standard",
      price: "$15",
      period: "per month",
      description: "Perfect for most families",
      features: [
        "10 AI-generated bedtime stories / month",
        "3 active AI-guided journeys",
        "Unlimited AI-powered learning packs",
        "3 child profiles",
        "1 AI voice + 1 AI illustration style",
        "Story library with export",
        "Priority support"
      ],
      cta: "Start Standard",
      popular: true
    },
    {
      name: "Premium",
      price: "$25",
      period: "per month",
      description: "Unlimited AI-powered everything",
      features: [
        "Unlimited AI-generated stories",
        "Unlimited AI-guided journeys",
        "Unlimited AI-powered learning packs",
        "All AI voices + AI illustration styles",
        "Parent voice intro recordings",
        "Weekly family report",
        "Export & print AI stories/journals",
        "Priority support"
      ],
      cta: "Start Premium",
      popular: false
    }
  ];

  const familyHistoryTiers = [
    {
      name: "Basic",
      price: "$8",
      period: "per month",
      storage: "100 MB",
      transcription: "60 min/month",
      features: [
        "Unlimited family members & relationships",
        "AI photo captions & face detection",
        "Audio story recording & transcription",
        "Document upload & parsing (PDF, Word, images)",
        "Interactive family tree builder",
        "Per-child access controls with age gating"
      ]
    },
    {
      name: "Plus",
      price: "$18",
      period: "per month",
      storage: "500 MB",
      transcription: "150 min/month",
      features: [
        "All Basic features",
        "5x more storage for larger photo archives",
        "2.5x more transcription time"
      ]
    },
    {
      name: "Pro",
      price: "$35",
      period: "per month",
      storage: "2 GB",
      transcription: "300 min/month",
      features: [
        "All Plus features",
        "20x storage for extensive family archives",
        "5x transcription for comprehensive oral histories"
      ]
    }
  ];

  const addons = [
    { name: "Premium Story Pack", price: "$5", description: "10 additional premium stories" },
    { name: "Premium Journey Template", price: "$5", description: "Professionally crafted journey with 30+ missions" },
    { name: "Hardcover Keepsake", price: "$29", description: "Month of Stories & Journeys in a beautiful book" }
  ];

  const faqs = [
    {
      question: "What ages is Buddy for?",
      answer: "Great for 4–12. You set age-appropriate language & topics for all three pillars."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely. Cancel anytime from your parent dashboard. No hidden fees or penalties."
    },
    {
      question: "What happens if I downgrade?",
      answer: "You keep access to all stories, journeys, and learning history. You just can't create new content beyond your new plan limit."
    },
    {
      question: "Do you sell data or show ads?",
      answer: "Never. Your privacy is non-negotiable. We make money from subscriptions, not from your data."
    },
    {
      question: "Can I export or delete my family's data?",
      answer: "Yes—export stories & logs, or delete everything with one click from your parent dashboard."
    },
    {
      question: "Does Buddy work offline?",
      answer: "Bedtime stories you've saved can play offline. For new content generation (stories, journeys, learning), an internet connection is required."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pricingHeroBg} 
            alt="Family value and pricing"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/80" />
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-5 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">Simple plans. Family-friendly pricing.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No ads. No data resale. Just safe, magical experiences for your children.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pricingTiers} 
            alt="Pricing plan tiers"
            className="w-full h-full object-cover opacity-15"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Trust Banner */}
          <Card className="p-6 mb-12 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200 dark:border-emerald-800">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>No ads. No data resale.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Your family's stories stay yours.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>30-day money-back guarantee.</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src={coppaBadge} alt="COPPA Certified" className="h-12 w-12 object-contain" loading="lazy" />
                <img src={kidsafeBadge} alt="kidSAFE Certified" className="h-12 w-12 object-contain" loading="lazy" />
                <img src={encryptedBadge} alt="Encrypted & Secure" className="h-12 w-12 object-contain" loading="lazy" />
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`p-6 flex flex-col relative ${
                  plan.popular ? "border-2 border-primary shadow-lg scale-102" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate("/auth")}
                  className={plan.popular ? "bg-primary" : ""}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.name === "Free" ? "Start Sampler Free" : plan.name === "Standard" ? "Subscribe $15/mo" : "Subscribe $25/mo"}
                </Button>
                {plan.name === "Standard" && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    or $120/year (save 20%)
                  </p>
                )}
                {plan.name === "Premium" && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    or $180/year (save 25%)
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Family History Add-On */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
              NEW ADD-ON
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Family History</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Preserve your family stories and let your child discover their heritage through AI-powered conversations
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
            <img 
              src={familyHistoryPreview} 
              alt="Family History add-on showing family tree builder and photo library"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {familyHistoryTiers.map((tier) => (
              <Card key={tier.name} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-semibold text-primary">{tier.storage} storage</div>
                  <div className="text-sm font-semibold text-primary">{tier.transcription} transcription</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                  Add to Plan
                </Button>
              </Card>
            ))}
          </div>
          
          <Card className="p-6 bg-gradient-to-br from-background to-primary/5">
            <div className="flex items-start gap-4">
              <Book className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">How It Enhances the AI Buddy Experience</h3>
                <p className="text-muted-foreground">
                  Your child can ask their AI buddy questions like "Tell me about Grandma Rose" or "What did Great-Grandpa do?" 
                  and receive warm, age-appropriate responses with family photos and stories. Build your family tree, 
                  record oral histories, and upload photos—all while maintaining control over what each child can access based on their age.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Other Add-Ons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pricingAddons} 
            alt="Add-ons and extras"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Other Add-Ons</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {addons.map((addon) => (
              <Card key={addon.name} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{addon.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{addon.price}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  Add to Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={faqSection} 
            alt="Frequently asked questions"
            className="w-full h-full object-cover opacity-15"
            loading="lazy"
          />
        </div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-6">
                <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={ctaBackground} 
            alt="Start free today"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/85" />
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Start tonight for free</h2>
          <p className="text-xl text-muted-foreground">
            2 stories, 1 journey, 50 learning questions—free. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Free Today
          </Button>
          <p className="text-sm text-muted-foreground">
            No ads · No data resale · Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
