import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Logo / Brand mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-6">
          <div className="w-6 h-6 rounded-md bg-primary" />
        </div>
        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          Holistenics
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h1 className="onboarding-title text-3xl sm:text-4xl">
          Run a low-noise health system
        </h1>
        <p className="onboarding-subtitle max-w-sm mx-auto">
          A 3-minute setup. Built for consistency, not hacks.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pt-4"
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStart}
          className="group"
        >
          Start
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </motion.div>

      {/* Reassurance */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xs text-muted-foreground pt-8"
      >
        No account required to explore. Your data stays private.
      </motion.p>
    </div>
  );
};
