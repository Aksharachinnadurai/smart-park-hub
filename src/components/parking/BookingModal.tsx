import { useState } from 'react';
import { ParkingSlot, BookingFormData } from '@/types/parking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, MapPin, Car } from 'lucide-react';

interface BookingModalProps {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: BookingFormData) => void;
}

export const BookingModal = ({ slot, isOpen, onClose, onConfirm }: BookingModalProps) => {
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!arrivalTime) {
      setError('Please select an arrival time');
      return;
    }

    onConfirm({
      arrivalTime,
      duration: parseInt(duration, 10),
    });

    // Reset form
    setArrivalTime('');
    setDuration('1');
    setError('');
  };

  const handleClose = () => {
    setArrivalTime('');
    setDuration('1');
    setError('');
    onClose();
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car className="w-6 h-6 text-slot-available" />
            Book Parking Slot
          </DialogTitle>
          <DialogDescription>
            Complete the booking details for your parking slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Slot Info */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{slot.zone} Parking</span>
              <span className="text-muted-foreground">•</span>
              <span>Slot #{slot.slotNumber}</span>
            </div>
          </div>

          {/* Arrival Time */}
          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expected Arrival Time
            </Label>
            <Input
              id="arrivalTime"
              type="time"
              value={arrivalTime}
              onChange={(e) => {
                setArrivalTime(e.target.value);
                setError('');
              }}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Parking Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="2">2 Hours</SelectItem>
                <SelectItem value="3">3 Hours</SelectItem>
                <SelectItem value="4">4 Hours</SelectItem>
                <SelectItem value="8">8 Hours (Full Day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-slot-available hover:bg-slot-available/90">
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
