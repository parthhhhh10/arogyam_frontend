import React, { createContext, useContext, useState, useCallback } from 'react';

const ArogyamContext = createContext();

const TRAY_COLORS = [
    "from-sky-600 to-sky-700",
    "from-indigo-600 to-indigo-700",
    "from-slate-600 to-slate-700",
    "from-emerald-600 to-emerald-700",
    "from-cyan-600 to-cyan-700",
    "from-blue-600 to-blue-700"
];

const TRAY_ICONS = ["💊", "🏥", "🧬", "🩺", "🧪", "🌡️"];

export const ArogyamProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('setup');
    const [trays, setTrays] = useState([
        {
            id: 1,
            name: "Paracetamol 500mg",
            color: "from-sky-600 to-sky-700",
            icon: "💊",
            morning: 1,
            afternoon: 0,
            evening: 1,
            morning_time: "08:00",
            afternoon_time: "13:00",
            evening_time: "22:00",
            stock: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            isSOS: true
        },
        {
            id: 2,
            name: "Dolo 650mg",
            color: "from-indigo-600 to-indigo-700",
            icon: "💊",
            morning: 0,
            afternoon: 1,
            evening: 0,
            morning_time: "09:00",
            afternoon_time: "13:30",
            evening_time: "21:00",
            stock: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            isSOS: false
        }
    ]);

    const [sosTrayId, setSosTrayId] = useState(1);
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((title, message, className) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, className }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const addTray = useCallback(() => {
        if (trays.length >= 6) {
            showToast("Limit Reached", "Max 6 trays", "bg-red-600 text-white");
            return;
        }
        const newId = trays.length > 0 ? Math.max(...trays.map(t => t.id)) + 1 : 1;
        const newTray = {
            id: newId,
            name: `Medicine ${newId}`,
            color: TRAY_COLORS[trays.length % TRAY_COLORS.length],
            icon: TRAY_ICONS[trays.length % TRAY_ICONS.length],
            morning: 0,
            afternoon: 0,
            evening: 0,
            morning_time: "08:00",
            afternoon_time: "13:00",
            evening_time: "22:00",
            stock: Array(10).fill(0),
            isSOS: false
        };
        setTrays(prev => [...prev, newTray]);
    }, [trays, showToast]);

    const removeTray = useCallback((id) => {
        if (trays.length <= 1) return;
        setTrays(prev => prev.filter(t => t.id !== id));
    }, [trays.length]);

    const updateTray = useCallback((id, field, value) => {
        setTrays(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    }, []);

    const setSOSTray = useCallback((id) => {
        setTrays(prev => prev.map(t => ({ ...t, isSOS: t.id === id })));
        setSosTrayId(id);
    }, []);

    const simulateDose = useCallback((time) => {
        showToast("💊 Dose Dispensed", `Time: ${time}`, "bg-teal-600 text-white");
    }, [showToast]);

    const autoFillDemo = useCallback(() => {
        // Simple demo logic
        showToast("✨ Demo Mode", "Sample data loaded", "bg-blue-600 text-white");
    }, [showToast]);

    const triggerEmergencySOS = useCallback(() => {
        showToast("🚨 SOS ACTIVE", "Alerting emergency services", "bg-red-600 text-white");
    }, [showToast]);

    return (
        <ArogyamContext.Provider value={{
            activeTab, setActiveTab,
            trays, setTrays,
            sosTrayId, setSOSTray,
            addTray, removeTray, updateTray,
            simulateDose, autoFillDemo, triggerEmergencySOS,
            toasts, showToast
        }}>
            {children}
        </ArogyamContext.Provider>
    );
};

export const useArogyam = () => {
    const context = useContext(ArogyamContext);
    if (!context) {
        throw new Error("useArogyam must be used within an ArogyamProvider");
    }
    return context;
};
