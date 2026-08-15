/**
 * Design reminder — Web LCT workflow reference: follow the observable navigation sequence
 * from the supplied playlist, but use a distinct visual system and label every data point as training-only.
 */
import { useState } from "react";
import { Activity, BarChart3, ChevronDown, ChevronRight, CircleAlert, Database, FileText, Gauge, History, LayoutList, RadioTower, RefreshCcw, Search, ShieldAlert, SlidersHorizontal, Table2 } from "lucide-react";
import "./PerformanceLab.css";

type Mode = "current" | "history";
type Interval = "15-minute" | "24-hour";

const metricRows = [
  ["Near-end radio path", "Received-signal trend", "Training reference — no live value", "Not a device result"],
  ["Far-end radio path", "Transmit-power trend", "Training reference — no live value", "Not a device result"],
  ["Near-end radio path", "Error-counter review", "Compare selected interval", "Training only"],
  ["Far-end radio path", "Link availability review", "Confirm from approved data", "Training only"],
];

export default function PerformanceLab() {
  const [mode, setMode] = useState<Mode>("current");
  const [interval, setInterval] = useState<Interval>("15-minute");
  const [view, setView] = useState<"table" | "chart">("table");
  const [queried, setQueried] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const query = () => setQueried(true);
  return <main className="perf-page" dir="ltr">
    <div className="perf-warning"><ShieldAlert size={15} /><b>WORKFLOW REFERENCE / TRAINING LAB</b><span>This is not Huawei Web LCT and contains no live NE data or original device output.</span></div>
    <header className="perf-titlebar"><div className="perf-app"><RadioTower size={18} /><strong>Network Element Explorer</strong><span>· training workflow model</span></div><div className="perf-top-actions"><button title="Training search"><Search size={15} /></button><button title="Training refresh"><RefreshCcw size={15} /></button><button title="Training alerts"><CircleAlert size={15} /></button></div></header>
    <div className="perf-toolbar"><button className="perf-brand">FIELDLINK / TRAINING</button><span>NE: <b>MW-TRAIN-A</b></span><span>State: <i /> Training-running</span><span>Workflow source: supplied playlist</span><span className="perf-time">Local training time · 15:34</span></div>
    <section className="perf-window">
      <aside className="perf-tree">
        <div className="perf-tree-head"><LayoutList size={15} /> Function Tree</div>
        <TreeItem icon={<SlidersHorizontal size={14} />} label="Configuration" />
        <TreeItem icon={<WrenchIcon />} label="Diagnosis & Maintenance" />
        <TreeItem icon={<CircleAlert size={14} />} label="Alarm" />
        <TreeItem icon={<Activity size={14} />} label="Performance" />
        <button className="tree-parent" onClick={() => setExpanded((value) => !value)}>{expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}<RadioTower size={14} /><b>Radio Links</b></button>
        {expanded && <div className="tree-children"><button className="tree-leaf active"><Gauge size={13} /> Microwave Link Performance</button><button className="tree-leaf"><Database size={13} /> Link Inventory</button></div>}
        <TreeItem icon={<FileText size={14} />} label="Report" />
        <div className="perf-tree-foot"><b>Training NE only</b><span>Target model / release must be verified before real operation.</span></div>
      </aside>
      <section className="perf-main">
        <div className="perf-breadcrumb">Radio Links <ChevronRight size={13} /> <b>Microwave Link Performance</b></div>
        <div className="perf-heading"><div><p>PERFORMANCE TRAINING VIEW</p><h1>Microwave Link Performance</h1><span>Observed workflow: select the view, set the interval or time window, then run a query.</span></div><div className="perf-ne-chip"><RadioTower size={16} /><div><small>Training link</small><b>MW-TRAIN-A ↔ MW-TRAIN-B</b></div></div></div>
        <nav className="perf-tabs"><button onClick={() => { setMode("current"); setQueried(false); }} className={mode === "current" ? "active" : ""}>Current Performance</button><button onClick={() => { setMode("history"); setQueried(false); }} className={mode === "history" ? "active" : ""}>History Performance</button></nav>
        <section className="perf-controls"><div className="perf-control-group"><span>Monitor period</span><div className="segment"><button onClick={() => setInterval("15-minute")} className={interval === "15-minute" ? "chosen" : ""}>15-Minute</button><button onClick={() => setInterval("24-hour")} className={interval === "24-hour" ? "chosen" : ""}>24-Hour</button></div></div>{mode === "history" && <div className="perf-control-group"><span>Period time</span><div className="date-field">Training start time <ChevronDown size={13} /></div><div className="date-field">Training end time <ChevronDown size={13} /></div></div>}<div className="perf-control-group events"><span>Performance events</span><label><input type="checkbox" defaultChecked /> Radio received-signal trend</label><label><input type="checkbox" defaultChecked /> Power trend</label><label><input type="checkbox" /> Error-counter review</label></div><div className="perf-query-area"><button onClick={() => setQueried(false)} className="reset">Reset</button><button onClick={query} className="query"><Search size={15} /> Query training view</button></div></section>
        {mode === "history" && <div className="perf-view-switch"><span>Display format</span><button onClick={() => setView("table")} className={view === "table" ? "selected" : ""}><Table2 size={14} /> Table</button><button onClick={() => setView("chart")} className={view === "chart" ? "selected" : ""}><BarChart3 size={14} /> Chart</button></div>}
        <section className="perf-results">{queried ? (mode === "history" && view === "chart" ? <TrainingChart /> : <TrainingTable interval={interval} mode={mode} />) : <QueryPrompt />}</section>
      </section>
    </section>
    <footer className="perf-footer"><span>Training data is intentionally non-operational.</span><span>Workflow reference: playlist videos showing Web LCT navigation and performance queries.</span><span>Do not use in place of the target release’s official documentation.</span></footer>
  </main>;
}

function WrenchIcon() { return <History size={14} />; }
function TreeItem({ icon, label }: { icon: React.ReactNode; label: string }) { return <button className="tree-item">{icon}<span>{label}</span></button>; }

function QueryPrompt() { return <div className="query-prompt"><div><Search size={25} /><h2>Ready for a training query</h2><p>Select a performance mode and interval, then choose <b>Query training view</b>. No device is contacted in this simulator.</p></div><ol><li>Select Current or History Performance.</li><li>Choose a monitor period or training time window.</li><li>Review the generated training-only near/far-end comparison.</li></ol></div>; }

function TrainingTable({ interval, mode }: { interval: Interval; mode: Mode }) { return <div className="training-table-wrap"><div className="results-label"><CheckCircleIcon /> Training query complete · {mode === "current" ? "Current" : "History"} / {interval}</div><table><thead><tr><th>Monitored object</th><th>Performance event</th><th>Training interpretation</th><th>Validity</th></tr></thead><tbody>{metricRows.map((row) => <tr key={row[0] + row[1]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table><p className="table-note">The rows deliberately omit RSL, XPD, SNR, transmit power, and error values. Populate real values only in a verified test environment under the applicable release and change controls.</p></div>; }
function TrainingChart() { return <div className="training-chart"><div className="results-label"><CheckCircleIcon /> Training chart generated · no device values</div><div className="chart-grid"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 720 220" role="img" aria-label="Training trend chart"><polyline points="20,146 105,124 195,152 285,94 380,111 472,64 560,85 690,48" fill="none" stroke="#3b9d8d" strokeWidth="4" /><polyline points="20,168 105,154 195,117 285,138 380,91 472,108 560,73 690,98" fill="none" stroke="#ce9550" strokeWidth="4" strokeDasharray="9 7" /></svg><div className="chart-legend"><span><i /> Near-end training trend</span><span><i /> Far-end training trend</span></div><p>This graphic teaches the query-and-compare interaction only; it is not a radio-power or performance record.</p></div>; }
function CheckCircleIcon() { return <span className="results-check">✓</span>; }
