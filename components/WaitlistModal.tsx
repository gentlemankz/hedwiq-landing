"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useWaitlist } from "@/components/WaitlistContext";
import { stopLenis, startLenis } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import { track } from "@/lib/amplitude";
import { ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { PAIN_POINTS, type PainPointId } from "@/db/schema";
import {
  waitlistStep1Schema,
  type WaitlistStep1Data,
} from "@/lib/validations/waitlist";

// ============================================================================
// Constants
// ============================================================================

const SUBMIT_DEBOUNCE_MS = 500;
const MODAL_RESET_DELAY_MS = 200;

// ============================================================================
// Step Components
// ============================================================================

function Step1Form({
  onNext,
  isLoading,
  defaultValues,
}: {
  onNext: (data: WaitlistStep1Data) => void;
  isLoading: boolean;
  defaultValues?: WaitlistStep1Data | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistStep1Data>({
    resolver: zodResolver(waitlistStep1Schema),
    defaultValues: defaultValues ?? undefined,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight className="size-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}

function Step2Form({
  onNext,
  onBack,
  isLoading,
  apiError,
}: {
  onNext: (painPoints: PainPointId[], otherText?: string) => void;
  onBack: () => void;
  isLoading: boolean;
  apiError: string | null;
}) {
  const [selectedPainPoints, setSelectedPainPoints] = useState<Set<PainPointId>>(
    new Set()
  );
  const [otherText, setOtherText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const togglePainPoint = useCallback((id: PainPointId) => {
    setSelectedPainPoints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setValidationError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedPainPoints.size === 0) {
      setValidationError("Please select at least one challenge");
      return;
    }
    onNext(
      Array.from(selectedPainPoints),
      selectedPainPoints.has("other") ? otherText : undefined
    );
  }, [selectedPainPoints, otherText, onNext]);

  const displayError = validationError || apiError;

  // Separate "other" from the rest
  const mainPainPoints = PAIN_POINTS.filter((p) => p.id !== "other");
  const otherOption = PAIN_POINTS.find((p) => p.id === "other");

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Select your challenges">
        {/* Responsive grid: 1 column on narrow screens, 2 columns on wider */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-1.5 min-[360px]:gap-2 max-h-[45vh] sm:max-h-[50vh] overflow-y-auto overscroll-contain -mx-1 px-1">
          {mainPainPoints.map((point) => (
            <label
              key={point.id}
              htmlFor={`pain-point-${point.id}`}
              className={cn(
                "flex items-center gap-1.5 min-[360px]:gap-2 p-2 min-[360px]:p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all text-left",
                selectedPainPoints.has(point.id)
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <Checkbox
                id={`pain-point-${point.id}`}
                checked={selectedPainPoints.has(point.id)}
                onCheckedChange={() => togglePainPoint(point.id)}
                className="shrink-0 size-4"
              />
              <span className="text-[11px] min-[360px]:text-xs sm:text-sm font-medium leading-snug">{point.label}</span>
            </label>
          ))}
          {otherOption && (
            <label
              htmlFor={`pain-point-${otherOption.id}`}
              className={cn(
                "flex items-center gap-1.5 min-[360px]:gap-2 p-2 min-[360px]:p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all min-[360px]:col-span-2",
                selectedPainPoints.has(otherOption.id)
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <Checkbox
                id={`pain-point-${otherOption.id}`}
                checked={selectedPainPoints.has(otherOption.id)}
                onCheckedChange={() => togglePainPoint(otherOption.id)}
                className="shrink-0 size-4"
              />
              <span className="text-[11px] min-[360px]:text-xs sm:text-sm font-medium">{otherOption.label}</span>
            </label>
          )}
        </div>

        {/* Other text input (shown when "other" is selected) */}
        {selectedPainPoints.has("other") && (
          <Input
            className="mt-3"
            placeholder="Tell us more..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            maxLength={500}
            aria-label="Other challenge details"
          />
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <p>{displayError}</p>
        </div>
      )}

      <div className="flex gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full text-sm sm:text-base h-9 sm:h-10"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base h-9 sm:h-10"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </div>
    </div>
  );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
        <Check className="size-8 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">You&apos;re on the list!</h3>
        <p className="text-muted-foreground">
          Thanks for joining our exclusive early access program. We&apos;ll be in touch soon with your invitation.
        </p>
      </div>
      <Button
        className="rounded-full bg-blue-600 hover:bg-blue-700"
        onClick={onClose}
      >
        Got it
      </Button>
    </div>
  );
}

// ============================================================================
// Progress Indicator
// ============================================================================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex justify-center gap-2 mb-4" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i <= currentStep ? "w-8 bg-blue-600" : "w-4 bg-muted"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ============================================================================
// Main Modal Component
// ============================================================================

export function WaitlistModal() {
  const { isOpen, closeWaitlist } = useWaitlist();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<WaitlistStep1Data | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Refs for cleanup
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmittingRef = useRef(false);

  // Stop Lenis smooth scroll when dialog opens, restart when closed
  useEffect(() => {
    if (isOpen) {
      stopLenis();
    } else {
      startLenis();
    }
  }, [isOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleStep1 = useCallback((data: WaitlistStep1Data) => {
    setFormData(data);
    setApiError(null);
    // Track without PII - only track that step was completed
    track({
      name: "Waitlist Step Completed",
      properties: { step: 1 },
    });
    setStep(1);
  }, []);

  const handleStep2 = useCallback(async (painPoints: PainPointId[], otherText?: string) => {
    if (!formData) return;

    // Debounce: prevent double submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          painPoints,
          otherPainPoint: otherText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join waitlist");
      }

      // Track without PII
      track({
        name: "Waitlist Submitted",
        properties: {
          pain_points: painPoints,
          has_other: !!otherText,
          pain_points_count: painPoints.length,
        },
      });
      setStep(2);
    } catch (error) {
      console.error("Waitlist signup error:", error);
      const message = error instanceof Error ? error.message : "An error occurred. Please try again.";
      setApiError(message);
    } finally {
      setIsLoading(false);
      // Reset debounce after a short delay
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, SUBMIT_DEBOUNCE_MS);
    }
  }, [formData]);

  const resetState = useCallback(() => {
    setStep(0);
    setFormData(null);
    setApiError(null);
    isSubmittingRef.current = false;
  }, []);

  const handleClose = useCallback(() => {
    closeWaitlist();
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    // Reset state after animation completes
    resetTimeoutRef.current = setTimeout(resetState, MODAL_RESET_DELAY_MS);
  }, [closeWaitlist, resetState]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleClose();
    }
  }, [handleClose]);

  const handleBack = useCallback(() => {
    setStep(0);
    setApiError(null);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto p-4 sm:p-6",
          "sm:max-w-md",
          step === 1 && "sm:max-w-xl"
        )}
        showCloseButton={step !== 2}
      >
        {step < 2 && (
          <>
            <StepIndicator currentStep={step} totalSteps={2} />
            <DialogHeader>
              <DialogTitle className="text-center text-base sm:text-lg">
                {step === 0
                  ? "Join the Exclusive Early Access"
                  : "What challenges do you face?"}
              </DialogTitle>
              <DialogDescription className="text-center text-xs sm:text-sm">
                {step === 0
                  ? "Be among the first to experience the future of meetings. Limited spots available."
                  : "Help us understand your needs so we can serve you better."}
              </DialogDescription>
            </DialogHeader>
          </>
        )}

        {step === 0 && (
          <Step1Form
            onNext={handleStep1}
            isLoading={isLoading}
            defaultValues={formData}
          />
        )}
        {step === 1 && (
          <Step2Form
            onNext={handleStep2}
            onBack={handleBack}
            isLoading={isLoading}
            apiError={apiError}
          />
        )}
        {step === 2 && <SuccessStep onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
