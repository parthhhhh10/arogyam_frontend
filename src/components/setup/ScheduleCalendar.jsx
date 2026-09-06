import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useArogyam } from '../../hooks/useArogyam';

const ScheduleCalendar = () => {
  const { selectedDate: selectedDateStr, setSelectedDate: setSelectedDateStr } = useArogyam();
  const [currentDate, setCurrentDate] = useState(new Date(selectedDateStr));
  
  const selectedDate = new Date(selectedDateStr);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const offset = firstDayOfMonth(year, currentDate.getMonth());

  // Weekday initials
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  for (let i = 0; i < offset; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateOfThisDay = new Date(year, currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneMonthFromToday = new Date(today);
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    const isPast = false; // Allow selecting past dates
    const isTooFar = false; // Allow selecting future dates
    const isDisabled = false;

    const isSelected = selectedDate.getDate() === day && 
                       selectedDate.getMonth() === currentDate.getMonth() && 
                       selectedDate.getFullYear() === currentDate.getFullYear();
    const isToday = today.getDate() === day && 
                    today.getMonth() === currentDate.getMonth() && 
                    today.getFullYear() === currentDate.getFullYear();

    days.push(
      <button
        key={day}
        disabled={isDisabled}
        onClick={() => {
            if (!isDisabled) {
                const newDate = new Date(year, currentDate.getMonth(), day);
                const yearStr = newDate.getFullYear();
                const monthStr = String(newDate.getMonth() + 1).padStart(2, '0');
                const dayStr = String(newDate.getDate()).padStart(2, '0');
                setSelectedDateStr(`${yearStr}-${monthStr}-${dayStr}`);
            }
        }}
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
          isSelected ? "bg-primary text-primary-foreground shadow-md scale-110" : 
          isToday ? "bg-secondary text-secondary-foreground border border-primary/30" : 
          isDisabled ? "text-muted-foreground/30 cursor-not-allowed" :
          "hover:bg-accent hover:text-accent-foreground text-foreground/70"
        )}
      >
        {day}
      </button>
    );
  }

  const today = new Date();
  const nextMonthLimit = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const isNavPrevDisabled = false; // Allow navigating to past months
  const isNavNextDisabled = false; // Allow navigating to future months

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-foreground">{monthName} {year}</h3>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth} 
            className="h-8 w-8"
            disabled={isNavPrevDisabled}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth} 
            className="h-8 w-8"
            disabled={isNavNextDisabled}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, idx) => (
          <div key={idx} className="h-10 w-10 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Selected Schedule:</span>
          <span className="font-bold text-primary">{selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
