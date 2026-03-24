import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  // Prevent division by zero if steps is 1
  const progressRatio = steps.length > 1 ? currentStep / (steps.length - 1) : 0;
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-secondary-200 rounded-full" />
        <div 
          className="absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `calc((100% - 16px) * ${progressRatio})` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className="relative flex flex-col items-center group">
              <div 
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold border-2 transition-all duration-300 z-10 bg-white',
                  isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 
                  isCurrent ? 'border-primary-600 text-primary-600 ring-4 ring-primary-50' : 
                  'border-secondary-300 text-secondary-400'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {/* Optional label placeholder, kept hidden on mobile strictly for cleanliness */}
              <span className={cn(
                'absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors hidden md:block',
                isCurrent || isCompleted ? 'text-secondary-900' : 'text-secondary-400'
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
