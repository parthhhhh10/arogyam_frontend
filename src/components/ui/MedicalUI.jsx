import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-medical-primary text-white hover:bg-medical-secondary shadow-sm hover:shadow-md',
        secondary: 'bg-white text-medical-text-main border border-medical-border hover:bg-slate-50',
        ghost: 'bg-transparent text-medical-text-main hover:bg-slate-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        outline: 'bg-transparent border border-medical-primary text-medical-primary hover:bg-medical-primary/5',
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
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', variants[variant], className)}>
            {children}
        </span>
    );
};

export const Input = React.forwardRef(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            'flex h-10 w-full rounded-lg border border-medical-border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-medical-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    />
));
