import seed from "./seed.json";

export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type WorkingHours = Record<DayName, { start: string; end: string } | null>;

export type Service = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  deposit: number;
  staffIds: string[];
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  initials: string;
  photoPlaceholder: string;
  workingHours: WorkingHours;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
};

export type AppointmentStatus =
  | "completed"
  | "no-show"
  | "booked"
  | "confirmed"
  | "cancelled";

export type Appointment = {
  id: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  depositPaid: boolean;
  reminderConfirmed: boolean;
};

export type WaitlistEntry = {
  id: string;
  clientId: string;
  serviceId: string;
  preferredStaffId: string | null;
  requestedDay: DayName;
};

export type FusionBookBusiness = {
  id: string;
  slug: string;
  asOfDate: string;
  profile: {
    name: string;
    trade: string;
    location: string;
    tagline: string;
    phone: string;
    cancellationPolicy: string;
    noShowPolicy: string;
  };
  branding: {
    primary: string;
    accent: string;
    accentSoft: string;
    surface: string;
    ink: string;
    logoMark: string;
  };
  depositRules: {
    required: boolean;
    applyToService: boolean;
    repeatNoShowPrepayThreshold: number;
  };
  services: Service[];
  staff: Staff[];
  clients: Client[];
  appointments: Appointment[];
  waitlist: WaitlistEntry[];
};

export const seedData = seed as { businesses: FusionBookBusiness[] };
export const businesses = seedData.businesses;
export const getBusiness = (slug: string) =>
  businesses.find((business) => business.slug === slug);

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const parseDate = (date: string) => new Date(`${date}T12:00:00`);

export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" },
) => parseDate(date).toLocaleDateString("en-US", options);

export const displayTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const weekdayName = (date: string) =>
  parseDate(date).toLocaleDateString("en-US", { weekday: "long" }) as DayName;

export const addDays = (date: string, days: number) => {
  const next = parseDate(date);
  next.setDate(next.getDate() + days);
  return dateKey(next);
};

export const mondayOfWeek = (date: string) => {
  const monday = parseDate(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return dateKey(monday);
};

