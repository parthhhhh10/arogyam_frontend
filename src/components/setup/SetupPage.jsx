import React from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import {
    Pill,
    Plus,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Sun,
    CloudSun,
    Moon,
    Zap,
    Save
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" // Keep using custom MedicalUI for complex cards for now, or replace with shadcn Card if desired. Combining for speed.
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
// Requested Misconceptions Accordion
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import ScheduleCalendar from './ScheduleCalendar';

const AccordionDisabled = () => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Can I split my tablets?</AccordionTrigger>
                <AccordionContent>
                    Not all tablets are safe to split. Enteric-coated or extended-release formulations must be swallowed whole. Consult your pharmacist before splitting.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" disabled>
                <AccordionTrigger>Premium Interaction Check (Pro)</AccordionTrigger>
                <AccordionContent>
                    Upgrade to Arogyam+ to automatically check for drug-drug interactions.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>What if I miss a dose?</AccordionTrigger>
                <AccordionContent>
                    Take it as soon as you remember, unless it's almost time for your next dose. Never take two doses at once ("doubling up").
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const DoseSelector = ({ label, sublabel, icon: Icon, color, value, time, onValueChange, onTimeChange }) => (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/20 transition-colors">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg bg-background shadow-sm", color)}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{sublabel}</p>
                </div>
            </div>
            <select
                className="text-sm font-bold bg-background border border-input rounded-lg px-2 py-1 outline-none text-foreground"
                value={value}
                onChange={(e) => onValueChange(parseInt(e.target.value))}
            >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        </div>

        <select
            className="w-full text-xs font-semibold text-muted-foreground bg-background border border-input rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
        >
            <option value="08:00">08:00 AM</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="21:00">09:00 PM</option>
            <option value="22:00">10:00 PM</option>
        </select>
    </div>
);

const SetupPage = () => {
    const {
        trays, addTray, removeTray, updateTray,
        sosTrayId, setSOSTray, autoFillDemo, simulateDose, showToast,
        selectedDate
    } = useArogyam();

    const [showTrayOptions, setShowTrayOptions] = React.useState(false);

    return (
        <div className="space-y-8 pb-12">
            <ScheduleCalendar />
            
            {/* Quick Actions Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Pill className="text-primary w-5 h-5" />
                        Treatment Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground">Define medicine schedule and electronic dispenser mapping.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto relative">

                    <div className="relative flex-1 sm:flex-none">
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => setShowTrayOptions(!showTrayOptions)} 
                            className="w-full gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Tray
                        </Button>
                        
                        {showTrayOptions && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button 
                                    className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-muted flex items-center gap-2 border-b border-border transition-colors text-foreground"
                                    onClick={() => {
                                        addTray(false);
                                        setShowTrayOptions(false);
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    Normal Tray
                                </button>
                                <button 
                                    className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-muted flex items-center gap-2 transition-colors text-destructive"
                                    onClick={() => {
                                        addTray(true);
                                        setShowTrayOptions(false);
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    SOS Tray
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Trays Grid */}
            <div className="grid grid-cols-1 gap-8">
                {trays.map(tray => (
                    <div key={tray.id} className="p-0 border border-border rounded-xl hover:border-primary/30 transition-all bg-card shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-3 rounded-xl text-white shadow-sm bg-gradient-to-br", tray.color)}>
                                    <Pill className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">H/W TRAY 0{tray.id}</span>
                                        {tray.isSOS && <Badge variant="red" className="text-[8px] px-1 bg-destructive text-destructive-foreground">SOS</Badge>}
                                        <div className="flex items-center gap-1.5 ml-auto">
                                            <Badge variant="blue" className="text-[10px] bg-sky-100 text-sky-800">
                                                Total: {tray.morning + tray.afternoon + tray.evening} Pill{ (tray.morning + tray.afternoon + tray.evening) !== 1 ? 's' : '' } / day
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="relative group/input">
                                        <Input
                                            className="h-8 py-0 px-0 border-none font-bold text-foreground focus-visible:ring-0 bg-transparent text-lg shadow-none"
                                            value={tray.name}
                                            placeholder="Medicine Name (e.g., Pantocid)"
                                            onChange={(e) => updateTray(tray.id, 'name', e.target.value)}
                                        />
                                        <div className="absolute left-0 bottom-[-2px] w-0 group-focus-within/input:w-full h-[2px] bg-primary transition-all duration-300" />
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTray(tray.id)}
                            >
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <DoseSelector
                                label="Morning"
                                sublabel="Post-Breakfast"
                                icon={Sun}
                                color="text-amber-500"
                                value={tray.morning}
                                time={tray.morning_time}
                                onValueChange={(v) => updateTray(tray.id, 'morning', v)}
                                onTimeChange={(t) => updateTray(tray.id, 'morning_time', t)}
                            />
                            <DoseSelector
                                label="Noon"
                                sublabel="Post-Lunch"
                                icon={CloudSun}
                                color="text-orange-500"
                                value={tray.afternoon}
                                time={tray.afternoon_time}
                                onValueChange={(v) => updateTray(tray.id, 'afternoon', v)}
                                onTimeChange={(t) => updateTray(tray.id, 'afternoon_time', t)}
                            />
                            <DoseSelector
                                label="Night"
                                sublabel="Before Bed"
                                icon={Moon}
                                color="text-indigo-500"
                                value={tray.evening}
                                time={tray.evening_time}
                                onValueChange={(v) => updateTray(tray.id, 'evening', v)}
                                onTimeChange={(t) => updateTray(tray.id, 'evening_time', t)}
                            />
                        </div>
                    </div>
                ))}
            </div>



            {/* Accordion FAQ Section */}
            <div className="bg-card rounded-xl border border-border p-6 mt-8">
                <h3 className="font-bold text-foreground mb-4">Common Misconceptions</h3>
                <AccordionDisabled />
            </div>
        </div>
    );
};

export default SetupPage;
