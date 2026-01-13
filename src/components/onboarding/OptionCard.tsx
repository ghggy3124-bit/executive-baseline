import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

export const OptionCard = ({ label, selected, onClick, multiSelect = false }: OptionCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all duration-200",
        "flex items-center justify-between gap-4",
        selected
          ? "bg-card-selected border-card-selected-border"
          : "bg-card border-border hover:bg-card-hover hover:border-border"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className={cn(
        "text-base transition-colors",
        selected ? "text-foreground font-medium" : "text-foreground"
      )}>
        {label}
      </span>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
        multiSelect ? "rounded" : "rounded-full",
        selected
          ? "bg-primary border-primary"
          : "border-border bg-transparent"
      )}>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="w-3 h-3 text-primary-foreground" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
