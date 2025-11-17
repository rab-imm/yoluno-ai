import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import supportChatInterface from "@/assets/support-chat-interface.jpg";

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    queryType: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours. Check your email for our response.",
    });
    setFormData({ name: "", email: "", queryType: "", message: "" });
  };

  const faqs = [
    {
      question: "How do conversation turns work?",
      answer: "One story typically uses 5-10 turns, while a quick Q&A uses 2-3 turns. You can see your usage details in the parent dashboard app. Free plan includes 100 turns/month, Standard offers 500, and Premium provides unlimited turns (with fair use).",
      cta: "Track Yours Free"
    },
    {
      question: "How do I set up profiles for multiple kids?",
      answer: "In your parent dashboard, click 'Add Child Profile' and customize settings for each child including age, interests, and content preferences. Standard plans support up to 3 profiles, Premium supports unlimited.",
      cta: "Set Up Profiles"
    },
    {
      question: "How do safety alerts work?",
      answer: "Yoluno proactively monitors all conversations and sends alerts if new topics are suggested or if content falls outside your approved guidelines. You'll receive instant notifications and can review detailed logs anytime.",
      cta: "Learn About Safety"
    },
    {
      question: "What's included in each billing plan?",
      answer: "Free: 100 turns/month, 1 profile. Standard ($15/mo): 500 turns, 3 profiles, custom voices. Premium ($25/mo): Unlimited turns, unlimited profiles, Family History mode, voice intros, and auto-journals. See full comparison on our pricing page.",
      cta: "Compare Plans"
    },
    {
      question: "I'm experiencing technical issues. What should I do?",
      answer: "First, try refreshing your app and checking your internet connection. If issues persist, use the live chat below or email support@paliyo.com with details about the problem. Our team responds within 24 hours.",
      cta: "Chat Support"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            We're Here for You—Every Step, Every Story
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Got a question? Dive into FAQs or chat live. Our team is ready to help make your Yoluno experience magical.
          </p>
          <Button 
            size="lg" 
            onClick={() => {
              // Trigger chat widget or navigate
              toast({
                title: "Chat Opening",
                description: "Live chat support is ready to help!"
              });
            }}
            className="text-lg px-8 py-6"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Quick Help: Chat Now or Start Free Trial
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                  <Button 
                    variant="link" 
                    className="p-0"
                    onClick={() => {
                      if (faq.cta.includes("Plans")) navigate("/pricing");
                      else if (faq.cta.includes("Safety")) navigate("/safety");
                      else navigate("/auth");
                    }}
                  >
                    {faq.cta} →
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="queryType">Query Type</Label>
                  <Select value={formData.queryType} onValueChange={(value) => setFormData({...formData, queryType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kid-feature">Kid Feature Question</SelectItem>
                      <SelectItem value="parent-tool">Parent Tool Question</SelectItem>
                      <SelectItem value="safety">Safety Concern</SelectItem>
                      <SelectItem value="billing">Billing & Account</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="How can we help you?"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Mail className="mr-2 h-5 w-5" />
                  Send & Get Free Tip Sheet
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Or <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>Start Free for Self-Help Docs</Button>
                </p>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Support Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Live Chat:</strong> 24/7 (typical response: &lt;5 min)</p>
                  <p><strong>Email:</strong> support@yoluno.com (response within 24 hours)</p>
                  <p><strong>Emergency Safety Line:</strong> Available for Premium users</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-xl font-bold mb-4">Quick Resources</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/safety")}>
                    Safety Charter & Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/pricing")}>
                    Billing & Plan Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/auth")}>
                    Parent Dashboard Help
                  </Button>
                </div>
              </Card>

              <Card className="p-6 overflow-hidden">
                <h3 className="text-xl font-bold mb-4">Live Chat</h3>
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={supportChatInterface} 
                    alt="Friendly support chat interface"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team. Available 24/7 for all your questions.
                </p>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Chat Opened",
                      description: "Our support team is ready to help!"
                    });
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat Now
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
