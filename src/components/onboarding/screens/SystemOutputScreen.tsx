import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Clock } from "lucide-react";

interface SystemOutputScreenProps {
  strictness: string;
  onNext: () => void;
  onBack: () => void;
}

interface SupplementItem {
  name: string;
  description?: string;
}

interface SystemSection {
  title: string;
  items: SupplementItem[];
}

interface ConditionalItem {
  name: string;
  status: "eligible" | "pending";
  description: string;
}

export const SystemOutputScreen = ({ strictness, onNext, onBack }: SystemOutputScreenProps) => {
  // System recommendations based on strictness
  const sections: SystemSection[] = [
    {
      title: "AM Core",
      items: [
        { name: "Micronutrient Foundation", description: "Baseline coverage" },
        { name: "Vitamin D3 + K2", description: "Absorption optimized" },
        { name: "Omega-3 (High EPA)", description: "Inflammation baseline" },
      ],
    },
    {
      title: "Daily Capacity",
      items: [
        { name: "Creatine Monohydrate", description: "Cognitive + physical reserve" },
      ],
    },
    {
      title: "PM Recovery",
      items: [
        { name: "Magnesium Bisglycinate", description: "Sleep + muscle" },
        { name: "Glycine", description: "Deep sleep support" },
      ],
    },
  ];

  const conditionalItems: ConditionalItem[] = [
    {
      name: "Cognitive Load Support",
      status: strictness === "Comprehensive (still lean)" ? "eligible" : "pending",
      description: "Citicoline + L-Tyrosine",
    },
  ];

  const exclusions = [
    "Stimulant-based focus products",
    "Protein supplements (handled via food)",
    "Pre-workout formulas",
    "Adaptogen stacks (added only if needed)",
    "Nootropic cocktails",
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Your System
        </span>
        <h2 className="onboarding-title">Your Executive Baseline System</h2>
      </div>

      {/* System sections */}
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {sections.map((section) => (
          <motion.div
            key={section.title}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
                >
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Conditional */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Conditional
          </h3>
          <div className="space-y-2">
            {conditionalItems.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  item.status === "eligible" ? "bg-accent" : "bg-muted"
                }`}>
                  {item.status === "eligible" ? (
                    <Check className="w-3 h-3 text-accent-foreground" />
                  ) : (
                    <Clock className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <span className={`text-xs mt-1 inline-block ${
                    item.status === "eligible" 
                      ? "text-accent-foreground" 
                      : "text-muted-foreground"
                  }`}>
                    {item.status === "eligible" ? "Eligible now" : "Eligible after first stable cycle"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Exclusions */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          className="space-y-3 pt-4 border-t border-border"
        >
          <h3 className="text-sm font-medium text-foreground">
            What we intentionally did NOT add
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Restraint builds trust. These exclusions are deliberate.
          </p>
          <ul className="space-y-2">
            {exclusions.map((exclusion) => (
              <li key={exclusion} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                {exclusion}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={onNext}
          className="group"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
