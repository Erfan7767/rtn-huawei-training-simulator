import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, CircleHelp, FileDown, RadioTower, Search, X } from "lucide-react";
import "./WebLctPerformance52121927.css";

type View = "current" | "history";
type Format = "chart" | "report";

const deviceNodes = ["1-MXXI4B", "Radio Links", "TBK0162_NE_4 — 1-MXXI4B-1"];
const sourceMetrics = ["Training Source", "Training Sink"];

export default function WebLctPerformance52121927() {
  const [view, setView] = useState<View>("history");
  const [resolution, setResolution] = useState("24-Hour");
  const [format, setFormat] = useState<Format>("chart");
  const [metric, setMetric] = useState<"power" | "errors">("power");
  const [legend, setLegend] = useState(true);
  const [queried, setQueried] = useState(true);
  const resultCaption = useMemo(() => `${view === "history" ? "History" : "Current"} training query · ${resolution}`, [view, resolution]);

  return (
    <main className="lct521-page" dir="ltr">
      <div className="lct521-disclosure">TRAINING REPLICA · REFERENCE SCREEN: NE VERSION 5.212.19.27 · NO LIVE NE CONNECTION</div>
      <header className="lct521-header">
        <div className="lct521-wordmark"><span className="lct521-orb">◉</span><strong>Web LCT</strong></div>
        <div className="lct521-tools"><button aria-label="Notification">▣</button><button aria-label="Inventory">☷</button><button aria-label="Help"><CircleHelp size={16} /></button><button aria-label="Close"><X size={16} /></button></div>
      </header>
      <div className="lct521-statusbar">
        <span>NE NAME: TRAINING-NE-4</span><i /> <span>NE VERSION: 5.212.19.27</span><i /> <span>CURRENT USER: training</span><i /> <span>NE STATE: RUNNING — SIMULATED</span>
        <div className="lct521-counters"><b className="critical">—</b><b className="major">—</b><b className="minor">—</b><b className="warning">—</b><b className="event">—</b></div>
      </div>
      <section className="lct521-shell">
        <aside className="lct521-sidebar">
          <div className="lct521-device-tree">
            <b><ChevronDown size={13} /> TRAINING-NE-4</b>
            {deviceNodes.map((node, index) => <span className={index === 2 ? "selected" : ""} key={node}>{index < 2 ? <ChevronDown size={12} /> : <ChevronRight size={12} />}{node}</span>)}
          </div>
          <div className="lct521-split" />
          <div className="lct521-function-title">Function Tree</div>
          <div className="lct521-function-tree">
            <span><ChevronDown size={12} /> Configuration</span>
            <span className="child">1+1 Configuration Sync</span>
            <span className="child">Microwave Link Configuration</span>
            <span className="child">Microwave Link Alarm</span>
            <span className="child active">Microwave Link Performance</span>
            <span className="child">Physical Link Aggregation</span>
            <span><ChevronDown size={12} /> Diagnosis &amp; Maintenance</span>
            <span className="child">RF Scan</span>
            <span className="child">Microwave Link Loopback</span>
          </div>
          <p className="lct521-side-note">Screen structure reconstructed from a public performance reference. Names, counters, and values are not production data.</p>
        </aside>
        <section className="lct521-workspace">
          <div className="lct521-tabs"><button>Slot Layout</button><button>HOP Management</button><button className="active">Microwave Link Performance <X size={13} /></button></div>
          <div className="lct521-peer-row"><label>Source:<select><option>TRAINING-NE-4 V 1-MXXI4B-1</option></select></label><label>Sink:<select><option>TRAINING-NE-1 V 1-MXXI4B-1</option></select></label></div>
          <div className="lct521-view-tabs"><button className={view === "current" ? "active" : ""} onClick={() => { setView("current"); setQueried(false); }}>Current Performance</button><button className={view === "history" ? "active" : ""} onClick={() => { setView("history"); setQueried(true); }}>History Performance</button></div>
          {view === "history" ? <>
            <div className="lct521-controls"><div className="control-group"><b>Resolution:</b><label><input type="radio" checked={resolution === "15-Minute"} onChange={() => setResolution("15-Minute")} /> 15-Minute</label><label><input type="radio" checked={resolution === "24-Hour"} onChange={() => setResolution("24-Hour")} /> 24-Hour</label></div><div className="control-group period"><b>Period Time:</b><label>From <input value="Training start" readOnly /><button>...</button></label><label>To <input value="Training end" readOnly /><button>...</button></label></div></div>
            <div className="lct521-history-table"><table><thead><tr><th>NE Name</th><th>Max RX Power (dBm) in Query Period</th><th>Min RX Power (dBm) in Query Period</th></tr></thead><tbody>{sourceMetrics.map((name) => <tr key={name}><td>{name}</td><td>—</td><td>—</td></tr>)}</tbody></table></div>
            <div className="lct521-display-row"><div className="control-group"><b>Display Format:</b><label><input type="radio" checked={format === "chart"} onChange={() => setFormat("chart")} /> Chart</label><label><input type="radio" checked={format === "report"} onChange={() => setFormat("report")} /> Report</label></div><button className="lct521-query" onClick={() => setQueried(true)}><Search size={13} /> Query</button><button className="lct521-save" onClick={() => window.alert("Training export only. No live device data is available.")}><FileDown size={13} /> Save As...</button></div>
            {queried && (format === "chart" ? <div className="lct521-chart-wrap"><div className="lct521-chart-options"><label><input type="radio" checked={metric === "power"} onChange={() => setMetric("power")} /> Link TX/RX Power</label><label><input type="radio" checked={metric === "errors"} onChange={() => setMetric("errors")} /> Link Errors</label><button className={legend ? "legend-on" : ""} onClick={() => setLegend(!legend)}>Legend</button></div><PerformanceChart metric={metric} legend={legend} /></div> : <div className="lct521-report">The public reference shows a Report option; its layout is not fully visible in the source frame, so this training replica does not invent it.</div>)}
          </> : <CurrentPanel onQuery={() => setQueried(true)} queried={queried} />}
          <footer className="lct521-footer"><span>2009–2021 Huawei Technologies Co., Ltd. appears in the public reference; this replica is not Huawei software.</span><span>Training scope: visual workflow only</span></footer>
        </section>
      </section>
    </main>
  );
}

function CurrentPanel({ queried, onQuery }: { queried: boolean; onQuery: () => void }) {
  return <><div className="lct521-current-controls"><label><input type="radio" defaultChecked /> 15-Minute</label><label><input type="radio" /> 24-Hour</label><button className="lct521-query" onClick={onQuery}><Search size={13} /> Query</button><button className="lct521-save"><FileDown size={13} /> Save As...</button></div>{queried ? <div className="lct521-report">Current Performance uses the event categories observed in the public video. Values are intentionally omitted because no device is connected.</div> : <div className="lct521-report">Select a monitoring interval and Query to show the training-only event categories.</div>}</>;
}

function PerformanceChart({ metric, legend }: { metric: "power" | "errors"; legend: boolean }) {
  if (metric === "errors") return <div className="lct521-error-chart"><span>Link Errors</span><p>No live error counters are available in this training replica.</p></div>;
  return <div className="lct521-chart"><div className="chart-axis-y">TX/RX POWER</div><svg viewBox="0 0 900 270" role="img" aria-label="Training-only microwave link power trend"><g className="grid"><line x1="45" y1="30" x2="875" y2="30"/><line x1="45" y1="80" x2="875" y2="80"/><line x1="45" y1="130" x2="875" y2="130"/><line x1="45" y1="180" x2="875" y2="180"/><line x1="45" y1="230" x2="875" y2="230"/></g><polyline className="line green" points="45,48 180,48 320,62 470,55 620,58 760,53 875,56"/><polyline className="line cyan" points="45,95 180,98 320,102 470,109 620,101 760,106 875,112"/><polyline className="line orange" points="45,110 180,106 320,114 470,113 620,118 760,120 875,124"/><polyline className="line blue" points="45,155 180,164 320,151 470,162 620,158 760,154 875,156"/><polyline className="line magenta" points="45,178 180,174 320,183 470,181 620,179 760,184 875,181"/><polyline className="line red" points="45,203 180,205 320,198 470,206 620,208 760,207 875,210"/><g className="dates"><text x="75" y="255">Training D1</text><text x="250" y="255">Training D2</text><text x="425" y="255">Training D3</text><text x="600" y="255">Training D4</text><text x="775" y="255">Training D5</text></g></svg>{legend && <div className="lct521-legend"><span className="green">Source max RX</span><span className="cyan">Source actual RX</span><span className="orange">Sink max RX</span><span className="blue">Source min RX</span><span className="magenta">Sink actual RX</span><span className="red">Sink min RX</span></div>}</div>;
}
