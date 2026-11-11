"use client";

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  displayTime,
  formatLongDate,
  formatMoney,
  minutesToTime,
  seedData,
  timeToMinutes,
  type Appointment,
  type Client,
  type Service,
  type Staff,
} from "@/data/bookedsolid/seed";
import "./bookedsolid.css";

type OwnerPage = "today" | "calendar" | "waitlist" | "clients" | "policies";
type BookingStep = "service" | "time" | "details" | "payment" | "confirmed";
type LocalAppointment = Appointment & { local?: boolean };

const pages: { id: OwnerPage; label: string; icon: typeof CalendarDays }[] = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "calendar", label: "Calendar", icon: Clock3 },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "clients", label: "Clients", icon: UserRound },
  { id: "policies", label: "Policies", icon: ShieldCheck },
];

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getDayName = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });

const getMonthName = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long" });

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(12, 0, 0, 0);
  return start;
};

function Avatar({ person, size = "md", className = "" }: { person: { name: string; initials?: string }; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = person.initials
    ? person.initials
    : person.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  return <span aria-label={person.name} className={`bs-avatar bs-avatar-${size} ${className}`}>{initials}</span>;
}

function Button({
  children,
  onClick,
  variant = "gold",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "gold" | "outline" | "dark" | "quiet";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`bs-button bs-button-${variant} ${className}`}>{children}</button>;
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const label = status === "no-show" ? "No-show" : status === "booked" ? "Booked" : status === "completed" ? "Completed" : status === "cancelled" ? "Cancelled" : "Confirmed";
  return <span className={`bs-status bs-status-${status}`}>{label}</span>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div>{eyebrow && <p className="bs-eyebrow">{eyebrow}</p>}<h1 className="bs-page-title">{title}</h1></div>{action}</div>;
}

function CurrencyCard({ label, value, note, icon: Icon, featured = false, trend }: { label: string; value: string; note: string; icon: typeof Wallet; featured?: boolean; trend?: string }) {
  return <div className={`bs-stat ${featured ? "bs-stat-featured" : ""}`}>
    <div className="flex items-start justify-between gap-3"><p className="text-[11px] font-medium text-white/55">{label}</p><span className={`grid h-8 w-8 place-items-center rounded-lg ${featured ? "bg-white/10 text-[#e2bd77]" : "bg-white/[.055] text-[#c2a36a]"}`}><Icon size={15} /></span></div>
    <p className="mt-4 text-[25px] font-semibold tracking-[-.045em] text-white">{value}</p>
    <div className="mt-2 flex items-center justify-between gap-2"><p className="text-[10px] text-white/40">{note}</p>{trend && <span className="text-[10px] font-semibold text-[#d3b678]">{trend}</span>}</div>
  </div>;
}

function StaffPhoto({ person, size = "lg" }: { person: Staff; size?: "md" | "lg" }) {
  return <div className={`bs-staff-photo bs-staff-photo-${size}`} style={{ "--person-tone": person.color } as React.CSSProperties}><span>{person.initials}</span><small>{person.name}</small></div>;
}

function PhonePreview({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bs-phone ${className}`}><div className="bs-phone-notch" /><div className="bs-phone-screen">{children}</div></div>;
}

function MessageBubble({ children, time, accent = false }: { children: ReactNode; time?: string; accent?: boolean }) {
  return <div className={`bs-message-row ${accent ? "justify-end" : ""}`}><div className={`bs-message ${accent ? "bs-message-out" : ""}`}>{children}{time && <span className="bs-message-time">{time}</span>}</div></div>;
}

function ReminderSequence({ clientName, service, staffName, date, time }: { clientName: string; service: Service; staffName: string; date: string; time: string }) {
  const firstName = clientName.trim().split(/\s+/)[0] || "there";
  const appointment = `${service.name} · ${getMonthName(date)} ${new Date(`${date}T12:00:00`).getDate()} at ${displayTime(time)}`;
  return <div className="bs-reminder-block">
    <div className="bs-reminder-title"><span className="bs-live-dot" /> YOUR AUTOMATIC REMINDERS <span className="ml-auto">SMS PREVIEW</span></div>
    <PhonePreview>
      <div className="bs-sms-header"><Avatar person={{ name: seedData.business.name, initials: "FG" }} size="sm" /><span><b>{seedData.business.name}</b><small>iMessage · Today</small></span></div>
      <MessageBubble time="now">You’re booked, {firstName}! ✨<br /><br />{appointment}<br />with {staffName}<br /><br />Your ${service.deposit} deposit is on file and goes toward your service. Need to make a change? Reply here.</MessageBubble>
      <p className="bs-reminder-label">24 HOURS BEFORE</p>
      <MessageBubble>Hey {firstName} — your {service.name.toLowerCase()} at Fade &amp; Glow is tomorrow at {displayTime(time)}. We can’t wait to see you! See you then?</MessageBubble>
      <p className="bs-reminder-label">2 HOURS BEFORE · CONFIRM / RESCHEDULE</p>
      <MessageBubble>We saved your chair, {firstName}. Confirm you’re on your way or let us know if you need to reschedule.</MessageBubble>
      <div className="bs-message-actions"><span>✓ Confirm</span><span>↗ Reschedule</span></div>
    </PhonePreview>
  </div>;
}

export default function BookedSolidApp() {
  const [mode, setMode] = useState<"owner" | "booking">("owner");
  const [ownerPage, setOwnerPage] = useState<OwnerPage>("today");
  const [appointments, setAppointments] = useState<LocalAppointment[]>(seedData.appointments);
  const [waitlist, setWaitlist] = useState(seedData.waitlist);
  const [cancelledAppointment, setCancelledAppointment] = useState<LocalAppointment | null>(null);
  const [waitlistAccepted, setWaitlistAccepted] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
  const [bookingStep, setBookingStep] = useState<BookingStep>("service");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("any");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [confirmedStaff, setConfirmedStaff] = useState<Staff | null>(null);

  const today = seedData.business.asOfDate;
  const todayAppointments = appointments.filter((appointment) => appointment.date === today && ["booked", "confirmed", "completed", "no-show"].includes(appointment.status))
    .sort((a, b) => a.time.localeCompare(b.time));
  const monthAppointments = appointments.filter((appointment) => appointment.date.slice(0, 7) === today.slice(0, 7));
  const monthDeposits = monthAppointments.filter((appointment) => appointment.depositPaid && appointment.status !== "cancelled")
    .reduce((sum, appointment) => sum + (seedData.services.find((service) => service.id === appointment.serviceId)?.deposit ?? 0), 0);
  const monthNoShows = monthAppointments.filter((appointment) => appointment.status === "no-show").length;
  const reminderProtectedRevenue = monthAppointments.filter((appointment) => appointment.reminderConfirmed && appointment.status !== "cancelled")
    .reduce((sum, appointment) => sum + (seedData.services.find((service) => service.id === appointment.serviceId)?.price ?? 0), 0);
  const protectedRevenue = monthDeposits + reminderProtectedRevenue;
  const selectedService = seedData.services.find((service) => service.id === serviceId) ?? null;
  const currentWeekStart = getWeekStart(addDays(new Date(`${today}T12:00:00`), calendarWeekOffset * 7));
  const calendarDays = Array.from({ length: 7 }, (_, index) => dateKey(addDays(currentWeekStart, index)));
  const sortedClients = useMemo(() => seedData.clients.map((client) => {
    const history = appointments.filter((appointment) => appointment.clientId === client.id && appointment.status !== "cancelled");
    const completed = history.filter((appointment) => appointment.status === "completed");
    const noShows = history.filter((appointment) => appointment.status === "no-show");
    const spent = completed.reduce((sum, appointment) => sum + (seedData.services.find((service) => service.id === appointment.serviceId)?.price ?? 0), 0);
    return { client, history, completed, noShows, spent };
  }).sort((a, b) => a.client.name.localeCompare(b.client.name)), [appointments]);
  const filteredClients = sortedClients.filter(({ client }) =>
    `${client.name} ${client.phone}`.toLowerCase().includes(clientSearch.trim().toLowerCase()));

  const chooseService = (service: Service) => {
    setServiceId(service.id);
    if (staffId !== "any" && !service.staffIds.includes(staffId)) setStaffId("any");
    setBookingDate("");
    setBookingTime("");
    setBookingStep("time");
  };

  const bookingSlots = (date: string) => {
    if (!selectedService) return [];
    const dayName = getDayName(date);
    const candidates = staffId === "any"
      ? seedData.staff.filter((member) => selectedService.staffIds.includes(member.id))
      : seedData.staff.filter((member) => member.id === staffId && selectedService.staffIds.includes(member.id));
    const slots = new Set<string>();
    for (const member of candidates) {
      const shift = member.workingHours[dayName];
      if (!shift) continue;
      const start = timeToMinutes(shift.start);
      const end = timeToMinutes(shift.end);
      const busy = appointments.filter((appointment) => appointment.date === date && appointment.staffId === member.id && ["booked", "confirmed"].includes(appointment.status))
        .map((appointment) => {
          const appointmentService = seedData.services.find((service) => service.id === appointment.serviceId);
          const from = timeToMinutes(appointment.time);
          return { from, to: from + (appointmentService?.durationMinutes ?? 30) };
        });
      for (let minute = Math.ceil(start / 30) * 30; minute + selectedService.durationMinutes <= end; minute += 30) {
        if (busy.every((slot) => minute + selectedService.durationMinutes <= slot.from || minute >= slot.to)) slots.add(minutesToTime(minute));
      }
    }
    return [...slots].sort();
  };

  const availableDates = Array.from({ length: 7 }, (_, index) => dateKey(addDays(new Date(`${today}T12:00:00`), index)))
    .filter((date) => getDayName(date) !== "Sunday");
  const availableStaffForSlot = (date: string, time: string) => {
    if (!selectedService) return [];
    const start = timeToMinutes(time);
    return seedData.staff.filter((member) => {
      if (!selectedService.staffIds.includes(member.id)) return false;
      const shift = member.workingHours[getDayName(date)];
      if (!shift || start < timeToMinutes(shift.start) || start + selectedService.durationMinutes > timeToMinutes(shift.end)) return false;
      return appointments.filter((appointment) => appointment.date === date && appointment.staffId === member.id && ["booked", "confirmed"].includes(appointment.status))
        .every((appointment) => {
          const busyStart = timeToMinutes(appointment.time);
          const busyEnd = busyStart + (seedData.services.find((item) => item.id === appointment.serviceId)?.durationMinutes ?? 30);
          return start + selectedService.durationMinutes <= busyStart || start >= busyEnd;
        });
    });
  };
  const availableStaffForBooking = bookingDate && bookingTime ? availableStaffForSlot(bookingDate, bookingTime) : [];
  const actualBookingStaff = staffId === "any"
    ? availableStaffForBooking[0] ?? null
    : availableStaffForBooking.find((member) => member.id === staffId) ?? null;

  const submitClientDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError("");
    if (!clientName.trim() || clientPhone.replace(/\D/g, "").length < 10) {
      setBookingError("Enter your name and a valid phone number to continue.");
      return;
    }
    if (!actualBookingStaff) {
      setBookingError("That time was just booked. Choose another available time.");
      return;
    }
    setBookingStep("payment");
  };

  const completeBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService || !bookingDate || !bookingTime || !actualBookingStaff) return;
    setConfirmedStaff(actualBookingStaff);
    const existing = seedData.clients.find((client) => client.phone.replace(/\D/g, "") === clientPhone.replace(/\D/g, ""));
    const clientId = existing?.id ?? `walk-in-${Date.now()}`;
    if (!existing) {
      const localClient: Client = {
        id: clientId,
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: "",
        notes: "Created during local demo booking.",
        preferredStaffId: actualBookingStaff.id,
      };
      setWalkInClients((items) => [...items, localClient]);
    }
    setAppointments((items) => [...items, {
      id: `booking-${Date.now()}`,
      clientId,
      serviceId: selectedService.id,
      staffId: actualBookingStaff.id,
      date: bookingDate,
      time: bookingTime,
      status: "confirmed",
      depositPaid: true,
      reminderConfirmed: false,
      source: "online",
      local: true,
    }]);
    setBookingStep("confirmed");
  };

  const [walkInClients, setWalkInClients] = useState<Client[]>([]);
  const allClients = [...seedData.clients, ...walkInClients];
  const getClient = (clientId: string) => allClients.find((client) => client.id === clientId) ?? seedData.clients[0];
  const getService = (id: string) => seedData.services.find((service) => service.id === id) ?? seedData.services[0];
  const getStaff = (id: string) => seedData.staff.find((member) => member.id === id) ?? seedData.staff[0];

  const simulateCancellation = () => {
    if (cancelledAppointment) return;
    const nextSaturday = availableDates.concat(dateKey(addDays(new Date(`${today}T12:00:00`), 7)))
      .find((date) => getDayName(date) === "Saturday");
    const firstWaiting = waitlist[0];
    if (!nextSaturday || !firstWaiting) return;
    const candidate = appointments.find((appointment) =>
      appointment.date === nextSaturday &&
      appointment.status !== "cancelled" &&
      appointment.serviceId === firstWaiting.serviceId &&
      (!firstWaiting.preferredStaffId || appointment.staffId === firstWaiting.preferredStaffId));
    if (!candidate) return;
    setAppointments((items) => items.map((item) => item.id === candidate.id ? { ...item, status: "cancelled", depositPaid: false } : item));
    setCancelledAppointment(candidate);
    setWaitlistAccepted(false);
  };

  const acceptWaitlistOffer = () => {
    if (!cancelledAppointment || !waitlist[0]) return;
    const firstWaiting = waitlist[0];
    setAppointments((items) => [...items, {
      ...cancelledAppointment,
      id: `waitlist-fill-${Date.now()}`,
      clientId: firstWaiting.clientId,
      serviceId: firstWaiting.serviceId,
      status: "confirmed",
      depositPaid: true,
      reminderConfirmed: true,
      source: "waitlist",
      local: true,
    }]);
    setWaitlist((items) => items.slice(1));
    setWaitlistAccepted(true);
  };

  const renderBooking = () => {
    const studioStaff = selectedService
      ? seedData.staff.filter((member) => selectedService.staffIds.includes(member.id))
      : seedData.staff;
    const chosenDate = bookingDate || availableDates[0] || today;
    const resetBooking = () => {
      setBookingStep("service");
      setServiceId("");
      setStaffId("any");
      setBookingDate("");
      setBookingTime("");
      setClientName("");
      setClientPhone("");
      setBookingError("");
      setConfirmedStaff(null);
    };

    return <div className="bs-booking-mode">
      <div className="bs-mobile-toolbar">
        <button type="button" className="bs-back-to-owner" onClick={() => setMode("owner")}><ArrowLeft size={15} /> Owner view</button>
        <span><span className="bs-live-dot" /> LIVE PREVIEW</span>
      </div>
      <div className="bs-booking-frame">
        <div className="bs-booking-side">
          <div className="bs-booking-brand"><span className="bs-brand-symbol"><Scissors size={21} /></span><span>FADE <i>&amp;</i> GLOW<small>STUDIO · CHICAGO, IL</small></span></div>
          <p className="bs-booking-tagline">{seedData.business.tagline}</p>
          <div className="bs-booking-photo"><div className="bs-photo-art"><span>F<span>&amp;</span>G</span><small>YOUR CHAIR IS WAITING</small></div></div>
          <div className="bs-booking-location"><Sparkles size={14} /><span>{seedData.business.location}</span></div>
          <div className="bs-booking-trust"><Star size={14} fill="currentColor" /><b>4.9</b><span>— your neighborhood’s good cut</span></div>
        </div>
        <div className="bs-booking-main">
          {bookingStep !== "confirmed" && <div className="bs-booking-progress">
            {(["service", "time", "details", "payment"] as BookingStep[]).map((step, index) => (
              <span key={step} className={`bs-step-dot ${bookingStep === step ? "active" : ""}`}>
                <i>{index + 1}</i><small>{["SERVICE", "TIME", "YOU", "DEPOSIT"][index]}</small>
              </span>
            ))}
          </div>}
          {bookingStep === "service" && <div className="bs-booking-stage">
            <p className="bs-eyebrow">YOUR RESET STARTS HERE</p><h1 className="bs-booking-title">Book your<br /><em>moment.</em></h1>
            <p className="bs-booking-intro">Good people. Great work. Your time, respected.</p>
            <div className="bs-category-label"><span>THE BARBER CHAIR</span><i /></div>
            <div className="bs-service-list">{seedData.services.filter((service) => service.category === "Barbering").map((service) => <button key={service.id} type="button" className="bs-service-option" onClick={() => chooseService(service)}><span><b>{service.name}</b><small>{service.durationMinutes} min · ${service.deposit} deposit</small></span><strong>{formatMoney(service.price)}</strong><ChevronRight size={15} /></button>)}</div>
            <div className="bs-category-label mt-6"><span>THE BEAUTY BAR</span><i /></div>
            <div className="bs-service-list">{seedData.services.filter((service) => service.category === "Beauty").map((service) => <button key={service.id} type="button" className="bs-service-option" onClick={() => chooseService(service)}><span><b>{service.name}</b><small>{service.durationMinutes} min · ${service.deposit} deposit</small></span><strong>{formatMoney(service.price)}</strong><ChevronRight size={15} /></button>)}</div>
            <div className="bs-booking-footnote"><ShieldCheck size={14} /> A small deposit reserves your time and goes toward your service.</div>
          </div>}
          {bookingStep === "time" && selectedService && <div className="bs-booking-stage">
            <button type="button" className="bs-inline-back" onClick={() => setBookingStep("service")}><ArrowLeft size={14} /> SERVICES</button>
            <p className="bs-eyebrow mt-6">PICK YOUR TIME</p><h1 className="bs-booking-title">Make it<br /><em>your time.</em></h1>
            <div className="bs-selection-summary"><span><Scissors size={15} /> {selectedService.name} · {selectedService.durationMinutes} min</span><b>{formatMoney(selectedService.price)}</b></div>
            <label className="bs-field-label">YOUR ARTIST</label>
            <div className="bs-picker-staff">
              <button type="button" onClick={() => setStaffId("any")} className={`bs-staff-choice ${staffId === "any" ? "selected" : ""}`}><span className="bs-first-available"><Sparkles size={16} /></span><span><b>First available</b><small>Earliest open chair</small></span>{staffId === "any" && <Check size={15} />}</button>
              {studioStaff.map((member) => <button type="button" key={member.id} onClick={() => setStaffId(member.id)} className={`bs-staff-choice ${staffId === member.id ? "selected" : ""}`}><StaffPhoto person={member} size="md" /><span><b>{member.name}</b><small>{member.role}</small></span>{staffId === member.id && <Check size={15} />}</button>)}
            </div>
            <label className="bs-field-label mt-6">CHOOSE A DAY</label>
            <div className="bs-date-strip">{availableDates.map((date) => {
              const dateObject = new Date(`${date}T12:00:00`);
              return <button type="button" key={date} onClick={() => { setBookingDate(date); setBookingTime(""); }} className={`bs-date-chip ${chosenDate === date ? "selected" : ""}`}><small>{dateObject.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</small><b>{dateObject.getDate()}</b><small>{dateObject.toLocaleDateString("en-US", { month: "short" })}</small></button>;
            })}</div>
            <label className="bs-field-label mt-6">AVAILABLE TIMES · {getDayName(chosenDate).toUpperCase()}</label>
            <div className="bs-time-grid">{bookingSlots(chosenDate).map((slot) => <button type="button" key={slot} onClick={() => setBookingTime(slot)} className={`bs-time-chip ${bookingTime === slot ? "selected" : ""}`}>{displayTime(slot)}</button>)}{bookingSlots(chosenDate).length === 0 && <p className="bs-no-slots">No openings left this day. Try another date.</p>}</div>
            <Button className="mt-7 w-full" disabled={!bookingTime} onClick={() => { setBookingError(""); setBookingStep("details"); }}>Continue <ArrowRight size={15} /></Button>
          </div>}
          {bookingStep === "details" && selectedService && <div className="bs-booking-stage">
            <button type="button" className="bs-inline-back" onClick={() => setBookingStep("time")}><ArrowLeft size={14} /> CHANGE TIME</button>
            <p className="bs-eyebrow mt-6">ALMOST THERE</p><h1 className="bs-booking-title">Who are<br /><em>we saving it for?</em></h1>
            <div className="bs-selection-summary"><span><CalendarDays size={15} /> {formatLongDate(bookingDate)} · {displayTime(bookingTime)}</span><b>{selectedService.name}</b></div>
            <form onSubmit={submitClientDetails} className="bs-form-stack">
              <label className="bs-form-field">YOUR NAME<input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="First and last name" autoComplete="name" required /></label>
              <label className="bs-form-field">MOBILE NUMBER<input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} placeholder="(312) 555-0123" type="tel" autoComplete="tel" required /></label>
              <p className="bs-privacy-note"><ShieldCheck size={14} /> Your number is only used for appointment reminders.</p>
              {bookingError && <p className="bs-error" role="alert">{bookingError}</p>}
              <Button type="submit" className="w-full">Continue to deposit <ArrowRight size={15} /></Button>
            </form>
          </div>}
          {bookingStep === "payment" && selectedService && <div className="bs-booking-stage">
            <button type="button" className="bs-inline-back" onClick={() => setBookingStep("details")}><ArrowLeft size={14} /> BACK</button>
            <p className="bs-eyebrow mt-6">SECURE YOUR SPOT</p><h1 className="bs-booking-title">One small<br /><em>commitment.</em></h1>
            <div className="bs-deposit-card"><div><small>DEPOSIT TO HOLD YOUR SPOT</small><p>{formatMoney(selectedService.deposit)}</p><span>Applied to your service · {formatMoney(selectedService.price)} total</span></div><span className="bs-card-mark"><CreditCard size={22} /></span></div>
            <form onSubmit={completeBooking} className="bs-form-stack">
              <label className="bs-form-field">NAME ON CARD<input placeholder="Cardholder name" required /></label>
              <label className="bs-form-field">CARD NUMBER<input inputMode="numeric" placeholder="4242 4242 4242 4242" minLength={12} required /></label>
              <div className="grid grid-cols-2 gap-3"><label className="bs-form-field">EXPIRY<input placeholder="MM / YY" required /></label><label className="bs-form-field">CVC<input inputMode="numeric" placeholder="123" required /></label></div>
              <p className="bs-mock-payment"><ShieldCheck size={14} /> Demo only — no card details are saved or charged.</p>
              <Button type="submit" className="w-full"><CreditCard size={15} /> Pay {formatMoney(selectedService.deposit)} deposit</Button>
            </form>
          </div>}
          {bookingStep === "confirmed" && selectedService && confirmedStaff && <div className="bs-booking-stage bs-confirmed-stage">
            <span className="bs-confirm-check"><CheckCircle2 size={26} /></span><p className="bs-eyebrow mt-5">YOU’RE ON THE BOOKS</p><h1 className="bs-booking-title">That’s a<br /><em>good look, {clientName.trim().split(/\s+/)[0]}.</em></h1>
            <div className="bs-confirm-card"><div><span>{formatLongDate(bookingDate)}</span><b>{displayTime(bookingTime)}</b></div><div><span>{selectedService.name} · {selectedService.durationMinutes} min</span><b>with {confirmedStaff.name}</b></div><div><span>Deposit paid</span><b>{formatMoney(selectedService.deposit)} · applied to service</b></div></div>
            <ReminderSequence clientName={clientName} service={selectedService} staffName={confirmedStaff.name} date={bookingDate} time={bookingTime} />
            <Button variant="outline" className="mt-6 w-full" onClick={resetBooking}>Book another visit</Button>
          </div>}
        </div>
      </div>
    </div>;
  };

  return <div className="bs-root">
    <div className="bs-demo-banner"><span className="bs-banner-dot" /> DEMO <span className="mx-2 opacity-35">/</span> Sample data for illustration</div>
    {mode === "booking" ? renderBooking() : <div className="bs-owner-shell">
      <aside className="bs-sidebar">
        <button type="button" className="bs-owner-brand" onClick={() => setOwnerPage("today")}><span className="bs-owner-mark"><Scissors size={19} /></span><span>BOOKED<span>SOLID</span><small>STUDIO MANAGER</small></span></button>
        <div className="bs-nav-caption">YOUR STUDIO</div>
        <nav className="bs-owner-nav" aria-label="Owner navigation">{pages.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setOwnerPage(id)} className={`bs-nav-link ${ownerPage === id ? "active" : ""}`}><Icon size={16} /><span>{label}</span>{id === "waitlist" && waitlist.length > 0 && <i>{waitlist.length}</i>}</button>)}</nav>
        <div className="bs-sidebar-spacer" />
        <div className="bs-sidebar-tip"><span><Crown size={15} /></span><p>More showing up.<br /><b>Less money left behind.</b></p><small>A calmer way to run your chair.</small></div>
        <div className="bs-sidebar-profile"><span className="bs-brand-seal">FG</span><span><b>Fade &amp; Glow Studio</b><small>Chicago, Illinois</small></span><ChevronDown size={14} /></div>
      </aside>
      <div className="bs-owner-main">
        <header className="bs-owner-topbar"><div className="bs-topbar-title"><span className="bs-live-dot" /> LIVE DEMO <span className="bs-topbar-divider">/</span> FADE &amp; GLOW STUDIO</div><div className="bs-topbar-right"><span className="bs-preview-label">SAMPLE WORKSPACE</span><Button variant="outline" className="bs-preview-button" onClick={() => { resetBookingToStart(); setMode("booking"); }}><ArrowDownLeft size={14} /> Preview booking page <ArrowRight size={13} /></Button></div></header>
        <main className="bs-owner-content">
          {ownerPage === "today" && <section>
            <SectionHeading eyebrow={formatLongDate(today)} title="Today at the studio" action={<Button onClick={() => { resetBookingToStart(); setMode("booking"); }}><Sparkles size={14} /> New booking</Button>} />
            <div className="bs-stats-grid">
              <CurrencyCard label="Appointments today" value={String(todayAppointments.length)} note={`${todayAppointments.filter((item) => ["booked", "confirmed"].includes(item.status)).length} still to come`} icon={CalendarDays} />
              <CurrencyCard label="Deposits this month" value={formatMoney(monthDeposits)} note={`${monthAppointments.filter((item) => item.depositPaid && item.status !== "cancelled").length} deposits collected`} icon={Wallet} />
              <CurrencyCard label="No-shows this month" value={String(monthNoShows)} note="Every empty chair costs you" icon={UserRound} trend={monthNoShows > 0 ? `−${formatMoney(monthAppointments.filter((item) => item.status === "no-show").reduce((sum, item) => sum + (getService(item.serviceId).price - (item.depositPaid ? getService(item.serviceId).deposit : 0)), 0))} at menu price` : undefined} />
              <CurrencyCard label="Revenue protected this month" value={formatMoney(protectedRevenue)} note={`${formatMoney(monthDeposits)} deposits + ${formatMoney(reminderProtectedRevenue)} reminder-confirmed visits`} icon={ShieldCheck} featured trend="Built from your bookings" />
            </div>
            <div className="bs-today-layout">
              <section className="bs-card bs-appointments-card">
                <div className="bs-card-heading"><div><p className="bs-eyebrow">YOUR FLOOR, AT A GLANCE</p><h2>Today’s appointments <span>{todayAppointments.length}</span></h2></div><button type="button" onClick={() => setOwnerPage("calendar")}>Full calendar <ArrowRight size={13} /></button></div>
                <div className="bs-appointment-list">{todayAppointments.length ? todayAppointments.map((appointment) => {
                  const client = getClient(appointment.clientId);
                  const service = getService(appointment.serviceId);
                  const artist = getStaff(appointment.staffId);
                  return <div key={appointment.id} className="bs-appointment-row"><span className="bs-appt-time">{displayTime(appointment.time)}</span><Avatar person={client} size="sm" /><div className="bs-appt-client"><b>{client.name}</b><small>{service.name} · {service.durationMinutes} min</small></div><div className="bs-appt-artist"><span style={{ backgroundColor: artist.color }} />{artist.name.split(" ")[0]}</div><span className="bs-appt-price">{formatMoney(service.price)}</span><StatusBadge status={appointment.status} /></div>;
                }) : <div className="bs-empty-state"><CalendarDays size={22} /><p>A little breathing room today.</p><span>New bookings will show up here.</span></div>}</div>
                <div className="bs-list-footer"><span><span className="bs-live-dot" /> Your schedule is looking good</span><button type="button" onClick={() => setOwnerPage("calendar")}>View week <ChevronRight size={13} /></button></div>
              </section>
              <div className="bs-today-aside">
                <section className="bs-card bs-artist-card"><div className="bs-card-heading"><div><p className="bs-eyebrow">ON THE FLOOR</p><h2>Your artists</h2></div><span className="bs-small-count">{seedData.staff.length} PEOPLE</span></div>
                  {seedData.staff.map((member) => {
                    const count = todayAppointments.filter((appointment) => appointment.staffId === member.id && ["booked", "confirmed"].includes(appointment.status)).length;
                    return <div className="bs-artist-row" key={member.id}><StaffPhoto person={member} size="md" /><span><b>{member.name}</b><small>{member.role}</small></span><i>{count} {count === 1 ? "visit" : "visits"}</i></div>;
                  })}
                  <div className="bs-shift-foot"><Clock3 size={13} /> Shop hours follow each artist’s schedule</div>
                </section>
                <section className="bs-revenue-note"><div className="bs-revenue-note-icon"><ShieldCheck size={17} /></div><div><b>Empty chairs, meet empty lists.</b><p>Reminders and your waitlist help turn a last-minute cancellation into your next filled appointment.</p></div></section>
              </div>
            </div>
          </section>}

          {ownerPage === "calendar" && <section>
            <SectionHeading eyebrow="THE WHOLE STUDIO · ONE VIEW" title="Appointment calendar" action={<Button onClick={() => { resetBookingToStart(); setMode("booking"); }}><Sparkles size={14} /> New booking</Button>} />
            <div className="bs-card bs-calendar-card">
              <div className="bs-calendar-toolbar"><div><p>{calendarDays[0].slice(0, 4) === calendarDays[6].slice(0, 4) ? new Date(`${calendarDays[0]}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : `${getMonthName(calendarDays[0])} – ${getMonthName(calendarDays[6])}`}</p><span>One week, every chair.</span></div><div className="bs-calendar-controls"><button type="button" aria-label="Previous week" onClick={() => setCalendarWeekOffset((offset) => offset - 1)}><ChevronLeft size={16} /></button><button type="button" onClick={() => setCalendarWeekOffset(0)}>Today</button><button type="button" aria-label="Next week" onClick={() => setCalendarWeekOffset((offset) => offset + 1)}><ChevronRight size={16} /></button></div></div>
              <div className="bs-calendar-legend">{(["confirmed", "booked", "completed", "no-show"] as Appointment["status"][]).map((status) => <span key={status}><i className={`bs-legend-${status}`} />{status === "no-show" ? "No-show" : status[0].toUpperCase() + status.slice(1)}</span>)}</div>
              <div className="bs-calendar-scroll"><div className="bs-calendar-grid">
                <div className="bs-calendar-corner">STUDIO</div>
                {calendarDays.map((date) => {
                  const dateObj = new Date(`${date}T12:00:00`);
                  return <div key={date} className={`bs-calendar-day ${date === today ? "is-today" : ""}`}><small>{dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</small><b>{dateObj.getDate()}</b></div>;
                })}
                {seedData.staff.map((member) => <div key={member.id} className="bs-staff-calendar-row"><div className="bs-staff-calendar-label"><Avatar person={member} size="sm" /><span><b>{member.name}</b><small>{member.role}</small></span></div>{calendarDays.map((date) => {
                  const items = appointments.filter((appointment) => appointment.date === date && appointment.staffId === member.id && appointment.status !== "cancelled").sort((a, b) => a.time.localeCompare(b.time));
                  return <div className="bs-calendar-cell" key={date}>{items.map((appointment) => <div key={appointment.id} className={`bs-calendar-event event-${appointment.status}`}><b>{displayTime(appointment.time)}</b><span>{getClient(appointment.clientId).name.split(" ")[0]}</span><small>{getService(appointment.serviceId).name}</small></div>)}</div>;
                })}</div>)}
              </div></div>
              <div className="bs-calendar-footer"><span>{appointments.filter((appointment) => calendarDays.includes(appointment.date) && appointment.status !== "cancelled").length} appointments this week</span><span>Times shown in Central Time</span></div>
            </div>
          </section>}

          {ownerPage === "waitlist" && <section>
            <SectionHeading eyebrow="FILL THE GAP, NOT JUST THE CALENDAR" title="Your Saturday waitlist" action={<span className="bs-waiting-pill"><span /> {waitlist.length} clients waiting</span>} />
            <div className="bs-waitlist-intro"><div className="bs-waitlist-copy"><span className="bs-waitlist-icon"><Clock3 size={19} /></span><div><h2>Saturday spots go fast.</h2><p>When an appointment opens up, offer it to the next client in line. One tap. One chair refilled.</p></div></div><Button onClick={simulateCancellation} disabled={Boolean(cancelledAppointment)}><Sparkles size={14} /> {cancelledAppointment ? "Cancellation simulated" : "Simulate a cancellation"}</Button></div>
            {cancelledAppointment && <div className={`bs-offer-flow ${waitlistAccepted ? "accepted" : ""}`}><div className="bs-flow-step"><span className="bs-flow-num">01</span><span><small>CANCELLATION</small><b>{displayTime(cancelledAppointment.time)} spot just opened</b></span><span className="bs-flow-check"><Check size={15} /></span></div><div className="bs-flow-connector" /><div className="bs-flow-step"><span className="bs-flow-num">02</span><span><small>OFFER SENT · SMS</small><b>{getClient(waitlist[0]?.clientId ?? "client-031").name} gets first dibs</b></span><span className="bs-flow-check"><Check size={15} /></span></div>
              <PhonePreview className="bs-waitlist-phone"><div className="bs-sms-header"><Avatar person={{ name: seedData.business.name, initials: "FG" }} size="sm" /><span><b>Fade &amp; Glow Studio</b><small>Text Message · now</small></span></div><MessageBubble>Hey {getClient(waitlistAccepted ? seedData.waitlist[0].clientId : waitlist[0]?.clientId ?? "client-031").name.split(" ")[0]}! A {displayTime(cancelledAppointment.time)} spot just opened this Saturday with {getStaff(cancelledAppointment.staffId).name} for a {getService(cancelledAppointment.serviceId).name}. Want us to save it for you?</MessageBubble><MessageBubble accent time={waitlistAccepted ? "just now" : "waiting"}>{waitlistAccepted ? "Yes! I’ll take it 🙌" : "YES — CLAIM MY SPOT"}</MessageBubble>
                {!waitlistAccepted && <button type="button" onClick={acceptWaitlistOffer} className="bs-accept-offer">Accept offer <ArrowRight size={14} /></button>}
                {waitlistAccepted && <p className="bs-offer-success"><CheckCircle2 size={15} /> Accepted! The spot is filled and confirmed.</p>}</PhonePreview>
              <div className="bs-flow-connector" /><div className="bs-flow-step"><span className="bs-flow-num">03</span><span><small>CALENDAR REFILLED</small><b>{waitlistAccepted ? "Appointment confirmed · deposit secured" : "Accept the offer to refill the slot"}</b></span><span className={waitlistAccepted ? "bs-flow-check" : "bs-flow-pending"}>{waitlistAccepted ? <Check size={15} /> : <Clock3 size={14} />}</span></div></div>}
            <div className="bs-card bs-waitlist-card"><div className="bs-card-heading"><div><p className="bs-eyebrow">NEXT UP FOR A SATURDAY SPOT</p><h2>Waiting list <span>{waitlist.length}</span></h2></div><span className="bs-small-count">OFFER IN ORDER</span></div>
              {waitlist.length ? waitlist.map((entry, index) => {
                const client = getClient(entry.clientId);
                const service = getService(entry.serviceId);
                return <div className="bs-waitlist-row" key={entry.id}><span className="bs-waitlist-rank">{String(index + 1).padStart(2, "0")}</span><Avatar person={client} /><span className="bs-waitlist-client"><b>{client.name}</b><small>{client.phone}</small></span><span className="bs-waitlist-service"><b>{service.name}</b><small>{entry.preferredStaffId ? `Prefers ${getStaff(entry.preferredStaffId).name}` : "First available"}</small></span><span className="bs-waitlist-request"><CalendarDays size={14} /> Saturday</span><span className="bs-waitlist-priority">{index === 0 ? "NEXT OFFER" : "IN LINE"}</span></div>;
              }) : <div className="bs-empty-state"><CheckCircle2 size={22} /><p>All caught up.</p><span>Everyone on the waitlist has been offered a slot.</span></div>}
              <div className="bs-waitlist-bottom"><ShieldCheck size={15} /> Clients join the list when their preferred day or artist is fully booked.</div>
            </div>
          </section>}

          {ownerPage === "clients" && <section>
            <SectionHeading eyebrow="YOUR COMMUNITY, REMEMBERED" title="Clients" action={<span className="bs-total-clients"><Users size={15} /> {sortedClients.length} clients</span>} />
            <div className="bs-client-alert"><span><ShieldCheck size={16} /></span><p><b>Repeat no-shows are automatically set to prepay in full.</b><small>Clients with 2 or more missed appointments are flagged before they book again. A little protection for your time and team.</small></p></div>
            <div className="bs-card bs-clients-card"><div className="bs-client-toolbar"><label className="bs-client-search"><span>⌕</span><input value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} placeholder="Find a client by name or phone" /></label><span>SHOWING {filteredClients.length} OF {sortedClients.length}</span></div>
              <div className="bs-clients-table-wrap"><table className="bs-clients-table"><thead><tr><th>CLIENT</th><th>VISITS</th><th>TOTAL SPENT</th><th>NO-SHOWS</th><th>STATUS</th></tr></thead><tbody>{filteredClients.map(({ client, completed, noShows, spent }) => {
                const flagged = noShows.length >= 2;
                return <tr key={client.id}><td><div className="bs-client-cell"><Avatar person={client} size="sm" /><span><b>{client.name}</b><small>{client.phone}</small></span></div></td><td>{completed.length}</td><td>{formatMoney(spent)}</td><td className={flagged ? "bs-red-number" : ""}>{noShows.length}</td><td>{flagged ? <span className="bs-repeat-flag"><span /> Repeat no-show · full prepay</span> : <span className="bs-good-standing">Good standing</span>}</td></tr>;
              })}{filteredClients.length === 0 && <tr><td colSpan={5} className="bs-no-results">No clients match that search.</td></tr>}</tbody></table></div>
              <div className="bs-clients-footer"><span>Visit and spend totals reflect completed appointments in this sample.</span><span>Sample client data · not real customer records</span></div>
            </div>
          </section>}

          {ownerPage === "policies" && <section>
            <SectionHeading eyebrow="CLEAR EXPECTATIONS, BETTER SHOW RATES" title="Policies & deposits" action={<span className="bs-policy-static"><ShieldCheck size={14} /> DISPLAY ONLY · SAMPLE POLICY</span>} />
            <div className="bs-policy-grid"><div className="bs-card bs-policy-card"><span className="bs-policy-icon"><CalendarDays size={18} /></span><p className="bs-eyebrow mt-4">CANCELLATIONS & RESCHEDULING</p><h2>Give your time a little respect.</h2><p>{seedData.business.cancellationPolicy}</p><div className="bs-policy-meta"><CheckCircle2 size={14} /> Deposit transfers when clients reschedule 24+ hours ahead.</div></div><div className="bs-card bs-policy-card bs-policy-card-gold"><span className="bs-policy-icon"><ShieldCheck size={18} /></span><p className="bs-eyebrow mt-4">MISSED APPOINTMENTS</p><h2>Protect the chair.</h2><p>{seedData.business.noShowPolicy}</p><div className="bs-policy-meta"><Crown size={14} /> Repeat no-shows are automatically flagged for full prepayment.</div></div></div>
            <div className="bs-card bs-deposit-table-card"><div className="bs-card-heading"><div><p className="bs-eyebrow">SET BY SERVICE · INCLUDED IN YOUR PRICE</p><h2>Booking deposits <span>{seedData.services.length} services</span></h2></div><span className="bs-small-count">SAMPLE SETTINGS</span></div><div className="bs-deposit-table-wrap"><table className="bs-deposit-table"><thead><tr><th>SERVICE</th><th>TIME</th><th>PRICE</th><th>DEPOSIT TO BOOK</th><th>REMAINDER AT VISIT</th></tr></thead><tbody>{seedData.services.map((service) => <tr key={service.id}><td><span className="bs-service-table-name">{service.category === "Beauty" ? <Sparkles size={14} /> : <Scissors size={14} />}{service.name}</span></td><td>{service.durationMinutes} min</td><td>{formatMoney(service.price)}</td><td><span className="bs-deposit-pill">{formatMoney(service.deposit)}</span></td><td>{formatMoney(service.price - service.deposit)}</td></tr>)}</tbody></table></div><div className="bs-policy-table-note"><CreditCard size={14} /> Deposits are applied to the service total. Mock payment is not processed.</div></div>
            <div className="bs-policy-disclaimer">Demo illustration only · Confirm your final booking, cancellation, refund, and payment policies with your business and payment provider.</div>
          </section>}
        </main>
        <footer className="bs-owner-footer"><span><span className="bs-brand-seal">FG</span> Fade &amp; Glow Studio <i>·</i> BookedSolid demo</span><span>Fictional data for illustration only</span></footer>
      </div>
    </div>}
  </div>;

  function resetBookingToStart() {
    setBookingStep("service");
    setServiceId("");
    setStaffId("any");
    setBookingDate("");
    setBookingTime("");
    setClientName("");
    setClientPhone("");
    setBookingError("");
  }
}
