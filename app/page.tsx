"use client";

import { useMemo, useState } from "react";
import {
  Activity, Bot, BriefcaseBusiness, CheckCircle2, Clock3, DollarSign,
  Inbox, Mail, Radar, Search, ShieldCheck, Sparkles, Star, Zap
} from "lucide-react";

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
  const [tab, setTab] = useState<"overview" | "opportunities" | "email">("overview");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(seed);
  const [emailConnected, setEmailConnected] = useState(false);

  const filtered = useMemo(() => items.filter(o =>
    (category === "All" || o.category === category) &&
    o.title.toLowerCase().includes(query.toLowerCase())
  ), [items, query, category]);

  const save = (id: number) => setItems(prev => prev.map(o => o.id === id ? { ...o, status: "Saved" } : o));

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Bot size={22}/></div><div><b>EARNING</b><span>ROBOT</span></div></div>
        <div className="navLabel">CONTROL CENTER</div>
        <button className={"nav " + (tab === "overview" ? "active" : "")} onClick={() => setTab("overview")}><Activity size={18}/><span>Overview</span></button>
        <button className={"nav " + (tab === "opportunities" ? "active" : "")} onClick={() => setTab("opportunities")}><Radar size={18}/><span>Opportunities</span><em>{items.length}</em></button>
        <button className="nav"><BriefcaseBusiness size={18}/><span>Tasks</span></button>
        <button className={"nav " + (tab === "email" ? "active" : "")} onClick={() => setTab("email")}><Mail size={18}/><span>Email Agent</span></button>
        <button className="nav"><DollarSign size={18}/><span>Earnings</span></button>
        <div className="navBottom"><div className="system"><span className="systemDot"/>System ready</div></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><div className="eyebrow">PHASE 2 • OPPORTUNITY + EMAIL LAYER</div><h1>{tab === "overview" ? "Robot Control Center" : tab === "opportunities" ? "Opportunity Radar" : "Email Agent"}</h1></div>
          <div className="topRight"><div className="status"><span className="pulse"></span>AUTOMATION READY</div><div className="avatar">ER</div></div>
        </header>

        {tab === "overview" && <Overview setTab={setTab} emailConnected={emailConnected} opportunities={items.length}/>}
        {tab === "opportunities" && <OpportunityPanel filtered={filtered} query={query} setQuery={setQuery} category={category} setCategory={setCategory} save={save}/>}
        {tab === "email" && <EmailPanel connected={emailConnected} onConnect={() => setEmailConnected(true)}/>}
      </section>
    </main>
  );
}

function Overview({ setTab, emailConnected, opportunities }: { setTab: (t: "overview" | "opportunities" | "email") => void; emailConnected: boolean; opportunities: number }) {
  return <div>
    <div className="hero">
      <div><div className="heroTitle"><Sparkles size={18}/> Phase 2 automation layer</div><h2>Discover work before you act.</h2><p>The opportunity workspace can filter, score and save work. Email connection is prepared for the next backend step.</p></div>
      <div className="heroStatus"><div className="bigPulse"><Zap size={21}/></div><div><b>Ready</b><span>Static test environment</span></div></div>
    </div>

    <div className="stats">
      <div className="stat"><div className="statIcon"><Radar size={18}/></div><span>Opportunities</span><strong>{opportunities}</strong><small>Demo records</small></div>
      <div className="stat"><div className="statIcon"><Star size={18}/></div><span>Saved</span><strong>0</strong><small>Waiting for review</small></div>
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
  </div>;
}

function OpportunityPanel({ filtered, query, setQuery, category, setCategory, save }: { filtered: Opportunity[]; query: string; setQuery: (v: string) => void; category: string; setCategory: (v: string) => void; save: (id: number) => void }) {
  return <div>
    <div className="panel toolbar">
      <div className="searchBox"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search opportunities..." /></div>
      <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option><option>Data</option><option>Social</option><option>Design</option></select>
      <span className="demoBadge">DEMO DATA</span>
    </div>
    <section className="panel">
      <div className="panelHead"><div><h3>Opportunity Inbox</h3><p>{filtered.length} matching opportunities • no applications are sent automatically</p></div><Radar size={18}/></div>
      <div className="oppList">{filtered.map(o => <div className="opp" key={o.id}>
        <div className="oppIcon"><BriefcaseBusiness size={18}/></div>
        <div className="oppMain"><b>{o.title}</b><span>{o.source} • {o.category}</span></div>
        <div className="match">{o.match}%<small>match</small></div>
        <div className="value">{o.value}</div>
        <button className={"inspect " + (o.status === "Saved" ? "saved" : "")} onClick={() => save(o.id)}>{o.status === "Saved" ? "Saved" : "Save"}</button>
      </div>)}</div>
      {!filtered.length && <div className="empty">No matching opportunities.</div>}
    </section>
    <div className="notice"><ShieldCheck size={16}/><span>Phase 2 only prepares and organizes opportunities. Real marketplace connectors will be added through permitted APIs or approved integrations.</span></div>
  </div>;
}

function EmailPanel({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return <div className="grid emailGrid">
    <section className="panel">
      <div className="panelHead"><div><h3>Email Agent</h3><p>Inbox monitoring preparation</p></div><Mail size={18}/></div>
      <div className="emailCard"><div className="mailIcon"><Inbox size={22}/></div><div><b>{connected ? "Test connection enabled" : "Connect your mailbox"}</b><span>{connected ? "This Phase 2 button only changes local demo state." : "Secure OAuth will be implemented when the backend is connected."}</span></div></div>
      <button className="primary wideBtn" onClick={onConnect}>{connected ? "Connected (demo)" : "Connect email (demo)"}</button>
    </section>
    <section className="panel">
      <div className="panelHead"><div><h3>What happens next</h3><p>Backend-required features</p></div><Zap size={18}/></div>
      <div className="queue"><div><Mail/><span>Read approved inbox messages</span><b>READY</b></div><div><Sparkles/><span>Extract client requirements</span><b>NEXT</b></div><div><BriefcaseBusiness/><span>Create a task from a request</span><b>NEXT</b></div><div><CheckCircle2/><span>Draft reply for approval</span><b>NEXT</b></div></div>
    </section>
  </div>;
}
