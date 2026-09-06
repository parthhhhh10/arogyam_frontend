import React, { useState } from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import {
    Search,
    Upload,
    Plus,
    FileText,
    Calendar,
    User,
    Pill,
    Clock,
    X,
    Download,
    Trash2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DoctorPage = () => {
    const { patients, searchPatient, uploadPrescription, deletePrescription, addClinicMedicine, deleteClinicMedicine, addPatient, showToast } = useArogyam();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [showAddMedicine, setShowAddMedicine] = useState(false);
    const [newPatientForm, setNewPatientForm] = useState({
        name: '',
        age: '',
        condition: ''
    });
    const [newMedicine, setNewMedicine] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
    });

    const filteredPatients = searchPatient(searchQuery);
    const fileInputRef = React.useRef(null);
    const acceptedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.heic'];
    const acceptedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/heic',
        'image/heif'
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!selectedPatient) {
            showToast("⚠️ Error", "Please select a patient first", "bg-amber-600 text-white");
            return;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasValidExtension = acceptedExtensions.some(ext => fileName.endsWith(ext));

        if (!hasValidExtension) {
            showToast("❌ Invalid Format", "Only PDF, DOCX, JPG, PNG, HEIC allowed", "bg-red-600 text-white");
            e.target.value = '';
            return;
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast("❌ File Too Large", "Maximum 10MB allowed", "bg-red-600 text-white");
            e.target.value = '';
            return;
        }

        uploadPrescription(selectedPatient.id, file);
        e.target.value = '';
    };

    const handleAddPatient = () => {
        if (!newPatientForm.name || !newPatientForm.age || !newPatientForm.condition) {
            showToast("⚠️ Incomplete Form", "Please fill all fields", "bg-amber-600 text-white");
            return;
        }
        
        const ageNum = parseInt(newPatientForm.age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
            showToast("❌ Invalid Age", "Please enter a valid age", "bg-red-600 text-white");
            return;
        }

        addPatient(newPatientForm);
        setNewPatientForm({ name: '', age: '', condition: '' });
        setShowAddPatient(false);
    };

    const handleAddMedicine = () => {
        if (!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency || !newMedicine.duration) {
            showToast("⚠️ Incomplete Form", "Please fill all fields", "bg-amber-600 text-white");
            return;
        }

        addClinicMedicine(selectedPatient.id, newMedicine);
        setNewMedicine({
            name: '',
            dosage: '',
            frequency: '',
            duration: ''
        });
        setShowAddMedicine(false);
    };

    const handlePrescriptionDownload = (prescription) => {
        if (!prescription?.file) {
            showToast("ℹ️ Info", "File data is only available during the upload session in demo mode.", "bg-blue-600 text-white");
            return;
        }

        const url = URL.createObjectURL(prescription.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = prescription.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handlePrescriptionDelete = (prescriptionId) => {
        deletePrescription(selectedPatient.id, prescriptionId);
    };

    const handleMedicineDelete = (medicineId) => {
        deleteClinicMedicine(selectedPatient.id, medicineId);
    };

    if (selectedPatient) {
        const patient = patients.find(p => p.id === selectedPatient.id);
        return (
            <div className="space-y-6 pb-12">
                {/* Back Button & Header */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedPatient(null)}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Back to Patients
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                            patient?.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'
                        )}>
                            {patient?.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{patient?.name}</h2>
                            <p className="text-sm text-muted-foreground">{patient?.condition}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-white border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Age</p>
                                <h3 className="text-2xl font-bold text-slate-800 mt-1">{patient?.age}</h3>
                                <p className="text-[10px] text-slate-400">Years</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-white border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Last Visit</p>
                                <h3 className="text-lg font-bold text-slate-800 mt-1">{patient?.lastVisit}</h3>
                                <p className="text-[10px] text-slate-400">Date</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-white border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                <h3 className="text-lg font-bold text-emerald-600 mt-1 capitalize">{patient?.status}</h3>
                                <p className="text-[10px] text-slate-400">Current</p>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Prescription & Pharmacy Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Prescriptions
                            </h3>
                            <label htmlFor="prescription-upload">
                                <Button className="gap-2" size="sm" asChild>
                                    <span>
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </span>
                                </Button>
                                <input
                                    id="prescription-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {patient?.prescriptions && patient.prescriptions.length > 0 ? (
                            <div className="space-y-3">
                                {patient.prescriptions.map(prescription => (
                                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">{prescription.fileName}</p>
                                                <p className="text-[10px] text-muted-foreground">{prescription.uploadDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handlePrescriptionDownload(prescription)}
                                            >
                                                <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handlePrescriptionDelete(prescription.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs">No records</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-medical-border p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                Pharmacy Delivery Map
                            </h3>
                            <Badge variant="blue" className="bg-emerald-50 text-emerald-700">Support Active</Badge>
                        </div>
                        
                        {/* Simulated Map Container */}
                        <div className="flex-1 bg-slate-100 rounded-xl relative overflow-hidden min-h-[220px] border border-slate-200">
                            {/* Grid background for map feel */}
                            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            
                            {/* Pharmacy Markers */}
                            <div className="absolute top-[30%] left-[40%] group cursor-pointer">
                                <div className="p-2 bg-white rounded-lg shadow-xl border border-red-200 animate-bounce">
                                    <Pill className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Apollo Pharmacy (2.1 km)
                                </div>
                            </div>
                            
                            <div className="absolute top-[60%] left-[20%] group cursor-pointer">
                                <div className="p-2 bg-white rounded-lg shadow-xl border border-blue-200">
                                    <Pill className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Generic Med Center (0.8 km)
                                </div>
                            </div>

                            <div className="absolute top-[20%] left-[75%] group cursor-pointer">
                                <div className="p-2 bg-white rounded-lg shadow-xl border border-indigo-200">
                                    <Pill className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    City Wellness Drugstore (3.5 km)
                                </div>
                            </div>

                            {/* Center Marker (Patient) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse" />
                                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-bold py-0.5 px-1.5 rounded uppercase tracking-tighter shadow-sm whitespace-nowrap">
                                    Patient Location
                                </div>
                            </div>

                            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                                <div className="py-1 px-2 bg-white/90 backdrop-blur-sm rounded border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-800">Assigned Zone: NW Mumbai</p>
                                    <p className="text-[8px] text-slate-500 font-medium leading-none">Status: Rapid Dispatch Enabled</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest gap-1 bg-slate-50">
                                <Phone className="w-3 h-3" /> Call Pharmacy
                            </Button>
                            <Button variant="secondary" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest gap-1 bg-medical-primary text-white border-none hover:bg-medical-secondary">
                                <ShoppingCart className="w-3 h-3" /> Priority Order
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Clinic Medicines Section */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Pill className="w-5 h-5 text-emerald-600" />
                            Clinic Medicines Provided
                        </h3>
                        <Button
                            onClick={() => setShowAddMedicine(!showAddMedicine)}
                            className="gap-2"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Medicine
                        </Button>
                    </div>

                    {showAddMedicine && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
                            <Input
                                placeholder="Medicine Name"
                                value={newMedicine.name}
                                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                className="bg-white"
                            />
                            <Input
                                placeholder="Dosage (e.g., 500mg)"
                                value={newMedicine.dosage}
                                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                className="bg-white"
                            />
                            <Input
                                placeholder="Frequency (e.g., 2x daily)"
                                value={newMedicine.frequency}
                                onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                                className="bg-white"
                            />
                            <Input
                                placeholder="Duration (e.g., 30 days)"
                                value={newMedicine.duration}
                                onChange={(e) => setNewMedicine({ ...newMedicine, duration: e.target.value })}
                                className="bg-white"
                            />
                            <div className="flex gap-2">
                                <Button onClick={handleAddMedicine} size="sm" className="flex-1">
                                    Add Medicine
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddMedicine(false)}
                                    size="sm"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {patient?.clinicMedicines && patient.clinicMedicines.length > 0 ? (
                        <div className="space-y-3">
                            {patient.clinicMedicines.map(medicine => (
                                <div key={medicine.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <Pill className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{medicine.name}</p>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <span className="font-semibold">{medicine.dosage}</span>
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {medicine.frequency}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {medicine.duration}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Added: {medicine.addedDate}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleMedicineDelete(medicine.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Pill className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>No clinic medicines added yet</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">

            {/* Add Patient Button & Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search patient by name..."
                        className="pl-10 bg-white border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => setShowAddPatient(!showAddPatient)}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Patient
                </Button>
            </div>

            {/* Add Patient Form */}
            {showAddPatient && (
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Add New Patient</h3>
                        <button
                            onClick={() => setShowAddPatient(false)}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            placeholder="Patient Full Name"
                            value={newPatientForm.name}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                            className="bg-white border-slate-200"
                        />
                        <Input
                            placeholder="Age"
                            type="number"
                            value={newPatientForm.age}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                            className="bg-white border-slate-200"
                        />
                        <Input
                            placeholder="Condition / Diagnosis"
                            value={newPatientForm.condition}
                            onChange={(e) => setNewPatientForm({ ...newPatientForm, condition: e.target.value })}
                            className="bg-white border-slate-200"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddPatient(false);
                                setNewPatientForm({ name: '', age: '', condition: '' });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddPatient}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Patient
                        </Button>
                    </div>
                </Card>
            )}

            {/* Patients List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-110 transition-transform",
                                    patient.status === 'active' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-slate-500 to-slate-600'
                                )}>
                                    {patient.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-lg truncate">{patient.name}</h3>
                                    <p className="text-sm text-slate-600">{patient.condition}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge
                                            className={cn(
                                                "text-[10px]",
                                                patient.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            )}
                                        >
                                            {patient.status === 'active' ? '✓ Active' : 'Inactive'}
                                        </Badge>
                                        <span className="text-[10px] text-slate-500">
                                            Age: {patient.age}
                                        </span>
                                        <span className="text-[10px] text-slate-500 ml-auto">
                                            Last: {patient.lastVisit}
                                        </span>
                                    </div>
                                    {(patient.prescriptions?.length > 0 || patient.clinicMedicines?.length > 0) && (
                                        <div className="flex gap-2 mt-3 text-[10px] text-muted-foreground">
                                            {patient.prescriptions?.length > 0 && (
                                                <span className="bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {patient.prescriptions.length} Rx
                                                </span>
                                            )}
                                            {patient.clinicMedicines?.length > 0 && (
                                                <span className="bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                                                    <Pill className="w-3 h-3" />
                                                    {patient.clinicMedicines.length} Meds
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-slate-500">{searchQuery ? `No patients found matching "${searchQuery}"` : 'No patients available'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPage;
