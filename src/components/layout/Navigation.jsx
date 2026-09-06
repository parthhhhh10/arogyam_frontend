import React from 'react';
import { useArogyam } from '../../hooks/useArogyam';
import { Pill, GridFour, Storefront, ChartLineUp, Phone, FileText, ShoppingCart, Info, Ambulance } from '@phosphor-icons/react';

const NavButton = ({ active, onClick, icon, label, sublabel, bgColor }) => (
    <button
        onClick={onClick}
        className={`nav-item group flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-300 ${active ? 'nav-active bg-emerald-50 content-highlight' : 'hover:bg-slate-50'}`}
    >
        <div className={`p-4 rounded-2xl shadow-sm ${bgColor} ${active ? 'scale-110 shadow-md' : 'group-hover:scale-105'}`}>
            {React.cloneElement(icon, { size: 40, weight: active ? "fill" : "regular" })}
        </div>
        <div className="text-left hidden md:block">
            <div className="font-bold text-slate-800 text-lg leading-tight">{label}</div>
            <div className="text-xs text-slate-500 font-medium tracking-wide">{sublabel}</div>
        </div>
        {/* Mobile only icon labels */}
        <div className="text-[10px] font-bold md:hidden mt-0.5">{label}</div>
    </button>
);

const Navigation = () => {
    const { activeTab, setActiveTab } = useArogyam();

    return (
        <nav className="flex justify-center mb-12 animate-slide-in-up px-4" style={{ animationDelay: '0.3s' }}>
            <div className="glass-nav p-2 inline-flex gap-2 items-stretch max-w-full overflow-x-auto hide-scrollbar">
                <NavButton
                    active={activeTab === 'setup'}
                    onClick={() => setActiveTab('setup')}
                    icon={<Pill className="text-teal-600" />}
                    label="Setup"
                    sublabel="Medicine Schedule"
                    bgColor="bg-teal-50"
                />
                <NavButton
                    active={activeTab === 'stock'}
                    onClick={() => setActiveTab('stock')}
                    icon={<GridFour className="text-blue-600" />}
                    label="Inventory"
                    sublabel="Manage Items"
                    bgColor="bg-blue-50"
                />
                <NavButton
                    active={activeTab === 'refill'}
                    onClick={() => setActiveTab('refill')}
                    icon={<Storefront className="text-amber-600" />}
                    label="Refill"
                    sublabel="Pharmacy Orders"
                    bgColor="bg-amber-50"
                />
                <NavButton
                    active={activeTab === 'history'}
                    onClick={() => setActiveTab('history')}
                    icon={<ChartLineUp className="text-purple-600" />}
                    label="Stats"
                    sublabel="Reports"
                    bgColor="bg-purple-50"
                />
                <NavButton
                    active={activeTab === 'emergency'}
                    onClick={() => setActiveTab('emergency')}
                    icon={<Phone className="text-red-500" />}
                    label="SOS"
                    sublabel="Emergency"
                    bgColor="bg-red-50"
                />
            </div>
        </nav>
    );
};

export default Navigation;
