import React from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import {
    BarChart2,
    CircleDot,
    AlertCircle,
    CheckCircle2,
    Package,
    RefreshCcw,
    Zap,
    Info
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../ui/MedicalUI';

const StockPage = () => {
    const { trays } = useArogyam();

    let totalFilled = 0;
    let totalSlots = trays.length * 10;
    trays.forEach(t => {
        totalFilled += t.stock.filter(s => s === 1).length;
    });

    const totalPercent = trays.length > 0 ? Math.round((totalFilled / totalSlots) * 100) : 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Inventory Overview Board */}
            <div className="flex flex-col xl:flex-row gap-8">
                <Card className="flex-1 p-8 bg-slate-900 border-none text-white flex flex-col sm:flex-row items-center gap-10">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80" cy="80" r="70"
                                className="stroke-slate-800 fill-none"
                                strokeWidth="12"
                            />
                            <circle
                                cx="80" cy="80" r="70"
                                className={cn(
                                    "fill-none transition-all duration-1000",
                                    totalPercent > 30 ? "stroke-medical-primary" : "stroke-red-500"
                                )}
                                strokeWidth="12"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * totalPercent) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{totalPercent}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Capacity</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">Supply Management</h3>
                            <p className="text-slate-400 text-sm mt-1">Aggregate canister analysis across all medical trays.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 min-w-[140px]">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Inventory Status</p>
                                <p className={cn("text-lg font-bold mt-1", totalPercent > 30 ? "text-emerald-400" : "text-red-400")}>
                                    {totalPercent > 30 ? "Optimal" : "Critically Low"}
                                </p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1 min-w-[140px]">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Total Unit Count</p>
                                <p className="text-lg font-bold text-white mt-1">{totalFilled} / {totalSlots} <span className="text-xs text-slate-400">Pills</span></p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="w-full xl:w-80 p-6 flex flex-col justify-center gap-4">
                    <Button variant="primary" className="w-full py-6 gap-2 font-bold shadow-lg shadow-medical-primary/20">
                        <RefreshCcw className="w-4 h-4" />
                        Request Full Audit
                    </Button>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-2 uppercase">
                            <Info className="w-3 h-3" /> System Log
                        </div>
                        <p className="text-xs text-slate-600">Last tray sync: 12:42:05 GMT. Electro-mechanical sensors report nominal torque on all canisters.</p>
                    </div>
                </Card>
            </div>

            {/* Tray List */}
            <div className="space-y-6">
                {trays.map((tray) => (
                    <StockTrayItem key={tray.id} tray={tray} />
                ))}
            </div>
        </div>
    );
};

const StockTrayItem = ({ tray }) => {
    const filledCount = tray.stock.filter(s => s === 1).length;
    const percent = Math.round((filledCount / 10) * 100);

    return (
        <Card className="p-0 border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="lg:flex">
                <div className="lg:w-72 p-8 bg-slate-50/50 border-r border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded-lg text-white shadow-sm bg-gradient-to-br", tray.color)}>
                                <Package className="w-4 h-4" />
                            </div>
                            {tray.isSOS && <Badge variant="red">SOS TRAY</Badge>}
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{tray.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tray ID: #MDT-0{tray.id}</p>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-slate-700">{percent}% Inventory</span>
                            <span className="text-xs font-medium text-slate-500">{filledCount}/10</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-1000", percent < 30 ? "bg-red-500" : "bg-medical-primary")}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {[...tray.stock].map((slot, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-500 relative",
                                    slot
                                        ? (tray.isSOS ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")
                                        : "bg-slate-50 border-slate-100 border-dashed"
                                )}
                            >
                                {slot ? (
                                    <CircleDot className={cn("w-6 h-6", tray.isSOS ? "text-red-500" : "text-emerald-500")} />
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-300">---</span>
                                )}
                                {slot && <span className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></span>}
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Pos {10 - i}</span>
                        </div>
                    ).reverse())}
                </div>
            </div>
        </Card>
    );
};

export default StockPage;
