"use client";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: readonly Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Plan creation steps">
      <ol className="flex items-center gap-1 rounded-lg border border-border-muted bg-surface p-1">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep && onStepClick;

          return (
            <li key={step.id} className="flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? " (completed)" : ""}`}
                className={`group flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                } ${
                  isActive
                    ? "bg-surface-elevated text-foreground shadow-sm"
                    : isCompleted
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded text-xs font-semibold ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className={`hidden sm:inline ${isActive ? "font-semibold" : ""}`}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
