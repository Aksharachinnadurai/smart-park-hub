import { ParkingZone, User, PARKING_CONFIG } from '@/types/parking';
import { Car, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HeaderProps {
  user: User | null;
  activeZone: ParkingZone;
  onZoneChange: (zone: ParkingZone) => void;
  zoneStats: {
    available: number;
    reserved: number;
    occupied: number;
  };
}

export const Header = ({ user, activeZone, onZoneChange, zoneStats }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row - Logo and User */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Smart Parking</h1>
              <p className="text-xs text-muted-foreground">Find & Book Instantly</p>
            </div>
          </div>

          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono">{user.vehicleNumber}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Zone Selector */}
        <div className="flex gap-2">
          {(['S', 'R'] as ParkingZone[]).map((zone) => (
            <button
              key={zone}
              onClick={() => onZoneChange(zone)}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200",
                activeZone === zone
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-base">{zone} Parking</span>
                <span className="text-xs opacity-80">
                  {PARKING_CONFIG[zone].totalSlots} Slots
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slot-available" />
            <span>{zoneStats.available} Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slot-reserved" />
            <span>{zoneStats.reserved} Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slot-occupied" />
            <span>{zoneStats.occupied} Occupied</span>
          </div>
        </div>
      </div>
    </header>
  );
};
