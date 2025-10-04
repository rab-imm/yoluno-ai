import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Book } from "lucide-react";
import { Card } from "@/components/ui/card";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out bedtime stories",
      features: [
        "2 bedtime stories / month",
        "50 learning questions / month",
        "1 child profile",
        "Basic voices & illustrations",
        "Story library"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Standard",
      price: "$15",
      period: "per month",
      description: "Great for families with regular bedtime routines",
      features: [
        "10 bedtime stories / month",
        "Unlimited learning questions",
        "3 child profiles",
        "1 premium voice style",
        "1 illustration style",
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
      description: "Everything you need for magical bedtimes",
      features: [
        "Unlimited bedtime stories",
        "Unlimited learning questions",
        "Unlimited child profiles",
        "All premium voices",
        "All illustration styles",
        "Parent voice recordings",
        "Weekly family insights",
        "Print & export stories",
        "Custom content packs",
        "Priority support"
      ],
      cta: "Start Premium",
      popular: false
    }
  ];

  const addons = [
    { name: "Premium Story Bundle", price: "$5", description: "10 additional premium stories" },
    { name: "Hardcover Storybook", price: "$29", description: "30 stories in a beautiful keepsake book" }
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely. Cancel anytime from your parent dashboard. No hidden fees or penalties."
    },
    {
      question: "What happens to my stories if I downgrade?",
      answer: "You keep access to all stories you've created. You just can't create new ones beyond your new plan limit."
    },
    {
      question: "Do you sell data or show ads?",
      answer: "Never. Your privacy is non-negotiable. We make money from subscriptions, not from your data."
    },
    {
      question: "What if my child exceeds the question limit?",
      answer: "On the Free plan, they'll see a gentle message to try again tomorrow. On paid plans, questions are unlimited."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-6xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Simple plans. Family-friendly pricing.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No ads. No data resale. Just safe, magical experiences for your children.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`p-8 flex flex-col relative ${
                  plan.popular ? "border-2 border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
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
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Add-Ons</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {addons.map((addon) => (
              <Card key={addon.name} className="p-6 hover:shadow-lg transition-shadow">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
      <section className="py-20 px-4 bg-gradient-to-br from-child-primary/10 to-child-secondary/10">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold">Start tonight for free</h2>
          <p className="text-xl text-muted-foreground">
            2 free bedtime stories. 50 free questions. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Create Your First Story
          </Button>
          <p className="text-sm text-muted-foreground">
            Cancel anytime • No hidden fees • No ads • No data resale
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
