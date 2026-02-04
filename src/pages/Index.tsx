import { useState } from 'react';
import { useParkingState } from '@/hooks/useParkingState';
import { ParkingSlot, BookingFormData } from '@/types/parking';
import { Header } from '@/components/parking/Header';
import { ParkingLot } from '@/components/parking/ParkingLot';
import { AuthModal } from '@/components/parking/AuthModal';
import { BookingModal } from '@/components/parking/BookingModal';
import { SlotDetailsModal } from '@/components/parking/SlotDetailsModal';
import { toast } from 'sonner';

const Index = () => {
  const {
    user,
    slots,
    activeZone,
    isLoading,
    setActiveZone,
    registerUser,
    bookSlot,
    confirmArrival,
    cancelBooking,
    getZoneStats,
  } = useParkingState();

  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (!user) return;

    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setIsBookingModalOpen(true);
    } else if (slot.vehicleNumber === user.vehicleNumber) {
      setSelectedSlot(slot);
      setIsDetailsModalOpen(true);
    } else {
      toast.error('This slot is already booked by another user');
    }
  };

  const handleBooking = (data: BookingFormData) => {
    if (selectedSlot) {
      const success = bookSlot(selectedSlot.id, data);
      if (success) {
        toast.success(`Slot ${selectedSlot.zone}-${selectedSlot.slotNumber} booked successfully!`);
        setIsBookingModalOpen(false);
        setSelectedSlot(null);
      }
    }
  };

  const handleConfirmArrival = () => {
    if (selectedSlot) {
      confirmArrival(selectedSlot.id);
      toast.success('Arrival confirmed! Your vehicle is now marked as parked.');
      setIsDetailsModalOpen(false);
      setSelectedSlot(null);
    }
  };

  const handleCancelBooking = () => {
    if (selectedSlot) {
      cancelBooking(selectedSlot.id);
      toast.success('Booking cancelled successfully');
      setIsDetailsModalOpen(false);
      setSelectedSlot(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading parking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Modal - Shows when user is not registered */}
      <AuthModal isOpen={!user} onRegister={registerUser} />

      {/* Header with zone selector */}
      <Header
        user={user}
        activeZone={activeZone}
        onZoneChange={setActiveZone}
        zoneStats={getZoneStats(activeZone)}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <ParkingLot
          zone={activeZone}
          slots={slots[activeZone]}
          onSlotClick={handleSlotClick}
        />
      </main>

      {/* Booking Modal */}
      <BookingModal
        slot={selectedSlot}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedSlot(null);
        }}
        onConfirm={handleBooking}
      />

      {/* Slot Details Modal */}
      <SlotDetailsModal
        slot={selectedSlot}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSlot(null);
        }}
        onConfirmArrival={handleConfirmArrival}
        onCancel={handleCancelBooking}
      />
    </div>
  );
};

export default Index;
