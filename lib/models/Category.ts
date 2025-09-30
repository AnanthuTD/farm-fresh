import type { ObjectId } from "mongodb";

export interface Category {
  _id?: ObjectId;
  id: string; // slug-like unique id (e.g., "chicken")
  name: string; // display name
  description?: string;
  image?: string; // URL or path to image
  // Availability
  alwaysAvailable?: boolean; // if true, available regardless of schedule
  availableDays?: number[]; // 0=Sun ... 6=Sat
  availableTimeStart?: string; // "HH:MM" 24h, local time
  availableTimeEnd?: string;   // "HH:MM" 24h, local time
  createdAt: Date;
  updatedAt: Date;
}
