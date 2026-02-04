import { ParkingSlot } from '@/types/parking';
import { Car, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingSlotComponentProps {
  slot: ParkingSlot;
  onClick?: () => void;
  isUserSlot?: boolean;
}

export const ParkingSlotComponent = ({ slot, onClick, isUserSlot }: ParkingSlotComponentProps) => {
  const isEmployee = slot.category === 'employee';
  
  const getSlotClasses = () => {
    if (isEmployee) {
      return 'bg-slot-employee/20 border-slot-employee cursor-not-allowed';
    }
    
    switch (slot.status) {
      case 'available':
        return 'bg-slot-available/20 border-slot-available hover:bg-slot-available/40 cursor-pointer hover:scale-105';
      case 'reserved':
        return 'bg-slot-reserved/30 border-slot-reserved cursor-pointer hover:scale-105';
      case 'occupied':
        return 'bg-slot-occupied/30 border-slot-occupied cursor-pointer hover:scale-105';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    if (isEmployee) {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <User className="w-4 h-4 text-slot-employee" />
          <span className="text-[8px] font-bold text-slot-employee">EMP</span>
        </div>
      );
    }

    if (slot.status === 'reserved' || slot.status === 'occupied') {
      return (
        <Car 
          className={cn(
            "w-5 h-5",
            slot.status === 'reserved' ? 'text-slot-reserved' : 'text-slot-occupied'
          )} 
        />
      );
    }

    return (
      <span className="text-xs font-semibold text-slot-available">
        {slot.slotNumber}
      </span>
    );
  };

  return (
    <button
      onClick={isEmployee ? undefined : onClick}
      disabled={isEmployee}
      className={cn(
        "relative w-12 h-16 md:w-14 md:h-20 flex items-center justify-center rounded-md border-2 transition-all duration-200",
        getSlotClasses()
      )}
      style={{
        transform: isUserSlot ? 'skewY(-8deg)' : 'skewY(8deg)',
      }}
    >
      <div 
        className="flex items-center justify-center"
        style={{
          transform: isUserSlot ? 'skewY(8deg)' : 'skewY(-8deg)',
        }}
      >
        {getStatusIcon()}
      </div>
      
      {/* Slot border detail */}
      <div 
        className={cn(
          "absolute inset-x-1 bottom-1 h-0.5 rounded-full",
          isEmployee ? 'bg-slot-employee/50' : 
          slot.status === 'available' ? 'bg-slot-available/50' :
          slot.status === 'reserved' ? 'bg-slot-reserved/50' : 'bg-slot-occupied/50'
        )}
      />
    </button>
  );
};
