import { useState, useMemo } from "react";
import { OnboardingLayout } from "./OnboardingLayout";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { SingleChoiceScreen } from "./screens/SingleChoiceScreen";
import { MultiChoiceScreen } from "./screens/MultiChoiceScreen";
import { WearableScreen } from "./screens/WearableScreen";
import { SystemOutputScreen } from "./screens/SystemOutputScreen";
import { SystemRulesScreen } from "./screens/SystemRulesScreen";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { AgeBandScreen } from "./screens/AgeBandScreen";
import {
  classifyICP,
  mapGoal,
  mapTrainingFrequency,
  mapAgeBand,
  mapSleepBaseline,
  mapCaffeineUse,
  mapConstraints,
  deriveMetabolicContext,
  type ICPResult,
} from "@/lib/icpClassifier";

interface OnboardingState {
  primaryGoal: string | null;
  constraints: string[];
  ageBand: string | null;
  trainingFrequency: string | null;
  sleepBaseline: string | null;
  caffeineUse: string | null;
  proteinReality: string | null;
  sensitivities: string[];
  systemStrictness: string | null;
  usesWearable: boolean | null;
  wearableDevice: string | null;
  reviewCadence: string | null;
}

const TOTAL_STEPS = 13;

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({
    primaryGoal: null,
    constraints: [],
    ageBand: null,
    trainingFrequency: null,
    sleepBaseline: null,
    caffeineUse: null,
    proteinReality: null,
    sensitivities: [],
    systemStrictness: null,
    usesWearable: null,
    wearableDevice: null,
    reviewCadence: null,
  });

  // Compute ICP classification when all required fields are present
  const icpResult: ICPResult | null = useMemo(() => {
    if (
      state.primaryGoal &&
      state.trainingFrequency &&
      state.ageBand &&
      state.sleepBaseline &&
      state.caffeineUse
    ) {
      return classifyICP({
        goal: mapGoal(state.primaryGoal),
        training_frequency: mapTrainingFrequency(state.trainingFrequency),
        age_band: mapAgeBand(state.ageBand),
        sleep_baseline: mapSleepBaseline(state.sleepBaseline),
        caffeine_use: mapCaffeineUse(state.caffeineUse),
        metabolic_context: deriveMetabolicContext(state.sensitivities),
        constraints: mapConstraints(state.constraints),
      });
    }
    return null;
  }, [state]);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateState = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleConstraint = (option: string) => {
    setState((prev) => ({
      ...prev,
      constraints: prev.constraints.includes(option)
        ? prev.constraints.filter((c) => c !== option)
        : [...prev.constraints.filter((c) => c !== "None of these"), option],
    }));
  };

  const toggleSensitivity = (option: string) => {
    setState((prev) => ({
      ...prev,
      sensitivities: prev.sensitivities.includes(option)
        ? prev.sensitivities.filter((s) => s !== option)
        : [...prev.sensitivities.filter((s) => s !== "None / prefer not to say"), option],
    }));
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout
    console.log("Checkout with state:", state);
    console.log("ICP Classification:", icpResult);
    alert("Onboarding complete! In production, this would proceed to checkout.");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onStart={goNext} />;

      case 1:
        return (
          <SingleChoiceScreen
            question="What are you optimizing for right now?"
            options={[
              "Sustainable energy & mental clarity",
              "Sleep quality & recovery",
              "Longevity baseline",
              "Stress resilience during heavy workload",
            ]}
            selected={state.primaryGoal}
            onSelect={(v) => updateState("primaryGoal", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 2:
        return (
          <MultiChoiceScreen
            question="What constraints must this fit?"
            options={[
              "Minimal pills",
              "Frequent travel",
              "Sensitive stomach",
              "Vegetarian / vegan",
              "Avoid anything stim-like",
              "Prefer powders over capsules",
              "None of these",
            ]}
            selected={state.constraints}
            onToggle={toggleConstraint}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 3:
        return (
          <AgeBandScreen
            selected={state.ageBand}
            onSelect={(v) => updateState("ageBand", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 4:
        return (
          <SingleChoiceScreen
            question="How often do you train?"
            options={[
              "0–1 days/week",
              "2–3 days/week",
              "4–6 days/week",
              "6+ days/week",
            ]}
            selected={state.trainingFrequency}
            onSelect={(v) => updateState("trainingFrequency", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 5:
        return (
          <SingleChoiceScreen
            question="On most nights, your sleep is…"
            options={[
              "Consistent (7+ hours)",
              "Inconsistent schedule",
              "Trouble falling asleep",
              "Waking during the night",
              "Short sleep (≤6h)",
            ]}
            selected={state.sleepBaseline}
            onSelect={(v) => updateState("sleepBaseline", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 6:
        return (
          <SingleChoiceScreen
            question="Which best describes your caffeine use?"
            options={[
              "0–1 per day",
              "2–3 per day, before noon",
              "2–3 per day, sometimes after noon",
              "I sometimes use stimulants or pre-workouts",
            ]}
            helperText="We don't police this. We simply don't interpret cognitive optimization when acute stimulants are present."
            selected={state.caffeineUse}
            onSelect={(v) => updateState("caffeineUse", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 7:
        return (
          <SingleChoiceScreen
            question="Protein is handled via food, not supplements. Are you getting enough daily?"
            options={[
              "Yes, usually",
              "Not sure",
              "No, I struggle",
            ]}
            helperText="We'll give you a protein target and food-based guidance. Protein is not included in shipments."
            selected={state.proteinReality}
            onSelect={(v) => updateState("proteinReality", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 8:
        return (
          <MultiChoiceScreen
            question="Anything we should be aware of?"
            options={[
              "Blood thinners",
              "Thyroid medication",
              "Kidney issues (past or present)",
              "Magnesium sensitivity",
              "Frequent migraines",
              "None / prefer not to say",
            ]}
            complianceNote="Consult your clinician if applicable."
            selected={state.sensitivities}
            onToggle={toggleSensitivity}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 9:
        return (
          <SingleChoiceScreen
            question="How strict should the system be?"
            options={[
              "Minimalist",
              "Standard (recommended)",
              "Comprehensive (still lean)",
            ]}
            selected={state.systemStrictness}
            onSelect={(v) => updateState("systemStrictness", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 10:
        return (
          <WearableScreen
            usesWearable={state.usesWearable}
            device={state.wearableDevice}
            onWearableSelect={(v) => {
              updateState("usesWearable", v);
              if (!v) updateState("wearableDevice", null);
            }}
            onDeviceSelect={(v) => updateState("wearableDevice", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 11:
        return (
          <SingleChoiceScreen
            question="How often should we review your system?"
            options={[
              "Every 4 weeks (recommended)",
              "Every 8 weeks",
            ]}
            selected={state.reviewCadence}
            onSelect={(v) => updateState("reviewCadence", v)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 12:
        return (
          <SystemOutputScreen
            strictness={state.systemStrictness || "Standard (recommended)"}
            icpResult={icpResult}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case 13:
        return (
          <SystemRulesScreen
            onConfirm={goNext}
            onBack={goBack}
          />
        );

      case 14:
        return (
          <CheckoutScreen
            reviewCadence={state.reviewCadence || "Every 4 weeks"}
            onCheckout={handleCheckout}
            onBack={goBack}
          />
        );

      default:
        return <WelcomeScreen onStart={goNext} />;
    }
  };

  return (
    <OnboardingLayout 
      currentStep={currentStep} 
      totalSteps={TOTAL_STEPS}
      showProgress={currentStep > 0 && currentStep <= TOTAL_STEPS}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};
