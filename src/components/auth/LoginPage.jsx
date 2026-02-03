import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stethoscope, User, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onDemoLogin }) {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient"); // 'patient' or 'doctor'
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <video
                    src="/Arogyam_Spinner.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-24 h-24"
                />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
            } else {
                console.log(result);
                // Handle multi-factor steps if necessary, for now assume simple auth
            }
        } catch (err) {
            console.error("error", err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
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
                    <CardTitle className="text-center text-xl text-slate-800">Arogyam Secure Login</CardTitle>
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
                            <User size={16} weight="bold" /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <Stethoscope size={16} weight="bold" /> Doctor
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
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-xs font-medium text-teal-600 decoration-teal-600 underline-offset-4 hover:underline"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Forgot password?
                                    </a>
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
                        <Button
                            type="submit"
                            className={`w-full mt-6 font-bold shadow-lg shadow-teal-900/10 ${role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : `Sign In as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
                        </Button>

                        {/* Demo Buttons */}
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                type="button"
                                className="flex-1 text-xs h-8 border-teal-200 text-teal-700 hover:bg-teal-50"
                                onClick={() => {
                                    setRole('patient');
                                    // In a real app, this would pre-fill credentials.
                                    // For this hackathon/demo, we bypass auth.
                                    if (onDemoLogin) onDemoLogin();
                                }}
                            >
                                Demo Patient
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="flex-1 text-xs h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                    setRole('doctor');
                                    if (onDemoLogin) onDemoLogin();
                                }}
                            >
                                Demo Doctor
                            </Button>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                            onClick={() => signIn.authenticateWithRedirect({
                                strategy: "oauth_google",
                                redirectUrl: "/sso-callback",
                                redirectUrlComplete: "/"
                            })}
                            disabled={isLoading}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                    </form>
                </CardContent>

            </Card>
        </div>
    )
}
