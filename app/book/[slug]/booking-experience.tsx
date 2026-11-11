"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  addDays,
  displayTime,
  formatDate,
  formatMoney,
  timeToMinutes,
  weekdayName,
  type Appointment,
  type FusionBookBusiness,
} from "@/data/fusionbook/seed";
import "../../fusionbook/fusionbook.css";

type BookingStep = "service" | "time" | "details" | "deposit" | "confirmed";
type AvailableSlot = { time: string; staffId: string };

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function BookingExperience({ business }: { business: FusionBookBusiness }) {
  const [step, setStep] = useState<BookingStep>("service");
  const [serviceId, setServiceId] = useState("");
  const [staffChoice, setStaffChoice] = useState("any");
  const [bookingDate, setBookingDate] = useState("");
  const [slot, setSlot] = useState<AvailableSlot | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [bookedStaffId, setBookedStaffId] = useState("");
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(business.appointments);

  const theme = {
    "--fb-accent": business.branding.accent,
    "--fb-accent-soft": business.branding.accentSoft,
    "--fb-primary": business.branding.primary,
  } as CSSProperties;
  const selectedService = business.services.find((service) => service.id === serviceId);
  const confirmationStaff = business.staff.find((member) => member.id === bookedStaffId);
  const bookingDates = useMemo(() => Array.from({ length: 14 }, (_, index) => addDays(business.asOfDate, index + 1))
    .filter((date) => business.staff.some((member) => member.workingHours[weekdayName(date)]))
    .slice(0, 7), [business]);

  const getSlots = (date: string): AvailableSlot[] => {
    if (!selectedService || !date) return [];
    const candidates = staffChoice === "any"
      ? business.staff.filter((member) => selectedService.staffIds.includes(member.id))
      : business.staff.filter((member) => member.id === staffChoice && selectedService.staffIds.includes(member.id));
    const weekday = weekdayName(date);
    const occupied = localAppointments.filter((appointment) =>
      appointment.date === date &&
      ["booked", "confirmed"].includes(appointment.status));
    const slots: AvailableSlot[] = [];

    candidates.forEach((member) => {
      const shift = member.workingHours[weekday];
      if (!shift) return;
      const start = timeToMinutes(shift.start);
      const end = timeToMinutes(shift.end);
      for (let time = Math.ceil(start / 30) * 30; time + selectedService.durationMinutes <= end; time += 30) {
        const conflict = occupied.some((appointment) => {
          if (appointment.staffId !== member.id) return false;
          const existingService = business.services.find((service) => service.id === appointment.serviceId);
          const bookedStart = timeToMinutes(appointment.time);
          const bookedEnd = bookedStart + (existingService?.durationMinutes ?? 30);
          return time < bookedEnd && time + selectedService.durationMinutes > bookedStart;
        });
        if (!conflict) slots.push({
          time: `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`,
          staffId: member.id,
        });
      }
    });

    return slots.sort((left, right) => left.time.localeCompare(right.time) || left.staffId.localeCompare(right.staffId));
  };

  const currentSlots = getSlots(bookingDate);
  const chooseService = (id: string) => {
    setServiceId(id);
    setStaffChoice("any");
    setBookingDate("");
    setSlot(null);
    setFormError("");
    setStep("time");
  };

  const submitClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!clientName.trim() || clientPhone.replace(/\D/g, "").length < 10) {
      setFormError("Enter your name and a valid phone number to continue.");
      return;
    }
    if (!slot || !currentSlots.some((available) => available.time === slot.time && available.staffId === slot.staffId)) {
      setFormError("That time is no longer available. Please choose another opening.");
      setStep("time");
      return;
    }
    setStep("deposit");
  };

  const completeBooking = () => {
    if (!selectedService || !slot) return;
    const staff = business.staff.find((member) => member.id === slot.staffId);
    if (!staff || !getSlots(bookingDate).some((available) => available.time === slot.time && available.staffId === slot.staffId)) {
      setFormError("That time is no longer available. Please choose another opening.");
      setStep("time");
      return;
    }
    setBookedStaffId(staff.id);
    setLocalAppointments((items) => [...items, {
      id: `local-booking-${Date.now()}`,
      clientId: "local-booking-client",
      serviceId: selectedService.id,
      staffId: staff.id,
      date: bookingDate,
      time: slot.time,
      status: "confirmed",
      depositPaid: true,
      reminderConfirmed: false,
    }]);
    setStep("confirmed");
  };

  const reset = () => {
    setStep("service");
    setServiceId("");
    setStaffChoice("any");
    setBookingDate("");
    setSlot(null);
    setClientName("");
    setClientPhone("");
    setFormError("");
    setBookedStaffId("");
  };

  const firstName = clientName.trim().split(/\s+/)[0] || "there";
  const steps: { id: Exclude<BookingStep, "confirmed">; label: string }[] = [
    { id: "service", label: "SERVICE" },
    { id: "time", label: "TIME" },
    { id: "details", label: "YOU" },
    { id: "deposit", label: "DEPOSIT" },
  ];

  return (
    <div className="fb-root" style={theme}>
      <div className="fb-demo-banner"><span /> DEMO — Sample data for illustration</div>
      <div className="min-h-[calc(100vh-30px)] px-4 py-4 sm:px-6 sm:py-7" style={{ backgroundColor: business.branding.surface }}>
        <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between gap-3">
          <Link href="/fusionbook" className="text-xs font-semibold text-slate-500 no-underline hover:text-slate-800"><ArrowLeft size={13} className="mr-1 inline" /> FusionBook demo businesses</Link>
          <Link href={`/fusionbook/${business.slug}/dashboard`} className="text-xs font-semibold no-underline" style={{ color: business.branding.accent }}>Owner dashboard <ArrowRight size={13} className="ml-1 inline" /></Link>
        </div>
        <main className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_65px_rgba(27,48,42,.1)] lg:min-h-[690px] lg:grid-cols-[.8fr_1.2fr]">
          <aside className="relative flex flex-col justify-between overflow-hidden p-6 text-white sm:p-8 lg:p-9" style={{ backgroundColor: business.branding.primary }}>
            <div className="pointer-events-none absolute -right-20 top-28 h-64 w-64 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: business.branding.accent }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-sm font-bold" style={{ backgroundColor: business.branding.accent, color: business.branding.primary }}>{business.branding.logoMark}</span>
                <span><b className="block text-sm font-semibold tracking-wide">{business.profile.name}</b><small className="mt-1 block text-[9px] uppercase tracking-[.14em] text-white/55">{business.profile.trade}</small></span>
              </div>
              <h1 className="mt-12 max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">{business.profile.tagline}</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Pick your service and we’ll save a spot that works for you.</p>
            </div>
            <div className="relative mt-8 space-y-3 border-t border-white/10 pt-5 text-xs text-white/65">
              <p className="flex items-center gap-2"><MapPin size={14} style={{ color: business.branding.accent }} />{business.profile.location}</p>
              <p className="flex items-center gap-2"><Clock3 size={14} style={{ color: business.branding.accent }} />Appointments follow your artist’s hours</p>
              <p className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: business.branding.accent }} />A small deposit holds your time</p>
            </div>
          </aside>

          <section className="min-w-0 p-5 sm:p-8 lg:p-10">
            {step !== "confirmed" && <div className="mb-8 grid grid-cols-4 gap-2" aria-label="Booking steps">
              {steps.map(({ id, label }, index) => {
                const activeIndex = steps.findIndex((item) => item.id === step);
                const active = id === step;
                const complete = index < activeIndex;
                return <div key={id} className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold" style={active || complete ? { backgroundColor: business.branding.accent, color: "white" } : { backgroundColor: "#f1f3f5", color: "#89919a" }}>{complete ? <Check size={13} /> : index + 1}</span>
                  <span className={`hidden text-[8px] font-bold tracking-[.08em] sm:inline ${active ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
                </div>;
              })}
            </div>}

            {step === "service" && <>
              <p className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: business.branding.accent }}>START WITH A SERVICE</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-slate-950">Book your visit.</h2>
              <p className="mt-2 text-sm text-slate-500">Choose what you’d like us to do.</p>
              <div className="mt-6 space-y-2.5">
                {business.services.map((service) => <button key={service.id} type="button" onClick={() => chooseService(service.id)} className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50">
                  <span className="min-w-0"><b className="block text-sm font-semibold text-slate-800">{service.name}</b><small className="mt-1 block text-[11px] text-slate-400">{service.durationMinutes} min · {formatMoney(service.deposit)} deposit</small></span>
                  <span className="flex shrink-0 items-center gap-3 text-sm font-semibold text-slate-800">{formatMoney(service.price)}<ArrowRight size={15} className="transition group-hover:translate-x-0.5" style={{ color: business.branding.accent }} /></span>
                </button>)}
              </div>
              <p className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-slate-400"><ShieldCheck size={14} className="shrink-0" />Your deposit is applied to your service total. Demo only—no payment is processed.</p>
            </>}

            {step === "time" && selectedService && <>
              <button type="button" onClick={() => setStep("service")} className="mb-5 inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-slate-400 hover:text-slate-700"><ArrowLeft size={13} /> SERVICES</button>
              <p className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: business.branding.accent }}>PICK YOUR TIME</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-slate-950">Find your opening.</h2>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}><span className="font-semibold">{selectedService.name} · {selectedService.durationMinutes} min</span><b>{formatMoney(selectedService.price)}</b></div>
              <p className="mb-2 mt-5 text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">YOUR ARTIST</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button type="button" onClick={() => { setStaffChoice("any"); setSlot(null); }} className="rounded-lg border px-3 py-2.5 text-left text-xs" style={staffChoice === "any" ? { borderColor: business.branding.accent, backgroundColor: business.branding.accentSoft, color: business.branding.primary } : { borderColor: "#e5e7eb", color: "#64748b" }}><b className="block">First available</b><small className="mt-1 block text-[9px] opacity-70">Earliest open chair</small></button>
                {business.staff.filter((member) => selectedService.staffIds.includes(member.id)).map((member) => <button key={member.id} type="button" onClick={() => { setStaffChoice(member.id); setSlot(null); }} className="rounded-lg border px-3 py-2.5 text-left text-xs" style={staffChoice === member.id ? { borderColor: business.branding.accent, backgroundColor: business.branding.accentSoft, color: business.branding.primary } : { borderColor: "#e5e7eb", color: "#64748b" }}><b className="block">{member.name.split(" ")[0]}</b><small className="mt-1 block text-[9px] opacity-70">{member.role}</small></button>)}
              </div>
              <p className="mb-2 mt-5 text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">CHOOSE A DAY</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {bookingDates.map((date) => {
                  const parsed = new Date(`${date}T12:00:00`);
                  return <button key={date} type="button" onClick={() => { setBookingDate(date); setSlot(null); }} className="min-w-[59px] rounded-lg border px-2 py-2 text-center" style={bookingDate === date ? { borderColor: business.branding.accent, backgroundColor: business.branding.accentSoft, color: business.branding.primary } : { borderColor: "#e5e7eb", color: "#64748b" }}><small className="block text-[8px] font-bold uppercase">{parsed.toLocaleDateString("en-US", { weekday: "short" })}</small><b className="my-1 block text-base">{parsed.getDate()}</b><small className="block text-[8px] uppercase">{parsed.toLocaleDateString("en-US", { month: "short" })}</small></button>;
                })}
              </div>
              {bookingDate && <><p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">AVAILABLE TIMES · {weekdayName(bookingDate).toUpperCase()}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {currentSlots.map((available) => {
                    const member = business.staff.find((person) => person.id === available.staffId);
                    const selected = slot?.time === available.time && slot.staffId === available.staffId;
                    return <button key={`${available.time}-${available.staffId}`} type="button" onClick={() => setSlot(available)} className="rounded-lg border px-3 py-2.5 text-left" style={selected ? { borderColor: business.branding.accent, backgroundColor: business.branding.accentSoft, color: business.branding.primary } : { borderColor: "#e5e7eb", color: "#334155" }}><b className="block text-xs">{displayTime(available.time)}</b><small className="mt-1 block truncate text-[9px] opacity-70">{member?.name}</small></button>;
                  })}
                  {!currentSlots.length && <p className="col-span-full rounded-lg bg-slate-50 px-3 py-4 text-xs text-slate-400">No openings for this selection. Try another day or artist.</p>}
                </div>
              </>}
              <button type="button" disabled={!slot || !bookingDate} onClick={() => { setFormError(""); setStep("details"); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: business.branding.primary }}>Continue <ArrowRight size={15} /></button>
            </>}

            {step === "details" && selectedService && slot && <>
              <button type="button" onClick={() => setStep("time")} className="mb-5 inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-slate-400 hover:text-slate-700"><ArrowLeft size={13} /> CHANGE TIME</button>
              <p className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: business.branding.accent }}>ALMOST THERE</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-slate-950">Who are we saving it for?</h2>
              <div className="mt-4 rounded-lg px-3 py-3 text-xs" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}><p className="font-semibold">{formatDate(bookingDate)} · {displayTime(slot.time)}</p><p className="mt-1 text-[10px]">{selectedService.name} with {business.staff.find((member) => member.id === slot.staffId)?.name}</p></div>
              <form className="mt-5 space-y-4" onSubmit={submitClient}>
                <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-500">Your name<input className="fb-booking-input mt-2 normal-case tracking-normal" value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="First and last name" autoComplete="name" required /></label>
                <label className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-500">Mobile number<input className="fb-booking-input mt-2 normal-case tracking-normal" value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} placeholder="(312) 555-0123" type="tel" autoComplete="tel" required /></label>
                <p className="flex items-center gap-2 text-[10px] text-slate-400"><ShieldCheck size={13} />Your number is used for appointment reminders.</p>
                {formError && <p role="alert" className="text-xs text-rose-600">{formError}</p>}
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: business.branding.primary }}>Continue to deposit <ArrowRight size={15} /></button>
              </form>
            </>}

            {step === "deposit" && selectedService && slot && <>
              <button type="button" onClick={() => setStep("details")} className="mb-5 inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-slate-400 hover:text-slate-700"><ArrowLeft size={13} /> BACK</button>
              <p className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: business.branding.accent }}>SECURE YOUR SPOT</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-slate-950">One small commitment.</h2>
              <div className="mt-5 rounded-xl border p-5" style={{ borderColor: business.branding.accentSoft, backgroundColor: business.branding.accentSoft }}>
                <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.12em]" style={{ color: business.branding.primary }}>DEPOSIT TO HOLD YOUR SPOT</p><p className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: business.branding.primary }}>{formatMoney(selectedService.deposit)}</p><p className="mt-1 text-[10px]" style={{ color: business.branding.primary }}>Applied to your service · {formatMoney(selectedService.price)} total</p></div><CreditCard size={22} style={{ color: business.branding.accent }} /></div>
              </div>
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><ShieldCheck size={15} style={{ color: business.branding.accent }} />Demo deposit step</p><p className="mt-2 text-[11px] leading-5 text-slate-500">This is a mock checkout preview. No card details are requested, stored, or charged.</p></div>
              <button type="button" onClick={completeBooking} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: business.branding.primary }}>Confirm {formatMoney(selectedService.deposit)} deposit <ArrowRight size={15} /></button>
            </>}

            {step === "confirmed" && selectedService && slot && confirmationStaff && <>
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.accent }}><CheckCircle2 size={26} /></div>
              <p className="text-center text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: business.branding.accent }}>YOU’RE ON THE BOOKS</p>
              <h2 className="mt-2 text-center text-3xl font-semibold tracking-[-.04em] text-slate-950">See you soon, {firstName}.</h2>
              <div className="mt-5 grid gap-2 rounded-xl border border-slate-200 p-4 text-xs sm:grid-cols-3">
                <span><small className="block text-[9px] uppercase text-slate-400">When</small><b className="mt-1 block text-slate-800">{formatDate(bookingDate, { month: "short", day: "numeric" })} · {displayTime(slot.time)}</b></span>
                <span><small className="block text-[9px] uppercase text-slate-400">Your service</small><b className="mt-1 block text-slate-800">{selectedService.name} · {confirmationStaff.name}</b></span>
                <span><small className="block text-[9px] uppercase text-slate-400">Deposit</small><b className="mt-1 block text-slate-800">{formatMoney(selectedService.deposit)} · applied to service</b></span>
              </div>
              <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-slate-500">YOUR REMINDER SEQUENCE</p><span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: business.branding.accent }}>SMS PREVIEW</span></div>
                <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3"><span className="fb-avatar h-8 w-8" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{business.branding.logoMark}</span><span><b className="block text-xs text-slate-800">{business.profile.name}</b><small className="text-[9px] text-slate-400">Text message preview</small></span></div>
                <div className="space-y-2.5">
                  <div className="fb-phone-bubble">You’re booked, {firstName}! ✨<br /><br />{selectedService.name} · {formatDate(bookingDate, { month: "long", day: "numeric" })} at {displayTime(slot.time)}<br />with {confirmationStaff.name}<br /><br />Your {formatMoney(selectedService.deposit)} deposit is on file and goes toward your service.</div>
                  <p className="px-1 pt-1 text-[8px] font-bold uppercase tracking-[.12em] text-slate-400">24 HOURS BEFORE</p>
                  <div className="fb-phone-bubble">Hey {firstName} — your {selectedService.name.toLowerCase()} at {business.profile.name} is tomorrow at {displayTime(slot.time)}. We look forward to seeing you!</div>
                  <p className="px-1 pt-1 text-[8px] font-bold uppercase tracking-[.12em] text-slate-400">2 HOURS BEFORE · CONFIRM / RESCHEDULE</p>
                  <div className="fb-phone-bubble">We saved your spot, {firstName}. Confirm you’re on your way or let us know if you need to reschedule.</div>
                  <div className="flex justify-end gap-2"><span className="rounded-full px-3 py-1.5 text-[9px] font-semibold" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>✓ Confirm</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-semibold text-slate-600">↗ Reschedule</span></div>
                </div>
              </section>
              <button type="button" onClick={reset} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Sparkles size={14} /> Book another service</button>
            </>}
          </section>
        </main>
        <footer className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-between gap-2 px-1 text-[9px] text-slate-400"><span>{business.profile.name} · {business.profile.phone}</span><span>Sample booking flow · no real payments or messages</span></footer>
      </div>
    </div>
  );
}
