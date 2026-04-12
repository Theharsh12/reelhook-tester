import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is an Instagram reel hook?",
    answer: "An Instagram reel hook is the first 1-3 seconds of your video or the opening text overlay that captures attention. A strong hook stops viewers from scrolling and compels them to watch the rest of your content.",
  },
  {
    question: "How does this hook analyzer work?",
    answer: "Our AI analyzes your hook text for key scroll-stopping elements: curiosity gaps, emotional triggers, pattern interrupts, and clarity. It scores your hook from 0-100, identifies its type, and provides specific suggestions to make it more engaging.",
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes! You get 3 free analyses without signing up. Create a free account to unlock unlimited analyses — no credit card required.",
  },
];

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="mt-16 sm:mt-24 max-w-2xl mx-auto animate-fade-in px-2" style={{ animationDelay: "600ms" }}>
      <div className="text-center mb-8">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">FAQ</h2>
        <p className="text-xl sm:text-2xl font-bold text-foreground">Common questions</p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl glass glass-border overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-primary/5 transition-colors gap-3"
            >
              <span className="font-medium text-foreground text-sm sm:text-base">{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openFaq === index ? "max-h-48" : "max-h-0"
              }`}
            >
              <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
