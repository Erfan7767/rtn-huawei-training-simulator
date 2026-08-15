import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Activity, AlertTriangle, ChevronDown, ChevronRight, CircleHelp, FileDown, Gauge, RadioTower, Search, ShieldAlert, SlidersHorizontal, X } from "lucide-react";
import "./BrowseAlarms.css";

type AlarmMode = "current" | "history";
type Severity = "All" | "Critical" | "Major" | "Minor";

type TrainingAlarm = {
  id: string;
  type: string;
  rising: string;
  object: string;
  name: string;
  severity: Exclude<Severity, "All">;
  detail: string;
  cause: string;
};

const trainingAlarms: TrainingAlarm[] = [
  { id: "a1", type: "Non-live", rising: "2026-08-16 10:24:18", object: "MW-TRAIN-NE / ODU-1", name: "Training: Link degraded", severity: "Major", detail: "Example alarm state used for the training decision path.", cause: "Compare the two endpoints, then inspect the performance interval before changing configuration." },
  { id: "a2", type: "Non-live", rising: "2026-08-16 10:20:42", object: "MW-TRAIN-NE / IF-1", name: "Training: Receive level below reference", severity: "Minor", detail: "Example receive-level condition; it is not a measurement from a radio.", cause: "Check the link budget reference, connectors, alignment record, and the opposite endpoint." },
  { id: "a3", type: "Non-live", rising: "2026-08-16 10:18:07", object: "MW-TRAIN-NE", name: "Training: No active device session", severity: "Critical", detail: "The replica never connects to a Huawei device or production network.", cause: "Use this row to teach the trainee to verify the session context before interpreting alarms." },
];

export default function BrowseAlarms() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<AlarmMode>("current");
  const [severity, setSeverity] = useState<Severity>("All");
  const [typeFilter, setTypeFilter] = useState("Current");
  const [queried, setQueried] = useState(false);
  const [selected, setSelected] = useState<TrainingAlarm | null>(null);
  const visible = useMemo(() => {
    if (!queried) return [];
    return trainingAlarms.filter((alarm) => severity === "All" || alarm.severity === severity);
  }, [queried, severity]);

  const query = () => {
    setQueried(true);
    setSelected(null);
  };

  return (
    <main className="alarms-page" aria-label="Browse Current Alarms training replica">
      <div className="alarms-training-banner">TRAINING REPLICA · NOT PRODUCTION SOFTWARE · NO LIVE DEVICE SESSION</div>
      <header className="alarms-topbar">
        <div className="alarms-brand"><div className="alarms-sun">✺</div><b>Web LCT</b><span>V200R021C10SPC200 workflow replica</span></div>
        <div className="alarms-top-actions"><button aria-label="Help"><CircleHelp size={16} /></button><button aria-label="Close"><X size={16} /></button></div>
      </header>
      <div className="alarms-context"><span>NE NAME: MW-TRAIN-NE</span><span>NE VERSION: V200R021C10SPC200</span><span>CURRENT USER: TRAINING</span><span>NE STATE: RUNNING — SIMULATED</span><div className="alarm-counts"><i className="red">0</i><i className="amber">0</i><i className="yellow">0</i><i className="blue">0</i></div></div>
      <div className="alarms-shell">
        <aside className="alarms-left">
          <div className="equipment-tree"><b><ChevronDown size={12} /> MW-TRAIN-NE</b><span><ChevronDown size={12} /> 1-ISMB</span><span>4-ODU</span><span>6-ISMB</span><span><ChevronDown size={12} /> Radio Links</span><span className="indent">MW-TRAIN-NE-1</span></div>
          <div className="function-caption">Function Tree</div>
          <button className="function-row"><ChevronRight size={13} /><SlidersHorizontal size={14} /> Configuration</button>
          <button className="function-row active"><ChevronDown size={13} /><ShieldAlert size={14} /> <b>Alarm</b></button>
          <div className="function-child"><button className="child-active"><AlertTriangle size={12} /> Browse Current Alarms</button><button><Activity size={12} /> Browse History Alarms</button></div>
          <button className="function-row"><ChevronDown size={13} /><Gauge size={14} /> Performance</button>
          <button className="function-row"><ChevronDown size={13} /><RadioTower size={14} /> Radio Links</button>
          <div className="left-footnote">All alarms in this screen are synthetic training records.</div>
        </aside>
        <section className="alarms-main">
          <div className="alarm-breadcrumb">NE Explorer <ChevronRight size={12} /> Fault <ChevronRight size={12} /> <b>Browse Current Alarms</b></div>
          <div className="alarm-title-row"><div><span className="alarm-kicker">NE EXPLORER / FAULT / TRAINING VIEW</span><h1>Browse Current Alarms</h1><p>Review, filter, and inspect simulated alarm records using the observed Web LCT layout.</p></div><button className="open-radio" onClick={() => setLocation("/weblct-v200r021-training?screen=hop")}><RadioTower size={15} /> Open Radio Links</button></div>
          <div className="alarm-toolbar"><button className="toolbar-query" onClick={query}><Search size={14} /> Query</button><button onClick={() => window.alert("Training export only — no live alarm data is available.")}><FileDown size={14} /> Save As</button><label>Type:<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option>Current</option><option>History</option><option>All</option></select></label><label>Severity:<select value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}><option>All</option><option>Critical</option><option>Major</option><option>Minor</option></select></label><div className="mode-toggle"><button className={mode === "current" ? "selected" : ""} onClick={() => { setMode("current"); setQueried(false); }}>Current</button><button className={mode === "history" ? "selected" : ""} onClick={() => { setMode("history"); setQueried(false); }}>History</button></div></div>
          <div className="alarm-table-wrap"><table className="alarm-table"><thead><tr><th>Type</th><th>Rising time</th><th>Object</th><th>Alarm name</th><th>Severity</th></tr></thead><tbody>{visible.map((alarm) => <tr key={alarm.id} className={selected?.id === alarm.id ? "selected" : ""} onClick={() => setSelected(alarm)}><td>{alarm.type}</td><td>{mode === "current" ? alarm.rising : "Training history interval"}</td><td>{alarm.object}</td><td>{alarm.name}</td><td><span className={`severity ${alarm.severity.toLowerCase()}`}>{alarm.severity}</span></td></tr>)}{!visible.length && <tr><td colSpan={5} className="empty-row"><AlertTriangle size={18} /><b>{queried ? "No records match this training filter" : "Query to load training alarm records"}</b><span>The table remains empty until the operator chooses Query.</span></td></tr>}</tbody></table></div>
          {selected ? <section className="alarm-detail"><div><span>Alarm details / causes</span><h2>{selected.name}</h2><p>{selected.detail}</p></div><div className="cause-box"><b>Training decision point</b><p>{selected.cause}</p></div><button onClick={() => setSelected(null)} aria-label="Close details"><X size={15} /></button></section> : <div className="alarm-detail empty-detail">Select an item in the training table to review its details and cause guidance.</div>}
          <div className="alarms-disclosure"><ShieldAlert size={15} /><span>Training-only disclosure: these rows, timestamps, severities, and causes are synthetic examples. No alarm is read from or written to a Huawei device.</span></div>
        </section>
      </div>
      <footer className="alarms-footer"><span>Observed screen structure: public Web LCT reference workflow</span><span>Replica scope: alarms table and detail flow only</span><span>Training state: offline</span></footer>
    </main>
  );
}
