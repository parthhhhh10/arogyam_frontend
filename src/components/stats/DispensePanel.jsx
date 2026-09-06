import React, { useState, useEffect, useCallback } from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import { Sun, CloudSun, Moon, CheckCircle2, Pill } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DispensePanel = () => {
    const { trays, userToken, selectedDate, showToast } = useArogyam();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = useCallback(async () => {
        if (!userToken || !selectedDate) return;
        setLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:9090/api/stats/logs?date=${selectedDate}`, {
                headers: { "Authorization": `Bearer ${userToken}` }
            });
            const data = await res.json();
            if (data.success) {
                setLogs(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    }, [userToken, selectedDate]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleDispense = async (trayId, doseSlot) => {
        try {
            const res = await fetch(`http://127.0.0.1:9090/api/trays/dispense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify({ trayId, doseSlot })
            });
            const data = await res.json();
            if (data.success) {
                showToast("Dose Dispensed", `Dispensed ${doseSlot} successfully.`, "bg-green-600 text-white");
                fetchLogs(); // refresh logs
            } else {
                showToast("Error", data.message, "bg-red-600 text-white");
            }
        } catch (error) {
            console.error(error);
            showToast("Network Error", "Could not record dose", "bg-red-600 text-white");
        }
    };

    const isDispensed = (trayId, slot) => {
        return logs.some(log => log.trayId === trayId && log.doseSlot === slot && log.status === 'TAKEN');
    };

    if (trays.length === 0) {
        return (
            <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
                <Pill className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">No Medicines Scheduled</h3>
                <p className="text-sm text-muted-foreground mt-2">Add medicines in the Settings page to see dispensing options here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Daily Dispensing
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">Manage and track your medication doses for the selected date.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {trays.map(tray => {
                    // Only show trays that have doses for any slot
                    const totalDoses = tray.morning + tray.afternoon + tray.evening;
                    if (totalDoses === 0) return null;

                    return (
                        <div key={tray.id} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br ${tray.color} text-white`}>
                                    <span className="text-2xl">{tray.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground text-lg tracking-tight">{tray.name}</h4>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                        Hardware Slot 0{tray.id}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                {tray.morning > 0 && (
                                    <Button 
                                        variant={isDispensed(tray.id, 'MORNING') ? "secondary" : "default"} 
                                        onClick={() => handleDispense(tray.id, 'MORNING')}
                                        className={`flex-1 md:flex-none gap-2 ${isDispensed(tray.id, 'MORNING') ? 'opacity-80' : 'bg-amber-500 hover:bg-amber-600'}`}
                                    >
                                        <Sun className="w-4 h-4" /> 
                                        {isDispensed(tray.id, 'MORNING') ? 'Taken' : 'Morning'}
                                    </Button>
                                )}
                                {tray.afternoon > 0 && (
                                    <Button 
                                        variant={isDispensed(tray.id, 'AFTERNOON') ? "secondary" : "default"} 
                                        onClick={() => handleDispense(tray.id, 'AFTERNOON')}
                                        className={`flex-1 md:flex-none gap-2 ${isDispensed(tray.id, 'AFTERNOON') ? 'opacity-80' : 'bg-orange-500 hover:bg-orange-600'}`}
                                    >
                                        <CloudSun className="w-4 h-4" /> 
                                        {isDispensed(tray.id, 'AFTERNOON') ? 'Taken' : 'Afternoon'}
                                    </Button>
                                )}
                                {tray.evening > 0 && (
                                    <Button 
                                        variant={isDispensed(tray.id, 'EVENING') ? "secondary" : "default"} 
                                        onClick={() => handleDispense(tray.id, 'EVENING')}
                                        className={`flex-1 md:flex-none gap-2 ${isDispensed(tray.id, 'EVENING') ? 'opacity-80' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                                    >
                                        <Moon className="w-4 h-4" /> 
                                        {isDispensed(tray.id, 'EVENING') ? 'Taken' : 'Evening'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DispensePanel;
