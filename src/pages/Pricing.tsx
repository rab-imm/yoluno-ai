import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import pricingHeroBg from "@/assets/pricing-hero-bg.jpg";
import pricingAddons from "@/assets/pricing-addons.jpg";
import pricingTiers from "@/assets/pricing-tiers.jpg";
import faqSection from "@/assets/faq-section.jpg";
import ctaBackground from "@/assets/cta-background.jpg";

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
          />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
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
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pricingAddons} 
            alt="Add-ons and extras"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Add-Ons</h2>
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
