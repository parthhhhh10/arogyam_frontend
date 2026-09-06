import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    BarChart3,
    Activity,
    Clock,
    AlertCircle,
    Trophy,
    Target,
    TrendingUp,
    HeartPulse,
    Download,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../ui/MedicalUI';
import { useArogyam } from '../../hooks/useArogyam';
import ScheduleCalendar from '../setup/ScheduleCalendar';
import DispensePanel from './DispensePanel';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StatMini = ({ label, value, icon: Icon, trend, color }) => (
    <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2 rounded-lg", color)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            {trend && (
                <Badge variant={trend > 0 ? 'green' : 'red'} className="text-[10px]">
                    {trend > 0 ? '+' : ''}{trend}%
                </Badge>
            )}
        </div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    </Card>
);

const StatsPage = () => {
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 6,
                    padding: 20,
                    font: { size: 10, weight: 'bold' }
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            y: { grid: { color: '#f1f5f9' }, beginAtZero: true, max: 4, ticks: { stepSize: 1, font: { weight: 'bold', size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
        }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#f1f5f9' }, min: 50, max: 100, ticks: { font: { weight: 'bold', size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
        }
    };

    const barData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Taken',
                data: [3, 3, 2, 3, 3, 2, 3],
                backgroundColor: '#0284c7',
                borderRadius: 4,
                barThickness: 20
            },
            {
                label: 'Missed',
                data: [0, 0, 1, 0, 0, 1, 0],
                backgroundColor: '#f1f5f9',
                borderRadius: 4,
                barThickness: 20
            }
        ]
    };

    const lineData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Adherence %',
            data: [82, 88, 85, 94],
            borderColor: '#0284c7',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(2, 132, 199, 0.2)');
                gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');
                return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#0284c7',
            pointBorderWidth: 2
        }]
    };

    const { medicineDispensed } = useArogyam();
    
    return (
        <div className="space-y-8 pb-12">
            {/* Report Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-2xl border border-medical-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-medical-primary rounded-xl">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Biomedical Adherence Analytics</h3>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Jan 01 - Jan 31, 2024
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Today's Dose Status</p>
                        <p className="text-xl font-bold text-emerald-600">{medicineDispensed} Doses Dispensed</p>
                    </div>
                    <Button variant="secondary" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Clinical Report
                    </Button>
                </div>
            </div>

            {/* Calendar and Dispense Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <ScheduleCalendar />
                </div>
                <div>
                    <DispensePanel />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatMini label="Compliance Rate" value="94.2%" icon={Activity} color="bg-medical-primary" trend={5} />
                <StatMini label="Dispensed Today" value={medicineDispensed} icon={Target} color="bg-emerald-500" />
                <StatMini label="On-Time Delivery" value="88.7%" icon={Clock} color="bg-blue-500" trend={2.1} />
                <StatMini label="Longest Streak" value="12 Days" icon={Trophy} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Distribution */}
                <Card className="p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-md font-bold text-slate-800">Dosage Distribution</h4>
                            <p className="text-xs text-slate-500 font-medium">Daily compliance over the last 7 days</p>
                        </div>
                        <Badge variant="blue" className="text-[10px]">REAL-TIME</Badge>
                    </div>
                    <div className="h-64">
                        <Bar options={barOptions} data={barData} />
                    </div>
                </Card>

                {/* Patient Health Trend */}
                <Card className="p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-md font-bold text-slate-800">Adherence Trendline</h4>
                            <p className="text-xs text-slate-500 font-medium">Monthly performance trajectory</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-emerald-500 w-4 h-4" />
                            <span className="text-xs font-bold text-emerald-600">Improving</span>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line options={lineOptions} data={lineData} />
                    </div>
                </Card>
            </div>

            {/* AI Insights Card */}
            <Card className="p-8 bg-gradient-to-br from-medical-primary to-blue-700 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <HeartPulse className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-tight">Precision Insight™ Analysis</h4>
                            <p className="text-white/80 font-medium max-w-md">Patient adherence has increased by 12% following morning schedule adjustments. Predictability score: <span className="text-white font-bold">9.8/10</span></p>
                        </div>
                    </div>
                    <Button variant="ghost" className="bg-white text-medical-primary hover:bg-slate-50 font-bold px-8 py-6 rounded-xl shrink-0 group">
                        Full Diagnostic Review
                        <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StatsPage;
