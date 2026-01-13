import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface SystemRulesScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

const rules = [
  {
    title: "No daily changes",
    description: "The system optimizes for stability, not novelty.",
  },
  {
    title: "Behavior before additions",
    description: "We address sleep, food, and movement before adding supplements.",
  },
  {
    title: "One variable per review cycle",
    description: "Changes are isolated so we know what's working.",
  },
  {
    title: "Protein handled via food",
    description: "Protein targets are set, but it's not in shipments.",
  },
  {
    title: "Stimulant products are not integrated",
    description: "We don't track or optimize around acute stimulants.",
  },
];

export const SystemRulesScreen = ({ onConfirm, onBack }: SystemRulesScreenProps) => {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="onboarding-title">How this system works</h2>
        <p className="onboarding-subtitle">
          The operating principles that guide your protocol.
        </p>
      </div>

      {/* Rules */}
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {rules.map((rule, index) => (
          <motion.div
            key={rule.title}
            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
            className="flex gap-4"
          >
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-secondary-foreground">
                {index + 1}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{rule.title}</p>
              <p className="text-sm text-muted-foreground">{rule.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={onConfirm}
          className="group"
        >
          Confirm & continue
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
