import { ParkingSlot, ParkingZone } from '@/types/parking';
import { ParkingSlotComponent } from './ParkingSlotComponent';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ParkingLotProps {
  zone: ParkingZone;
  slots: ParkingSlot[];
  onSlotClick: (slot: ParkingSlot) => void;
}

export const ParkingLot = ({ zone, slots, onSlotClick }: ParkingLotProps) => {
  const employeeSlots = slots.filter((s) => s.category === 'employee');
  const emergencySlots = slots.filter((s) => s.category === 'emergency');
  const userSlots = slots.filter((s) => s.category === 'user');

  // Split into rows for better layout
  const createRows = (slotList: ParkingSlot[], slotsPerRow: number) => {
    const rows: ParkingSlot[][] = [];
    for (let i = 0; i < slotList.length; i += slotsPerRow) {
      rows.push(slotList.slice(i, i + slotsPerRow));
    }
    return rows;
  };

  const slotsPerRow = 5;
  const employeeRows = createRows(employeeSlots, slotsPerRow);
  // Combine emergency slots with user slots for display (emergency first)
  const userAndEmergencySlots = [...emergencySlots, ...userSlots];
  const userRows = createRows(userAndEmergencySlots, slotsPerRow);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Zone Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {zone} Parking Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          {slots.length} Total Slots
        </p>
      </div>

      {/* Parking Layout Container */}
      <div className="bg-card rounded-2xl shadow-lg p-4 md:p-6 border border-border overflow-hidden">
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slot-available/30 border-2 border-slot-available" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slot-reserved/30 border-2 border-slot-reserved" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slot-occupied/30 border-2 border-slot-occupied" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slot-employee/20 border-2 border-slot-employee" />
            <span>Employee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slot-emergency/20 border-2 border-slot-emergency" />
            <span>Emergency</span>
          </div>
        </div>

        {/* Entry Sign */}
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            ENTRY
          </div>
        </div>

        {/* Parking Grid */}
        <div className="flex gap-2 md:gap-4">
          {/* Employee Side */}
          <div className="flex-1">
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-slot-employee uppercase tracking-wide">
                Employee Parking
              </span>
            </div>
            <div className="space-y-2">
              {employeeRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-end gap-1 md:gap-1.5">
                  {row.map((slot) => (
                    <ParkingSlotComponent
                      key={slot.id}
                      slot={slot}
                      isUserSlot={false}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Road */}
          <div className="w-16 md:w-24 flex-shrink-0">
            <div className="h-full bg-road-surface rounded-lg relative overflow-hidden">
              {/* Road markings */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-around py-4">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1.5 h-6 md:h-8 bg-road-arrow/80 rounded-full"
                  />
                ))}
              </div>
              
              {/* Direction Arrows */}
              <div className="absolute inset-0 flex flex-col items-center justify-between py-8 pointer-events-none">
                <ArrowDown className="w-6 h-6 text-road-arrow/60" />
                <ArrowUp className="w-6 h-6 text-road-arrow/60" />
              </div>
            </div>
          </div>

          {/* User Side */}
          <div className="flex-1">
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-slot-available uppercase tracking-wide">
                Visitor Parking
              </span>
            </div>
            <div className="space-y-2">
              {userRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-start gap-1 md:gap-1.5">
                  {row.map((slot) => (
                    <ParkingSlotComponent
                      key={slot.id}
                      slot={slot}
                      onClick={() => onSlotClick(slot)}
                      isUserSlot={true}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exit Sign */}
        <div className="flex justify-center mt-4">
          <div className="bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            EXIT
          </div>
        </div>
      </div>
    </div>
  );
};
