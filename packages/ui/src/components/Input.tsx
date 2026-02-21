'use client';

import React from 'react';
import { cn } from '@agentic/shared';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    const describedBy = error
      ? [props['aria-describedby'], errorId].filter(Boolean).join(' ') || undefined
      : props['aria-describedby'];

    const ariaInvalid = error ? true : props['aria-invalid'];

    return (
      <div className="space-y-2">
        {label && (
          <label
            className="block text-sm font-medium text-gray-300"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('neo-input w-full', error && 'border-red-500', className)}
          {...props}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
