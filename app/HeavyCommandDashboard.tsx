"use client";

import { Activity, Bot, BrainCircuit, Database, Gauge, Globe2, LockKeyhole, Radar, Server, ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";

type Props = {
  opportunities: number;
  saved: number;
  tasks: number;
  approved: number;
  clients: number;
  paid: number;
  revbotRunning: boolean;
};

export default function HeavyCommandDashboard({ opportunities, saved, tasks, approved, clients, paid, revbotRunning }: Props) {
  const queue = Math.max(saved + tasks + approved, 0);
  const load = Math.min(98, 34 + opportunities * 6 + tasks * 5);
  const activity = [
    ["RADAR", opportunities + " opportunity nodes indexed", "ACTIVE"],
    ["REV-BOT", revbotRunning ? "automation core running" : "automation core standing by", revbotRunning ? "LIVE" : "STANDBY"],
    ["TASK", tasks + " task records in pipeline", "SYNC"],
    ["GATE", approved + " approvals cleared", "LOCKED"],
    ["CLIENT", clients + " client records available", "READY"],
    ["LEDGER", paid + " paid records confirmed", "VERIFIED"]
  ];

  return (
    <section className="heavyDashboard sectionGap">
      <div className="heavyHeader">
        <div>
          <span className="heavyKicker">NEXUS OS // REV-BOT OPERATIONS</span>
          <h2>MASTER COMMAND GRID</h2>
          <p>One-screen control layer for discovery, task preparation, approvals, clients and verified earnings.</p>
        </div>
        <div className="coreBadge"><i /> CORE {revbotRunning ? "RUNNING" : "STANDBY"}</div>
      </div>

      <div className="heavyMetrics">
        <div><span><Radar size={13}/> RADAR</span><b>{opportunities}</b><small>opportunity nodes</small></div>
        <div><span><Bot size={13}/> REV-BOT</span><b>{revbotRunning ? "ON" : "OFF"}</b><small>automation state</small></div>
        <div><span><Gauge size={13}/> QUEUE</span><b>{queue}</b><small>items in pipeline</small></div>
        <div><span><ShieldCheck size={13}/> GATE</span><b>{approved}</b><small>approved tasks</small></div>
        <div><span><Database size={13}/> LEDGER</span><b>{paid}</b><small>paid records</small></div>
      </div>

      <div className="heavyBody">
        <div className="heavyTerminal">
          <div className="heavyTerminalTop">
            <span><Terminal size={13}/> LIVE_EVENT_STREAM</span>
            <span>SECURE // MONITORED</span>
          </div>
          <div className="heavyLogs">
            {activity.map(([source, message, state], i) => (
              <div className="heavyLog" key={source}>
                <span className="logIndex">0{i + 1}</span>
                <b>[{source}]</b>
                <span>{message}</span>
                <em>{state}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="heavyCore">
          <div className="coreRing">
            <div><span>CORE</span><strong>{load}%</strong><small>READY</small></div>
          </div>
          <div className="coreStats">
            <span><span className="cpuGlyph">CPU</span> PROCESSING <b>{load}%</b></span>
            <span><Globe2 size={12}/> NETWORK <b>SECURE</b></span>
            <span><LockKeyhole size={12}/> SECRETS <b>SERVER</b></span>
            <span><ShieldCheck size={12}/> SAFETY <b>ACTIVE</b></span>
          </div>
        </div>
      </div>

      <div className="heavyModules">
        <div><Sparkles size={15}/><span>AI PROPOSAL</span><b>READY</b><small>Generate + human approve</small></div>
        <div><BrainCircuit size={15}/><span>OPPORTUNITY AI</span><b>READY</b><small>Score and organize work</small></div>
        <div><Server size={15}/><span>BACKEND LINK</span><b>WAITING</b><small>Connect secure API when hosted</small></div>
        <div><Activity size={15}/><span>ACTIVITY FEED</span><b>LIVE</b><small>Local browser telemetry</small></div>
      </div>

      <div className="heavyFooter">
        <span><Zap size={12}/> HUMAN APPROVAL REQUIRED</span>
        <span>NO AUTO-SEND</span>
        <span>NO FAKE EARNINGS</span>
        <span>PUBLIC UI • SAFE MODE</span>
      </div>
    </section>
  );
}
