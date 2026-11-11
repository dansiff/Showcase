import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "data/programtrack/seed.json");
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const asOfDate = process.argv[2] ?? localToday;
if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || Number.isNaN(Date.parse(`${asOfDate}T12:00:00Z`))) {
  throw new Error("Usage: node scripts/generate-programtrack-seed.mjs [YYYY-MM-DD]");
}

let state = 0x21c1c;
const random = () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 0x100000000;
};
const pick = (items) => items[Math.floor(random() * items.length)];
const dateString = (date) => date.toISOString().slice(0, 10);
const parseDate = (value) => new Date(`${value}T12:00:00Z`);
const addDays = (date, count) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + count);
  return next;
};
const asOf = parseDate(asOfDate);
const firstMonth = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth() - 4, 1));
const attendanceStartDate = dateString(firstMonth);
const sites = [
  { id: "lincoln", name: "Lincoln Elementary" },
  { id: "washington", name: "Washington Middle School" },
  { id: "garfield", name: "Garfield Community Center" },
];
const activityNames = ["Homework Help", "STEM Lab", "Robotics", "Basketball", "Art Studio", "Dance"];
const staff = sites.flatMap((site, siteIndex) => [
  { id: `staff-${site.id}-coordinator`, name: ["Morgan Ellis", "Taylor Brooks", "Riley Bennett"][siteIndex], role: "Site Coordinator", siteId: site.id },
  { id: `staff-${site.id}-tutor`, name: ["Casey Reed", "Jamie Foster", "Avery Price"][siteIndex], role: "Tutor", siteId: site.id },
  { id: `staff-${site.id}-enrichment-a`, name: ["Jordan Kim", "Drew Patel", "Quinn Flores"][siteIndex], role: "Enrichment Instructor", siteId: site.id },
  { id: `staff-${site.id}-enrichment-b`, name: ["Skyler Ortiz", "Cameron Wells", "Parker Nguyen"][siteIndex], role: "Enrichment Instructor", siteId: site.id },
]);
const activities = sites.flatMap((site, siteIndex) =>
  activityNames.map((name, activityIndex) => ({
    id: `${site.id}-${name.toLowerCase().replaceAll(" ", "-")}`,
    name,
    siteId: site.id,
    staffId:
      activityIndex === 0
        ? `staff-${site.id}-tutor`
        : `staff-${site.id}-enrichment-${activityIndex % 2 === 0 ? "a" : "b"}`,
    daysPerWeek: [5, 3, 2, 3, 2, 2][activityIndex],
    hoursPerSession: activityIndex === 0 ? 1 : 1.5,
  })),
);

const firstNames = ["Amaya", "Andre", "Ariana", "Caleb", "Camila", "Carter", "Darius", "Elena", "Ethan", "Gabriela", "Isaiah", "Jada", "Jalen", "Jasmine", "Jayden", "Layla", "Liam", "Lucia", "Mateo", "Maya", "Micah", "Naomi", "Noah", "Olivia", "Sofia", "Zion"];
const lastNames = ["Adams", "Baker", "Brooks", "Carter", "Coleman", "Davis", "Edwards", "Flores", "Garcia", "Green", "Harris", "Jackson", "Johnson", "Kim", "Lewis", "Martin", "Miller", "Nguyen", "Ortiz", "Patel", "Perez", "Robinson", "Smith", "Taylor", "Thomas", "Williams", "Wilson", "Young"];
const grades = ["K", "1", "2", "3", "4", "5", "6", "7", "8"];
const races = ["Black or African American", "Hispanic or Latino", "White", "Asian", "Two or more races", "American Indian or Alaska Native"];
const students = Array.from({ length: 140 }, (_, index) => {
  const siteIndex = index < 47 ? 0 : index < 94 ? 1 : 2;
  const site = sites[siteIndex];
  const siteActivities = activities.filter((activity) => activity.siteId === site.id);
  const activityIds = siteActivities
    .filter((_, activityIndex) => activityIndex === 0 || random() < 0.35)
    .map((activity) => activity.id);
  if (!activityIds.some((id) => id.includes("homework-help"))) {
    activityIds.push(siteActivities[0].id);
  }
  const enrollmentDate = random() < 0.72
    ? dateString(addDays(firstMonth, -Math.floor(10 + random() * 110)))
    : dateString(addDays(firstMonth, Math.floor(random() * Math.max(1, (asOf - firstMonth) / 86400000))));
  return {
    id: `student-${String(index + 1).padStart(3, "0")}`,
    name: `${firstNames[(index * 7 + Math.floor(random() * firstNames.length)) % firstNames.length]} ${lastNames[(index * 11 + Math.floor(random() * lastNames.length)) % lastNames.length]}`,
    grade: grades[Math.floor(random() * grades.length)],
    siteId: site.id,
    gender: random() < 0.49 ? "Female" : "Male",
    raceEthnicity: pick(races),
    lunchStatus: random() < 0.81 ? "Free or reduced-price" : "Not eligible",
    englishLearner: random() < 0.22,
    iep: random() < 0.16,
    enrollmentDate,
    activityIds: [...new Set(activityIds)],
  };
});

const attendance = [];
for (const student of students) {
  const chronic = random() < 0.13;
  const baseline = chronic ? 0.47 + random() * 0.18 : 0.82 + random() * 0.14;
  const start = student.enrollmentDate > attendanceStartDate ? student.enrollmentDate : attendanceStartDate;
  for (let date = parseDate(start); date <= asOf; date = addDays(date, 1)) {
    if (date.getUTCDay() === 0 || date.getUTCDay() === 6) continue;
    const dateKey = dateString(date);
    const weekdayAdjustment = date.getUTCDay() === 1 ? -0.035 : date.getUTCDay() === 5 ? -0.025 : 0;
    const monthAdjustment = date.getUTCMonth() === 6 || date.getUTCMonth() === 7 ? -0.02 : 0;
    const present = random() < Math.max(0.2, Math.min(0.99, baseline + weekdayAdjustment + monthAdjustment + (random() - 0.5) * 0.09));
    const activityId = present ? pick(student.activityIds) : null;
    attendance.push({ studentId: student.id, date: dateKey, present, activityId });
  }
}

const budget = [
  { category: "Personnel", budgeted: 78000 },
  { category: "Fringe Benefits", budgeted: 19500 },
  { category: "Supplies", budgeted: 22000 },
  { category: "Contractual Services", budgeted: 30000 },
  { category: "Travel", budgeted: 8000 },
  { category: "Other", budgeted: 27500 },
];
const vendors = ["Northside Learning Supply", "Community Transit Co.", "BrightPath Staffing", "Metro Arts Collective", "Campus Technology Group", "Neighborhood Sports & Rec"];
const descriptions = [
  "After-school program materials",
  "Instructional support and enrichment",
  "Student transportation",
  "Learning resources and classroom supplies",
  "Staff professional development",
  "Program equipment and activities",
];
const expenditures = [];
const firstBudgetMonth = new Date(Date.UTC(asOf.getUTCFullYear() - (asOf.getUTCMonth() < 6 ? 1 : 0), 6, 1));
for (const category of budget) {
  const monthlyCount = (asOf.getUTCFullYear() - firstBudgetMonth.getUTCFullYear()) * 12 + asOf.getUTCMonth() - firstBudgetMonth.getUTCMonth() + 1;
  const monthlyBase = category.budgeted * (0.73 / monthlyCount);
  let spent = 0;
  for (let monthIndex = 0; monthIndex < monthlyCount; monthIndex += 1) {
    const month = new Date(Date.UTC(firstBudgetMonth.getUTCFullYear(), firstBudgetMonth.getUTCMonth() + monthIndex, 1));
    if (month > asOf) break;
    const multiplier = monthIndex === monthlyCount - 1 ? 0.56 : 0.92 + random() * 0.2;
    const remaining = category.budgeted - spent;
    const amount = Math.min(remaining, Math.round((monthlyBase * multiplier) / 25) * 25);
    if (amount <= 0) continue;
    spent += amount;
    const day = Math.min(26, 4 + Math.floor(random() * 20), monthIndex === monthlyCount - 1 ? asOf.getUTCDate() : 26);
    expenditures.push({
      id: `expense-${String(expenditures.length + 1).padStart(3, "0")}`,
      date: dateString(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day))),
      category: category.category,
      vendor: pick(vendors),
      amount,
      description: pick(descriptions),
    });
  }
}

const seed = {
  organization: "Bright Futures Community Alliance",
  asOfDate,
  attendanceStartDate,
  budgetStartDate: dateString(firstBudgetMonth),
  sites,
  staff,
  activities,
  students,
  attendance,
  budget,
  expenditures,
};
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Generated ${students.length} students and ${attendance.length} attendance records through ${asOfDate}.`);
