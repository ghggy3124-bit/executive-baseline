import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OptionCard } from "../OptionCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface WearableScreenProps {
  usesWearable: boolean | null;
  device: string | null;
  onWearableSelect: (uses: boolean) => void;
  onDeviceSelect: (device: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const devices = ["WHOOP", "Oura", "Apple Watch", "Garmin", "Other"];

export const WearableScreen = ({
  usesWearable,
  device,
  onWearableSelect,
  onDeviceSelect,
  onNext,
  onBack,
}: WearableScreenProps) => {
  const canContinue = usesWearable === false || (usesWearable === true && device !== null);

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="space-y-2">
        <h2 className="onboarding-title">Do you use a wearable?</h2>
        <p className="helper-text max-w-md">
          We use trends to decide when NOT to change your protocol. No daily optimization.
        </p>
      </div>

      {/* Primary choice */}
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <OptionCard
            label="Yes"
            selected={usesWearable === true}
            onClick={() => onWearableSelect(true)}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
          <OptionCard
            label="No"
            selected={usesWearable === false}
            onClick={() => onWearableSelect(false)}
          />
        </motion.div>
      </motion.div>

      {/* Device selection (conditional) */}
      {usesWearable === true && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <p className="text-sm text-muted-foreground font-medium">Which device?</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {devices.map((d) => (
              <button
                key={d}
                onClick={() => onDeviceSelect(d)}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  device === d
                    ? "bg-card-selected border-card-selected-border font-medium"
                    : "bg-card border-border hover:bg-card-hover"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.div>
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
          disabled={!canContinue}
          className="group"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
