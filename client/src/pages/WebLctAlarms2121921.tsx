import { useState } from "react";
import { ChevronDown, ChevronRight, CircleHelp, FileDown, Filter, Printer, X } from "lucide-react";
import "./WebLctAlarms2121921.css";

type TrainingAlarm = { severity: "Major" | "Critical" | "Minor"; name: string; object: string; rising: string; type: string; description: string; causes: string[] };

const alarms: TrainingAlarm[] = [
  { severity: "Major", name: "LAN_LOC", object: "TRAINING-ALARM-NE / Shelf / ETH-1", rising: "Training timestamp", type: "Communication", description: "Training-only LAN loss-of-carrier example.", causes: ["Inspect the approved physical-link checklist.", "Compare source and sink interface state.", "Do not modify a production port from this training replica."] },
  { severity: "Major", name: "POWER_FAIL", object: "TRAINING-ALARM-NE / Shelf / PIU", rising: "Training timestamp", type: "Equipment", description: "Training-only power-state example.", causes: ["Confirm the local power record and cabinet procedure.", "Escalate according to the approved site O&M process."] },
  { severity: "Critical", name: "SWDL_CHNG_MISMATCH", object: "TRAINING-ALARM-NE / Shelf", rising: "Training timestamp", type: "Equipment", description: "Training-only software-change mismatch example.", causes: ["Stop unrelated changes.", "Compare the release record and approved rollback plan."] },
  { severity: "Minor", name: "SHELF_POWER_UNCONFIG", object: "—", rising: "Training timestamp", type: "Equipment", description: "Training-only unconfigured-power example.", causes: ["Verify the installed hardware against the approved BOM."] },
];

export default function WebLctAlarms2121921() {
  const [selected, setSelected] = useState(alarms[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showLatest, setShowLatest] = useState(true);
  return <main className="lct551-page" dir="ltr">
    <div className="lct551-disclosure">TRAINING REPLICA · REFERENCE SCREEN: NE VERSION 212.19.21 · SYNTHETIC ALARMS ONLY</div>
    <header className="lct551-header"><div className="lct551-wordmark"><span className="lct551-flower">✺</span><strong>Web LCT</strong></div><div className="lct551-tools"><button>▣</button><button>☷</button><button><CircleHelp size={16} /></button><button><X size={16} /></button></div></header>
    <div className="lct551-status"><span>NE NAME: TRAINING-ALARM-NE</span><i/> <span>REFERENCE NE VERSION: 212.19.21</span><i/> <span>CURRENT USER: training</span><i/> <span>NE STATE: RUNNING — SIMULATED</span><div className="lct551-counts"><b className="red">—</b><b className="orange">—</b><b className="yellow">—</b><b className="blue">—</b><b className="cyan">—</b></div></div>
    <section className="lct551-shell">
      <aside className="lct551-left"><div className="lct551-device"><b><ChevronDown size={12}/> TRAINING-ALARM-NE</b><span><ChevronDown size={12}/> Shelf0 (subrack)</span>{["1-ISMB", "5-PIU", "23-ODU", "27-ODU", "47-ODU"].map((item) => <span className="device-child" key={item}>{item}</span>)}</div><div className="lct551-divider"/><div className="lct551-function"><b>Function Tree</b><span><ChevronDown size={12}/> Configuration</span><span className="active"><ChevronDown size={12}/> Alarm</span><span className="child selected">Browse Alarms</span><span className="child">Browse Abnormal Events</span><span className="child">NE Alarm Attributes</span><span className="child">NE Alarm Suppression</span><span><ChevronRight size={12}/> Performance</span><span><ChevronRight size={12}/> Communication</span><span><ChevronRight size={12}/> Security</span><span><ChevronRight size={12}/> Report</span></div><p>Reference structure only. The reference itself is a separate release from the performance module.</p></aside>
      <section className="lct551-workspace"><div className="lct551-tabs"><button>Slot Layout</button><button className="active">Browse Current Alarms <X size={12}/></button><button>Browse History Alarms <X size={12}/></button></div><div className="lct551-pagination"><span>Total: {alarms.length}, Selected: 1</span><div>First &nbsp;|&nbsp; Previous &nbsp;|&nbsp; Next &nbsp;|&nbsp; Last &nbsp;|&nbsp; 1/1 &nbsp;|&nbsp; Goto <select><option>1</option></select> &nbsp; Each Page <select><option>40</option></select></div></div>
        {filterOpen && <div className="lct551-filter"><b>Training filter</b><label>Severity <select><option>All</option><option>Major</option><option>Critical</option><option>Minor</option></select></label><button onClick={() => setFilterOpen(false)}>Close</button></div>}
        <div className="lct551-table-wrap"><table><thead><tr><th>Severity</th><th>Alarm Name</th><th>Monitored Object</th><th>Rising Time</th><th>Alarm Type</th></tr></thead><tbody>{alarms.map((alarm) => <tr key={alarm.name} className={selected.name === alarm.name ? "selected" : ""} onClick={() => setSelected(alarm)}><td><span className={`severity ${alarm.severity.toLowerCase()}`}>{alarm.severity}</span></td><td>{alarm.name}</td><td>{alarm.object}</td><td>{alarm.rising}</td><td>{alarm.type}</td></tr>)}</tbody></table></div>
        <div className="lct551-detail-row"><section><h2>Alarm Details</h2><p>Alarm Description: {selected.description}</p></section><section><h2>Alarm Causes</h2>{selected.causes.map((cause, index) => <p key={cause}>({index + 1}) {cause}</p>)}</section></div>
        <div className="lct551-actions"><label><input type="checkbox" checked={showLatest} onChange={(event) => setShowLatest(event.target.checked)}/> Show latest alarms</label><span>{showLatest ? "Unfiltered!" : "Training filter active"}</span><div><button onClick={() => window.alert("Delete is disabled in this training replica.")}>Delete</button><button onClick={() => setFilterOpen(true)}><Filter size={12}/> Filter</button><button disabled>Synchronize</button><button onClick={() => window.alert("Print is unavailable in this offline training replica.")}><Printer size={12}/> Print</button><button onClick={() => window.alert("Training export only; no NE data is available.")}><FileDown size={12}/> Save As</button></div></div>
        <footer>2009–2022 Huawei Technologies Co., Ltd. appears in the public reference; this is a training reconstruction, not Huawei software.</footer>
      </section>
    </section>
  </main>;
}
