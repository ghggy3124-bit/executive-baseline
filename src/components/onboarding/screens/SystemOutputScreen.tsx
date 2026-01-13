import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Clock, User } from "lucide-react";
import { type ICPResult, ICP_DISPLAY_NAMES, ICP_DESCRIPTIONS, type ICPKey } from "@/lib/icpClassifier";

interface SystemOutputScreenProps {
  strictness: string;
  icpResult: ICPResult | null;
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

const ICP_SHORT_NAMES: Record<ICPKey, string> = {
  ICP1_EXEC: "Executive",
  ICP2_ATHLETE: "Athlete",
  ICP3_METABOLIC: "Metabolic",
  ICP4_MIDLIFE: "Midlife",
  ICP5_KNOWLEDGE: "Knowledge",
};

const ScoreBar = ({ 
  label, 
  score, 
  maxScore, 
  isWinner 
}: { 
  label: string; 
  score: number; 
  maxScore: number; 
  isWinner: boolean;
}) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={isWinner ? "font-semibold text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
        <span className={isWinner ? "font-semibold text-foreground" : "text-muted-foreground"}>
          {score}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${isWinner ? "bg-primary" : "bg-muted-foreground/40"}`}
        />
      </div>
    </div>
  );
};

export const SystemOutputScreen = ({ strictness, icpResult, onNext, onBack }: SystemOutputScreenProps) => {
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

  // Calculate max score for bar chart scaling
  const maxScore = icpResult 
    ? Math.max(...Object.values(icpResult.scores), 1) 
    : 1;

  const icpOrder: ICPKey[] = ["ICP1_EXEC", "ICP2_ATHLETE", "ICP3_METABOLIC", "ICP4_MIDLIFE", "ICP5_KNOWLEDGE"];

  return (
    <div className="space-y-8">
      {/* ICP Classification Badge */}
      {icpResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-accent/30 rounded-xl border border-accent"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {ICP_DISPLAY_NAMES[icpResult.primary_icp]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  icpResult.confidence === "high" 
                    ? "bg-green-500/20 text-green-700 dark:text-green-400" 
                    : icpResult.confidence === "medium"
                    ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {icpResult.confidence} confidence
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {ICP_DESCRIPTIONS[icpResult.primary_icp]}
              </p>
            </div>
          </div>
          
          {/* Score breakdown */}
          <div className="space-y-2 pt-3 border-t border-accent/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Profile Score Breakdown
            </p>
            {icpOrder.map((key) => (
              <ScoreBar
                key={key}
                label={ICP_SHORT_NAMES[key]}
                score={icpResult.scores[key]}
                maxScore={maxScore}
                isWinner={key === icpResult.primary_icp}
              />
            ))}
          </div>
        </motion.div>
      )}

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
