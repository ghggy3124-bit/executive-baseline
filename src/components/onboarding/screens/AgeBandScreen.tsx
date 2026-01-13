import { motion } from "framer-motion";
import { OptionCard } from "../OptionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface AgeBandScreenProps {
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  "18–29",
  "30–39",
  "40–49",
  "50–65",
];

export const AgeBandScreen = ({ selected, onSelect, onNext, onBack }: AgeBandScreenProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="onboarding-title">What's your age range?</h2>
        <p className="helper-text">
          This helps calibrate supplement timing and dosage recommendations.
        </p>
      </div>

      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {options.map((option) => (
          <motion.div
            key={option}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            <OptionCard
              label={option}
              selected={selected === option}
              onClick={() => onSelect(option)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={onNext}
          disabled={!selected}
          className="group"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
