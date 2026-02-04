import { ParkingSlot } from '@/types/parking';
import { Car, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingSlotComponentProps {
  slot: ParkingSlot;
  onClick?: () => void;
  isUserSlot?: boolean;
}

export const ParkingSlotComponent = ({ slot, onClick, isUserSlot }: ParkingSlotComponentProps) => {
  const isEmployee = slot.category === 'employee';
  const isEmergency = slot.category === 'emergency';
  const isNonBookable = isEmployee || isEmergency;
  
  const getSlotClasses = () => {
    if (isEmployee) {
      return 'bg-slot-employee/20 border-slot-employee cursor-not-allowed';
    }
    
    if (isEmergency) {
      return 'bg-slot-emergency/20 border-slot-emergency cursor-not-allowed';
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

    if (isEmergency) {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <AlertTriangle className="w-4 h-4 text-slot-emergency" />
          <span className="text-[8px] font-bold text-slot-emergency">SOS</span>
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

  const getBorderColor = () => {
    if (isEmployee) return 'bg-slot-employee/50';
    if (isEmergency) return 'bg-slot-emergency/50';
    if (slot.status === 'available') return 'bg-slot-available/50';
    if (slot.status === 'reserved') return 'bg-slot-reserved/50';
    return 'bg-slot-occupied/50';
  };

  return (
    <button
      onClick={isNonBookable ? undefined : onClick}
      disabled={isNonBookable}
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
          getBorderColor()
        )}
      />
    </button>
  );
};
