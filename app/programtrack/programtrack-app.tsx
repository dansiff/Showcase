"use client";

import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileBarChart,
  FileText,
  Filter,
  LayoutDashboard,
  MapPin,
  Menu,
  Plus,
  Printer,
  Search,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import JSZip from "jszip";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  attendancePercent,
  formatCurrency,
  formatDate,
  getPeriodRange,
  isWeekday,
  seedData,
  type AttendanceRecord,
  type Expenditure,
  type Student,
} from "@/data/programtrack/seed";
import "./programtrack.css";

type Screen = "dashboard" | "attendance" | "students" | "activities" | "budget" | "reports";
type ReportType = "monthly" | "attendance" | "regular" | "annual";
type ReportPeriod = "month" | "year" | "all";

const navigation: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "attendance", label: "Attendance", icon: CalendarDays },
  { id: "students", label: "Students", icon: Users },
  { id: "activities", label: "Activities", icon: Sparkles },
  { id: "budget", label: "Budget", icon: WalletCards },
  { id: "reports", label: "Reports", icon: FileBarChart },
];

const reportCards: { id: ReportType; title: string; description: string }[] = [
  { id: "monthly", title: "Monthly Expenditure Report", description: "Grant spending by approved budget category." },
  { id: "attendance", title: "Attendance & Participation Summary", description: "Enrollment, program days, attendance, and regular attendees by site." },
  { id: "regular", title: "Regular Attendee Report", description: "Student-level attendance and demographic detail." },
  { id: "annual", title: "Annual Evaluation Data Summary", description: "Key outcomes, attendance bands, demographics, and participation." },
];

const tableHead = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500";
const tableCell = "px-4 py-3.5 text-sm text-slate-700";
const gradesOrder = (grade: string) => grade === "K" ? 0 : Number(grade);

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`pt-panel ${className}`}>{children}</section>;
}

function PanelTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>}
        <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="pt-select-wrap">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="pt-select">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function Badge({ children, green = false }: { children: ReactNode; green?: boolean }) {
  return <span className={`pt-badge ${green ? "pt-badge-green" : ""}`}>{children}</span>;
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Users;
  highlight?: boolean;
}) {
  return (
    <div className={`pt-metric ${highlight ? "pt-metric-highlight" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium ${highlight ? "text-emerald-100/80" : "text-slate-500"}`}>{label}</p>
          <p className="mt-3 text-[29px] font-semibold leading-none tracking-[-0.045em]">{value}</p>
        </div>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${highlight ? "bg-white/15" : "bg-slate-50 text-slate-500"}`}>
          <Icon className="h-[17px] w-[17px]" />
        </div>
      </div>
      <p className={`mt-3 text-[11px] ${highlight ? "text-emerald-100/75" : "text-slate-400"}`}>{note}</p>
    </div>
  );
}

function AttendanceChart({ rows }: { rows: { label: string; percent: number }[] }) {
  const width = 660;
  const height = 190;
  const left = 34;
  const right = 12;
  const top = 14;
  const bottom = 28;
  const points = rows.map((row, index) => ({
    x: left + (index * (width - left - right)) / Math.max(1, rows.length - 1),
    y: top + ((100 - row.percent) / 35) * (height - top - bottom),
    ...row,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x},${Math.min(height - bottom, Math.max(top, point.y))}`).join(" ");
  const area = `${path} L${points.at(-1)?.x ?? width - right},${height - bottom} L${points[0]?.x ?? left},${height - bottom} Z`;
  return (
    <div className="pt-chart">
      <div className="mb-3 flex items-center justify-between">
        <div><p className="text-sm font-semibold text-slate-900">Average daily attendance</p><p className="mt-1 text-xs text-slate-400">Weekly attendance rate · last 12 weeks</p></div>
        <Badge green>Attendance</Badge>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[190px] w-full" role="img" aria-label="Average daily attendance for the last 12 weeks">
        <defs><linearGradient id="attendance-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10a37f" stopOpacity=".19" /><stop offset="100%" stopColor="#10a37f" stopOpacity="0" /></linearGradient></defs>
        {[60, 75, 90].map((tick) => {
          const y = top + ((100 - tick) / 35) * (height - top - bottom);
          return <g key={tick}><line x1={left} x2={width - right} y1={y} y2={y} stroke="#edf0f3" strokeDasharray="3 5" /><text x="0" y={y + 4} fill="#98a2b3" fontSize="10">{tick}%</text></g>;
        })}
        <path d={area} fill="url(#attendance-area)" />
        <path d={path} fill="none" stroke="#0f9f79" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => <g key={`${point.label}-${index}`}><circle cx={point.x} cy={Math.min(height - bottom, Math.max(top, point.y))} r="3.3" fill="white" stroke="#0f9f79" strokeWidth="2" /><text x={point.x} y={height - 5} fill="#98a2b3" fontSize="9" textAnchor="middle">{point.label}</text></g>)}
      </svg>
    </div>
  );
}

function escapeCsv(value: string | number) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvContent(rows: (string | number)[][]) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const url = URL.createObjectURL(new Blob([csvContent(rows)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function percentBar(percent: number) {
  return Math.min(100, Math.max(0, percent));
}

export default function ProgramTrackApp() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [siteFilter, setSiteFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(seedData.asOfDate);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [regularFilter, setRegularFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<ReportType | null>(null);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("year");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(seedData.attendance);
  const [expenditures, setExpenditures] = useState<Expenditure[]>(seedData.expenditures);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [expenseNotice, setExpenseNotice] = useState("");
  const [exportNotice, setExportNotice] = useState("");

  const attendanceByStudent = useMemo(() => {
    const map = new Map<string, { attended: number; possible: number }>();
    for (const record of attendance) {
      const current = map.get(record.studentId) ?? { attended: 0, possible: 0 };
      current.possible += 1;
      if (record.present) current.attended += 1;
      map.set(record.studentId, current);
    }
    return map;
  }, [attendance]);

  const budgetRows = useMemo(() => seedData.budget.map((item) => {
    const spent = expenditures.filter((entry) => entry.category === item.category).reduce((sum, entry) => sum + entry.amount, 0);
    return { ...item, spent, remaining: item.budgeted - spent, percent: item.budgeted ? Math.round((spent / item.budgeted) * 100) : 0 };
  }), [expenditures]);
  const totalBudget = budgetRows.reduce((sum, row) => sum + row.budgeted, 0);
  const totalSpent = budgetRows.reduce((sum, row) => sum + row.spent, 0);
  const regularCount = seedData.students.filter((student) => (attendanceByStudent.get(student.id)?.attended ?? 0) >= 30).length;
  const activeSiteId = siteFilter === "all" ? seedData.sites[0].id : siteFilter;
  const selectedSite = seedData.sites.find((site) => site.id === activeSiteId) ?? seedData.sites[0];
  const selectedDayRecords = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.forEach((record) => {
      if (record.date === selectedDate) map.set(record.studentId, record);
    });
    return map;
  }, [attendance, selectedDate]);
  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return seedData.students.filter((student) => {
      const matchesSite = siteFilter === "all" || student.siteId === siteFilter;
      const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter;
      const matchesSearch = !query || student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query);
      const isRegular = (attendanceByStudent.get(student.id)?.attended ?? 0) >= 30;
      return matchesSite && matchesGrade && matchesSearch && (regularFilter === "all" || (regularFilter === "regular" ? isRegular : !isRegular));
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [attendanceByStudent, gradeFilter, regularFilter, search, siteFilter]);
  const currentMonthRecords = attendance.filter((record) => record.date.slice(0, 7) === seedData.asOfDate.slice(0, 7));
  const currentMonthStudents = new Set(currentMonthRecords.filter((record) => record.present).map((record) => record.studentId)).size;
  const currentMonthRate = attendancePercent(
    currentMonthRecords.filter((record) => record.present).length,
    currentMonthRecords.length,
  );
  const trendRows = useMemo(() => {
    const end = new Date(`${seedData.asOfDate}T12:00:00`);
    const endDay = end.getDay();
    end.setDate(end.getDate() - (endDay === 0 ? 6 : endDay - 1));
    return Array.from({ length: 12 }, (_, index) => {
      const weekStart = new Date(end);
      weekStart.setDate(end.getDate() - (11 - index) * 7);
      const from = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const to = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, "0")}-${String(weekEnd.getDate()).padStart(2, "0")}`;
      const rows = attendance.filter((record) => record.date >= from && record.date <= to);
      return {
        label: index % 2 === 0 || index === 11 ? weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
        percent: attendancePercent(rows.filter((record) => record.present).length, rows.length),
      };
    });
  }, [attendance]);
  const periodRange = getPeriodRange(reportPeriod, seedData.asOfDate, seedData.attendanceStartDate);
  const periodAttendance = attendance.filter((record) => record.date >= periodRange.start && record.date <= periodRange.end);
  const periodExpenditures = expenditures.filter((entry) => entry.date >= periodRange.start && entry.date <= periodRange.end);
  const generatedOn = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const markAttendance = (student: Student) => {
    if (student.enrollmentDate > selectedDate || !isWeekday(selectedDate)) return;
    setAttendance((records) => {
      const exists = records.find((record) => record.studentId === student.id && record.date === selectedDate);
      if (exists) return records.map((record) => record === exists ? { ...record, present: !record.present } : record);
      return [...records, { studentId: student.id, date: selectedDate, present: true, activityId: null }].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const addExpenditure = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const category = String(form.get("category"));
    if (!Number.isFinite(amount) || amount <= 0 || !seedData.budget.some((item) => item.category === category)) {
      setExpenseNotice("Enter a valid amount and budget category.");
      return;
    }
    const date = String(form.get("date"));
    if (!date || date < seedData.budgetStartDate || date > seedData.asOfDate) {
      setExpenseNotice(`Choose a date between ${formatDate(seedData.budgetStartDate)} and ${formatDate(seedData.asOfDate)}.`);
      return;
    }
    setExpenditures((items) => [...items, {
      id: `local-expense-${Date.now()}`,
      date,
      category,
      vendor: String(form.get("vendor")).trim(),
      amount: Math.round(amount * 100) / 100,
      description: String(form.get("description")).trim(),
    }]);
    event.currentTarget.reset();
    setExpenseFormOpen(false);
    setExpenseNotice("Expenditure added to this demo session.");
  };

  const reportRows = useMemo((): { headers: (string | number)[]; rows: (string | number)[][] } => {
    if (report === "monthly") {
      const rows = budgetRows.map((row) => {
        const spent = periodExpenditures.filter((entry) => entry.category === row.category).reduce((sum, entry) => sum + entry.amount, 0);
        return [row.category, row.budgeted, spent, row.budgeted - spent, `${row.budgeted ? Math.round((spent / row.budgeted) * 100) : 0}%`];
      });
      return { headers: ["Grant budget category", "Approved budget", "Expenditures this period", "Balance", "Spent"], rows };
    }
    if (report === "attendance") {
      const rows = seedData.sites.map((site) => {
        const students = seedData.students.filter((student) => student.siteId === site.id && student.enrollmentDate <= periodRange.end);
        const studentIds = new Set(students.map((student) => student.id));
        const records = periodAttendance.filter((record) => studentIds.has(record.studentId));
        const days = new Set(records.map((record) => record.date)).size;
        const attended = records.filter((record) => record.present).length;
        const perStudent = new Map<string, number>();
        records.forEach((record) => { if (record.present) perStudent.set(record.studentId, (perStudent.get(record.studentId) ?? 0) + 1); });
        return [site.name, students.length, days, attended, [...perStudent.values()].filter((count) => count >= 30).length, `${attendancePercent(attended, records.length)}%`];
      });
      return { headers: ["Program site", "Students enrolled", "Days served", "Total attendance", "Regular attendees (30+)", "Attendance rate"], rows };
    }
    if (report === "regular") {
      const totals = new Map<string, number>();
      periodAttendance.forEach((record) => { if (record.present) totals.set(record.studentId, (totals.get(record.studentId) ?? 0) + 1); });
      const rows = seedData.students
        .filter((student) => (totals.get(student.id) ?? 0) >= 30)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((student) => [
          student.name,
          student.grade === "K" ? "Kindergarten" : `Grade ${student.grade}`,
          seedData.sites.find((site) => site.id === student.siteId)?.name ?? "",
          totals.get(student.id) ?? 0,
          student.gender,
          student.raceEthnicity,
          student.lunchStatus,
          student.englishLearner ? "Yes" : "No",
          student.iep ? "Yes" : "No",
        ]);
      return { headers: ["Student", "Grade", "Site", "Days attended", "Gender", "Race / ethnicity", "Lunch status", "English learner", "IEP"], rows };
    }
    const totals = new Map<string, number>();
    periodAttendance.forEach((record) => { if (record.present) totals.set(record.studentId, (totals.get(record.studentId) ?? 0) + 1); });
    const bands = [
      ["1–29 days", (days: number) => days >= 1 && days <= 29],
      ["30–59 days", (days: number) => days >= 30 && days <= 59],
      ["60–89 days", (days: number) => days >= 60 && days <= 89],
      ["90+ days", (days: number) => days >= 90],
    ];
    const demographics = ["Black or African American", "Hispanic or Latino", "White", "Asian", "Two or more races", "American Indian or Alaska Native"];
    const studentsServed = seedData.students.filter((student) => (totals.get(student.id) ?? 0) > 0);
    const activityHours = seedData.activities.map((activity) => [
      activity.name,
      seedData.sites.find((site) => site.id === activity.siteId)?.name ?? "",
      periodAttendance
        .filter((record) => record.present && record.activityId === activity.id)
        .reduce((hours, record) => hours + (seedData.activities.find((item) => item.id === record.activityId)?.hoursPerSession ?? 0), 0),
    ]);
    const rows: (string | number)[][] = [
      ["Students served", studentsServed.length],
      ["Total enrollment", seedData.students.length],
      ["Attendance rate", `${attendancePercent(periodAttendance.filter((record) => record.present).length, periodAttendance.length)}%`],
      ["Regular attendees (30+ days)", [...totals.values()].filter((days) => days >= 30).length],
      ["Free or reduced-price lunch", studentsServed.filter((student) => student.lunchStatus === "Free or reduced-price").length],
      ["English learners", studentsServed.filter((student) => student.englishLearner).length],
      ["Students with an IEP", studentsServed.filter((student) => student.iep).length],
      ...demographics.map((race) => [`Demographic · ${race}`, studentsServed.filter((student) => student.raceEthnicity === race).length]),
      ...[...new Set(studentsServed.map((student) => student.gender))].sort().map((gender) => [`Demographic · ${gender}`, studentsServed.filter((student) => student.gender === gender).length]),
      ...[...new Set(studentsServed.map((student) => student.grade))].sort((a, b) => gradesOrder(a) - gradesOrder(b)).map((grade) => [`Enrollment · ${grade === "K" ? "Kindergarten" : `Grade ${grade}`}`, studentsServed.filter((student) => student.grade === grade).length]),
      ...bands.map(([label, matches]) => [String(label), [...totals.values()].filter(matches as (days: number) => boolean).length]),
      ...activityHours.map(([name, site, hours]) => [`Participation hours · ${site} · ${name}`, Number(hours)]),
    ];
    return { headers: ["Evaluation measure", "Value"], rows };
  }, [attendance, budgetRows, periodAttendance, periodExpenditures, periodRange.end, report, seedData.activities, seedData.sites, seedData.students]);

  const downloadReport = () => {
    if (!report) return;
    const filename = `programtrack-${report}-${periodRange.start}-to-${periodRange.end}.csv`;
    downloadCsv(filename, [reportRows.headers, ...reportRows.rows]);
  };

  const downloadProgramData = async () => {
    const zip = new JSZip();
    const siteName = (siteId: string) => seedData.sites.find((site) => site.id === siteId)?.name ?? siteId;
    const activityName = (activityId: string | null) =>
      seedData.activities.find((activity) => activity.id === activityId)?.name ?? "";
    zip.file("students.csv", csvContent([
      ["Student ID", "Student name", "Grade", "Site", "Gender", "Race / ethnicity", "Lunch status", "English learner", "IEP", "Enrollment date", "Activities"],
      ...seedData.students.map((student) => [
        student.id,
        student.name,
        student.grade === "K" ? "Kindergarten" : `Grade ${student.grade}`,
        siteName(student.siteId),
        student.gender,
        student.raceEthnicity,
        student.lunchStatus,
        student.englishLearner ? "Yes" : "No",
        student.iep ? "Yes" : "No",
        student.enrollmentDate,
        student.activityIds.map(activityName).join("; "),
      ]),
    ]));
    zip.file("attendance.csv", csvContent([
      ["Student ID", "Student name", "Date", "Present", "Activity"],
      ...attendance.map((record) => [
        record.studentId,
        seedData.students.find((student) => student.id === record.studentId)?.name ?? "",
        record.date,
        record.present ? "Yes" : "No",
        activityName(record.activityId),
      ]),
    ]));
    zip.file("activities.csv", csvContent([
      ["Activity", "Site", "Assigned staff", "Staff role", "Days per week", "Hours per session"],
      ...seedData.activities.map((activity) => {
        const assignedStaff = seedData.staff.find((member) => member.id === activity.staffId);
        return [
          activity.name,
          siteName(activity.siteId),
          assignedStaff?.name ?? "",
          assignedStaff?.role ?? "",
          activity.daysPerWeek,
          activity.hoursPerSession,
        ];
      }),
    ]));
    zip.file("staff.csv", csvContent([
      ["Staff name", "Role", "Site"],
      ...seedData.staff.map((member) => [member.name, member.role, siteName(member.siteId)]),
    ]));
    zip.file("budget.csv", csvContent([
      ["Budget category", "Budgeted", "Spent to date", "Remaining"],
      ...budgetRows.map((row) => [row.category, row.budgeted, row.spent, row.remaining]),
    ]));
    zip.file("expenditures.csv", csvContent([
      ["Date", "Category", "Vendor", "Amount", "Description"],
      ...expenditures.map((item) => [item.date, item.category, item.vendor, item.amount, item.description]),
    ]));
    const archive = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(archive);
    const link = document.createElement("a");
    link.href = url;
    link.download = `programtrack-data-${seedData.asOfDate}.zip`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExportNotice("Data export downloaded. This demo stores no live student records.");
  };

  const toggleScreen = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setReport(null);
    setMobileNavOpen(false);
  };

  const reportTitle = reportCards.find((item) => item.id === report)?.title;
  const isPeriodMonth = reportPeriod === "month";
  const fiscalStartYear = new Date(`${seedData.budgetStartDate}T12:00:00`).getFullYear();
  const fiscalYearLabel = `${fiscalStartYear}–${String(fiscalStartYear + 1).slice(-2)}`;

  return (
    <div className="pt-root">
      <div className="pt-demo-banner"><span className="pt-demo-dot" /> DEMO <span className="mx-2 opacity-40">/</span> Sample data for illustration</div>
      <div className="pt-shell">
        <aside className={`pt-sidebar ${mobileNavOpen ? "pt-sidebar-open" : ""}`}>
          <div className="pt-brand">
            <div className="pt-brand-mark"><Activity className="h-[19px] w-[19px]" /></div>
            <div><p className="text-[15px] font-bold tracking-[-0.025em] text-white">ProgramTrack</p><p className="mt-0.5 text-[10px] tracking-wide text-slate-500">21st CCLC · DATA & REPORTING</p></div>
            <button type="button" className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-800 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={17} /></button>
          </div>
          <div className="pt-nav-label">WORKSPACE</div>
          <nav className="pt-nav" aria-label="Main navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button type="button" key={id} onClick={() => toggleScreen(id)} className={`pt-nav-item ${screen === id && !report ? "pt-nav-item-active" : ""}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{id === "reports" && <span className="pt-nav-count">{reportCards.length}</span>}
              </button>
            ))}
          </nav>
          <div className="pt-sidebar-bottom">
            <div className="pt-grant-card"><div className="flex items-center gap-2 text-[11px] font-medium text-slate-300"><CircleHelp size={14} className="text-emerald-400" /> Grant program</div><p className="mt-2 text-xs font-semibold text-white">21st CCLC · FY {fiscalYearLabel}</p><p className="mt-1 text-[10px] text-slate-500">Program year · July–June</p></div>
            <div className="flex items-center gap-3 px-2 pt-4"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#1d5949] text-[11px] font-semibold text-emerald-100">BF</div><div className="min-w-0"><p className="truncate text-[11px] font-medium text-slate-200">Bright Futures Alliance</p><p className="text-[10px] text-slate-500">Demo workspace</p></div></div>
          </div>
        </aside>

        <div className="pt-main-column">
          <header className="pt-topbar">
            <button type="button" className="mr-3 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <div className="min-w-0"><p className="truncate text-xs text-slate-400">{report ? "Reports / " : "Program overview / "}<span className="text-slate-600">{report ? reportTitle : navigation.find((item) => item.id === screen)?.label}</span></p><p className="mt-1 truncate text-sm font-semibold text-slate-800">{seedData.organization}</p></div>
            <div className="ml-auto hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Data through {formatDate(seedData.asOfDate)}</div>
            {report ? <button type="button" className="pt-button pt-button-dark ml-3" onClick={() => window.print()}><Printer size={15} /><span className="hidden sm:inline">Print report</span></button> : <button type="button" className="ml-3 grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-xs font-semibold text-slate-600" aria-label="Workspace profile">BF</button>}
          </header>

          <main className="pt-content">
            {report ? (
              <div className="pt-report-view">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
                  <button type="button" onClick={() => setReport(null)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> All reports</button>
                  <button type="button" className="pt-button pt-button-primary" onClick={downloadReport}><ArrowDownToLine size={15} /> Download CSV</button>
                </div>
                <div className="pt-report-paper">
                  <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-6">
                    <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50"><FileText size={14} /></span> ProgramTrack · 21st CCLC</div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">{reportTitle}</h1><p className="mt-2 text-sm text-slate-500">{seedData.organization}</p></div>
                    <div className="min-w-[170px] rounded-xl bg-slate-50 p-4 text-sm"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Reporting period</p><p className="mt-1 font-medium text-slate-700">{formatDate(periodRange.start)} – {formatDate(periodRange.end)}</p><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Generated</p><p className="mt-1 font-medium text-slate-700">{generatedOn}</p></div>
                  </div>
                  <p className="my-5 text-xs leading-5 text-slate-500">{report === "monthly" ? "Expenditures are shown against approved 21st Century Community Learning Centers grant budget categories." : report === "regular" ? "Regular attendees are students with 30 or more days attended during the selected reporting period." : report === "annual" ? "Evaluation measures are calculated from attendance, student, activity, and participation data in this sample program." : "Attendance and participation measures are summarized for each active program site."}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead><tr className="border-y border-slate-200 bg-slate-50">{reportRows.headers.map((header) => <th key={header} className={tableHead}>{header}</th>)}</tr></thead>
                      <tbody>{reportRows.rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-b border-slate-100 last:border-0">{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className={`${tableCell} ${cellIndex === 0 ? "font-medium text-slate-800" : ""}`}>{typeof cell === "number" && (report === "monthly" && cellIndex > 0 && cellIndex < 4) ? formatCurrency(cell) : cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                  <p className="mt-8 border-t border-slate-200 pt-4 text-[10px] text-slate-400">Sample data for illustration · {seedData.organization} · 21st Century Community Learning Centers</p>
                </div>
              </div>
            ) : screen === "dashboard" ? (
              <div>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-xs font-medium text-slate-400">{formatDate(seedData.asOfDate, { weekday: "long" })} · {formatDate(seedData.asOfDate)}</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Program overview</h1><p className="mt-1 text-sm text-slate-500">A clear view of student participation and grant progress.</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Total enrolled" value={String(seedData.students.length)} note={`${seedData.sites.length} active program sites`} icon={Users} />
                  <MetricCard label="Students served this month" value={String(currentMonthStudents)} note={`${seedData.asOfDate.slice(0, 7)} · attended at least once`} icon={Activity} />
                  <MetricCard label="Average daily attendance" value={`${currentMonthRate}%`} note="Current month · across all sites" icon={CalendarDays} />
                  <MetricCard label="Regular attendees" value={String(regularCount)} note={`${attendancePercent(regularCount, seedData.students.length)}% of enrolled · 30+ days attended`} icon={BadgeCheck} highlight />
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
                  <Panel><AttendanceChart rows={trendRows} /></Panel>
                  <Panel>
                    <PanelTitle title="Reports due" action={<span className="text-[11px] text-slate-400">Upcoming</span>} />
                    <div className="space-y-2.5">
                      {[["Monthly expenditure report", "Due the 20th of each month", Clock3], ["Quarterly performance report", "Next reporting checkpoint", FileBarChart], ["Annual evaluation data", "Year-end outcome summary", FileText]].map(([title, detail, Icon]) => {
                        const DueIcon = Icon as typeof Clock3;
                        return <div key={title as string} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500"><DueIcon size={15} /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">{title as string}</p><p className="mt-1 text-[11px] text-slate-400">{detail as string}</p></div><ChevronRight size={14} className="mt-1 text-slate-300" /></div>;
                      })}
                    </div>
                    <button type="button" onClick={() => toggleScreen("reports")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Open report center <ArrowRight size={14} /></button>
                  </Panel>
                </div>
                <Panel className="mt-4">
                  <PanelTitle eyebrow="Grant year · July through current month" title="Budget at a glance" action={<button type="button" onClick={() => toggleScreen("budget")} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">View budget <ArrowRight size={13} /></button>} />
                  <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-[25px] font-semibold tracking-tight text-slate-900">{formatCurrency(totalSpent)}</span><span className="text-sm text-slate-400">of {formatCurrency(totalBudget)} awarded</span><Badge green>{totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilized</Badge></div>
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{budgetRows.map((row) => <div key={row.category}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-medium text-slate-600">{row.category}</span><span className="text-slate-400">{formatCurrency(row.spent)} <span className="text-slate-300">/ {formatCurrency(row.budgeted)}</span></span></div><div className="pt-progress"><span style={{ width: `${percentBar(row.percent)}%` }} /></div></div>)}</div>
                </Panel>
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
                  <Panel><PanelTitle title="Program sites" action={<span className="text-[11px] text-slate-400">{seedData.sites.length} locations</span>} />
                    <div className="divide-y divide-slate-100">{seedData.sites.map((site) => {
                      const roster = seedData.students.filter((student) => student.siteId === site.id);
                      const siteAttendance = currentMonthRecords.filter((record) => seedData.students.find((student) => student.id === record.studentId)?.siteId === site.id);
                      const rate = attendancePercent(siteAttendance.filter((record) => record.present).length, siteAttendance.length);
                      return <button type="button" key={site.id} onClick={() => { setSiteFilter(site.id); toggleScreen("attendance"); }} className="flex w-full items-center gap-3 py-3 text-left first:pt-0 last:pb-0 hover:bg-slate-50/70"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><MapPin size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-800">{site.name}</span><span className="mt-1 block text-[11px] text-slate-400">{roster.length} students enrolled</span></span><span className="text-right"><span className="block text-sm font-semibold text-slate-800">{rate}%</span><span className="text-[10px] text-slate-400">attendance</span></span><ChevronRight size={14} className="text-slate-300" /></button>;
                    })}</div>
                  </Panel>
                  <Panel><PanelTitle title="Regular attendee milestone" action={<Badge green>Federal performance measure</Badge>} />
                    <div className="flex items-end justify-between gap-4"><div><p className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-slate-900">{regularCount}<span className="ml-2 text-base font-normal text-slate-400">/ {seedData.students.length}</span></p><p className="mt-2 text-xs text-slate-500">students reached 30+ program days</p></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><BadgeCheck size={23} /></div></div>
                    <div className="mt-5 pt-progress pt-progress-tall"><span style={{ width: `${attendancePercent(regularCount, seedData.students.length)}%` }} /></div>
                    <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>0 students</span><span>{attendancePercent(regularCount, seedData.students.length)}% of enrollment</span><span>{seedData.students.length} students</span></div>
                  </Panel>
                </div>
              </div>
            ) : screen === "attendance" ? (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Daily roster & attendance tracking</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Attendance</h1></div><div className="flex flex-wrap gap-2"><SelectField value={activeSiteId} onChange={setSiteFilter} label="Select attendance site">{seedData.sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</SelectField><label className="pt-date-wrap"><CalendarDays size={15} /><input type="date" min={seedData.attendanceStartDate} max={seedData.asOfDate} value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} aria-label="Attendance date" /></label></div></div>
                <Panel className="mb-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{selectedSite.name}</p><p className="mt-1 text-xs text-slate-400">{formatDate(selectedDate, { weekday: "long" })} · {seedData.students.filter((student) => student.siteId === activeSiteId && student.enrollmentDate <= selectedDate).length} students eligible for attendance</p></div><div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs text-slate-500">Present</span><span className="ml-2 inline-block h-2 w-2 rounded-full bg-slate-300" /><span className="text-xs text-slate-500">Absent</span></div></div>
                  <div className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-y border-slate-100"><th className={tableHead}>Student</th><th className={tableHead}>Grade</th><th className={tableHead}>Daily status</th><th className={tableHead}>Days attended</th><th className={tableHead}>Attendance rate</th><th className={tableHead}>Milestone</th></tr></thead><tbody>{seedData.students.filter((student) => student.siteId === activeSiteId).sort((a, b) => a.name.localeCompare(b.name)).map((student) => {
                    const stats = attendanceByStudent.get(student.id) ?? { attended: 0, possible: 0 };
                    const record = selectedDayRecords.get(student.id);
                    const eligible = student.enrollmentDate <= selectedDate && isWeekday(selectedDate);
                    return <tr key={student.id} className="border-b border-slate-50 last:border-0"><td className={`${tableCell} font-medium text-slate-800`}>{student.name}</td><td className={tableCell}>{student.grade === "K" ? "K" : `Grade ${student.grade}`}</td><td className={tableCell}><button type="button" disabled={!eligible} onClick={() => markAttendance(student)} className={`pt-attendance-toggle ${record?.present ? "pt-attendance-present" : ""} ${!eligible ? "opacity-35" : ""}`} aria-label={`${student.name}: ${record?.present ? "present" : "absent"}; toggle attendance`}><span>{record?.present ? <Check size={12} /> : null}</span>{eligible ? record?.present ? "Present" : "Absent" : "Not enrolled"}</button></td><td className={tableCell}>{stats.attended} days</td><td className={tableCell}>{attendancePercent(stats.attended, stats.possible)}%</td><td className={tableCell}>{stats.attended >= 30 ? <Badge green>Regular attendee</Badge> : <span className="text-xs text-slate-300">—</span>}</td></tr>;
                  })}</tbody></table></div>
                </Panel>
                <Panel><PanelTitle eyebrow="All recorded program days" title="Student attendance summary" action={<span className="text-[11px] text-slate-400">{seedData.students.filter((student) => student.siteId === activeSiteId).length} students</span>} />
                  <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-y border-slate-100"><th className={tableHead}>Student</th><th className={tableHead}>Days attended</th><th className={tableHead}>Days enrolled</th><th className={tableHead}>Attendance</th><th className={tableHead}>Status</th></tr></thead><tbody>{seedData.students.filter((student) => student.siteId === activeSiteId).sort((a, b) => a.name.localeCompare(b.name)).map((student) => {
                    const stats = attendanceByStudent.get(student.id) ?? { attended: 0, possible: 0 };
                    return <tr key={student.id} className="border-b border-slate-50 last:border-0"><td className={`${tableCell} font-medium text-slate-800`}>{student.name}</td><td className={tableCell}>{stats.attended}</td><td className={tableCell}>{stats.possible}</td><td className={tableCell}>{attendancePercent(stats.attended, stats.possible)}%</td><td className={tableCell}>{stats.attended >= 30 ? <Badge green>Regular attendee</Badge> : <span className="text-xs text-slate-400">{30 - stats.attended} days to milestone</span>}</td></tr>;
                  })}</tbody></table></div>
                </Panel>
              </div>
            ) : screen === "students" ? (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Enrollment & student outcomes</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Students</h1><p className="mt-1 text-sm text-slate-500">{visibleStudents.length} students match your filters</p></div><div className="flex flex-wrap gap-2"><label className="pt-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students…" aria-label="Search students" /></label><SelectField value={siteFilter} onChange={setSiteFilter} label="Filter students by site"><option value="all">All sites</option>{seedData.sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</SelectField></div></div>
                <Panel className="!p-0">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3"><Filter size={14} className="text-slate-400" /><span className="mr-1 text-[11px] font-medium text-slate-400">FILTERS</span><SelectField value={gradeFilter} onChange={setGradeFilter} label="Filter by grade"><option value="all">All grades</option>{["K", "1", "2", "3", "4", "5", "6", "7", "8"].map((grade) => <option key={grade} value={grade}>{grade === "K" ? "Kindergarten" : `Grade ${grade}`}</option>)}</SelectField><SelectField value={regularFilter} onChange={setRegularFilter} label="Filter by regular attendee status"><option value="all">All attendance statuses</option><option value="regular">Regular attendees (30+)</option><option value="not-regular">Under 30 days</option></SelectField></div>
                  <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-b border-slate-100"><th className={tableHead}>Student</th><th className={tableHead}>Site</th><th className={tableHead}>Grade</th><th className={tableHead}>Days attended</th><th className={tableHead}>Attendance</th><th className={tableHead}>Demographics</th><th className={tableHead}></th></tr></thead><tbody>{visibleStudents.map((student) => {
                    const stats = attendanceByStudent.get(student.id) ?? { attended: 0, possible: 0 };
                    return <tr key={student.id} onClick={() => setSelectedStudent(student)} className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50/70"><td className={tableCell}><span className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef4f2] text-[10px] font-semibold text-emerald-800">{student.name.split(" ").map((part) => part[0]).join("")}</span><span><span className="block font-medium text-slate-800">{student.name}</span><span className="mt-0.5 block text-[10px] text-slate-400">Enrolled {formatDate(student.enrollmentDate, { year: undefined })}</span></span></span></td><td className={tableCell}>{seedData.sites.find((site) => site.id === student.siteId)?.name}</td><td className={tableCell}>{student.grade === "K" ? "K" : student.grade}</td><td className={tableCell}>{stats.attended}</td><td className={tableCell}>{attendancePercent(stats.attended, stats.possible)}%</td><td className={tableCell}><span className="flex flex-wrap gap-1">{student.lunchStatus === "Free or reduced-price" && <Badge>FRL</Badge>}{student.englishLearner && <Badge>EL</Badge>}{student.iep && <Badge>IEP</Badge>}</span></td><td className={tableCell}>{stats.attended >= 30 ? <Badge green>30+ days</Badge> : <ChevronRight size={15} className="text-slate-300" />}</td></tr>;
                  })}{visibleStudents.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">No students match these filters.</td></tr>}</tbody></table></div>
                  <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400"><span>Showing {visibleStudents.length} of {seedData.students.length} enrolled students</span><span>Click a student to view their record</span></div>
                </Panel>
              </div>
            ) : screen === "activities" ? (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Enrichment & academic programming</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Activities</h1><p className="mt-1 text-sm text-slate-500">Activity enrollment and hours are calculated from student attendance.</p></div><SelectField value={siteFilter} onChange={setSiteFilter} label="Filter activities by site"><option value="all">All program sites</option>{seedData.sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</SelectField></div>
                <div className="mb-4 grid gap-3 sm:grid-cols-3"><MetricCard label="Activities offered" value={String(seedData.activities.filter((item) => siteFilter === "all" || item.siteId === siteFilter).length)} note="Across selected program sites" icon={Sparkles} /><MetricCard label="Student enrollments" value={String(seedData.students.filter((student) => siteFilter === "all" || student.siteId === siteFilter).reduce((sum, student) => sum + student.activityIds.length, 0))} note="Unique student activity assignments" icon={Users} /><MetricCard label="Participation hours" value={String(Math.round(attendance.filter((record) => record.present && record.activityId && (siteFilter === "all" || seedData.activities.find((activity) => activity.id === record.activityId)?.siteId === siteFilter)).reduce((sum, record) => sum + (seedData.activities.find((activity) => activity.id === record.activityId)?.hoursPerSession ?? 0), 0)).toLocaleString())} note="Recorded through the latest program date" icon={Clock3} /></div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{seedData.activities.filter((activity) => siteFilter === "all" || activity.siteId === siteFilter).map((activity, index) => {
                  const enrolled = seedData.students.filter((student) => student.activityIds.includes(activity.id));
                  const records = attendance.filter((record) => record.present && record.activityId === activity.id);
                  const hours = records.length * activity.hoursPerSession;
                  const staffMember = seedData.staff.find((member) => member.id === activity.staffId);
                  return <Panel key={activity.id} className="pt-5"><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${["bg-blue-50 text-blue-700", "bg-violet-50 text-violet-700", "bg-amber-50 text-amber-700", "bg-rose-50 text-rose-700", "bg-cyan-50 text-cyan-700", "bg-pink-50 text-pink-700"][index % 6]}`}><Sparkles size={17} /></span><Badge>{seedData.sites.find((site) => site.id === activity.siteId)?.name}</Badge></div><h2 className="mt-4 text-base font-semibold text-slate-900">{activity.name}</h2><p className="mt-1 text-xs text-slate-400">{activity.daysPerWeek} days per week · {activity.hoursPerSession} hour session</p><div className="mt-4 border-t border-slate-100 pt-4"><div className="flex justify-between text-xs"><span className="text-slate-400">Student enrollment</span><span className="font-semibold text-slate-700">{enrolled.length}</span></div><div className="mt-3 flex justify-between text-xs"><span className="text-slate-400">Participation hours</span><span className="font-semibold text-slate-700">{hours.toLocaleString()}</span></div><div className="mt-3 flex justify-between gap-2 text-xs"><span className="text-slate-400">Assigned staff</span><span className="text-right font-medium text-slate-700">{staffMember?.name}<span className="block mt-0.5 text-[10px] font-normal text-slate-400">{staffMember?.role}</span></span></div></div></Panel>;
                })}</div>
              </div>
            ) : screen === "budget" ? (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Grant year · July 1–June 30</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Budget</h1><p className="mt-1 text-sm text-slate-500">Track grant spending across approved budget categories.</p></div><button type="button" className="pt-button pt-button-primary" onClick={() => { setExpenseFormOpen(!expenseFormOpen); setExpenseNotice(""); }}><Plus size={15} /> Add expenditure</button></div>
                <div className="mb-4 grid gap-3 sm:grid-cols-3"><MetricCard label="Total award" value={formatCurrency(totalBudget)} note="Approved grant budget" icon={Banknote} /><MetricCard label="Spent to date" value={formatCurrency(totalSpent)} note={`${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% of total award`} icon={WalletCards} /><MetricCard label="Remaining balance" value={formatCurrency(totalBudget - totalSpent)} note="Available grant funds" icon={Activity} /></div>
                {expenseNotice && <p role="status" className="mb-3 rounded-lg bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">{expenseNotice}</p>}
                {expenseFormOpen && <Panel className="mb-4"><PanelTitle title="Record an expenditure" action={<button type="button" onClick={() => setExpenseFormOpen(false)} aria-label="Close expenditure form"><X size={17} className="text-slate-400" /></button>} />
                  <form onSubmit={addExpenditure} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="pt-form-field">Date<input name="date" type="date" min={seedData.budgetStartDate} max={seedData.asOfDate} required /></label>
                    <label className="pt-form-field">Budget category<select name="category" required>{seedData.budget.map((item) => <option key={item.category}>{item.category}</option>)}</select></label>
                    <label className="pt-form-field">Amount (USD)<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></label>
                    <label className="pt-form-field">Vendor<input name="vendor" placeholder="Vendor or payee" required /></label>
                    <label className="pt-form-field sm:col-span-2">Description<input name="description" placeholder="What was purchased or paid for?" required /></label>
                    <div className="sm:col-span-2 lg:col-span-3 flex justify-end"><button type="submit" className="pt-button pt-button-primary">Save expenditure</button></div>
                  </form>
                </Panel>}
                <Panel><PanelTitle eyebrow="Approved grant categories" title="Budget summary" action={<span className="text-[11px] text-slate-400">{budgetRows.length} categories</span>} />
                  <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-y border-slate-100"><th className={tableHead}>Category</th><th className={tableHead}>Budgeted</th><th className={tableHead}>Spent to date</th><th className={tableHead}>Remaining</th><th className={tableHead}>% spent</th><th className={tableHead}>Utilization</th></tr></thead><tbody>{budgetRows.map((row) => <tr key={row.category} className="border-b border-slate-50 last:border-0"><td className={`${tableCell} font-medium text-slate-800`}>{row.category}</td><td className={tableCell}>{formatCurrency(row.budgeted)}</td><td className={tableCell}>{formatCurrency(row.spent)}</td><td className={tableCell}>{formatCurrency(row.remaining)}</td><td className={tableCell}>{row.percent}%</td><td className={`${tableCell} min-w-[135px]`}><div className="pt-progress"><span style={{ width: `${percentBar(row.percent)}%` }} /></div></td></tr>)}</tbody><tfoot><tr className="border-t border-slate-200 bg-slate-50/70"><td className={`${tableCell} font-semibold text-slate-800`}>Total grant</td><td className={`${tableCell} font-semibold`}>{formatCurrency(totalBudget)}</td><td className={`${tableCell} font-semibold`}>{formatCurrency(totalSpent)}</td><td className={`${tableCell} font-semibold`}>{formatCurrency(totalBudget - totalSpent)}</td><td className={`${tableCell} font-semibold`}>{totalBudget ? Math.round(totalSpent / totalBudget * 100) : 0}%</td><td className={tableCell} /></tr></tfoot></table></div>
                </Panel>
                <Panel className="mt-4"><PanelTitle title="Monthly expenditures" action={<span className="text-[11px] text-slate-400">July through current month</span>} />
                  {(() => {
                    const months = Array.from(new Set(expenditures.map((item) => item.date.slice(0, 7)))).sort();
                    const values = months.map((month) => expenditures.filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + item.amount, 0));
                    const maxValue = Math.max(...values, 1);
                    return <div className="pt-expense-chart" aria-label="Monthly total expenditures bar chart">{months.map((month, index) => <div key={month} className="pt-expense-month"><span className="pt-expense-value">{formatCurrency(values[index])}</span><div className="pt-expense-track"><span style={{ height: `${Math.max(3, values[index] / maxValue * 100)}%` }} /></div><span className="pt-expense-label">{new Date(`${month}-01T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</span></div>)}</div>;
                  })()}
                  <div className="overflow-x-auto"><table className="w-full border-collapse text-left"><thead><tr className="border-y border-slate-100"><th className={tableHead}>Month</th>{seedData.budget.map((item) => <th key={item.category} className={tableHead}>{item.category}</th>)}<th className={tableHead}>Total</th></tr></thead><tbody>{Array.from(new Set(expenditures.map((item) => item.date.slice(0, 7)))).sort().map((month) => {
                    const monthItems = expenditures.filter((item) => item.date.startsWith(month));
                    const monthTotal = monthItems.reduce((sum, item) => sum + item.amount, 0);
                    return <tr key={month} className="border-b border-slate-50 last:border-0"><td className={`${tableCell} font-medium text-slate-800`}>{new Date(`${month}-01T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</td>{seedData.budget.map((item) => <td key={item.category} className={tableCell}>{formatCurrency(monthItems.filter((entry) => entry.category === item.category).reduce((sum, entry) => sum + entry.amount, 0))}</td>)}<td className={`${tableCell} font-semibold`}>{formatCurrency(monthTotal)}</td></tr>;
                  })}</tbody></table></div>
                </Panel>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">Grant-ready reporting</p><h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-slate-900">Reports</h1><p className="mt-1 text-sm text-slate-500">Build, review, and export reports from your program data.</p></div><SelectField value={reportPeriod} onChange={(value) => setReportPeriod(value as ReportPeriod)} label="Select report period"><option value="month">Current month</option><option value="year">Program year to date</option><option value="all">Full demo history</option></SelectField></div>
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800"><FileBarChart size={16} /><span>Choose a report to preview and download as a spreadsheet.</span><span className="ml-auto hidden text-[11px] text-emerald-700 sm:block">{formatDate(periodRange.start)} – {formatDate(periodRange.end)}</span></div>
                <div className="grid gap-3 md:grid-cols-2">{reportCards.map((item, index) => {
                  const Icon = [WalletCards, CalendarDays, BadgeCheck, FileText][index];
                  return <button type="button" key={item.id} onClick={() => { setReport(item.id); setReportPeriod(item.id === "monthly" ? "month" : "year"); }} className="pt-report-card text-left"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={18} /></span><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-500">{item.id === "monthly" ? "FINANCIAL" : item.id === "annual" ? "EVALUATION" : "PERFORMANCE"}</span></div><h2 className="mt-5 text-[15px] font-semibold text-slate-900">{item.title}</h2><p className="mt-1.5 min-h-10 text-xs leading-5 text-slate-500">{item.description}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[11px] text-slate-400">{item.id === "monthly" ? "Current month" : isPeriodMonth ? "Current month" : reportPeriod === "year" ? "Program year to date" : "Full demo history"}</span><span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">Preview report <ArrowRight size={13} /></span></div></button>;
                })}</div>
                <Panel className="mt-4"><PanelTitle title="Reporting notes" />
                  <div className="grid gap-4 sm:grid-cols-2"><div className="flex gap-2.5"><span className="mt-0.5 text-emerald-700"><BadgeCheck size={16} /></span><div><p className="text-xs font-semibold text-slate-800">Regular attendee measure</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Students with 30 or more days attended in the selected reporting period.</p></div></div><div className="flex gap-2.5"><span className="mt-0.5 text-emerald-700"><CalendarDays size={16} /></span><div><p className="text-xs font-semibold text-slate-800">Attendance records</p><p className="mt-1 text-[11px] leading-5 text-slate-500">School-day attendance is generated from the local sample roster.</p></div></div><div className="flex gap-2.5"><span className="mt-0.5 text-emerald-700"><ArrowDownToLine size={16} /></span><div><p className="text-xs font-semibold text-slate-800">Your data, your choice</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Your organization owns its student data. Export it anytime; no lock-in.</p></div></div><div className="flex gap-2.5"><span className="mt-0.5 text-emerald-700"><FileBarChart size={16} /></span><div><p className="text-xs font-semibold text-slate-800">Illinois reporting alignment</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Built around ISBE&apos;s reporting requirements. This independent demo is not affiliated with or endorsed by ISBE. Confirm current forms and due dates with your grant administrator.</p></div></div></div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><p className="max-w-2xl text-[10px] leading-4 text-slate-400">Sample reports illustrate a workflow; they are not official ISBE forms or a substitute for current grant guidance. This demo uses fictional seed data and does not store live student records.</p><div className="flex flex-wrap items-center gap-3"><span role="status" className="text-[11px] text-emerald-700">{exportNotice}</span><button type="button" onClick={downloadProgramData} className="pt-button pt-button-primary"><ArrowDownToLine size={14} /> Export all program data</button></div></div>
                </Panel>
              </div>
            )}
          </main>
          <footer className="pt-footer"><span>ProgramTrack <span className="text-slate-300">·</span> 21st CCLC program data demo</span><span>Sample data for illustration</span></footer>
        </div>
      </div>

      {selectedStudent && (() => {
        const student = selectedStudent;
        const records = attendance.filter((record) => record.studentId === student.id);
        const attended = records.filter((record) => record.present).length;
        const monthStart = `${seedData.asOfDate.slice(0, 7)}-01`;
        const monthLength = new Date(Number(seedData.asOfDate.slice(0, 4)), Number(seedData.asOfDate.slice(5, 7)), 0).getDate();
        const monthCalendar: (string | null)[] = [
          ...Array.from({ length: (new Date(`${monthStart}T12:00:00`).getDay() + 6) % 7 }, () => null),
          ...Array.from({ length: monthLength }, (_, index) => `${seedData.asOfDate.slice(0, 7)}-${String(index + 1).padStart(2, "0")}`),
        ];
        const participatingActivities = seedData.activities.filter((activity) => student.activityIds.includes(activity.id));
        return <div className="pt-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStudent(null); }}>
          <section className="pt-student-modal" role="dialog" aria-modal="true" aria-labelledby="student-detail-title">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Student record · {student.id.toUpperCase()}</p><h2 id="student-detail-title" className="mt-1 text-xl font-semibold text-slate-900">{student.name}</h2><p className="mt-1 text-xs text-slate-500">{student.grade === "K" ? "Kindergarten" : `Grade ${student.grade}`} · {seedData.sites.find((site) => site.id === student.siteId)?.name}</p></div><button type="button" onClick={() => setSelectedStudent(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close student detail"><X size={18} /></button></div>
            <div className="grid grid-cols-3 gap-3 p-5 pb-0"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Days attended</p><p className="mt-1 text-lg font-semibold text-slate-900">{attended}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Attendance rate</p><p className="mt-1 text-lg font-semibold text-slate-900">{attendancePercent(attended, records.length)}%</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Enrolled since</p><p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(student.enrollmentDate, { year: undefined })}</p></div></div>
            <div className="p-5"><p className="mb-3 text-xs font-semibold text-slate-800">Attendance calendar · {new Date(`${seedData.asOfDate}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p><div className="grid grid-cols-7 gap-1.5">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`} className="pb-1 text-center text-[10px] font-medium text-slate-400">{day}</span>)}{monthCalendar.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} />;
              const record = records.find((item) => item.date === date);
              const schoolDay = isWeekday(date);
              const day = Number(date.slice(-2));
              return <span key={date} title={schoolDay ? `${formatDate(date)} · ${record?.present ? "Present" : record ? "Absent" : "Not recorded"}` : `${formatDate(date)} · No program day`} className={`grid aspect-square place-items-center rounded-md text-[10px] ${!schoolDay ? "bg-transparent text-slate-200" : record?.present ? "bg-emerald-100 font-semibold text-emerald-800" : record ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-300"}`}>{day}</span>;
            })}</div><div className="mt-3 flex gap-4 text-[10px] text-slate-400"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-300" />Present</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-rose-200" />Absent</span></div></div>
            <div className="border-t border-slate-100 px-5 py-4"><p className="mb-2 text-xs font-semibold text-slate-800">Student demographics</p><div className="flex flex-wrap gap-1.5"><Badge>{student.gender}</Badge><Badge>{student.raceEthnicity}</Badge><Badge>{student.lunchStatus}</Badge>{student.englishLearner && <Badge>English learner</Badge>}{student.iep && <Badge>IEP</Badge>}</div></div>
            <div className="border-t border-slate-100 px-5 py-4"><p className="mb-2 text-xs font-semibold text-slate-800">Activity participation</p><div className="space-y-2">{participatingActivities.map((activity) => {
              const activityRecords = records.filter((record) => record.present && record.activityId === activity.id).length;
              return <div key={activity.id} className="flex items-center justify-between text-xs"><span className="text-slate-600">{activity.name}</span><span className="text-slate-400">{activityRecords * activity.hoursPerSession} hours</span></div>;
            })}</div></div>
          </section>
        </div>;
      })()}
    </div>
  );
}
