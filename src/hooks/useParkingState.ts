import { useState, useEffect, useCallback } from 'react';
import { ParkingSlot, ParkingZone, User, PARKING_CONFIG, BookingFormData } from '@/types/parking';

const STORAGE_KEYS = {
  USER: 'parking_user',
  SLOTS: 'parking_slots',
};

const generateSlots = (zone: ParkingZone): ParkingSlot[] => {
  const config = PARKING_CONFIG[zone];
  const slots: ParkingSlot[] = [];

  // Generate employee slots
  for (let i = 1; i <= config.employeeSlots; i++) {
    slots.push({
      id: `${zone}-EMP-${i}`,
      slotNumber: i,
      zone,
      category: 'employee',
      status: 'available',
    });
  }

  // Generate user slots
  for (let i = 1; i <= config.userSlots; i++) {
    slots.push({
      id: `${zone}-USR-${i}`,
      slotNumber: i,
      zone,
      category: 'user',
      status: 'available',
    });
  }

  return slots;
};

export const useParkingState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [slots, setSlots] = useState<Record<ParkingZone, ParkingSlot[]>>({
    S: [],
    R: [],
  });
  const [activeZone, setActiveZone] = useState<ParkingZone>('S');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    } else {
      setSlots({
        S: generateSlots('S'),
        R: generateSlots('R'),
      });
    }

    setIsLoading(false);
  }, []);

  // Save slots to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && slots.S.length > 0) {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
    }
  }, [slots, isLoading]);

  const registerUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }, []);

  const bookSlot = useCallback((slotId: string, bookingData: BookingFormData) => {
    if (!user) return false;

    setSlots((prev) => {
      const zone = slotId.startsWith('S') ? 'S' : 'R';
      return {
        ...prev,
        [zone]: prev[zone].map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                status: 'reserved' as const,
                userName: user.name,
                vehicleNumber: user.vehicleNumber,
                arrivalTime: bookingData.arrivalTime,
                duration: bookingData.duration,
                bookedAt: new Date().toISOString(),
              }
            : slot
        ),
      };
    });

    return true;
  }, [user]);

  const confirmArrival = useCallback((slotId: string) => {
    setSlots((prev) => {
      const zone = slotId.startsWith('S') ? 'S' : 'R';
      return {
        ...prev,
        [zone]: prev[zone].map((slot) =>
          slot.id === slotId
            ? { ...slot, status: 'occupied' as const }
            : slot
        ),
      };
    });
  }, []);

  const cancelBooking = useCallback((slotId: string) => {
    setSlots((prev) => {
      const zone = slotId.startsWith('S') ? 'S' : 'R';
      return {
        ...prev,
        [zone]: prev[zone].map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                status: 'available' as const,
                userName: undefined,
                vehicleNumber: undefined,
                arrivalTime: undefined,
                duration: undefined,
                bookedAt: undefined,
              }
            : slot
        ),
      };
    });
  }, []);

  const getUserBookings = useCallback(() => {
    if (!user) return [];
    
    return [...slots.S, ...slots.R].filter(
      (slot) => slot.vehicleNumber === user.vehicleNumber && slot.status !== 'available'
    );
  }, [user, slots]);

  const getZoneStats = useCallback((zone: ParkingZone) => {
    const zoneSlots = slots[zone];
    const userSlots = zoneSlots.filter((s) => s.category === 'user');
    
    return {
      total: zoneSlots.length,
      available: userSlots.filter((s) => s.status === 'available').length,
      reserved: userSlots.filter((s) => s.status === 'reserved').length,
      occupied: userSlots.filter((s) => s.status === 'occupied').length,
    };
  }, [slots]);

  return {
    user,
    slots,
    activeZone,
    isLoading,
    setActiveZone,
    registerUser,
    bookSlot,
    confirmArrival,
    cancelBooking,
    getUserBookings,
    getZoneStats,
  };
};
