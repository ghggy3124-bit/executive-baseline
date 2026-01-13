import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
}

export const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps,
  showProgress = true 
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with progress */}
      {showProgress && currentStep > 0 && (
        <header className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="max-w-xl mx-auto">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 sm:px-8">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs text-muted-foreground tracking-wide">
            Holistenics
          </span>
        </div>
      </footer>
    </div>
  );
};
