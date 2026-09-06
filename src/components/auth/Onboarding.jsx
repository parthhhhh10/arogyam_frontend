import React, { useState } from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import { t, LANGUAGES } from '../../i18n/translations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, ChevronRight, Check } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const { 
        language, setLanguage, 
        doctors, 
        selectDoctor, 
        saveEmergencyContact,
        completeOnboarding,
        showToast
    } = useArogyam();

    const [step, setStep] = useState(1); // 1: Language, 2: Doctor, 3: Emergency, 4: Complete
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [emergencyContact, setEmergencyContactLocal] = useState('');
    const [errors, setErrors] = useState({});

    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLanguageSelect = (langCode) => {
        setLanguage(langCode);
        setStep(2);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleContinueFromDoctor = () => {
        if (!selectedDoctor) {
            setErrors({ doctor: t(language, 'doctorRequired') });
            return;
        }
        setErrors({});
        setStep(3);
    };

    const handleEmergencyContactChange = (e) => {
        const value = e.target.value;
        setEmergencyContactLocal(value);
        if (errors.emergencyContact) {
            setErrors(prev => ({ ...prev, emergencyContact: '' }));
        }
    };

    const validatePhoneNumber = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    };

    const handleContinueFromEmergency = () => {
        if (!emergencyContact.trim()) {
            setErrors({ emergencyContact: 'Phone number is required' });
            return;
        }
        if (!validatePhoneNumber(emergencyContact)) {
            setErrors({ emergencyContact: 'Please enter a valid phone number' });
            return;
        }
        setErrors({});
        setStep(4);
    };

    const handleCompleteOnboarding = () => {
        selectDoctor(selectedDoctor);
        saveEmergencyContact(emergencyContact);
        completeOnboarding();
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Step 1: Language Selection */}
                {step === 1 && (
                    <Card className="border-0 shadow-xl bg-white">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">🏥 Arogyam</h1>
                                <p className="text-slate-600">Welcome to your health companion</p>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm font-semibold text-slate-700 mb-4">Select Your Language • আপনার ভাষা নির্বাচন করুন</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className="p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 text-center group"
                                        >
                                            <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform">{lang.flag}</span>
                                            <p className="font-semibold text-sm text-slate-700">{lang.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Step 2: Doctor Selection */}
                {step === 2 && (
                    <Card className="border-0 shadow-xl bg-white">
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map(s => (
                                        <div 
                                            key={s}
                                            className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t(language, 'selectDoctor')}</h2>
                            <p className="text-slate-600 text-sm mb-6">{t(language, 'welcomeSubtitle')}</p>

                            {/* Search */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder={t(language, 'selectDoctorPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                                />
                            </div>

                            {/* Doctor List */}
                            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map(doctor => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => handleDoctorSelect(doctor)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                selectedDoctor?.id === doctor.id
                                                    ? 'border-emerald-400 bg-emerald-50'
                                                    : 'border-slate-200 hover:border-emerald-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-800">{doctor.name}</p>
                                                    <p className="text-sm text-slate-600">{doctor.specialty}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{doctor.phone}</p>
                                                </div>
                                                {selectedDoctor?.id === doctor.id && (
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm text-center py-4">No doctors found</p>
                                )}
                            </div>

                            {errors.doctor && <p className="text-red-600 text-sm mb-4">{errors.doctor}</p>}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContinueFromDoctor}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {t(language, 'continueBtn')} <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Step 3: Emergency Contact */}
                {step === 3 && (
                    <Card className="border-0 shadow-xl bg-white">
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map(s => (
                                        <div 
                                            key={s}
                                            className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t(language, 'emergencyContact')}</h2>
                            <p className="text-slate-600 text-sm mb-6">{t(language, 'emergencyContactHint')}</p>

                            {/* Contact Input */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="tel"
                                        placeholder={t(language, 'emergencyContactPlaceholder')}
                                        value={emergencyContact}
                                        onChange={handleEmergencyContactChange}
                                        className={`pl-10 border-2 transition-all ${
                                            errors.emergencyContact 
                                                ? 'border-red-400 focus:border-red-400'
                                                : 'border-slate-200 focus:border-emerald-400'
                                        }`}
                                    />
                                </div>
                                {errors.emergencyContact && (
                                    <p className="text-red-600 text-sm mt-2">{errors.emergencyContact}</p>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-900">
                                    <span className="font-semibold">ℹ️ Note: </span>
                                    This number will be automatically called when you long-press the SOS button in case of an emergency.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep(2)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContinueFromEmergency}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {t(language, 'continueBtn')} <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Step 4: Complete */}
                {step === 4 && (
                    <Card className="border-0 shadow-xl bg-white">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">All Set!</h2>
                                <p className="text-slate-600">Your profile has been configured</p>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4 mb-8 bg-slate-50 rounded-lg p-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-600 uppercase">Your Doctor</p>
                                    <p className="text-sm font-semibold text-slate-800">{selectedDoctor?.name}</p>
                                    <p className="text-xs text-slate-600">{selectedDoctor?.specialty}</p>
                                </div>
                                <div className="border-t border-slate-200 pt-3">
                                    <p className="text-xs font-semibold text-slate-600 uppercase">Emergency Contact</p>
                                    <p className="text-sm font-semibold text-slate-800">{emergencyContact}</p>
                                </div>
                            </div>

                            {/* Completion Button */}
                            <Button
                                onClick={handleCompleteOnboarding}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
                            >
                                Start Using Arogyam
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
