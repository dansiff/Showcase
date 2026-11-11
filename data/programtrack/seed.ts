import seed from "./seed.json";

export type Site = { id: string; name: string };
export type Staff = {
  id: string;
  name: string;
  role: "Site Coordinator" | "Tutor" | "Enrichment Instructor";
  siteId: string;
};
export type Activity = {
  id: string;
  name: string;
  siteId: string;
  staffId: string;
  daysPerWeek: number;
  hoursPerSession: number;
};
export type Student = {
  id: string;
  name: string;
  grade: string;
  siteId: string;
  gender: string;
  raceEthnicity: string;
  lunchStatus: string;
  englishLearner: boolean;
  iep: boolean;
  enrollmentDate: string;
  activityIds: string[];
};
export type AttendanceRecord = {
  studentId: string;
  date: string;
  present: boolean;
  activityId: string | null;
};
export type Expenditure = {
  id: string;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  description: string;
};
export type ProgramTrackSeed = {
  organization: string;
  asOfDate: string;
  attendanceStartDate: string;
  budgetStartDate: string;
  sites: Site[];
  staff: Staff[];
  activities: Activity[];
  students: Student[];
  attendance: AttendanceRecord[];
  budget: { category: string; budgeted: number }[];
  expenditures: Expenditure[];
};

export const seedData = seed as ProgramTrackSeed;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });

export const attendancePercent = (present: number, possible: number) =>
  possible ? Math.round((present / possible) * 100) : 0;

export function getPeriodRange(
  period: "month" | "year" | "all",
  asOfDate: string,
  startDate: string,
) {
  if (period === "all") return { start: startDate, end: asOfDate };
  const date = new Date(`${asOfDate}T12:00:00`);
  if (period === "month") {
    return {
      start: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`,
      end: asOfDate,
    };
  }
  const fiscalYear = date.getMonth() < 6 ? date.getFullYear() - 1 : date.getFullYear();
  return {
    start: `${fiscalYear}-07-01`,
    end: asOfDate,
  };
}

export function isWeekday(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day !== 0 && day !== 6;
}

export function getSchoolDays(start: string, end: string) {
  const days: string[] = [];
  const date = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  while (date <= last) {
    const weekday = date.getDay();
    if (weekday !== 0 && weekday !== 6) {
      days.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      );
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}
