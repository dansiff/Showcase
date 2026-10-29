"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileText,
  Plus,
  Search,
  Table2,
} from "lucide-react";

type Entry = {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Income" | "Expense";
  amount: number;
};

type Invoice = {
  id: string;
  customer: string;
  issued: string;
  due: string;
  amount: number;
  status: "Paid" | "Due" | "Overdue";
};

const initialEntries: Entry[] = [
  { id: "TX-1048", date: "2026-10-28", description: "Website project deposit", category: "Client work", type: "Income", amount: 850 },
  { id: "TX-1047", date: "2026-10-27", description: "Office supplies", category: "Supplies", type: "Expense", amount: 64.28 },
  { id: "TX-1046", date: "2026-10-26", description: "Monthly hosting plan", category: "Software", type: "Expense", amount: 42 },
  { id: "TX-1045", date: "2026-10-25", description: "Brand identity package", category: "Client work", type: "Income", amount: 1200 },
  { id: "TX-1044", date: "2026-10-23", description: "Local business lunch", category: "Meals", type: "Expense", amount: 38.5 },
  { id: "TX-1043", date: "2026-10-21", description: "Care plan renewal", category: "Recurring", type: "Income", amount: 175 },
];

const initialInvoices: Invoice[] = [
  { id: "INV-2084", customer: "Juniper Coffee Co.", issued: "Oct 28, 2026", due: "Nov 11, 2026", amount: 850, status: "Due" },
  { id: "INV-2083", customer: "Northline Electric", issued: "Oct 20, 2026", due: "Nov 03, 2026", amount: 1200, status: "Due" },
  { id: "INV-2082", customer: "Cedar Street Studio", issued: "Oct 12, 2026", due: "Oct 26, 2026", amount: 425, status: "Overdue" },
  { id: "INV-2081", customer: "Morrow Garden Co.", issued: "Oct 08, 2026", due: "Oct 22, 2026", amount: 680, status: "Paid" },
];

const initialStock = [
  { sku: "PKG-001", name: "Shipping boxes", category: "Packaging", quantity: 18, reorderAt: 12, unitCost: 1.8 },
  { sku: "PKG-002", name: "Padded mailers", category: "Packaging", quantity: 7, reorderAt: 10, unitCost: 0.72 },
  { sku: "OFF-014", name: "Thermal labels", category: "Office", quantity: 42, reorderAt: 15, unitCost: 0.08 },
  { sku: "PRD-220", name: "Desk calendar", category: "Products", quantity: 5, reorderAt: 8, unitCost: 6.5 },
];

const sqlExamples = {
  "Profit & loss": "SELECT category, SUM(CASE WHEN type = 'Income' THEN amount ELSE -amount END) AS net\nFROM transactions\nWHERE transaction_date >= DATE_TRUNC('month', CURRENT_DATE)\nGROUP BY category\nORDER BY net DESC;",
  "Open invoices": "SELECT customer_name, invoice_number, due_date, total_cents / 100.0 AS total\nFROM invoices\nWHERE status IN ('due', 'overdue')\nORDER BY due_date ASC;",
  "Reorder report": "SELECT sku, item_name, quantity_on_hand, reorder_point\nFROM inventory_items\nWHERE quantity_on_hand <= reorder_point\nORDER BY quantity_on_hand ASC;",
};

type AppView = "Ledger" | "Invoices" | "Inventory";
type SqlQuery = keyof typeof sqlExamples;

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function BusinessDataStudio() {
  const [view, setView] = useState<AppView>("Ledger");
  const [entries, setEntries] = useState(initialEntries);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [stock, setStock] = useState(initialStock);
  const [search, setSearch] = useState("");
  const [entryFilter, setEntryFilter] = useState("All activity");
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [entryType, setEntryType] = useState<Entry["type"]>("Income");
  const [sqlQuery, setSqlQuery] = useState<SqlQuery>("Profit & loss");
  const [sqlRan, setSqlRan] = useState(false);

  const totals = useMemo(() => {
    const income = entries.filter((entry) => entry.type === "Income").reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = entries.filter((entry) => entry.type === "Expense").reduce((sum, entry) => sum + entry.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [entries]);

  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const matchesText = `${entry.description} ${entry.category} ${entry.id}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = entryFilter === "All activity" || entry.type === entryFilter;
    return matchesText && matchesType;
  }), [entries, entryFilter, search]);

  const outstanding = invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const lowStock = stock.filter((item) => item.quantity <= item.reorderAt).length;

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    setEntries((current) => [{
      id: `TX-${1049 + current.length - initialEntries.length}`,
      date: new Date().toISOString().slice(0, 10),
      description: description.trim(),
      category: entryType === "Income" ? "Client work" : "General",
      type: entryType,
      amount: parsedAmount,
    }, ...current]);
    setDescription("");
    setAmount("");
    setShowEntryForm(false);
  }

  function exportEntries() {
    const rows = [["ID", "Date", "Description", "Category", "Type", "Amount"], ...filteredEntries.map((entry) => [entry.id, entry.date, entry.description, entry.category, entry.type, entry.amount.toFixed(2)])];
    const csv = rows.map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "business-ledger.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f3f4ef] text-[#202923]">
      <section className="border-b border-[#d9dfd6] bg-[#18251e] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8 lg:pb-12">
          <div className="flex items-center gap-2 text-sm text-[#b8c5b9]"><BriefcaseBusiness className="h-4 w-4 text-[#d5a84f]" /> THE FUSION SPACE <span className="text-[#637369]">/</span> BUSINESS DATA</div>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase text-[#d5a84f]">Practical software, built around real data</p>
              <h1 className="mt-3 max-w-3xl font-nacelle text-4xl font-semibold leading-tight sm:text-5xl">Small business operations, made clear.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#c5d0c8]">Explore working previews for bookkeeping, invoicing, and inventory. Each one is shaped around relational data, dependable calculations, and everyday business tasks.</p>
            </div>
            <div className="flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-[#c5d0c8] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><span className="h-2 w-2 rounded-full bg-[#78b58c]" /> Interactive sample workspace</div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-[#728074]">Operations suite <span className="px-1 text-[#bdc4bb]">/</span> Demo workspace</p>
            <h2 className="mt-2 font-nacelle text-2xl font-semibold">Juniper & Co. <span className="text-[#a5afa4]">·</span> October 2026</h2>
          </div>
          <div className="flex flex-wrap gap-1 border-b border-[#d9dfd6]" role="tablist" aria-label="Business application previews">
            {(["Ledger", "Invoices", "Inventory"] as AppView[]).map((item) => {
              const Icon = item === "Ledger" ? CircleDollarSign : item === "Invoices" ? FileText : Boxes;
              return <button key={item} role="tab" aria-selected={view === item} onClick={() => { setView(item); setSearch(""); }} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${view === item ? "border-[#2f7250] text-[#255d40]" : "border-transparent text-[#728074] hover:text-[#202923]"}`}><Icon className="h-4 w-4" />{item}</button>;
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(view === "Ledger" ? [
            { label: "Income recorded", value: money(totals.income), note: "Across sample transactions", tone: "green", Icon: ArrowDownLeft },
            { label: "Expenses recorded", value: money(totals.expenses), note: "Categorized for review", tone: "red", Icon: ArrowUpRight },
            { label: "Net operating", value: money(totals.net), note: "Income less expenses", tone: "gold", Icon: CircleDollarSign },
            { label: "Transactions", value: String(entries.length), note: "In this demo ledger", tone: "ink", Icon: Table2 },
          ] : view === "Invoices" ? [
            { label: "Outstanding", value: money(outstanding), note: "Due and overdue invoices", tone: "gold", Icon: CircleDollarSign },
            { label: "Open invoices", value: String(invoices.filter((invoice) => invoice.status !== "Paid").length), note: "Awaiting payment", tone: "ink", Icon: ClipboardList },
            { label: "Paid invoices", value: String(invoices.filter((invoice) => invoice.status === "Paid").length), note: "Marked as settled", tone: "green", Icon: Check },
            { label: "Invoice records", value: String(invoices.length), note: "Customer billing history", tone: "ink", Icon: FileText },
          ] : [
            { label: "Tracked items", value: String(stock.length), note: "Across 3 categories", tone: "ink", Icon: Boxes },
            { label: "Low stock", value: String(lowStock), note: "At or below reorder point", tone: "red", Icon: ArrowDownLeft },
            { label: "Units on hand", value: String(stock.reduce((sum, item) => sum + item.quantity, 0)), note: "Current sample quantity", tone: "green", Icon: Table2 },
            { label: "Inventory value", value: money(stock.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)), note: "Quantity × unit cost", tone: "gold", Icon: CircleDollarSign },
          ]).map(({ label, value, note, tone, Icon }) => <div key={label} className="border border-[#dce1da] bg-white p-5">
            <div className="flex items-start justify-between"><p className="text-sm font-medium text-[#68756a]">{label}</p><Icon className={`h-4 w-4 ${tone === "green" ? "text-[#368258]" : tone === "red" ? "text-[#b9634d]" : tone === "gold" ? "text-[#b48632]" : "text-[#66776a]"}`} /></div>
            <p className="mt-4 font-nacelle text-3xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-[#8b968b]">{note}</p>
          </div>)}
        </div>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.8fr)]">
          <section className="min-w-0 border border-[#dce1da] bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-[#e6e9e4] p-5 sm:flex-row sm:items-center">
              <div><h3 className="font-semibold">{view === "Ledger" ? "Transaction ledger" : view === "Invoices" ? "Customer invoices" : "Stock on hand"}</h3><p className="mt-1 text-xs text-[#879187]">{view === "Ledger" ? "Every entry is categorized and traceable." : view === "Invoices" ? "Track due dates and record payments." : "Monitor quantities against reorder points."}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                {view === "Ledger" && <button onClick={exportEntries} title="Export filtered ledger to CSV" aria-label="Export filtered ledger to CSV" className="inline-flex h-9 items-center gap-2 border border-[#dce1da] px-3 text-xs font-medium text-[#526055] hover:bg-[#f4f6f2]"><Download className="h-4 w-4" /> Export CSV</button>}
                {view === "Ledger" && <button onClick={() => setShowEntryForm((shown) => !shown)} className="inline-flex h-9 items-center gap-2 bg-[#285f43] px-3 text-xs font-semibold text-white hover:bg-[#204d36]"><Plus className="h-4 w-4" /> Add entry</button>}
              </div>
            </div>

            {showEntryForm && view === "Ledger" && <form onSubmit={addEntry} className="grid gap-3 border-b border-[#e6e9e4] bg-[#f7f8f5] p-4 sm:grid-cols-[1fr_130px_120px_auto]">
              <label className="text-xs font-medium text-[#68756a]">Description<input required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Client deposit" className="mt-1 h-10 w-full border border-[#dce1da] bg-white px-3 text-sm text-[#202923] outline-none focus:border-[#4e8d66]" /></label>
              <label className="text-xs font-medium text-[#68756a]">Amount<input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-1 h-10 w-full border border-[#dce1da] bg-white px-3 text-sm text-[#202923] outline-none focus:border-[#4e8d66]" /></label>
              <label className="text-xs font-medium text-[#68756a]">Type<select value={entryType} onChange={(event) => setEntryType(event.target.value as Entry["type"])} className="mt-1 h-10 w-full border border-[#dce1da] bg-white px-3 text-sm text-[#202923] outline-none focus:border-[#4e8d66]"><option>Income</option><option>Expense</option></select></label>
              <button type="submit" className="mt-auto h-10 bg-[#285f43] px-4 text-sm font-semibold text-white hover:bg-[#204d36]">Save entry</button>
            </form>}

            {view === "Ledger" && <div className="flex flex-col gap-3 border-b border-[#e6e9e4] p-4 sm:flex-row">
              <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a197]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search descriptions, categories, IDs" className="h-10 w-full border border-[#dce1da] pl-9 pr-3 text-sm outline-none focus:border-[#4e8d66]" /></label>
              <label className="relative"><span className="sr-only">Filter transactions</span><select value={entryFilter} onChange={(event) => setEntryFilter(event.target.value)} className="h-10 min-w-36 appearance-none border border-[#dce1da] bg-white pl-3 pr-9 text-sm text-[#526055] outline-none focus:border-[#4e8d66]"><option>All activity</option><option>Income</option><option>Expense</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#879187]" /></label>
            </div>}

            <div className="overflow-x-auto">
              {view === "Ledger" ? <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#f7f8f5] text-[11px] uppercase text-[#879187]"><tr><th className="px-5 py-3 font-semibold">Transaction</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Type</th><th className="px-5 py-3 text-right font-semibold">Amount</th></tr></thead>
                <tbody className="divide-y divide-[#edf0eb]">{filteredEntries.map((entry) => <tr key={entry.id} className="hover:bg-[#fafbf9]"><td className="px-5 py-4"><div className="font-medium text-[#354239]">{entry.description}</div><div className="mt-1 font-mono text-[11px] text-[#9aa39a]">{entry.id}</div></td><td className="px-4 py-4 text-[#68756a]">{entry.category}</td><td className="px-4 py-4 text-[#68756a]">{entry.date}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 text-xs ${entry.type === "Income" ? "text-[#368258]" : "text-[#b9634d]"}`}><span className={`h-1.5 w-1.5 rounded-full ${entry.type === "Income" ? "bg-[#54a273]" : "bg-[#ce7964]"}`} />{entry.type}</span></td><td className={`px-5 py-4 text-right font-medium tabular-nums ${entry.type === "Income" ? "text-[#368258]" : "text-[#354239]"}`}>{entry.type === "Income" ? "+" : "−"}{money(entry.amount)}</td></tr>)}</tbody>
              </table> : view === "Invoices" ? <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-[#f7f8f5] text-[11px] uppercase text-[#879187]"><tr><th className="px-5 py-3 font-semibold">Invoice / Customer</th><th className="px-4 py-3 font-semibold">Issued</th><th className="px-4 py-3 font-semibold">Due date</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-5 py-3 text-right font-semibold">Total</th><th className="px-5 py-3 text-right font-semibold">Action</th></tr></thead>
                <tbody className="divide-y divide-[#edf0eb]">{invoices.map((invoice) => <tr key={invoice.id} className="hover:bg-[#fafbf9]"><td className="px-5 py-4"><div className="font-medium text-[#354239]">{invoice.customer}</div><div className="mt-1 font-mono text-[11px] text-[#9aa39a]">{invoice.id}</div></td><td className="px-4 py-4 text-[#68756a]">{invoice.issued}</td><td className="px-4 py-4 text-[#68756a]">{invoice.due}</td><td className="px-4 py-4"><span className={`text-xs font-medium ${invoice.status === "Paid" ? "text-[#368258]" : invoice.status === "Overdue" ? "text-[#b9634d]" : "text-[#ad812e]"}`}>{invoice.status}</span></td><td className="px-5 py-4 text-right font-medium tabular-nums">{money(invoice.amount)}</td><td className="px-5 py-4 text-right">{invoice.status !== "Paid" && <button onClick={() => setInvoices((current) => current.map((item) => item.id === invoice.id ? { ...item, status: "Paid" } : item))} className="text-xs font-semibold text-[#2f7250] hover:underline">Mark paid</button>}</td></tr>)}</tbody>
              </table> : <table className="w-full min-w-[570px] text-left text-sm">
                <thead className="bg-[#f7f8f5] text-[11px] uppercase text-[#879187]"><tr><th className="px-5 py-3 font-semibold">Item / SKU</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">On hand</th><th className="px-4 py-3 font-semibold">Reorder at</th><th className="px-5 py-3 text-right font-semibold">Unit cost</th><th className="px-5 py-3 text-right font-semibold">Action</th></tr></thead>
                <tbody className="divide-y divide-[#edf0eb]">{stock.map((item) => <tr key={item.sku} className="hover:bg-[#fafbf9]"><td className="px-5 py-4"><div className="font-medium text-[#354239]">{item.name}</div><div className="mt-1 font-mono text-[11px] text-[#9aa39a]">{item.sku}</div></td><td className="px-4 py-4 text-[#68756a]">{item.category}</td><td className="px-4 py-4"><span className={item.quantity <= item.reorderAt ? "font-semibold text-[#b9634d]" : "text-[#354239]"}>{item.quantity}</span><span className="ml-2 text-xs text-[#9aa39a]">units</span></td><td className="px-4 py-4 text-[#68756a]">{item.reorderAt}</td><td className="px-5 py-4 text-right tabular-nums">{money(item.unitCost)}</td><td className="px-5 py-4 text-right"><button onClick={() => setStock((current) => current.map((row) => row.sku === item.sku ? { ...row, quantity: row.quantity + 5 } : row))} className="text-xs font-semibold text-[#2f7250] hover:underline">Receive +5</button></td></tr>)}</tbody>
              </table>}
              {view === "Ledger" && filteredEntries.length === 0 && <p className="p-8 text-center text-sm text-[#879187]">No transactions match that search.</p>}
            </div>
            <div className="flex flex-col gap-2 border-t border-[#e6e9e4] px-5 py-3 text-xs text-[#8b968b] sm:flex-row sm:items-center sm:justify-between"><span>{view === "Ledger" ? `Showing ${filteredEntries.length} of ${entries.length} transactions` : view === "Invoices" ? `${invoices.length} invoices in this workspace` : `${stock.length} stock items in this workspace`}</span><span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#69a77b]" /> Sample data · changes stay in this preview</span></div>
          </section>

          <aside className="border border-[#dce1da] bg-white">
            <div className="flex items-center justify-between border-b border-[#e6e9e4] px-5 py-4"><div className="flex items-center gap-2"><Table2 className="h-4 w-4 text-[#3d7956]" /><h3 className="text-sm font-semibold">Data model & SQL</h3></div><span className="font-mono text-[10px] text-[#879187]">POSTGRESQL</span></div>
            <div className="p-5">
              <p className="text-xs leading-5 text-[#788479]">Relational tables keep business records connected, traceable, and ready for useful reporting.</p>
              <div className="mt-4 space-y-2">
                {[{ name: "transactions", fields: "id · date · type · amount · category_id" }, { name: "categories", fields: "id · name · account_type" }, { name: "invoices", fields: "id · customer_id · due_date · status" }, { name: "invoice_items", fields: "invoice_id · description · quantity · unit_price" }, { name: "inventory_items", fields: "sku · quantity_on_hand · reorder_point" }].map((table) => <div key={table.name} className="border border-[#e6e9e4] px-3 py-2.5"><div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#354239]"><Table2 className="h-3.5 w-3.5 text-[#7b927f]" />{table.name}</div><p className="mt-1 pl-[22px] font-mono text-[10px] leading-4 text-[#909a90]">{table.fields}</p></div>)}
              </div>
              <label className="mt-5 block text-xs font-semibold text-[#68756a]">Example report<select value={sqlQuery} onChange={(event) => { setSqlQuery(event.target.value as SqlQuery); setSqlRan(false); }} className="mt-2 h-10 w-full border border-[#dce1da] bg-white px-3 text-sm font-normal text-[#354239] outline-none focus:border-[#4e8d66]">{Object.keys(sqlExamples).map((query) => <option key={query}>{query}</option>)}</select></label>
              <pre className="mt-3 overflow-x-auto border border-[#26382d] bg-[#19271f] p-4 font-mono text-[11px] leading-5 text-[#d5dfd4]"><code>{sqlExamples[sqlQuery]}</code></pre>
              <button onClick={() => setSqlRan(true)} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#b8c7b9] text-sm font-semibold text-[#315d40] hover:bg-[#f2f6f1]"><ChevronDown className="h-4 w-4 -rotate-90" /> Run sample query</button>
              {sqlRan && <p role="status" className="mt-3 border-l-2 border-[#5f9a70] bg-[#f2f6f1] px-3 py-2 text-xs leading-5 text-[#456b4e]">Query preview complete. Results are reflected in the live demo totals and tables above.</p>}
            </div>
          </aside>
        </div>

        <section className="mt-8 border-t border-[#d9dfd6] py-7">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-start"><div><p className="text-xs font-semibold uppercase text-[#728074]">Built for useful details</p><h3 className="mt-2 font-nacelle text-xl font-semibold">From a clean schema to a calmer workday.</h3></div><div className="grid gap-4 sm:grid-cols-3"><div className="flex gap-3"><span className="mt-0.5 text-[#a47b31]"><Table2 className="h-4 w-4" /></span><div><h4 className="text-sm font-semibold">Structured records</h4><p className="mt-1 text-xs leading-5 text-[#728074]">Related tables model customers, transactions, invoices, and inventory cleanly.</p></div></div><div className="flex gap-3"><span className="mt-0.5 text-[#a47b31]"><CircleDollarSign className="h-4 w-4" /></span><div><h4 className="text-sm font-semibold">Reliable calculations</h4><p className="mt-1 text-xs leading-5 text-[#728074]">Totals, balances, and reorder alerts update from the underlying records.</p></div></div><div className="flex gap-3"><span className="mt-0.5 text-[#a47b31]"><ClipboardList className="h-4 w-4" /></span><div><h4 className="text-sm font-semibold">Useful outputs</h4><p className="mt-1 text-xs leading-5 text-[#728074]">Search, status changes, and a CSV export support real operational work.</p></div></div></div></div>
        </section>
      </main>
    </div>
  );
}