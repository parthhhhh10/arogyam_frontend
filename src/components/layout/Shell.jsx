"use client"

import React, { useState } from 'react';
import useArogyam from '../../hooks/useArogyam';
import {
    Settings,
    Package,
    ShoppingCart,
    BarChart3,
    AlertCircle,
    User,
    Bell,
    Activity,
    LogOut,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

// Feature Demos requested by USER
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Minus, Plus } from "lucide-react"

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
    >
        <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
        <span className="font-semibold text-sm">{label}</span>
        {badge && (
            <span className={cn(
                "ml-auto px-2 py-0.5 text-[10px] rounded-full font-bold",
                active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive text-destructive-foreground"
            )}>
                {badge}
            </span>
        )}
    </button>
);

const DrawerDemo = () => {
    const [goal, setGoal] = React.useState(350)
    const data = [{ goal: 400 }, { goal: 300 }, { goal: 200 }, { goal: 300 }, { goal: 200 }, { goal: 278 }, { goal: 189 }, { goal: 239 }, { goal: 300 }, { goal: 200 }, { goal: 278 }, { goal: 189 }, { goal: 349 }]

    function onClick(adjustment) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)))
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">Dose Status</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Daily Dose Goal</DrawerTitle>
                        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => onClick(-10)}
                                disabled={goal <= 200}
                            >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="flex-1 text-center">
                                <div className="text-7xl font-bold tracking-tighter">
                                    {goal}
                                </div>
                                <div className="text-muted-foreground text-[0.70rem] uppercase">
                                    Calories/day
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full"
                                onClick={() => onClick(10)}
                                disabled={goal >= 400}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase</span>
                            </Button>
                        </div>
                        <div className="mt-3 h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <Bar
                                        dataKey="goal"
                                        style={{
                                            fill: "hsl(var(--primary))",
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

const ThemeSwitch = () => {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex items-center space-x-2">
            <Switch
                id="theme-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Label htmlFor="theme-mode" className="sr-only">Dark Mode</Label>
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </div>
    )
}

const Shell = ({ children }) => {
    const { activeTab, setActiveTab } = useArogyam();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'setup', label: 'Patient Setup', icon: Settings },
        { id: 'stock', label: 'Inventory', icon: Package },
        { id: 'refill', label: 'Prescriptions', icon: ShoppingCart },
        { id: 'history', label: 'Health Analytics', icon: BarChart3 },
        { id: 'emergency', label: 'SOS / Support', icon: AlertCircle, badge: '!' },
    ];

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 transform",
                !isSidebarOpen && "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-10 px-2">
                        <img
                            src="/logo.png"
                            alt="Arogyam Logo"
                            className="h-24 w-auto object-contain hover:scale-105 transition-transform duration-300 rounded-2xl"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                                badge={item.badge}
                            />
                        ))}
                    </nav>

                    {/* User Profile Mini */}
                    <div className="mt-auto pt-6 border-t border-border">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                                <User className="text-muted-foreground w-5 h-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-foreground truncate">Dr. Rajesh Kumar</p>
                                <p className="text-[10px] text-muted-foreground truncate">Chief Surgeon</p>
                            </div>
                            <button className="text-muted-foreground hover:text-destructive transition-colors">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 transition-all duration-300",
                isSidebarOpen ? "ml-72" : "ml-0"
            )}>
                {/* Top Header */}
                <header className="sticky top-0 z-40 h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <h2 className="text-lg font-bold text-foreground capitalize">
                            {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <DrawerDemo />
                        <ThemeSwitch />

                        <div className="h-8 w-px bg-border mx-2"></div>

                        <Button variant="ghost" size="icon" className="relative group">
                            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive border-2 border-background rounded-full"></span>
                        </Button>
                    </div>
                </header>

                {/* Content Body */}
                <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, here's what's happening today in your clinic.
                        </p>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Shell;
