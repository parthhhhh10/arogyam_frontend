import React, { createContext, useContext, useState, useCallback } from 'react';

const ArogyamContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:9090';

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
    const getLocalISODate = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [userToken, setUserToken] = useState(() => localStorage.getItem('arogyam_user_token') || null);
    const [activeTab, setActiveTab] = useState('setup');
    const [selectedDate, setSelectedDate] = useState(getLocalISODate());
    const [schedule, setSchedule] = useState({});
    const [language, setLanguage] = useState('en');
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [emergencyContact, setEmergencyContact] = useState('');
    const [assignedDoctor, setAssignedDoctor] = useState(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(() => {
        const saved = localStorage.getItem('arogyam_first_launch');
        return saved ? JSON.parse(saved) : true;
    });
    const [doctors, setDoctors] = useState(() => {
        const saved = localStorage.getItem('arogyam_doctors');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', phone: '+91 9876543210' },
            { id: 2, name: 'Dr. Priya Sharma', specialty: 'Orthopedic', phone: '+91 9876543211' }
        ];
    });
    const [chatHistory, setChatHistory] = useState([]);
    
    // NOTE: Token sync effect is placed after fetchTrays definition below

    const DEFAULT_TRAY = (id = 1) => ({
        id,
        name: `Medicine ${id}`,
        color: TRAY_COLORS[(id - 1) % TRAY_COLORS.length],
        icon: TRAY_ICONS[(id - 1) % TRAY_ICONS.length],
        morning: 0,
        afternoon: 0,
        evening: 0,
        morning_time: "08:00",
        afternoon_time: "13:00",
        evening_time: "22:00",
        stockMorning: 4,
        stockAfternoon: 4,
        stockEvening: 4,
        isSOS: false
    });

    const [trays, setTrays] = useState([]);
    const [sosTrayId, setSosTrayId] = useState(1);
    const [medicineDispensed, setMedicineDispensed] = useState(0);
    const [userRole, setUserRole] = useState('patient'); // 'patient' or 'doctor'
    const [toasts, setToasts] = useState([]);
    const [patients, setPatients] = useState(() => {
        const saved = localStorage.getItem('arogyam_patients');
        if (saved) return JSON.parse(saved);
        return [
            {
                id: 1,
                name: 'Ananya Deshmukh',
                age: 64,
                condition: 'Hypertension',
                status: 'active',
                lastVisit: '2024-03-20',
                prescriptions: [],
                clinicMedicines: []
            },
            {
                id: 2,
                name: 'Rohan Mehta',
                age: 42,
                condition: 'Type 2 Diabetes',
                status: 'active',
                lastVisit: '2024-03-12',
                prescriptions: [],
                clinicMedicines: []
            }
        ];
    });

    React.useEffect(() => {
        // Clean File objects before stringifying for localStorage
        const serializablePatients = patients.map(p => ({
            ...p,
            prescriptions: p.prescriptions ? p.prescriptions.map(({file, ...rest}) => rest) : []
        }));
        localStorage.setItem('arogyam_patients', JSON.stringify(serializablePatients));
    }, [patients]);

    const showToast = useCallback((title, message, className) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, className }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    // -------------- API Integration -------------
    const fetchTrays = useCallback(async () => {
        if (!userToken) return;
        try {
            const res = await fetch(`${API_BASE}/api/trays`, {
                headers: { "Authorization": `Bearer ${userToken}` }
            });
            const data = await res.json();
            if (data.success) {
                // Map backend to frontend schema
                const fetchedTrays = data.data.map(t => ({
                    id: t.id,
                    name: t.medicineName,
                    color: t.color || TRAY_COLORS[0],
                    icon: t.iconEmoji || TRAY_ICONS[0],
                    morning: t.morning,
                    afternoon: t.afternoon,
                    evening: t.evening,
                    morning_time: t.morningTime,
                    afternoon_time: t.afternoonTime,
                    evening_time: t.eveningTime,
                    stockMorning: t.stockMorning,
                    stockAfternoon: t.stockAfternoon,
                    stockEvening: t.stockEvening,
                    isSOS: t.sos
                }));
                setTrays(fetchedTrays);
                const sosTray = fetchedTrays.find(t => t.isSOS);
                if (sosTray) setSosTrayId(sosTray.id);
            }
        } catch (error) {
            console.error(error);
        }
    }, [userToken]);

    // Manage Token — placed here so fetchTrays is in scope
    React.useEffect(() => {
        if (userToken) {
            localStorage.setItem('arogyam_user_token', userToken);
            fetchTrays();
        } else {
            localStorage.removeItem('arogyam_user_token');
        }
    }, [userToken, fetchTrays]);

    const addTray = useCallback(async (isSOS = false) => {
        if (trays.length >= 6) {
            showToast("Limit Reached", "Max 6 trays", "bg-red-600 text-white");
            return;
        }
        const newTrayName = isSOS ? `SOS Medicine` : `Medicine ${trays.length + 1}`;
        const color = isSOS ? "from-red-600 to-red-700" : TRAY_COLORS[trays.length % TRAY_COLORS.length];
        const icon = isSOS ? "🚨" : TRAY_ICONS[trays.length % TRAY_ICONS.length];

        if (!userToken) {
            // Demo mode
            const newId = trays.length > 0 ? Math.max(...trays.map(t => t.id)) + 1 : 1;
            setTrays(prev => [...prev, { ...DEFAULT_TRAY(newId), name: newTrayName, color, icon, isSOS }]);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/trays`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
                body: JSON.stringify({
                    medicineName: newTrayName,
                    color,
                    iconEmoji: icon,
                    sos: isSOS,
                    stockMorning: 4,
                    stockAfternoon: 4,
                    stockEvening: 4
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTrays();
                showToast("Added", "New tray created", "bg-green-600 text-white");
            } else {
                showToast("Error", data.message, "bg-red-600 text-white");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "Could not create tray in DB", "bg-red-600 text-white");
        }
    }, [trays, userToken, fetchTrays, showToast]);

    const removeTray = useCallback(async (id) => {
        if (!userToken) {
            setTrays(prev => prev.filter(t => t.id !== id));
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/trays/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${userToken}` }
            });
            if (res.ok) fetchTrays();
        } catch (error) {
            console.error(error);
        }
    }, [userToken, fetchTrays]);

    const updateTray = useCallback(async (id, field, value) => {
        if (!userToken) {
            setTrays(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
            return;
        }
        const targetTray = trays.find(t => t.id === id);
        if (!targetTray) return;
        
        // Optomistic UI
        setTrays(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

        const updated = { ...targetTray, [field]: value };
        const payload = {
            medicineName: updated.name,
            color: updated.color,
            iconEmoji: updated.icon,
            morning: updated.morning,
            afternoon: updated.afternoon,
            evening: updated.evening,
            morningTime: updated.morning_time,
            afternoonTime: updated.afternoon_time,
            eveningTime: updated.evening_time,
            sos: updated.isSOS,
            stockMorning: updated.stockMorning,
            stockAfternoon: updated.stockAfternoon,
            stockEvening: updated.stockEvening
        };

        try {
            await fetch(`${API_BASE}/api/trays/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error(error);
        }
    }, [trays, userToken]);

    const setSOSTray = useCallback(async (id) => {
        if (!userToken) {
            setTrays(prev => prev.map(t => ({ ...t, isSOS: t.id === id })));
            setSosTrayId(id);
            return;
        }
        try {
            await fetch(`${API_BASE}/api/trays/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
                body: JSON.stringify({ sos: true })
            });
            fetchTrays();
        } catch (error) {
            console.error("SOS Update error:", error);
        }
    }, [userToken, fetchTrays]);

    const simulateDose = useCallback(async (time) => {
        // Just grab the first tray for now or proper logic later
        const targetTray = trays[0]; 
        if (userToken && targetTray) {
            try {
                await fetch(`${API_BASE}/api/trays/dispense`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
                    body: JSON.stringify({ trayId: targetTray.id, doseSlot: "MORNING" })
                });
                fetchTrays();
            } catch (err) {
                console.error(err);
            }
        }
        setMedicineDispensed(prev => prev + 1);
        showToast("💊 Dose Dispensed", `Time: ${time}`, "bg-teal-600 text-white");
    }, [userToken, trays, fetchTrays, showToast]);

    const autoFillDemo = useCallback(() => {
        showToast("✨ Demo Mode", "Sample data loaded", "bg-blue-600 text-white");
    }, [showToast]);

    const triggerEmergencySOS = useCallback(() => {
        showToast("🚨 SOS ACTIVE", "Alerting emergency services", "bg-red-600 text-white");
    }, [showToast]);

    const initiateTraumaCall = useCallback(() => {
        showToast("📍 Locating", "Fetching your live coordinates...", "bg-blue-600 text-white");
    }, [showToast]);

    // Doctor functions
    const addPatient = useCallback((patientData) => {
        const newPatient = {
            ...patientData,
            id: Date.now(),
            status: 'active',
            lastVisit: new Date().toISOString().split('T')[0],
            prescriptions: [],
            clinicMedicines: []
        };
        setPatients(prev => [...prev, newPatient]);
        showToast("✅ Patient Added", `${patientData.name} has been added to your records`, "bg-green-600 text-white");
    }, [showToast]);

    const uploadPrescription = useCallback((patientId, file) => {
        const newPrescription = {
            id: `rx_${Date.now()}`,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0],
            file: file // Included for current session!
        };

        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    prescriptions: [...(p.prescriptions || []), newPrescription]
                };
            }
            return p;
        }));
        showToast("✅ RX Uploaded", `${file.name} uploaded successfully`, "bg-blue-600 text-white");
    }, [showToast]);

    const deletePrescription = useCallback((patientId, prescriptionId) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    prescriptions: p.prescriptions.filter(rx => rx.id !== prescriptionId)
                };
            }
            return p;
        }));
        showToast("🗑️ Removed", "Prescription deleted", "bg-slate-700 text-white");
    }, [showToast]);

    const addClinicMedicine = useCallback((patientId, medicine) => {
        const newMedicine = {
            ...medicine,
            id: `med_${Date.now()}`,
            addedDate: new Date().toISOString().split('T')[0]
        };

        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    clinicMedicines: [...(p.clinicMedicines || []), newMedicine]
                };
            }
            return p;
        }));
        showToast("💊 Medicine Added", `${medicine.name} assigned to patient`, "bg-emerald-600 text-white");
    }, [showToast]);

    const deleteClinicMedicine = useCallback((patientId, medicineId) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                return {
                    ...p,
                    clinicMedicines: p.clinicMedicines.filter(m => m.id !== medicineId)
                };
            }
            return p;
        }));
        showToast("🗑️ Removed", "Medicine removed from list", "bg-slate-700 text-white");
    }, [showToast]);

    const searchPatient = useCallback((query) => {
        if (!query) return patients;
        const lowQuery = query.toLowerCase();
        return patients.filter(p => 
            p.name.toLowerCase().includes(lowQuery) || 
            p.condition.toLowerCase().includes(lowQuery)
        );
    }, [patients]);

    const selectDoctor = useCallback((doctor) => {
        setAssignedDoctor(doctor);
        localStorage.setItem('arogyam_assigned_doctor', JSON.stringify(doctor));
        showToast("✅ Doctor Selected", `You are now assigned to ${doctor.name}`, "bg-green-600 text-white");
    }, [showToast]);

    const saveEmergencyContact = useCallback((contact) => {
        setEmergencyContact(contact);
        localStorage.setItem('arogyam_emergency_contact', contact);
        showToast("✅ Contact Saved", `Emergency contact updated`, "bg-green-600 text-white");
    }, [showToast]);

    const completeOnboarding = useCallback(() => {
        setOnboardingComplete(true);
        setIsFirstLaunch(false);
        localStorage.setItem('arogyam_onboarding_complete', 'true');
        localStorage.setItem('arogyam_first_launch', 'false');
    }, []);

    const addChatMessage = useCallback((message, isUser = true) => {
        const newMessage = { id: Date.now(), text: message, isUser, timestamp: new Date() };
        setChatHistory(prev => [...prev, newMessage]);
    }, []);

    return (
        <ArogyamContext.Provider value={{
            userToken, setUserToken,
            activeTab, setActiveTab,
            trays, setTrays,
            selectedDate, setSelectedDate,
            sosTrayId, setSOSTray,
            medicineDispensed, setMedicineDispensed,
            userRole, setUserRole,
            patients, setPatients,
            language, setLanguage,
            onboardingComplete, setOnboardingComplete,
            emergencyContact, setEmergencyContact,
            assignedDoctor, setAssignedDoctor,
            isFirstLaunch, setIsFirstLaunch,
            doctors, setDoctors,
            chatHistory, setChatHistory,
            addTray, removeTray, updateTray,
            simulateDose, autoFillDemo, triggerEmergencySOS, initiateTraumaCall,
            uploadPrescription, deletePrescription, addClinicMedicine, deleteClinicMedicine, searchPatient, addPatient,
            selectDoctor, saveEmergencyContact, completeOnboarding, addChatMessage,
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
