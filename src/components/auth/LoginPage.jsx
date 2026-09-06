import React, { useState } from 'react';
import { useArogyam } from '../../context/ArogyamContext';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stethoscope, User, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const { setUserToken, setUserRole } = useArogyam();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient"); // 'patient' or 'doctor'
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        console.log("FORM SUBMITTED");
        if (e) e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const url = isLogin 
                ? "http://127.0.0.1:9090/api/auth/login" 
                : "http://127.0.0.1:9090/api/auth/register";
            const payload = isLogin 
                ? { email, password } 
                : { name, email, password };

            console.log("Triggering API Request:", { url, method: 'POST', payload });

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("Response Status:", res.status);

            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                console.error("JSON Parse Error:", jsonErr);
                throw new Error("Backend server returned an invalid response.");
            }
            
            if (res.ok && data && (data.success !== false)) {
                console.log("Authentication Successful:", data);
                setUserRole(role);
                const token = data.data?.token || data.token;
                if (token) {
                    setUserToken(token);
                } else {
                    setError("Login succeeded but no token received.");
                }
            } else {
                console.warn("Authentication Failed:", data);
                setError(data?.message || data?.error || `Failed to authenticate. Status: ${res.status}`);
            }
        } catch (err) {
            console.error("Fetch/Network Error:", err);
            if (err.message && err.message.includes("Backend server returned")) {
                setError(err.message);
            } else {
                setError("Network error: Could not reach server at 127.0.0.1:9090.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <Card className="w-full max-w-sm shadow-xl border-slate-200">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-teal-50 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-xl text-slate-800">Arogyam Secure {isLogin ? 'Login' : 'Signup'}</CardTitle>
                    <CardDescription className="text-center">
                        {role === 'doctor' ? 'Medical Professional Portal' : 'Patient Access Portal'}
                    </CardDescription>

                    {/* Role Toggle */}
                    <div className="flex gap-2 mt-6 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${role === 'patient' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <User size={16} /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <Stethoscope size={16} /> Doctor
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Authentication Error</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!isLogin && (
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                        value={name}
                                        disabled={isLoading}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={role === 'doctor' ? "dr.reference@hospital.com" : "you@example.com"}
                                    required
                                    value={email}
                                    disabled={isLoading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    disabled={isLoading}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`w-full mt-6 py-2 px-4 rounded-md text-white font-bold shadow-lg shadow-teal-900/10 transition-all ${role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : (isLogin ? `Sign In as ${role === 'doctor' ? 'Doctor' : 'Patient'}` : `Sign Up as ${role === 'doctor' ? 'Doctor' : 'Patient'}`)}
                        </button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="text-sm text-teal-600 hover:underline"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                }}
                            >
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
