import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const estimatedMinutes = Math.max(1, Math.ceil((totalSteps - currentStep) * 0.25));

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-muted-foreground">
          ~{estimatedMinutes} min remaining
        </span>
      </div>
      <div className="h-1 w-full bg-progress-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-progress-fill rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
