export interface StoreSettings {
  _id?: import('mongodb').ObjectId
  // Hours: 24h format HH:MM local time
  weekdayOpen: string // e.g. "07:00"
  weekdayClose: string // e.g. "19:00"
  sundayOpen?: string // optional
  sundayClose?: string // optional
  // WhatsApp contact number (with country code, no spaces or special chars)
  whatsappNumber?: string // e.g. "919544845854"
  // List of ISO date strings (YYYY-MM-DD) that are full-day off
  offDates: string[]
  updatedAt: Date
}
