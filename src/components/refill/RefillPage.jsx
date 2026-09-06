import React from 'react';
import {
    Building2,
    Phone,
    MapPin,
    ShoppingCart,
    Truck,
    ChevronRight,
    CheckCircle2,
    Clock,
    MessageSquare
} from 'lucide-react';
import { useArogyam } from '../../hooks/useArogyam';
import { Button, Card, Input } from '../ui/MedicalUI';

const RefillPage = () => {
    const { showToast } = useArogyam();
    const [location, setLocation] = React.useState({ lat: 19.0760, lng: 72.8777 }); // default Mumbai
    const [locError, setLocError] = React.useState('');

    const updateLocation = () => {
        showToast("Locating", "Fetching your live coordinates...", "bg-blue-600 text-white");
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocError('');
                    showToast("Success", "Location updated successfully", "bg-emerald-600 text-white");
                },
                (error) => {
                    setLocError(error.message);
                    showToast("Error", "Could not fetch location: " + error.message, "bg-red-600 text-white");
                }
            );
        } else {
            setLocError("Geolocation not available");
        }
    };

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
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <Building2 className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Assigned Pharmacy Portal</h3>
                            <p className="text-sm text-muted-foreground">Configure fulfillment endpoints and delivery logistics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-3 h-3" /> Facility Name
                            </label>
                            <Input defaultValue="Apollo Pharma Central" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Secure Line
                            </label>
                            <Input defaultValue="+91 98765 00000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Delivery Point (GPS Validated)
                                </label>
                                <textarea 
                                    className="w-full text-sm font-semibold text-foreground bg-background border border-border rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-sm" 
                                    defaultValue="Unit 402, Quantum Towers, Health District, Mumbai 400001" 
                                />
                            </div>
                            <Button variant="outline" className="w-full gap-2 border-dashed" onClick={updateLocation}>
                                <MapPin className="w-4 h-4" /> Update GPS Coordinates
                            </Button>
                            {locError && <p className="text-xs text-red-500">{locError}</p>}
                        </div>
                        
                        {/* Interactive Pharmacy Map Visualization */}
                        <div className="bg-muted/40 rounded-xl border border-border overflow-hidden relative group h-64 md:h-auto min-h-[250px]">
                            <iframe 
                                title="Pharmacy Locator"
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight="0" 
                                marginWidth="0" 
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.05},${location.lat - 0.05},${location.lng + 0.05},${location.lat + 0.05}&layer=mapnik&marker=${location.lat},${location.lng}`} 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                                <div className="bg-background/90 backdrop-blur-sm border border-border shadow-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-foreground uppercase flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live GPS Active
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Procurement Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 border border-teal-600/30 rounded-2xl p-8 text-white relative overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Truck className="w-40 h-40 text-white" />
                    </div>

                    <div className="relative z-10 flex-1">
                        <h4 className="text-xl font-bold mb-2 text-white">Transit Manifest</h4>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-teal-100 mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
                            Real-time GPS Tracking
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-teal-100/70">Last Delivery</span>
                                </div>
                                <p className="text-xl font-bold text-white">Jan 30 • 14:05</p>
                                <p className="text-[10px] text-teal-100/70 mt-1 uppercase font-bold">Verified by Biometric ID</p>
                            </div>

                            <div className="p-5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-1">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-teal-100/70">Estimated Cycle</span>
                                    <span className="ml-auto bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">Warning</span>
                                </div>
                                <p className="text-xl font-bold text-white">04 Days Left</p>
                                <p className="text-[10px] text-teal-100/70 mt-1 uppercase font-bold">Based on current burn rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 space-y-4">
                        <button
                            type="button"
                            onClick={handleOrder}
                            className="w-full py-4 px-6 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-teal-400/25 active:scale-[0.98] cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5 text-slate-950" />
                            <span>Force Refill Order</span>
                            <ChevronRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-teal-200/80">
                            <MessageSquare className="w-4 h-4 text-teal-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Comm Line</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefillPage;
