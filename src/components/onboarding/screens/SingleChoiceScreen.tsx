import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OptionCard } from "../OptionCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface SingleChoiceScreenProps {
  question: string;
  options: string[];
  helperText?: string;
  selected: string | null;
  onSelect: (option: string) => void;
  onNext: () => void;
  onBack: () => void;
  showBack?: boolean;
}

export const SingleChoiceScreen = ({
  question,
  options,
  helperText,
  selected,
  onSelect,
  onNext,
  onBack,
  showBack = true,
}: SingleChoiceScreenProps) => {
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
              selected={selected === option}
              onClick={() => onSelect(option)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {showBack ? (
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <div />
        )}
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
