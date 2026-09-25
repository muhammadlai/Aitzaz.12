"use client";

import { useEffect, useState } from "react";
import {
  Activity, Bot, BriefcaseBusiness, CheckCircle2, Clock3, DollarSign,
  Inbox, Mail, Radar, Settings, ShieldCheck, Sparkles, TrendingUp,
  Zap, Circle
} from "lucide-react";

const activities = [
  ["Opportunity scanner","Watching approved sources","active"],
  ["Email monitor","Inbox connected — waiting for new mail","idle"],
  ["Task engine","Ready for incoming work","ready"],
  ["Client agent","No pending client replies","idle"]
];

const opportunities = [
  {title:"Data entry & web research", source:"Opportunity feed", value:"Rs 2,500–5,000", match:"94%"},
  {title:"Social media post package", source:"Client inbox", value:"Rs 3,000–6,000", match:"89%"},
  {title:"YouTube thumbnail", source:"Opportunity feed", value:"Rs 800–1,500", match:"86%"}
];

export default function Home() {
  const [online,setOnline]=useState(true);
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t)},[]);
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Bot size={22}/></div><div><b>EARNING</b><span>ROBOT</span></div></div>
        <div className="navLabel">CONTROL CENTER</div>
        {[
          [Activity,"Overview"],[Radar,"Opportunities"],[Inbox,"Tasks"],[Mail,"Email Agent"],
          [BriefcaseBusiness,"Clients"],[DollarSign,"Earnings"]
        ].map(([Icon,label],i)=><button className={"nav "+(i===0?"active":"")} key={label as string}><Icon size={18}/><span>{label as string}</span>{i===1&&<em>3</em>}</button>)}
        <div className="navBottom"><button className="nav"><Settings size={18}/><span>Settings</span></button><div className="system"><Circle size={9} fill="currentColor"/><span>System ready</span></div></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><div className="eyebrow">AUTONOMOUS WORKSPACE</div><h1>Robot Control Center</h1></div>
          <div className="topRight"><div className="clock">{time.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</div><div className="status" onClick={()=>setOnline(!online)}><span className={online?"pulse":"pulse off"}></span>{online?"ONLINE":"PAUSED"}</div><div className="avatar">MK</div></div>
        </header>

        <div className="hero">
          <div><div className="heroTitle"><Sparkles size={19}/> Autonomous mode</div><h2>Your agent is ready to work.</h2><p>Monitor opportunities, incoming email and approved work sources from one workspace.</p></div>
          <div className="heroStatus"><div className="bigPulse"><Zap size={21}/></div><div><b>{online?"Monitoring":"Paused"}</b><span>Last cycle: just now</span></div></div>
        </div>

        <div className="stats">
          {[
            ["Today's earnings","Rs 0","—",DollarSign],
            ["Opportunities","3","+3 today",Radar],
            ["Active tasks","0","All clear",BriefcaseBusiness],
            ["Pending payments","Rs 0","0 invoices",TrendingUp]
          ].map(([a,b,c,I])=><div className="stat" key={a as string}><div className="statIcon"><I size={18}/></div><span>{a as string}</span><strong>{b as string}</strong><small>{c as string}</small></div>)}
        </div>

        <div className="grid">
          <section className="panel wide"><div className="panelHead"><div><h3>Opportunity Radar</h3><p>New opportunities detected by the agent</p></div><button className="ghost">View all <span>→</span></button></div>
            <div className="oppList">{opportunities.map(o=><div className="opp" key={o.title}><div className="oppIcon"><BriefcaseBusiness size={18}/></div><div className="oppMain"><b>{o.title}</b><span>{o.source}</span></div><div className="match">{o.match}<small>match</small></div><div className="value">{o.value}</div><button className="inspect">Review</button></div>)}</div>
          </section>
          <section className="panel"><div className="panelHead"><div><h3>Agent Activity</h3><p>Live worker status</p></div><Activity size={18}/></div>
            <div className="activity">{activities.map(([a,b,s])=><div className="act" key={a}><span className={"dot "+s}></span><div><b>{a}</b><span>{b}</span></div></div>)}</div>
          </section>
        </div>

        <div className="grid lower">
          <section className="panel"><div className="panelHead"><div><h3>Automation Queue</h3><p>What the robot will process next</p></div><Clock3 size={18}/></div><div className="queue"><div><Mail/><span>Check connected inbox</span><b>Ready</b></div><div><Radar/><span>Scan approved opportunity sources</span><b>Ready</b></div><div><Sparkles/><span>Analyze new requirements</span><b>Waiting</b></div></div></section>
          <section className="panel"><div className="panelHead"><div><h3>Safety & Permissions</h3><p>Automation stays within approved access</p></div><ShieldCheck size={18}/></div><div className="safety"><CheckCircle2/><div><b>Approval-aware automation</b><span>No mass spam, fake accounts or platform bypassing.</span></div></div><div className="safety"><CheckCircle2/><div><b>Secrets stay out of source code</b><span>API credentials will be supplied through secure environment settings.</span></div></div></section>
        </div>
        <footer><span>Earning Robot v0.1 • foundation build</span><span>Local time {time.toLocaleDateString()}</span></footer>
      </section>
    </main>
  );
}