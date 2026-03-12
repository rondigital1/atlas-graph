"use client";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = index <= currentStep && onStepClick;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                    ? "bg-accent-muted text-primary"
                    : "bg-muted text-muted-foreground"
              } ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              {step.label}
            </button>
            {index < steps.length - 1 && (
              <div
                className={`mx-1 h-px w-4 ${
                  isCompleted ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
