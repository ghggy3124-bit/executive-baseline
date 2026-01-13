import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Calendar, Clock } from "lucide-react";

interface CheckoutScreenProps {
  reviewCadence: string;
  onCheckout: () => void;
  onBack: () => void;
}

export const CheckoutScreen = ({ reviewCadence, onCheckout, onBack }: CheckoutScreenProps) => {
  const shipsNow = [
    "Micronutrient Foundation",
    "Vitamin D3 + K2",
    "Omega-3 (High EPA)",
    "Creatine Monohydrate",
    "Magnesium Bisglycinate",
    "Glycine",
  ];

  const conditional = [
    "Cognitive Load Support (after first stable cycle)",
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Final Step
        </span>
        <h2 className="onboarding-title">Your first shipment</h2>
      </div>

      {/* What ships now */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Ships now</h3>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 space-y-2">
          {shipsNow.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conditional later */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Conditional later</h3>
        </div>
        <div className="bg-muted rounded-lg p-4 space-y-2">
          {conditional.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review cadence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Review cadence</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your system will be reviewed {reviewCadence.toLowerCase()}. We'll reach out with observations and adjustments.
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          variant="primary" 
          size="lg"
          onClick={onCheckout}
        >
          Continue to checkout
        </Button>
      </div>

      {/* Trust note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-center text-muted-foreground"
      >
        Free shipping. Cancel anytime. No commitment.
      </motion.p>
    </div>
  );
};
