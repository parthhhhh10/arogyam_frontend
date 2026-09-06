import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md dark:bg-teal-600 dark:hover:bg-teal-500',
        secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'bg-transparent border border-teal-600 text-teal-600 hover:bg-teal-600/10 dark:text-teal-400 dark:border-teal-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

export const Card = ({ className, children, ...props }) => (
    <div className={cn('medical-card', className)} {...props}>
        {children}
    </div>
);

export const Badge = ({ className, variant = 'blue', children }) => {
    const variants = {
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
        slate: 'bg-secondary text-secondary-foreground border-border',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1', variants[variant], className)}>
            {children}
        </span>
    );
};

export const Input = React.forwardRef(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    />
));
