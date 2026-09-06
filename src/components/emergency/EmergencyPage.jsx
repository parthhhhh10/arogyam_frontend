import React from 'react';
import {
    Phone,
    Ambulance,
    Hospital,
    UserPlus,
    Users,
    MapPin,
    AlertTriangle,
    ShieldAlert,
    Siren,
    Crosshair,
    BellRing,
    Activity,
    ChevronRight,
    Stethoscope
} from 'lucide-react';
import { useArogyam } from '../../hooks/useArogyam';
import { Button, Card, Badge, cn } from '../ui/MedicalUI';

const EmergencyPage = () => {
    const { triggerEmergencySOS, trays, initiateTraumaCall, emergencyContact, assignedDoctor } = useArogyam();
    const sosTray = trays.find(t => t.isSOS);
    const sosStock = sosTray ? sosTray.stock.filter(s => s === 1).length : 0;

    const contacts = [
        { icon: Ambulance, label: 'Ambulance (STAT)', sub: 'Local Emergency 108', color: 'bg-red-500', action: () => window.location.href = 'tel:108' },
        { icon: Hospital, label: 'Trauma Center', sub: 'Live Nearest Center', color: 'bg-blue-600', action: initiateTraumaCall },
        { icon: Stethoscope, label: 'Primary Physician', sub: assignedDoctor?.name || 'Your Doctor', color: 'bg-emerald-600', action: () => {
            if (assignedDoctor?.phone) {
                window.location.href = `tel:${assignedDoctor.phone}`;
            }
        }},
        { icon: UserPlus, label: 'Emergency Contact', sub: emergencyContact || 'Not set', color: 'bg-purple-600', action: () => {
            if (emergencyContact) {
                window.location.href = `tel:${emergencyContact.replace(/\D/g, '')}`;
            }
        }},
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Direct Dial Controls */}
            <div className="lg:col-span-12">
                <Card className="p-8 border-red-100 bg-red-50/10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-200">
                            <Siren className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Rapid Response Dispatch</h3>
                            <p className="text-sm text-slate-500">Immediate communication protocols with verified medical services.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contacts.map((contact, i) => (
                            <button
                                key={i}
                                onClick={contact.action}
                                className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-medical-primary/20 transition-all text-left"
                            >
                                <div className={cn("p-2 rounded-lg w-fit mb-4 text-white", contact.color)}>
                                    <contact.icon className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-800">{contact.label}</h4>
                                <p className="text-xs text-slate-500 mb-6 font-medium">{contact.sub}</p>
                                <div className="flex items-center gap-1 text-xs font-bold text-medical-primary group-hover:gap-2 transition-all">
                                    INITIATE CALL <ChevronRight className="w-3 h-3" />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Central SOS Trigger */}
            <div className="lg:col-span-8">
                <Card className="p-12 flex flex-col items-center justify-center text-center relative overflow-hidden h-full border-none shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700"></div>

                    {/* Visual Radar Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full animate-ping opacity-20"></div>

                    <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white mb-10">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">System Hot • Immediate Trigger</span>
                        </div>

                        <button
                            onClick={triggerEmergencySOS}
                            className="group relative w-64 h-64 flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse blur-xl"></div>
                            <div className="absolute inset-4 bg-white/20 rounded-full animate-pulse group-hover:scale-110 transition-transform"></div>
                            <div className="relative w-48 h-48 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center group-active:scale-95 transition-all">
                                <BellRing className="w-12 h-12 text-red-600 mb-2" />
                                <span className="text-4xl font-extrabold text-red-600 tracking-tighter">SOS</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1">PRESS & HOLD</span>
                            </div>
                        </button>

                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">📞 Call 108</div>
                            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">📱 SMS Family</div>
                            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">📍 Share GPS</div>
                            <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">💊 Dispense SOS</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Emergency Status Sidebar */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="text-medical-primary w-5 h-5" />
                        <h4 className="text-md font-bold text-slate-800">Telemetry Feed</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                            <span>GPS Lock</span>
                            <Badge variant="green" className="animate-pulse">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                            <span>Network Latency</span>
                            <span className="font-bold text-slate-700">12ms</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                            <span>Biometric Relay</span>
                            <Badge variant="blue">Pending</Badge>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Emergency Drug Status</p>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-700 truncate mr-2">{sosTray?.name || 'Emergency Medicine'}</span>
                                <span className="text-sm font-black text-red-600">{sosStock}/10</span>
                            </div>
                            <div className="w-full h-1 bg-slate-200 rounded-full mt-2">
                                <div className="w-full h-full bg-red-500 rounded-full" style={{ width: `${(sosStock / 10) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-amber-100 bg-amber-50/20">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-amber-600 w-5 h-5" />
                        <h4 className="text-sm font-bold text-amber-900 uppercase">Warning Logic</h4>
                    </div>
                    <p className="text-xs text-amber-800/80 font-medium leading-relaxed">
                        The SOS protocol is globally unique and bypasses all mechanical delays. Ensure the emergency drug is correctly mapped to hardware tray #0{sosTray?.id || 'X'} before activation.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default EmergencyPage;
