import seed from "./seed.json";

export type Staff = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  initials: string;
  photoPlaceholder: string;
  color: string;
  workingHours: Record<string, { start: string; end: string } | null>;
};

export type Service = {
  id: string;
  name: string;
  category: "Barbering" | "Beauty";
  durationMinutes: number;
  price: number;
  deposit: number;
  staffIds: string[];
  description: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  preferredStaffId: string;
};

export type Appointment = {
  id: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: "completed" | "no-show" | "booked" | "confirmed" | "cancelled";
  depositPaid: boolean;
  reminderConfirmed: boolean;
  source: "online" | "phone" | "waitlist";
};

export type WaitlistEntry = {
  id: string;
  clientId: string;
  serviceId: string;
  preferredStaffId: string | null;
};

export type BookedSolidSeed = {
  business: {
    name: string;
    location: string;
    tagline: string;
    phone: string;
    instagram: string;
    asOfDate: string;
    cancellationPolicy: string;
    noShowPolicy: string;
  };
  staff: Staff[];
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  waitlist: WaitlistEntry[];
};

export const seedData = seed as BookedSolidSeed;

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export const formatLongDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const minutesToTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const displayTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};
