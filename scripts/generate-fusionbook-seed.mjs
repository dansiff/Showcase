import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = resolve(root, "data/fusionbook/seed.json");
const seed = JSON.parse(await readFile(seedPath, "utf8"));
const names = [
  "Aaliyah Brooks", "Amari Johnson", "Andre Williams", "Ariana Davis", "Benjamin Carter",
  "Brianna Jackson", "Caleb Thompson", "Camille Lewis", "Carlos Walker", "Chloe Robinson",
  "Darius Hall", "Destiny Allen", "Elijah Young", "Gabrielle King", "Isaiah Wright",
  "Jasmine Scott", "Jayden Green", "Jocelyn Baker", "Jordan Adams", "Kennedy Nelson",
  "Layla Mitchell", "London Perez", "Malik Roberts", "Maya Turner", "Micah Phillips",
  "Nia Campbell", "Noah Parker", "Quincy Evans", "Sofia Edwards", "Taylor Collins",
];
const areaCodes = ["312", "773", "708", "630", "847"];
const statuses = ["completed", "completed", "completed", "completed", "no-show"];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const padded = (number) => String(number).padStart(2, "0");

function dateAt(date, offset) {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + offset);
  return `${value.getFullYear()}-${padded(value.getMonth() + 1)}-${padded(value.getDate())}`;
}

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function toTime(value) {
  return `${padded(Math.floor(value / 60))}:${padded(value % 60)}`;
}

function createClients() {
  return names.map((name, index) => ({
    id: `client-${padded(index + 1)}`,
    name,
    phone: `(${areaCodes[index % areaCodes.length]}) 555-${String(1200 + index * 17).padStart(4, "0")}`,
  }));
}

function createAppointments(business, clients) {
  const appointments = [];
  const occupied = new Map();
  const services = business.services;
  const staffById = new Map(business.staff.map((staff) => [staff.id, staff]));
  const slots = [540, 660, 780, 900, 990];
  let serial = 1;

  function schedule({ date, clientId, service, status, preferredStaffId, fixedTime, reminderConfirmed = false }) {
    const weekday = weekdayNames[new Date(`${date}T12:00:00`).getDay()];
    const eligible = preferredStaffId
      ? [staffById.get(preferredStaffId)].filter(Boolean)
      : service.staffIds.map((staffId) => staffById.get(staffId)).filter(Boolean);

    for (const staff of eligible) {
      const shift = staff.workingHours[weekday];
      if (!shift) continue;
      const times = fixedTime ? [minutes(fixedTime)] : slots;
      for (const start of times) {
        if (start < minutes(shift.start) || start + service.durationMinutes > minutes(shift.end)) continue;
        const key = `${date}:${staff.id}`;
        const booked = occupied.get(key) ?? [];
        const overlaps = booked.some((entry) =>
          start < entry.end && start + service.durationMinutes > entry.start);
        if (overlaps) continue;
        occupied.set(key, [...booked, { start, end: start + service.durationMinutes }]);
        const depositPaid = status === "completed" || status === "booked" || status === "confirmed"
          ? true
          : serial % 2 === 0;
        appointments.push({
          id: `appointment-${String(serial++).padStart(3, "0")}`,
          clientId,
          serviceId: service.id,
          staffId: staff.id,
          date,
          time: toTime(start),
          status,
          depositPaid,
          reminderConfirmed,
        });
        return true;
      }
    }
    return false;
  }

  const pastDates = Array.from({ length: 21 }, (_, index) => dateAt(business.asOfDate, index - 21))
    .filter((date) => business.staff.some((staff) => staff.workingHours[weekdayNames[new Date(`${date}T12:00:00`).getDay()]]));
  const repeatNoShowClients = [3, 12, 24];
  const oneTimeNoShowClients = [7, 18];

  clients.forEach((client, index) => {
    const service = services[index % services.length];
    const date = pastDates[Math.floor((index * pastDates.length) / clients.length)];
    const isNoShow = repeatNoShowClients.includes(index) || oneTimeNoShowClients.includes(index);
    schedule({
      date,
      clientId: client.id,
      service,
      status: isNoShow ? "no-show" : "completed",
      reminderConfirmed: false,
    });
  });

  repeatNoShowClients.forEach((index, duplicateIndex) => {
    const client = clients[index];
    const service = services[(index + 1) % services.length];
    schedule({
      date: pastDates[duplicateIndex + 1],
      clientId: client.id,
      service,
      status: "no-show",
      reminderConfirmed: false,
    });
  });

  const futureDates = Array.from({ length: 8 }, (_, index) => dateAt(business.asOfDate, index))
    .filter((date) => business.staff.some((staff) => staff.workingHours[weekdayNames[new Date(`${date}T12:00:00`).getDay()]]));
  const nextSaturday = futureDates.find((date) =>
    date > business.asOfDate && weekdayNames[new Date(`${date}T12:00:00`).getDay()] === "Saturday");
  const waitlistService = services.find((service) => service.staffIds.length > 0) ?? services[0];
  const waitlistStaffId = waitlistService.staffIds[0];

  if (nextSaturday) {
    schedule({
      date: nextSaturday,
      clientId: clients[0].id,
      service: waitlistService,
      status: "booked",
      preferredStaffId: waitlistStaffId,
      fixedTime: "11:00",
    });
  }

  futureDates.forEach((date, dayIndex) => {
    [0, 1].forEach((slotIndex) => {
      const service = services[(dayIndex * 2 + slotIndex + 1) % services.length];
      const client = clients[(dayIndex * 2 + slotIndex + 15) % clients.length];
      const isSaturdayMatch = date === nextSaturday && service.id === waitlistService.id;
      if (isSaturdayMatch) return;
      schedule({
        date,
        clientId: client.id,
        service,
        status: (dayIndex + slotIndex) % 2 === 0 ? "confirmed" : "booked",
        reminderConfirmed: (dayIndex + slotIndex) % 2 === 0,
      });
    });
  });

  return appointments.sort((left, right) =>
    left.date.localeCompare(right.date) || left.time.localeCompare(right.time));
}

for (const business of seed.businesses) {
  const clients = createClients();
  const appointments = createAppointments(business, clients);
  const waitlistService = business.services.find((service) => service.staffIds.length > 0);
  const preferredStaffId = waitlistService?.staffIds[0] ?? null;
  business.clients = clients;
  business.appointments = appointments;
  business.waitlist = clients.slice(26, 30).map((client, index) => ({
    id: `waitlist-${index + 1}`,
    clientId: client.id,
    serviceId: business.services[index % business.services.length].id,
    preferredStaffId: index === 0 ? preferredStaffId : null,
    requestedDay: "Saturday",
  }));
}

await writeFile(seedPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Generated ${seed.businesses.length} FusionBook businesses.`);
