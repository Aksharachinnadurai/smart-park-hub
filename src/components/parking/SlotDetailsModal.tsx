import { ParkingSlot } from '@/types/parking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, User, XCircle, CheckCircle2 } from 'lucide-react';

interface SlotDetailsModalProps {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmArrival: () => void;
  onCancel: () => void;
}

export const SlotDetailsModal = ({
  slot,
  isOpen,
  onClose,
  onConfirmArrival,
  onCancel,
}: SlotDetailsModalProps) => {
  if (!slot) return null;

  const isReserved = slot.status === 'reserved';
  const isOccupied = slot.status === 'occupied';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car 
              className={`w-6 h-6 ${isReserved ? 'text-slot-reserved' : 'text-slot-occupied'}`} 
            />
            Your Booking
          </DialogTitle>
          <DialogDescription>
            {isReserved
              ? 'Your slot is reserved. Confirm when you arrive.'
              : 'Your vehicle is currently parked here.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Slot Info Card */}
          <div 
            className={`rounded-lg p-4 space-y-3 border-2 ${
              isReserved 
                ? 'bg-slot-reserved/10 border-slot-reserved/30' 
                : 'bg-slot-occupied/10 border-slot-occupied/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{slot.zone} Parking</span>
              </div>
              <span className="text-2xl font-bold">#{slot.slotNumber}</span>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{slot.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">{slot.vehicleNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  Arrival: {slot.arrivalTime} • {slot.duration}h duration
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center pt-2">
              <span 
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  isReserved 
                    ? 'bg-slot-reserved/20 text-slot-reserved' 
                    : 'bg-slot-occupied/20 text-slot-occupied'
                }`}
              >
                {isReserved ? 'Awaiting Arrival' : 'Vehicle Parked'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          {isReserved && (
            <Button 
              onClick={onConfirmArrival}
              className="w-full sm:w-auto bg-slot-available hover:bg-slot-available/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              I Have Arrived
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
