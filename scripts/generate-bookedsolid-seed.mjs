import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "data/bookedsolid/seed.json");
const now = new Date();
const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const asOfDate = process.argv[2] ?? localToday;
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || Number.isNaN(Date.parse(`${asOfDate}T12:00:00Z`))) {
  throw new Error("Usage: node scripts/generate-bookedsolid-seed.mjs [YYYY-MM-DD]");
}

let state = 0xb00ced;
const random = () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 0x100000000;
};
const pick = (items) => items[Math.floor(random() * items.length)];
const dateString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (date) => new Date(`${date}T12:00:00`);
const addDays = (date, count) => {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
};
const asOf = parseDate(asOfDate);
const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hours = (start, end) => ({
  Sunday: null,
  Monday: { start, end },
  Tuesday: { start, end },
  Wednesday: { start, end },
  Thursday: { start, end },
  Friday: { start, end },
  Saturday: { start: "09:00", end: "16:00" },
});
const staff = [
  {
    id: "staff-marcus",
    name: "Marcus Reed",
    role: "Master barber",
    specialty: "Fades, classic cuts & beard work",
    initials: "MR",
    photoPlaceholder: "warm editorial portrait",
    color: "#b08c5a",
    workingHours: hours("09:00", "18:00"),
  },
  {
    id: "staff-nia",
    name: "Nia Carter",
    role: "Barber & stylist",
    specialty: "Natural texture, locs & shape-ups",
    initials: "NC",
    photoPlaceholder: "warm editorial portrait",
    color: "#9b746f",
    workingHours: hours("10:00", "19:00"),
  },
  {
    id: "staff-jade",
    name: "Jade Williams",
    role: "Lash & nail artist",
    specialty: "Lash sets, fills & brow design",
    initials: "JW",
    photoPlaceholder: "warm editorial portrait",
    color: "#a48192",
    workingHours: {
      Sunday: null,
      Monday: null,
      Tuesday: { start: "10:00", end: "18:00" },
      Wednesday: { start: "10:00", end: "18:00" },
      Thursday: { start: "10:00", end: "18:00" },
      Friday: { start: "10:00", end: "19:00" },
      Saturday: { start: "09:00", end: "16:00" },
    },
  },
];

const services = [
  { id: "haircut", name: "Haircut", category: "Barbering", durationMinutes: 45, price: 45, deposit: 15, staffIds: ["staff-marcus", "staff-nia"], description: "A tailored cut, finished with a clean detail." },
  { id: "skin-fade", name: "Skin Fade", category: "Barbering", durationMinutes: 45, price: 50, deposit: 15, staffIds: ["staff-marcus", "staff-nia"], description: "A precise fade, blended to perfection." },
  { id: "beard-trim", name: "Beard Trim", category: "Barbering", durationMinutes: 20, price: 25, deposit: 10, staffIds: ["staff-marcus", "staff-nia"], description: "Shape, line-up and condition your beard." },
  { id: "hair-beard", name: "Hair + Beard", category: "Barbering", durationMinutes: 60, price: 70, deposit: 20, staffIds: ["staff-marcus", "staff-nia"], description: "The complete reset: cut and beard detail." },
  { id: "kids-cut", name: "Kids Cut", category: "Barbering", durationMinutes: 30, price: 35, deposit: 10, staffIds: ["staff-marcus", "staff-nia"], description: "A fresh, comfortable cut for the next generation." },
  { id: "lash-set", name: "Lash Set", category: "Beauty", durationMinutes: 90, price: 120, deposit: 25, staffIds: ["staff-jade"], description: "A customized set designed for your eye shape." },
  { id: "lash-fill", name: "Lash Fill", category: "Beauty", durationMinutes: 60, price: 75, deposit: 20, staffIds: ["staff-jade"], description: "Refresh and fill your existing lash set." },
  { id: "brow-shaping", name: "Brow Shaping", category: "Beauty", durationMinutes: 15, price: 20, deposit: 10, staffIds: ["staff-jade"], description: "A clean, considered shape to frame your features." },
];

const firstNames = ["Amari", "Aaliyah", "Andre", "Brianna", "Caleb", "Camille", "Cameron", "Chloe", "Darius", "Deja", "Dominic", "Elijah", "Imani", "Isaiah", "Jalen", "Jasmine", "Jocelyn", "Jordan", "Khalil", "Layla", "Malik", "Maya", "Micah", "Naomi", "Nia", "Noah", "Olivia", "Quincy", "Sanaa", "Sofia", "Tiana", "Xavier"];
const lastNames = ["Adams", "Allen", "Anderson", "Baker", "Bennett", "Brooks", "Carter", "Davis", "Edwards", "Foster", "Franklin", "Garcia", "Harris", "Jackson", "Johnson", "Jones", "Lewis", "Martin", "Miller", "Moore", "Parker", "Reed", "Robinson", "Scott", "Smith", "Taylor", "Thomas", "Walker", "Washington", "Williams"];
const clients = Array.from({ length: 40 }, (_, index) => ({
  id: `client-${String(index + 1).padStart(3, "0")}`,
  name: `${firstNames[(index * 7 + Math.floor(random() * firstNames.length)) % firstNames.length]} ${lastNames[(index * 11 + Math.floor(random() * lastNames.length)) % lastNames.length]}`,
  phone: `(${312 + (index % 7)}) ${String(201 + index * 13).slice(-3)}-${String(1000 + index * 37).slice(-4)}`,
  email: `client${String(index + 1).padStart(2, "0")}@example.com`,
  notes: index % 9 === 0 ? "Prefers a quiet appointment." : "",
  preferredStaffId: staff[index % staff.length].id,
}));

const appointments = [];
const occupied = new Map();
let sequence = 1;
const getAvailableTime = (staffMember, date, service, avoid = null) => {
  const dayHours = staffMember.workingHours[dayLabels[parseDate(date).getDay()]];
  if (!dayHours) return null;
  const start = Number(dayHours.start.slice(0, 2)) * 60 + Number(dayHours.start.slice(3));
  const end = Number(dayHours.end.slice(0, 2)) * 60 + Number(dayHours.end.slice(3));
  const used = occupied.get(`${date}:${staffMember.id}`) ?? [];
  const candidates = [];
  for (let minute = start; minute + service.durationMinutes <= end; minute += 15) {
    if (used.every((slot) => minute + service.durationMinutes <= slot.start || minute >= slot.end)) candidates.push(minute);
  }
  if (avoid) return candidates.find((minute) => `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}` !== avoid) ?? null;
  return candidates.length ? pick(candidates) : null;
};
const addAppointment = ({ clientIndex, service, date, status, staffId, depositPaid, reminderConfirmed, source = "online" }) => {
  const chosenStaff = staff.find((member) => member.id === staffId);
  const minute = getAvailableTime(chosenStaff, date, service);
  if (minute === null) return false;
  const used = occupied.get(`${date}:${staffId}`) ?? [];
  used.push({ start: minute, end: minute + service.durationMinutes });
  occupied.set(`${date}:${staffId}`, used);
  appointments.push({
    id: `appointment-${String(sequence++).padStart(4, "0")}`,
    clientId: clients[clientIndex].id,
    serviceId: service.id,
    staffId,
    date,
    time: `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`,
    status,
    depositPaid,
    reminderConfirmed,
    source,
  });
  return true;
};

for (let offset = -21; offset < 0; offset += 1) {
  const date = dateString(addDays(asOf, offset));
  const weekday = parseDate(date).getDay();
  if (weekday === 0) continue;
  const count = weekday === 6 ? 8 : 5 + Math.floor(random() * 5);
  for (let index = 0; index < count; index += 1) {
    const service = pick(services);
    addAppointment({
      clientIndex: Math.floor(random() * clients.length),
      service,
      date,
      status: random() < 0.075 ? "no-show" : "completed",
      staffId: pick(service.staffIds),
      depositPaid: random() < 0.8,
      reminderConfirmed: random() < 0.42,
      source: random() < 0.78 ? "online" : "phone",
    });
  }
}

const repeatNoShowClients = [
  { clientIndex: 2, service: services[1], staffId: "staff-marcus" },
  { clientIndex: 11, service: services[2], staffId: "staff-nia" },
  { clientIndex: 25, service: services[5], staffId: "staff-jade" },
];
for (const repeatClient of repeatNoShowClients) {
  let recorded = 0;
  for (let offset = 1; offset <= 21 && recorded < 2; offset += 1) {
    const date = dateString(addDays(asOf, -offset));
    if (parseDate(date).getDay() === 0) continue;
    if (addAppointment({
      clientIndex: repeatClient.clientIndex,
      service: repeatClient.service,
      date,
      status: "no-show",
      staffId: repeatClient.staffId,
      depositPaid: false,
      reminderConfirmed: false,
    })) recorded += 1;
  }
  if (recorded !== 2) throw new Error(`Could not seed two no-shows for client ${clients[repeatClient.clientIndex].id}.`);
}

for (let offset = 0; offset <= 7; offset += 1) {
  const date = dateString(addDays(asOf, offset));
  if (parseDate(date).getDay() === 0) continue;
  const count = parseDate(date).getDay() === 6 ? 7 : 3 + Math.floor(random() * 3);
  for (let index = 0; index < count; index += 1) {
    const service = pick(services);
    addAppointment({
      clientIndex: Math.floor(random() * clients.length),
      service,
      date,
      status: random() < 0.48 ? "confirmed" : "booked",
      staffId: pick(service.staffIds),
      depositPaid: true,
      reminderConfirmed: random() < 0.48,
      source: random() < 0.82 ? "online" : "phone",
    });
  }
}

const saturday = Array.from({ length: 8 }, (_, offset) => dateString(addDays(asOf, offset)))
  .find((date) => parseDate(date).getDay() === 6);
if (saturday) {
  for (let index = 0; index < 4; index += 1) {
    const service = services[index === 0 ? 1 : index === 1 ? 0 : index === 2 ? 5 : 3];
    addAppointment({
      clientIndex: 30 + index,
      service,
      date: saturday,
      status: index % 2 === 0 ? "confirmed" : "booked",
      staffId: service.staffIds[0],
      depositPaid: true,
      reminderConfirmed: index % 2 === 0,
      source: "phone",
    });
  }
}

const waitlist = [
  { id: "waitlist-001", clientId: "client-031", serviceId: "skin-fade", preferredStaffId: "staff-marcus" },
  { id: "waitlist-002", clientId: "client-032", serviceId: "haircut", preferredStaffId: "staff-nia" },
  { id: "waitlist-003", clientId: "client-033", serviceId: "lash-set", preferredStaffId: "staff-jade" },
  { id: "waitlist-004", clientId: "client-034", serviceId: "hair-beard", preferredStaffId: null },
];

const seed = {
  business: {
    name: "Fade & Glow Studio",
    location: "1842 W Division St, Chicago, IL 60622",
    tagline: "Good cuts. Great energy. Your time, respected.",
    phone: "(312) 555-0184",
    instagram: "@fadeandglowchi",
    asOfDate,
    cancellationPolicy: "Please give us at least 24 hours’ notice if you need to cancel or reschedule. Your deposit transfers to a new appointment when you reschedule within that window.",
    noShowPolicy: "Missed appointments without notice forfeit the deposit. After two no-shows, future appointments must be prepaid in full to protect your service time and our team’s schedule.",
  },
  staff,
  services,
  clients,
  appointments,
  waitlist,
};
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(seed, null, 2)}\n`);
const pastCount = appointments.filter((item) => item.date < asOfDate).length;
const futureCount = appointments.filter((item) => item.date >= asOfDate).length;
console.log(`Generated ${clients.length} clients, ${pastCount} recent appointments, and ${futureCount} upcoming appointments through ${asOfDate}.`);
