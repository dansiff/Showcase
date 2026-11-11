"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import {
  addDays,
  displayTime,
  formatDate,
  formatMoney,
  mondayOfWeek,
  parseDate,
  weekdayName,
  type Appointment,
  type AppointmentStatus,
  type Client,
  type FusionBookBusiness,
} from "@/data/fusionbook/seed";
import "../../fusionbook.css";

type DashboardTab = "today" | "calendar" | "waitlist" | "clients" | "policies";

const navigation: { id: DashboardTab; label: string; icon: typeof CalendarDays }[] = [
  { id: "today", label: "Today", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "clients", label: "Clients", icon: Users },
  { id: "policies", label: "Policies", icon: ShieldCheck },
];

const statusNames: Record<AppointmentStatus, string> = {
  completed: "Completed",
  booked: "Booked",
  confirmed: "Confirmed",
  "no-show": "No-show",
  cancelled: "Cancelled",
};

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function statusClass(status: AppointmentStatus) {
  return status === "no-show" ? "fb-status fb-status-no-show" : `fb-status fb-status-${status}`;
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  highlight = false,
  accent,
  accentSoft,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof CalendarDays;
  highlight?: boolean;
  accent: string;
  accentSoft: string;
}) {
  return (
    <div className={`fb-metric ${highlight ? "fb-metric-highlight" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div><p className={`text-xs font-medium ${highlight ? "text-white/75" : "text-slate-500"}`}>{label}</p><p className="mt-3 text-[27px] font-semibold leading-none tracking-[-.045em]">{value}</p></div>
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: highlight ? "rgb(255 255 255 / 15%)" : accentSoft, color: highlight ? "white" : accent }}><Icon size={17} /></span>
      </div>
      <p className={`mt-3 text-[11px] ${highlight ? "text-white/75" : "text-slate-400"}`}>{note}</p>
    </div>
  );
}

export default function FusionBookDashboard({ business }: { business: FusionBookBusiness }) {
  const [tab, setTab] = useState<DashboardTab>("today");
  const [appointments, setAppointments] = useState<Appointment[]>(business.appointments);
  const [waitlist, setWaitlist] = useState(business.waitlist);
  const [cancelledAppointment, setCancelledAppointment] = useState<Appointment | null>(null);
  const [offeredClient, setOfferedClient] = useState<Client | null>(null);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [clientSearch, setClientSearch] = useState("");

  const theme = {
    "--fb-accent": business.branding.accent,
    "--fb-accent-soft": business.branding.accentSoft,
    "--fb-primary": business.branding.primary,
  } as CSSProperties;
  const getClient = (id: string) => business.clients.find((client) => client.id === id) ?? business.clients[0];
  const getService = (id: string) => business.services.find((service) => service.id === id) ?? business.services[0];
  const getStaff = (id: string) => business.staff.find((member) => member.id === id) ?? business.staff[0];
  const todayAppointments = appointments
    .filter((appointment) => appointment.date === business.asOfDate && appointment.status !== "cancelled")
    .sort((left, right) => left.time.localeCompare(right.time));
  const monthAppointments = appointments.filter((appointment) =>
    appointment.date.startsWith(business.asOfDate.slice(0, 7)) && appointment.status !== "cancelled");
  const depositsCollected = monthAppointments.reduce(
    (total, appointment) => total + (appointment.depositPaid ? getService(appointment.serviceId).deposit : 0),
    0,
  );
  const noShowsThisMonth = monthAppointments.filter((appointment) => appointment.status === "no-show").length;
  const reminderBalance = monthAppointments.reduce((total, appointment) => {
    if (!appointment.reminderConfirmed) return total;
    const service = getService(appointment.serviceId);
    return total + Math.max(0, service.price - (appointment.depositPaid ? service.deposit : 0));
  }, 0);
  const protectedRevenue = depositsCollected + reminderBalance;

  const weekDays = useMemo(() => {
    const first = mondayOfWeek(business.asOfDate);
    const shifted = addDays(first, weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => addDays(shifted, index));
  }, [business.asOfDate, weekOffset]);

  const waitlistSlot = useMemo(() => {
    const saturday = Array.from({ length: 7 }, (_, index) => addDays(business.asOfDate, index + 1))
      .find((date) => weekdayName(date) === "Saturday");
    const first = waitlist[0];
    if (!saturday || !first) return null;
    return appointments.find((appointment) =>
      appointment.date === saturday &&
      appointment.serviceId === first.serviceId &&
      (!first.preferredStaffId || appointment.staffId === first.preferredStaffId) &&
      ["booked", "confirmed"].includes(appointment.status)) ?? null;
  }, [appointments, business.asOfDate, waitlist]);

  const clientRows = useMemo(() => business.clients.map((client) => {
    const visits = appointments.filter((appointment) => appointment.clientId === client.id && appointment.status === "completed");
    const noShows = appointments.filter((appointment) => appointment.clientId === client.id && appointment.status === "no-show").length;
    const spend = visits.reduce((total, appointment) => total + getService(appointment.serviceId).price, 0);
    return { client, visits: visits.length, noShows, spend, flagged: noShows >= business.depositRules.repeatNoShowPrepayThreshold };
  }).filter(({ client }) => `${client.name} ${client.phone}`.toLowerCase().includes(clientSearch.toLowerCase()))
    .sort((left, right) => Number(right.flagged) - Number(left.flagged) || left.client.name.localeCompare(right.client.name)),
  [appointments, business, clientSearch]);

  const simulateCancellation = () => {
    setWaitlistError("");
    if (!waitlistSlot || !waitlist[0]) {
      setWaitlistError("There is no matching Saturday appointment to cancel in this sample.");
      return;
    }
    const client = getClient(waitlist[0].clientId);
    setAppointments((items) => items.map((appointment) =>
      appointment.id === waitlistSlot.id ? { ...appointment, status: "cancelled" } : appointment));
    setCancelledAppointment({ ...waitlistSlot, status: "cancelled" });
    setOfferedClient(client);
    setOfferAccepted(false);
  };

  const acceptOffer = () => {
    if (!cancelledAppointment || !waitlist[0] || !offeredClient) return;
    const entry = waitlist[0];
    setAppointments((items) => [...items, {
      ...cancelledAppointment,
      id: `waitlist-fill-${Date.now()}`,
      clientId: entry.clientId,
      serviceId: entry.serviceId,
      status: "confirmed",
      depositPaid: true,
      reminderConfirmed: true,
    }]);
    setWaitlist((items) => items.slice(1));
    setOfferAccepted(true);
  };

  const heading = {
    today: ["YOUR STUDIO · LIVE DEMO", "Today at the studio"],
    calendar: ["THE WHOLE WEEK · EVERY CHAIR", "Appointment calendar"],
    waitlist: ["FILL THE GAP, NOT JUST THE CALENDAR", "Your Saturday waitlist"],
    clients: ["YOUR COMMUNITY, REMEMBERED", "Clients"],
    policies: ["CLEAR EXPECTATIONS, BETTER SHOW RATES", "Policies & deposits"],
  } satisfies Record<DashboardTab, [string, string]>;

  return (
    <div className="fb-root" style={theme}>
      <div className="fb-demo-banner"><span /> DEMO — Sample data for illustration</div>
      <div className="fb-shell">
        <aside className="fb-sidebar">
          <Link href="/fusionbook" className="fb-side-brand text-inherit no-underline">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.accent }}>{business.branding.logoMark}</span>
            <span><b className="block text-[13px] tracking-wide text-white">FUSION<span style={{ color: business.branding.accent }}>BOOK</span></b><small className="mt-1 block text-[8px] tracking-[.15em] text-white/40">STUDIO MANAGER</small></span>
          </Link>
          <div className="fb-nav-label">YOUR BUSINESS</div>
          <nav className="fb-nav" aria-label="Business dashboard">
            {navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" className="fb-nav-item" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}><Icon size={16} /><span>{label}</span>{id === "waitlist" && waitlist.length > 0 && <span className="ml-auto rounded-md bg-white/10 px-1.5 py-0.5 text-[10px]">{waitlist.length}</span>}</button>)}
          </nav>
          <div className="fb-side-bottom">
            <p className="text-sm font-semibold text-white">Less time chasing.</p>
            <p className="mt-1 text-[11px] leading-5 text-white/50">More appointments that show up.</p>
            <Link href={`/book/${business.slug}`} className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold no-underline" style={{ color: business.branding.accent }}>Open booking page <ArrowRight size={13} /></Link>
          </div>
        </aside>

        <div className="fb-main-column">
          <header className="fb-topbar">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold tracking-[.12em] text-slate-500"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> SAMPLE WORKSPACE <span className="text-slate-300">/</span><span className="truncate">{business.profile.name.toUpperCase()}</span></div>
            <Link href={`/book/${business.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 no-underline hover:bg-slate-50"><ArrowLeft size={13} /> Booking page</Link>
          </header>
          <main className="fb-content">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div><p className="fb-eyebrow">{tab === "today" ? formatDate(business.asOfDate) : heading[tab][0]}</p><h1 className="fb-page-title mt-1">{heading[tab][1]}</h1></div>
              <span className="rounded-full px-3 py-1.5 text-[10px] font-semibold" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{business.profile.name}</span>
            </div>

            {tab === "today" && <>
              <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Appointments today" value={String(todayAppointments.length)} note={`${todayAppointments.filter((item) => ["booked", "confirmed"].includes(item.status)).length} still to come`} icon={CalendarDays} accent={business.branding.accent} accentSoft={business.branding.accentSoft} />
                <StatCard label="Deposits collected this month" value={formatMoney(depositsCollected)} note={`${monthAppointments.filter((item) => item.depositPaid).length} deposits recorded`} icon={Wallet} accent={business.branding.accent} accentSoft={business.branding.accentSoft} />
                <StatCard label="No-shows this month" value={String(noShowsThisMonth)} note="Missed visits in the sample month" icon={Users} accent={business.branding.accent} accentSoft={business.branding.accentSoft} />
                <StatCard label="Revenue protected this month" value={formatMoney(protectedRevenue)} note={`${formatMoney(depositsCollected)} deposits + ${formatMoney(reminderBalance)} reminder-confirmed balance`} icon={ShieldCheck} highlight accent={business.branding.accent} accentSoft={business.branding.accentSoft} />
              </div>
              <div className="grid gap-4 xl:grid-cols-[1.55fr_.75fr]">
                <section className="fb-panel">
                  <div className="mb-4 flex items-center justify-between gap-3"><div><p className="fb-eyebrow">YOUR FLOOR, AT A GLANCE</p><h2 className="mt-1 text-base font-semibold text-slate-900">Today’s appointments <span className="ml-1 rounded-md bg-slate-100 px-1.5 py-1 text-xs text-slate-600">{todayAppointments.length}</span></h2></div><button type="button" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: business.branding.accent }} onClick={() => setTab("calendar")}>Full calendar <ArrowRight size={13} /></button></div>
                  {todayAppointments.length ? <div className="divide-y divide-slate-100">
                    {todayAppointments.map((appointment) => {
                      const client = getClient(appointment.clientId);
                      const service = getService(appointment.serviceId);
                      const artist = getStaff(appointment.staffId);
                      return <div key={appointment.id} className="grid grid-cols-[64px_36px_minmax(0,1fr)_auto] items-center gap-3 py-3.5">
                        <span className="text-xs font-semibold text-slate-600">{displayTime(appointment.time)}</span>
                        <span className="fb-avatar h-9 w-9" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{initials(client.name)}</span>
                        <span className="min-w-0"><b className="block truncate text-xs text-slate-800">{client.name}</b><small className="mt-1 block truncate text-[10px] text-slate-400">{service.name} · {service.durationMinutes} min · {artist.name}</small></span>
                        <span className={statusClass(appointment.status)}>{statusNames[appointment.status]}</span>
                      </div>;
                    })}
                  </div> : <p className="py-8 text-center text-sm text-slate-400">No appointments on the schedule today.</p>}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400"><span>All times shown in local time</span><button type="button" className="font-semibold" style={{ color: business.branding.accent }} onClick={() => setTab("calendar")}>View week <ChevronRight size={12} className="inline" /></button></div>
                </section>
                <section className="fb-panel">
                  <div className="mb-4"><p className="fb-eyebrow">YOUR TEAM</p><h2 className="mt-1 text-base font-semibold text-slate-900">On the floor</h2></div>
                  <div className="space-y-4">{business.staff.map((member) => {
                    const count = todayAppointments.filter((appointment) => appointment.staffId === member.id).length;
                    return <div key={member.id} className="flex items-center gap-3">
                      <span className="fb-avatar h-10 w-10 rounded-xl" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{member.initials}</span>
                      <span className="min-w-0 flex-1"><b className="block truncate text-xs text-slate-800">{member.name}</b><small className="mt-1 block truncate text-[10px] text-slate-400">{member.specialty}</small></span>
                      <span className="text-[10px] text-slate-400">{count} {count === 1 ? "visit" : "visits"}</span>
                    </div>;
                  })}</div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-[10px] leading-5 text-slate-500">Working hours and booking availability follow each team member’s schedule.</div>
                </section>
              </div>
            </>}

            {tab === "calendar" && <section className="fb-panel">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-base font-semibold text-slate-900">{formatDate(weekDays[0], { month: "long", year: "numeric" })}</p><p className="mt-1 text-xs text-slate-400">A week across every team member.</p></div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Previous week" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => setWeekOffset((offset) => offset - 1)}><ChevronLeft size={16} /></button>
                  <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50" onClick={() => setWeekOffset(0)}>Today</button>
                  <button type="button" aria-label="Next week" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => setWeekOffset((offset) => offset + 1)}><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-3 text-[10px] text-slate-500">{(["confirmed", "booked", "completed", "no-show", "cancelled"] as AppointmentStatus[]).map((status) => <span key={status} className="inline-flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${status === "confirmed" ? "bg-emerald-500" : status === "booked" ? "bg-amber-400" : status === "completed" ? "bg-slate-400" : status === "no-show" ? "bg-rose-500" : "bg-slate-300"}`} />{statusNames[status]}</span>)}</div>
              <div className="overflow-x-auto">
                <div className="grid min-w-[910px] grid-cols-7 border-y border-slate-100" role="grid" aria-label="Weekly appointment calendar">
                  {weekDays.map((date) => {
                    const dateObject = parseDate(date);
                    const dayAppointments = appointments.filter((appointment) => appointment.date === date)
                      .sort((left, right) => left.time.localeCompare(right.time));
                    return <div key={date} role="gridcell" className="fb-calendar-day" style={date === business.asOfDate ? { backgroundColor: business.branding.accentSoft } : undefined}>
                      <div className="mb-2"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">{dateObject.toLocaleDateString("en-US", { weekday: "short" })}</p><p className="mt-1 text-sm font-semibold text-slate-800">{dateObject.getDate()}</p></div>
                      {dayAppointments.length ? dayAppointments.map((appointment) => {
                        const client = getClient(appointment.clientId);
                        return <div key={appointment.id} className={`fb-calendar-event ${appointment.status === "cancelled" ? "fb-calendar-event-cancelled" : ""}`} style={appointment.status === "cancelled" ? undefined : { "--fb-event-color": business.branding.accent, "--fb-event-bg": business.branding.accentSoft } as CSSProperties}>
                          <b>{displayTime(appointment.time)}</b><span className="mt-1 block font-semibold">{client.name.split(" ")[0]}</span><span className="block">{getService(appointment.serviceId).name}</span><span className="mt-1 block opacity-70">{getStaff(appointment.staffId).name.split(" ")[0]} · {statusNames[appointment.status]}</span>
                        </div>;
                      }) : <p className="mt-4 text-[10px] text-slate-300">No visits</p>}
                    </div>;
                  })}
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-400">{appointments.filter((appointment) => weekDays.includes(appointment.date) && appointment.status !== "cancelled").length} active appointments this week · cancelled bookings remain visible for the demo.</p>
            </section>}

            {tab === "waitlist" && <div className="space-y-4">
              <section className="fb-panel flex flex-wrap items-center justify-between gap-4">
                <div className="flex max-w-xl items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.accent }}><Clock3 size={18} /></span><div><h2 className="text-sm font-semibold text-slate-900">A Saturday spot opens. The next client gets first dibs.</h2><p className="mt-1 text-xs leading-5 text-slate-500">Simulate a cancellation, send a sample text offer, and refill that same calendar slot.</p></div></div>
                <button type="button" disabled={Boolean(cancelledAppointment) || waitlist.length === 0} onClick={simulateCancellation} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: business.branding.primary }}><CalendarDays size={14} />{cancelledAppointment ? "Cancellation simulated" : "Simulate a cancellation"}</button>
              </section>
              {waitlistError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{waitlistError}</p>}
              {cancelledAppointment && offeredClient && <section className="fb-panel">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check size={14} /></span>{formatDate(cancelledAppointment.date)} · {displayTime(cancelledAppointment.time)} slot opened</div>
                <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-3"><span className="fb-avatar h-8 w-8" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{business.branding.logoMark}</span><span><b className="block text-xs text-slate-800">{business.profile.name}</b><small className="text-[10px] text-slate-400">Text message · now</small></span></div>
                  <div className="fb-phone-bubble">Hey {offeredClient.name.split(" ")[0]}! A {displayTime(cancelledAppointment.time)} spot just opened {weekdayName(cancelledAppointment.date)} with {getStaff(cancelledAppointment.staffId).name} for a {getService(cancelledAppointment.serviceId).name}. Want us to save it for you?</div>
                  <div className="mt-3 flex justify-end"><span className="fb-phone-bubble fb-phone-bubble-out text-xs font-semibold">YES — CLAIM MY SPOT</span></div>
                  {!offerAccepted ? <button type="button" onClick={acceptOffer} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold text-white" style={{ backgroundColor: business.branding.accent }}>Accept offer <ArrowRight size={14} /></button> : <p className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800"><CheckCircle2 size={15} /> Accepted — the appointment is confirmed and the slot is refilled.</p>}
                </div>
              </section>}
              <section className="fb-panel">
                <div className="mb-3 flex items-end justify-between"><div><p className="fb-eyebrow">OFFER IN ORDER</p><h2 className="mt-1 text-base font-semibold text-slate-900">Saturday waitlist</h2></div><span className="text-xs text-slate-400">{waitlist.length} clients waiting</span></div>
                {waitlist.length ? <div className="divide-y divide-slate-100">{waitlist.map((entry, index) => {
                  const client = getClient(entry.clientId);
                  return <div key={entry.id} className="grid grid-cols-[32px_40px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                    <span className="text-xs font-semibold text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                    <span className="fb-avatar h-10 w-10" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{initials(client.name)}</span>
                    <span className="min-w-0"><b className="block truncate text-xs text-slate-800">{client.name}</b><small className="mt-1 block truncate text-[10px] text-slate-400">{getService(entry.serviceId).name} · {entry.preferredStaffId ? `Prefers ${getStaff(entry.preferredStaffId).name}` : "First available"}</small></span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{index === 0 ? "Next offer" : "In line"}</span>
                  </div>;
                })}</div> : <p className="py-7 text-center text-sm text-slate-400">The waitlist is clear.</p>}
              </section>
            </div>}

            {tab === "clients" && <section className="fb-panel">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="fb-eyebrow">CLIENT HISTORY</p><h2 className="mt-1 text-base font-semibold text-slate-900">{business.clients.length} sample clients</h2></div><label className="flex min-w-[230px] items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"><Search size={14} className="text-slate-400" /><input value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} placeholder="Search name or phone" className="w-full border-0 bg-transparent text-xs outline-none placeholder:text-slate-400" /></label></div>
              <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3"><p className="text-xs font-semibold text-rose-800">Repeat no-shows are flagged for full prepayment.</p><p className="mt-1 text-[10px] leading-4 text-rose-700/80">Clients with {business.depositRules.repeatNoShowPrepayThreshold} or more missed appointments must prepay in full before booking again.</p></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[670px] border-collapse text-left">
                <thead><tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-[.12em] text-slate-400"><th className="px-3 py-3">Client</th><th className="px-3 py-3">Visits</th><th className="px-3 py-3">Total spent</th><th className="px-3 py-3">No-shows</th><th className="px-3 py-3">Status</th></tr></thead>
                <tbody>{clientRows.map(({ client, visits, noShows, spend, flagged }) => <tr key={client.id} className="border-b border-slate-50 text-xs">
                  <td className="px-3 py-3"><span className="flex items-center gap-2.5"><span className="fb-avatar h-8 w-8">{initials(client.name)}</span><span><b className="block text-slate-800">{client.name}</b><small className="mt-1 block text-[10px] text-slate-400">{client.phone}</small></span></span></td>
                  <td className="px-3 py-3 text-slate-600">{visits}</td><td className="px-3 py-3 text-slate-600">{formatMoney(spend)}</td><td className={`px-3 py-3 font-semibold ${flagged ? "text-rose-600" : "text-slate-500"}`}>{noShows}</td>
                  <td className="px-3 py-3">{flagged ? <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-semibold text-rose-700">Repeat no-show · full prepay</span> : <span className="text-[10px] text-emerald-700">Good standing</span>}</td>
                </tr>)}</tbody>
              </table></div>
              <p className="mt-4 text-[10px] text-slate-400">Visit counts and spend use completed appointments in this business’s sample history.</p>
            </section>}

            {tab === "policies" && <div className="grid gap-4 lg:grid-cols-2">
              <section className="fb-panel"><div className="mb-4 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.accent }}><CalendarDays size={17} /></span><div><p className="fb-eyebrow">CANCELLATIONS & RESCHEDULING</p><h2 className="mt-1 text-sm font-semibold text-slate-900">Give your time a little respect.</h2></div></div><p className="text-sm leading-6 text-slate-600">{business.profile.cancellationPolicy}</p></section>
              <section className="fb-panel"><div className="mb-4 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600"><ShieldCheck size={17} /></span><div><p className="fb-eyebrow">MISSED APPOINTMENTS</p><h2 className="mt-1 text-sm font-semibold text-slate-900">Protect the schedule.</h2></div></div><p className="text-sm leading-6 text-slate-600">{business.profile.noShowPolicy}</p><p className="mt-4 rounded-lg bg-slate-50 p-3 text-[10px] font-medium leading-5 text-slate-500">After {business.depositRules.repeatNoShowPrepayThreshold} missed visits, clients are flagged to prepay in full.</p></section>
              <section className="fb-panel lg:col-span-2"><div className="mb-4"><p className="fb-eyebrow">SET BY SERVICE · APPLIED TO THE SERVICE TOTAL</p><h2 className="mt-1 text-base font-semibold text-slate-900">Deposit settings</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead><tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-[.12em] text-slate-400"><th className="py-3">Service</th><th className="py-3">Duration</th><th className="py-3">Price</th><th className="py-3">Deposit to book</th></tr></thead><tbody>{business.services.map((service) => <tr key={service.id} className="border-b border-slate-50 text-xs"><td className="py-3 font-medium text-slate-800">{service.name}</td><td className="py-3 text-slate-500">{service.durationMinutes} min</td><td className="py-3 text-slate-500">{formatMoney(service.price)}</td><td className="py-3 font-semibold" style={{ color: business.branding.accent }}>{formatMoney(service.deposit)}</td></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-slate-400">Display-only demo settings. No payment is processed.</p></section>
            </div>}
          </main>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-7 py-4 text-[10px] text-slate-400"><span><span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-md text-[8px] font-bold" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.accent }}>{business.branding.logoMark}</span>{business.profile.name} · FusionBook demo</span><Link href="/fusionbook" className="text-slate-500 no-underline hover:text-slate-800">All demo businesses</Link></footer>
        </div>
      </div>
    </div>
  );
}
