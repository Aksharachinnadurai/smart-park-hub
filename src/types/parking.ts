export type ParkingZone = 'S' | 'R';

export type SlotStatus = 'available' | 'reserved' | 'occupied';

export type SlotCategory = 'user' | 'employee' | 'emergency';

export interface ParkingSlot {
  id: string;
  slotNumber: number;
  zone: ParkingZone;
  category: SlotCategory;
  status: SlotStatus;
  userName?: string;
  vehicleNumber?: string;
  arrivalTime?: string;
  duration?: number;
  bookedAt?: string;
}

export interface User {
  name: string;
  vehicleNumber: string;
  email: string;
}

export interface BookingFormData {
  arrivalTime: string;
  duration: number;
}

export const PARKING_CONFIG = {
  S: {
    totalSlots: 100,
    userSlots: 40,
    employeeSlots: 55,
    emergencySlots: 5,
  },
  R: {
    totalSlots: 100,
    userSlots: 45,
    employeeSlots: 50,
    emergencySlots: 5,
  },
} as const;
