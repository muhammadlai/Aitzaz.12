"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, Bot, BriefcaseBusiness, CheckCircle2, Clock3, DollarSign,
  Inbox, Mail, Radar, Search, ShieldCheck, Sparkles, Star, Zap, FileText, CalendarDays
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  source: string;
  category: string;
  budget: string;
  deadline: string;
  requirements: string;
  skills: string;
  proposal: string;
  status: "Draft" | "Approved";
};

type Client = { id:number; name:string; email:string; company:string; taskTitle:string; status:"Lead"|"Active"|"Completed"; };
type EarningsEntry = { id:number; taskTitle:string; clientName:string; amount:string; status:"Pending"|"Paid"; note:string; };

type Opportunity = {
  id: number;
  title: string;
  source: string;
  category: string;
  value: string;
  match: number;
  status: "New" | "Saved";
};

const seed: Opportunity[] = [
  { id: 1, title: "Data entry & web research", source: "Demo opportunity feed", category: "Data", value: "Rs 2,500–5,000", match: 94, status: "New" },
  { id: 2, title: "Social media post package", source: "Demo opportunity feed", category: "Social", value: "Rs 3,000–6,000", match: 89, status: "New" },
  { id: 3, title: "YouTube thumbnail design", source: "Demo opportunity feed", category: "Design", value: "Rs 800–1,500", match: 86, status: "New" },
  { id: 4, title: "Product listing cleanup", source: "Demo opportunity feed", category: "Data", value: "Rs 1,500–3,500", match: 82, status: "New" }
];

export default function Home() {
  const [tab, setTab] = useState<"overview" | "revbot" | "opportunities" | "tasks" | "email" | "clients" | "earnings">("overview");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(seed);
  const [emailConnected, setEmailConnected] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [earnings, setEarnings] = useState<EarningsEntry[]>([]);
  const [revbotRunning, setRevbotRunning] = useState(false);
  const [revbotGoal, setRevbotGoal] = useState("Find and prepare suitable work");
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const savedCount = items.filter(o => o.status === "Saved").length;
  const approvedCount = tasks.filter(t => t.status === "Approved").length;
  const paidCount = earnings.filter(e => e.status === "Paid").length;

  const filtered = useMemo(() => items.filter(o =>
    (category === "All" || o.category === category) &&
    o.title.toLowerCase().includes(query.toLowerCase())
  ), [items, query, category]);

  const save = (id: number) => setItems(prev => prev.map(o => o.id === id ? { ...o, status: "Saved" } : o));

  const createTask = (opportunity: Opportunity) => {
    setTasks(prev => {
      if (prev.some(t => t.title === opportunity.title)) return prev;
      return [...prev, {
        id: Date.now(),
        title: opportunity.title,
        source: opportunity.source,
        category: opportunity.category,
        budget: opportunity.value,
        deadline: "Not set",
        requirements: "Add the client's exact requirements here.",
        skills: opportunity.category === "Design" ? "Design, communication" : "Research, communication, accuracy",
        proposal: "",
        status: "Draft"
      }];
    });
    setTab("tasks");
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Bot size={22}/></div><div><b>EARNING</b><span>ROBOT</span></div></div>
        <div className="navLabel">CONTROL CENTER</div>
        <button className={"nav " + (tab === "overview" ? "active" : "")} onClick={() => setTab("overview")}><Activity size={18}/><span>Overview</span></button>
        <button className={"nav " + (tab === "revbot" ? "active" : "")} onClick={() => setTab("revbot" as any)}><Bot size={18}/><span>RevBot</span><em>{revbotRunning ? "ON" : "OFF"}</em></button>
        <button className={"nav " + (tab === "opportunities" ? "active" : "")} onClick={() => setTab("opportunities")}><Radar size={18}/><span>Opportunities</span><em>{items.length}</em></button>
        <button className={"nav " + (tab === "tasks" ? "active" : "")} onClick={() => setTab("tasks")}><BriefcaseBusiness size={18}/><span>Tasks</span><em>{tasks.length}</em></button>
        <button className={"nav " + (tab === "email" ? "active" : "")} onClick={() => setTab("email")}><Mail size={18}/><span>Email Agent</span></button>
        <button className={"nav " + (tab === "clients" ? "active" : "")} onClick={() => setTab("clients")}><BriefcaseBusiness size={18}/><span>Clients</span></button>
        <button className={"nav " + (tab === "earnings" ? "active" : "")} onClick={() => setTab("earnings")}><DollarSign size={18}/><span>Earnings</span></button>
        <div className="navBottom"><div className="system"><span className="systemDot"/>System ready</div></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><div className="eyebrow">PHASE 4 • TASK + PROPOSAL WORKSPACE</div><h1>{tab === "overview" ? "Robot Control Center" : tab === "revbot" ? "RevBot Command Center" : tab === "opportunities" ? "Opportunity Radar" : tab === "tasks" ? "Task Workspace" : tab === "clients" ? "Client Workspace" : tab === "earnings" ? "Earnings Ledger" : "Email Agent"}</h1></div>
          <div className="topRight"><div className="status"><span className="pulse"></span>AUTOMATION READY <span className="topClock">{now.toLocaleTimeString()}</span></div><div className="avatar">ER</div></div>
        </header>

        {tab === "overview" && <Overview setTab={setTab} emailConnected={emailConnected} opportunities={items.length} saved={savedCount} tasks={tasks.length} approved={approvedCount} clients={clients.length} paid={paidCount} revbotRunning={revbotRunning}/>}\n        {tab === "revbot" && <RevBotPanel running={revbotRunning} setRunning={setRevbotRunning} goal={revbotGoal} setGoal={setRevbotGoal} tasks={tasks} clients={clients} earnings={earnings}/>}
        {tab === "opportunities" && <OpportunityPanel filtered={filtered} query={query} setQuery={setQuery} category={category} setCategory={setCategory} save={save} createTask={createTask}/>}
        {tab === "tasks" && <TaskPanel tasks={tasks} setTasks={setTasks} />}
        {tab === "clients" && <ClientPanel clients={clients} setClients={setClients} tasks={tasks} />}
        {tab === "earnings" && <EarningsPanel earnings={earnings} setEarnings={setEarnings} tasks={tasks} clients={clients} />}
        {tab === "email" && <EmailPanel connected={emailConnected} onConnect={() => setEmailConnected(true)} />}
      </section>
    </main>
  );
}

function Overview({ setTab, emailConnected, opportunities, saved, tasks, approved, clients, paid, revbotRunning }: { setTab: (t: "overview" | "revbot" | "opportunities" | "tasks" | "email" | "clients" | "earnings") => void; emailConnected: boolean; opportunities: number; saved: number; tasks: number; approved: number; clients: number; paid: number; revbotRunning: boolean }) {
  return <div>
    <div className="hero">
      <div><div className="heroTitle"><Sparkles size={18}/> Phase 2 automation layer</div><h2>Discover work before you act.</h2><p>The opportunity workspace can filter, score and save work. Email connection is prepared for the next backend step.</p></div>
      <div className="heroStatus"><div className="bigPulse"><Zap size={21}/></div><div><b>Ready</b><span>Static test environment</span></div></div>
    </div>

    <div className="stats">
      <div className="stat"><div className="statIcon"><Radar size={18}/></div><span>Opportunities</span><strong>{opportunities}</strong><small>Demo records</small></div>
      <div className="stat"><div className="statIcon"><Star size={18}/></div><span>Saved</span><strong>{saved}</strong><small>Waiting for review</small></div>
      <div className="stat"><div className="statIcon"><Mail size={18}/></div><span>Email</span><strong>{emailConnected ? "Ready" : "Off"}</strong><small>{emailConnected ? "Local test connection" : "Not connected"}</small></div>
      <div className="stat"><div className="statIcon"><ShieldCheck size={18}/></div><span>Safety</span><strong>On</strong><small>Approval-aware</small></div>
    </div>

    <div className="grid">
      <section className="panel">
        <div className="panelHead"><div><h3>Opportunity Discovery</h3><p>Search and review candidate work</p></div><Radar size={18}/></div>
        <div className="featureCard"><div className="featureIcon"><Search size={19}/></div><div><b>Opportunity inbox</b><span>Search, filter, score and save incoming opportunities.</span></div><button className="primary" onClick={() => setTab("opportunities")}>Open radar</button></div>
        <div className="featureCard"><div className="featureIcon"><Sparkles size={19}/></div><div><b>Requirement analyzer</b><span>Prepared for AI extraction of budget, deadline and required skills.</span></div><span className="tag">NEXT</span></div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h3>Email Agent</h3><p>Connection and inbox preparation</p></div><Mail size={18}/></div>
        <div className="featureCard"><div className="featureIcon"><Mail size={19}/></div><div><b>Inbox connector</b><span>OAuth connection UI is ready; real mailbox access requires a secure backend.</span></div><button className="primary" onClick={() => setTab("email")}>Open email</button></div>
        <div className="notice"><ShieldCheck size={16}/><span>Credentials are never stored in the public GitHub frontend.</span></div>
      </section>
    </div>

    <section className="panel sectionGap">
      <div className="panelHead"><div><h3>Phase 2 workflow</h3><p>How the agent will process new work</p></div><Clock3 size={18}/></div>
      <div className="steps"><div><b>01</b><span>Discover</span><small>Approved sources</small></div><div><b>02</b><span>Score</span><small>Skill + budget match</small></div><div><b>03</b><span>Review</span><small>Human approval</small></div><div><b>04</b><span>Prepare</span><small>Proposal/task draft</small></div></div>
    </section>
    <section className="advancedGrid sectionGap">
      <section className="panel">
        <div className="panelHead"><div><h3>Advanced Operations</h3><p>Live workspace health and throughput</p></div><Activity size={18}/></div>
        <div className="opsRows">
          <div><span><span className="opsDot"></span>RevBot engine</span><b>{revbotRunning ? "RUNNING" : "PAUSED"}</b></div>
          <div><span><span className="opsDot"></span>Opportunity queue</span><b>{opportunities} records</b></div>
          <div><span><span className="opsDot"></span>Saved for review</span><b>{saved} records</b></div>
          <div><span><span className="opsDot"></span>Task pipeline</span><b>{tasks} tasks</b></div>
          <div><span><span className="opsDot"></span>Approval queue</span><b>{approved} approved</b></div>
          <div><span><span className="opsDot"></span>Client workspace</span><b>{clients} clients</b></div>
          <div><span><span className="opsDot"></span>Payment ledger</span><b>{paid} paid</b></div>
        </div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h3>Quick Actions</h3><p>Jump directly into the next step</p></div><Zap size={18}/></div>
        <div className="quickGrid">
          <button onClick={() => setTab("opportunities")}><Radar size={17}/><span>Scan work</span><small>{opportunities} available</small></button>
          <button onClick={() => setTab("tasks")}><BriefcaseBusiness size={17}/><span>Open tasks</span><small>{tasks} in workspace</small></button>
          <button onClick={() => setTab("revbot")}><Bot size={17}/><span>RevBot</span><small>{revbotRunning ? "Running" : "Paused"}</small></button>
          <button onClick={() => setTab("earnings")}><DollarSign size={17}/><span>Ledger</span><small>{paid} paid records</small></button>
        </div>
      </section>
    </section>
  </div>;
}

function OpportunityPanel({ filtered, query, setQuery, category, setCategory, save, createTask }: { filtered: Opportunity[]; query: string; setQuery: (v: string) => void; category: string; setCategory: (v: string) => void; save: (id: number) => void; createTask: (o: Opportunity) => void }) {
  return <div>
    <div className="panel toolbar">
      <div className="searchBox"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search opportunities..." /></div>
      <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option><option>Data</option><option>Social</option><option>Design</option></select>
      <span className="demoBadge">LOCAL SEED • BACKEND READY</span>
    </div>
    <section className="panel">
      <div className="panelHead"><div><h3>Opportunity Inbox</h3><p>{filtered.length} matching opportunities • no applications are sent automatically</p></div><Radar size={18}/></div>
      <div className="oppList">{filtered.map(o => <div className="opp" key={o.id}>
        <div className="oppIcon"><BriefcaseBusiness size={18}/></div>
        <div className="oppMain"><b>{o.title}</b><span>{o.source} • {o.category}</span></div>
        <div className="match">{o.match}%<small>match</small></div>
        <div className="value">{o.value}</div>
        <button className={"inspect " + (o.status === "Saved" ? "saved" : "")} onClick={() => save(o.id)}>{o.status === "Saved" ? "Saved" : "Save"}</button><button className="inspect" onClick={() => createTask(o)}>Create task</button>
      </div>)}</div>
      {!filtered.length && <div className="empty">No matching opportunities.</div>}
    </section>
    <div className="notice"><ShieldCheck size={16}/><span>Phase 2 only prepares and organizes opportunities. Real marketplace connectors will be added through permitted APIs or approved integrations.</span></div>
  </div>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";\n\nfunction EmailPanel({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return <div className="grid emailGrid">
    <section className="panel">
      <div className="panelHead"><div><h3>Email Agent</h3><p>Inbox monitoring preparation</p></div><Mail size={18}/></div>
      <div className="emailCard"><div className="mailIcon"><Inbox size={22}/></div><div><b>{connected ? "Test connection enabled" : "Connect your mailbox"}</b><span>{connected ? "Gmail OAuth is handled by the secure backend." : "Secure Gmail OAuth is handled server-side; secrets stay off GitHub Pages."}</span></div></div>
      <button className="primary wideBtn" onClick={async () => { if (!API_BASE) { onConnect(); return; } const r = await fetch(`${API_BASE}/api/gmail/connect`); const d = await r.json(); if (d.url) window.location.href = d.url; else alert(d.error || "Gmail backend is not configured."); }}>{connected ? "Connected (demo)" : "Connect Gmail"}</button>
    </section>
    <section className="panel">
      <div className="panelHead"><div><h3>What happens next</h3><p>Backend-required features</p></div><Zap size={18}/></div>
      <div className="queue"><div><Mail/><span>Read approved inbox messages</span><b>READY</b></div><div><Sparkles/><span>Extract client requirements</span><b>NEXT</b></div><div><BriefcaseBusiness/><span>Create a task from a request</span><b>NEXT</b></div><div><CheckCircle2/><span>Draft reply for approval</span><b>NEXT</b></div></div>
    </section>
  </div>;
}


function TaskPanel({ tasks, setTasks }: { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const [selectedId, setSelectedId] = useState<number | null>(tasks[0]?.id ?? null);
  const selected = tasks.find(t => t.id === selectedId) ?? tasks[0];

  const update = (patch: Partial<Task>) => {
    if (!selected) return;
    setTasks(prev => prev.map(t => t.id === selected.id ? { ...t, ...patch } : t));
  };

  const generateDraft = () => {
    if (!selected) return;
    update({
      proposal: `Hello, I can help with ${selected.title.toLowerCase()}. Based on the requirements, I can deliver accurate, organized work within the agreed scope and deadline. I will communicate clearly, confirm any missing details, and provide the final work for your review.`,
      status: "Draft"
    });
  };

  const approve = () => {
    if (!selected?.proposal) return;
    update({ status: "Approved" });
  };

  if (!tasks.length) {
    return <section className="panel">
      <div className="panelHead"><div><h3>Task Workspace</h3><p>Create a task from Opportunity Radar to begin.</p></div><BriefcaseBusiness size={18}/></div>
      <div className="empty">No tasks yet. Open Opportunities → Create task.</div>
    </section>;
  }

  return <div className="grid">
    <section className="panel">
      <div className="panelHead"><div><h3>Task Workspace</h3><p>{tasks.length} task{tasks.length === 1 ? "" : "s"} • approval required</p></div><BriefcaseBusiness size={18}/></div>
      <div className="queue">
        {tasks.map(t => <button key={t.id} className="featureCard" onClick={() => setSelectedId(t.id)}>
          <div className="featureIcon"><BriefcaseBusiness size={19}/></div>
          <div><b>{t.title}</b><span>{t.category} • {t.budget}</span></div>
          <span className="tag">{t.status.toUpperCase()}</span>
        </button>)}
      </div>
    </section>

    {selected && <section className="panel">
      <div className="panelHead"><div><h3>Task Details</h3><p>Requirement, budget and deadline</p></div><FileText size={18}/></div>
      <div className="featureCard"><div className="featureIcon"><BriefcaseBusiness size={19}/></div><div><b>{selected.title}</b><span>{selected.source} • {selected.category}</span></div></div>
      <label className="fieldLabel">Budget</label>
      <input className="taskInput" value={selected.budget} onChange={e => update({ budget: e.target.value })} />
      <label className="fieldLabel">Deadline</label>
      <div className="searchBox"><CalendarDays size={16}/><input className="taskInputPlain" value={selected.deadline} onChange={e => update({ deadline: e.target.value })} placeholder="e.g. 30 Sep 2026" /></div>
      <label className="fieldLabel">Requirements</label>
      <textarea className="taskInput taskArea" value={selected.requirements} onChange={e => update({ requirements: e.target.value })} />
      <label className="fieldLabel">Required skills</label>
      <input className="taskInput" value={selected.skills} onChange={e => update({ skills: e.target.value })} />
    </section>}

    {selected && <section className="panel sectionGap">
      <div className="panelHead"><div><h3>Proposal Studio</h3><p>Generate → review → approve</p></div><Sparkles size={18}/></div>
      <div className="notice"><ShieldCheck size={16}/><span>No proposal is sent automatically. Approval is required.</span></div>
      <textarea className="taskInput taskArea proposalBox" value={selected.proposal} onChange={e => update({ proposal: e.target.value, status: "Draft" })} placeholder="Click Generate draft to prepare a proposal..." />
      <div className="featureCard">
        <div className="featureIcon"><FileText size={19}/></div>
        <div><b>Status: {selected.status}</b><span>{selected.status === "Approved" ? "Approved and ready for the next backend send step." : "Draft requires your review."}</span></div>
        <button className="primary" onClick={generateDraft}><Sparkles size={16}/> Generate draft</button>
        <button className="inspect" disabled={!selected.proposal} onClick={approve}><CheckCircle2 size={16}/> Approve</button>
      </div>
    </section>}
  </div>;
}

function RevBotPanel({ running, setRunning, goal, setGoal, tasks, clients, earnings }: { running:boolean; setRunning:(v:boolean)=>void; goal:string; setGoal:(v:string)=>void; tasks:Task[]; clients:Client[]; earnings:EarningsEntry[] }) {
  const approved=tasks.filter(t=>t.status==="Approved").length;
  const paid=earnings.filter(e=>e.status==="Paid").length;
  return <div>
    <div className="stats">
      <div className="stat"><div className="statIcon"><Bot size={18}/></div><span>RevBot</span><strong>{running?"ON":"OFF"}</strong><small>{running?"Automation armed":"Manual mode"}</small></div>
      <div className="stat"><div className="statIcon"><Radar size={18}/></div><span>Opportunities</span><strong>{tasks.length}</strong><small>Tasks created</small></div>
      <div className="stat"><div className="statIcon"><CheckCircle2 size={18}/></div><span>Approved</span><strong>{approved}</strong><small>Human approved</small></div>
      <div className="stat"><div className="statIcon"><DollarSign size={18}/></div><span>Paid records</span><strong>{paid}</strong><small>Confirmed manually</small></div>
    </div>
    <div className="grid">
      <section className="panel">
        <div className="panelHead"><div><h3>RevBot Command Center</h3><p>Control what the robot prepares; actions remain approval-aware.</p></div><Bot size={18}/></div>
        <div className="featureCard"><div className="featureIcon"><Zap size={19}/></div><div><b>Automation status</b><span>{running?"RevBot is running in local demo mode.":"RevBot is paused."}</span></div><button className="primary" onClick={()=>setRunning(!running)}>{running?"Pause RevBot":"Start RevBot"}</button></div>
        <label className="fieldLabel">Primary goal</label>
        <textarea className="taskInput taskArea" value={goal} onChange={e=>setGoal(e.target.value)} />
        <div className="notice"><ShieldCheck size={16}/><span>RevBot does not submit applications, send messages, or create fake earnings automatically. Those actions require a permitted backend integration and explicit approval.</span></div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h3>Automation Pipeline</h3><p>Current workspace signals</p></div><Activity size={18}/></div>
        <div className="queue">
          <div className="featureCard"><div className="featureIcon"><Radar size={19}/></div><div><b>Discover</b><span>Review opportunities in the radar.</span></div><span className="tag">READY</span></div>
          <div className="featureCard"><div className="featureIcon"><FileText size={19}/></div><div><b>Prepare</b><span>{tasks.length} task{tasks.length===1?"":"s"} available.</span></div><span className="tag">{tasks.length?"READY":"WAIT"}</span></div>
          <div className="featureCard"><div className="featureIcon"><CheckCircle2 size={19}/></div><div><b>Approval</b><span>{approved} approved proposal{approved===1?"":"s"}.</span></div><span className="tag">HUMAN</span></div>
          <div className="featureCard"><div className="featureIcon"><BriefcaseBusiness size={19}/></div><div><b>Clients</b><span>{clients.length} client record{clients.length===1?"":"s"}.</span></div><span className="tag">{clients.length?"READY":"WAIT"}</span></div>
        </div>
      </section>
    </div>
  </div>;
}

function ClientPanel({ clients, setClients, tasks }: { clients: Client[]; setClients: React.Dispatch<React.SetStateAction<Client[]>>; tasks: Task[] }) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [company,setCompany]=useState("");
  const [taskTitle,setTaskTitle]=useState(tasks[0]?.title ?? "");

  const addClient=()=>{
    if(!name.trim()) return;
    setClients(prev=>[...prev,{id:Date.now(),name:name.trim(),email:email.trim(),company:company.trim(),taskTitle,status:"Lead"}]);
    setName(""); setEmail(""); setCompany("");
  };

  return <div className="grid">
    <section className="panel">
      <div className="panelHead"><div><h3>Client Workspace</h3><p>Create and track client records locally</p></div><BriefcaseBusiness size={18}/></div>
      <label className="fieldLabel">Client name</label><input className="taskInput" value={name} onChange={e=>setName(e.target.value)} placeholder="Client name"/>
      <label className="fieldLabel">Email</label><input className="taskInput" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@example.com"/>
      <label className="fieldLabel">Company</label><input className="taskInput" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Optional"/>
      <label className="fieldLabel">Related task</label><select value={taskTitle} onChange={e=>setTaskTitle(e.target.value)}>{tasks.length ? tasks.map(t=><option key={t.id}>{t.title}</option>) : <option>No task yet</option>}</select>
      <button className="primary wideBtn" onClick={addClient} disabled={!name.trim()}><BriefcaseBusiness size={16}/> Add client</button>
    </section>
    <section className="panel">
      <div className="panelHead"><div><h3>Client list</h3><p>{clients.length} local record{clients.length===1?"":"s"}</p></div><CheckCircle2 size={18}/></div>
      {!clients.length ? <div className="empty">No clients yet. Add one from the form.</div> : <div className="queue">{clients.map(cl=><div className="featureCard" key={cl.id}><div className="featureIcon"><BriefcaseBusiness size={19}/></div><div><b>{cl.name}</b><span>{cl.company||"No company"} • {cl.email||"No email"} • {cl.taskTitle||"No task"}</span></div><select value={cl.status} onChange={e=>setClients(prev=>prev.map(x=>x.id===cl.id?{...x,status:e.target.value as Client["status"]}:x))}><option>Lead</option><option>Active</option><option>Completed</option></select></div>)}</div>}
    </section>
    <div className="notice"><ShieldCheck size={16}/><span>Client records are local demo state. Persistent clients and real messages require the secure backend.</span></div>
  </div>;
}

function EarningsPanel({ earnings, setEarnings, tasks, clients }: { earnings:EarningsEntry[]; setEarnings:React.Dispatch<React.SetStateAction<EarningsEntry[]>>; tasks:Task[]; clients:Client[] }) {
  const [taskTitle,setTaskTitle]=useState(tasks[0]?.title ?? "");
  const [clientName,setClientName]=useState(clients[0]?.name ?? "");
  const [amount,setAmount]=useState("");

  const addEntry=()=>{
    if(!taskTitle || !clientName || !amount.trim()) return;
    setEarnings(prev=>[...prev,{id:Date.now(),taskTitle,clientName,amount:amount.trim(),status:"Pending",note:"Awaiting real payment confirmation"}]);
    setAmount("");
  };

  return <div>
    <section className="panel">
      <div className="panelHead"><div><h3>Earnings Ledger</h3><p>Track approved jobs without inventing payment data</p></div><DollarSign size={18}/></div>
      <div className="stats">
        <div className="stat"><div className="statIcon"><DollarSign size={18}/></div><span>Total recorded</span><strong>{earnings.length}</strong><small>Ledger entries</small></div>
        <div className="stat"><div className="statIcon"><CheckCircle2 size={18}/></div><span>Paid</span><strong>{earnings.filter(e=>e.status==="Paid").length}</strong><small>Only after confirmation</small></div>
      </div>
      <div className="notice"><ShieldCheck size={16}/><span>Amounts here are user-provided records only. No fake payment or bank balance is generated.</span></div>
    </section>
    <section className="panel sectionGap">
      <div className="panelHead"><div><h3>Add earning record</h3><p>Record a real payment you have actually received</p></div><FileText size={18}/></div>
      <label className="fieldLabel">Task</label><select value={taskTitle} onChange={e=>setTaskTitle(e.target.value)}>{tasks.length?tasks.map(t=><option key={t.id}>{t.title}</option>):<option>No task yet</option>}</select>
      <label className="fieldLabel">Client</label><select value={clientName} onChange={e=>setClientName(e.target.value)}>{clients.length?clients.map(cl=><option key={cl.id}>{cl.name}</option>):<option>No client yet</option>}</select>
      <label className="fieldLabel">Amount</label><input className="taskInput" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. Rs 5,000"/>
      <button className="primary wideBtn" onClick={addEntry} disabled={!tasks.length||!clients.length||!amount.trim()}><DollarSign size={16}/> Add pending record</button>
    </section>
    <section className="panel sectionGap">
      <div className="panelHead"><div><h3>Ledger</h3><p>Payment status remains under your control</p></div><Clock3 size={18}/></div>
      {!earnings.length?<div className="empty">No earnings recorded.</div>:<div className="oppList">{earnings.map(e=><div className="opp" key={e.id}><div className="oppIcon"><DollarSign size={18}/></div><div className="oppMain"><b>{e.taskTitle}</b><span>{e.clientName} • {e.note}</span></div><div className="value">{e.amount}</div><select value={e.status} onChange={ev=>setEarnings(prev=>prev.map(x=>x.id===e.id?{...x,status:ev.target.value as EarningsEntry["status"],note:ev.target.value==="Paid"?"Marked paid by user":"Awaiting real payment confirmation"}:x))}><option>Pending</option><option>Paid</option></select></div>)}</div>}
    </section>
  </div>;
}
