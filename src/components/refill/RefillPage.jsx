import React from 'react';
import {
    Building2,
    Phone,
    MapPin,
    ShoppingCart,
    Truck,
    Zap,
    ChevronRight,
    CheckCircle2,
    Clock,
    Package,
    MessageSquare,
    Bot
} from 'lucide-react';
import { useArogyam } from '../../hooks/useArogyam';
import { Button, Card, Badge, Input, cn } from '../ui/MedicalUI';

const RefillPage = () => {
    const { showToast } = useArogyam();

    const handleOrder = () => {
        showToast("🔄 Connecting to API", "Handshaking with pharmacy servers...", "bg-blue-600 text-white");
        setTimeout(() => {
            showToast("📦 Transmission Success", "Refill request dispatched. ETA: 4 Hours.", "bg-emerald-600 text-white");
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Pharmacy Settings */}
            <div className="lg:col-span-8 space-y-8">
                <Card className="p-8">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <Building2 className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Assigned Pharmacy Portal</h3>
                            <p className="text-sm text-slate-500">Configure fulfillment endpoints and delivery logistics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-3 h-3" /> Facility Name
                            </label>
                            <Input defaultValue="Apollo Pharma Central" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Secure Line
                            </label>
                            <Input defaultValue="+91 98765 00000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Delivery Point (GPS Validated)
                        </label>
                        <textarea className="w-full text-sm font-semibold text-slate-700 bg-white border border-medical-border rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 transition-all" defaultValue="Unit 402, Quantum Towers, Health District, Mumbai 400001" />
                    </div>
                </Card>

                {/* Automation Board */}
                <Card className="p-8 border-emerald-100 bg-emerald-50/20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <Bot className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-md font-bold text-slate-800 tracking-tight">AI Autonomous Refill</h4>
                                <p className="text-xs text-slate-500">Inventory-aware automated replenishment protocol.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mr-2">Status: Active</span>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative shadow-inner">
                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-5 rounded-xl border border-emerald-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest flex justify-between">
                                Trigger Threshold
                                <span className="text-emerald-600">20% Remainder</span>
                            </div>
                            <input type="range" min="10" max="50" defaultValue="20" className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-emerald-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Protocol Priority</div>
                            <select className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 outline-none">
                                <option>STAT (Immediate Dispatch)</option>
                                <option>Urgent (Next Flight/Truck)</option>
                                <option>Standard (Economy)</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Procurement Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <Card className="bg-medical-primary border-none p-8 text-white relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Truck className="w-40 h-40" />
                    </div>

                    <div className="relative z-10 flex-1">
                        <h4 className="text-xl font-bold mb-2">Transit Manifest</h4>
                        <Badge variant="slate" className="bg-white/10 border-white/20 text-white mb-8">Real-time GPS Tracking</Badge>

                        <div className="space-y-6">
                            <div className="p-5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Last Delivery</span>
                                </div>
                                <p className="text-xl font-bold">Jan 30 • 14:05</p>
                                <p className="text-[10px] opacity-70 mt-1 uppercase font-bold">Verified by Biometric ID</p>
                            </div>

                            <div className="p-5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-1">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Estimated Cycle</span>
                                    <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-none px-1 text-[8px]">Warning</Badge>
                                </div>
                                <p className="text-xl font-bold">04 Days Left</p>
                                <p className="text-[10px] opacity-70 mt-1 uppercase font-bold">Based on current burn rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 space-y-4">
                        <Button
                            onClick={handleOrder}
                            className="w-full py-6 bg-white text-medical-primary hover:bg-slate-50 font-bold text-lg gap-2 group shadow-xl shadow-black/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Force Refill Order
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <div className="flex items-center justify-center gap-2 opacity-60">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Comm Line</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RefillPage;
