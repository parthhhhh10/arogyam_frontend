import React from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import { Info, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from './MedicalUI';

const Toast = ({ toast }) => {
    const isError = toast.className?.includes('bg-red') || toast.title?.toLowerCase().includes('alert');
    const isSuccess = toast.className?.includes('bg-teal') || toast.className?.includes('bg-emerald') || toast.title?.toLowerCase().includes('success');

    return (
        <div className={cn(
            "p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-10",
            toast.className || "bg-slate-900 text-white"
        )}>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg shrink-0">
                    {isError ? <AlertCircle size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Info size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm tracking-tight">{toast.title}</p>
                    <p className="text-xs opacity-90 font-medium">{toast.message}</p>
                </div>
            </div>
        </div>
    );
};

const ToastContainer = () => {
    const { toasts } = useArogyam();

    return (
        <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4 w-80 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
