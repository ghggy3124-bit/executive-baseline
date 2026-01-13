import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OptionCard } from "../OptionCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface MultiChoiceScreenProps {
  question: string;
  options: string[];
  helperText?: string;
  complianceNote?: string;
  selected: string[];
  onToggle: (option: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MultiChoiceScreen = ({
  question,
  options,
  helperText,
  complianceNote,
  selected,
  onToggle,
  onNext,
  onBack,
}: MultiChoiceScreenProps) => {
  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="space-y-2">
        <h2 className="onboarding-title">{question}</h2>
        {helperText && (
          <p className="helper-text max-w-md">{helperText}</p>
        )}
      </div>

      {/* Options */}
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 }
          }
        }}
      >
        {options.map((option) => (
          <motion.div
            key={option}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <OptionCard
              label={option}
              selected={selected.includes(option)}
              onClick={() => onToggle(option)}
              multiSelect
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Compliance note */}
      {complianceNote && (
        <p className="text-xs text-muted-foreground italic">
          {complianceNote}
        </p>
      )}

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
