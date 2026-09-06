import React, { useState } from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import {
    Search,
    Filter,
    Package,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    MoreVertical,
    Pill
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../ui/MedicalUI';

const InventoryPage = () => {
    const { trays, medicineDispensed } = useArogyam();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter trays based on search
    const filteredTrays = trays.filter(tray =>
        tray.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate totals
    const remainingMedicine = trays.reduce((total, t) => total + (t.stockMorning || 0) + (t.stockAfternoon || 0) + (t.stockEvening || 0), 0);

    return (
        <div className="space-y-6 pb-20 md:pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
                    <p className="text-slate-500 text-sm">Real-time tracking of medical dispenser contents.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button variant="primary" className="gap-2">
                        <ArrowUpRight className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Total Medicines</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{trays.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Remaining Medicine</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{remainingMedicine}</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-slate-200 shadow-sm hidden md:block">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Next Expiry</p>
                            <h3 className="text-xl font-bold text-slate-800 mt-1">Aug 24</h3>
                            <p className="text-[10px] text-slate-400">Metformin 500mg</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-slate-200 shadow-sm hidden md:block">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Medicine Dispensed</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{medicineDispensed}</h3>
                            <p className="text-[10px] text-slate-400">From ESP/IR Sensor</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Pill className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-slate-200 shadow-sm hidden md:block">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">System Status</p>
                            <h3 className="text-lg font-bold text-emerald-600 mt-1">Online</h3>
                            <p className="text-[10px] text-slate-400">Synced 2m ago</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search medicines..."
                    className="pl-10 bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Inventory List */}
            <div className="space-y-4">
                {filteredTrays.map((tray) => (
                    <InventoryItem key={tray.id} tray={tray} />
                ))}
                {filteredTrays.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No medicines found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
};

const InventoryItem = ({ tray }) => {
    const stockCount = (tray.stockMorning || 0) + (tray.stockAfternoon || 0) + (tray.stockEvening || 0);
    const maxStock = (tray.morning * 4) + (tray.afternoon * 4) + (tray.evening * 4);
    const percentage = maxStock > 0 ? Math.round((stockCount / maxStock) * 100) : 0;
    const isLow = percentage > 0 && percentage < 30;

    return (
        <Card className="p-4 md:p-6 bg-white hover:shadow-md transition-shadow border-slate-200 group">
            <div className="flex items-center gap-4">
                {/* Icon / Avatar */}
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    tray.isSOS ? "bg-red-100 text-red-600" : `bg-gradient-to-br ${tray.color} text-white`
                )}>
                    <Pill className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-slate-900 truncate pr-2">{tray.name}</h4>
                            <p className="text-xs text-slate-500">Tray #{tray.id} • Tablet</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Stock Bar (Mobile & Desktop) */}
                    <div className="mt-4">
                        <div className="flex justify-between items-end mb-1">
                            <span className={cn(
                                "text-xs font-bold",
                                isLow ? "text-red-500" : "text-emerald-600"
                            )}>
                                {isLow ? 'Low Stock' : 'In Stock'}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                                {stockCount} / {maxStock} units
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    isLow ? "bg-red-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default InventoryPage;
