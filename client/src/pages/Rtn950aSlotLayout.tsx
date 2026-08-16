import { ChevronDown, ChevronLeft, FileWarning, Radio, RotateCcw, Server, ShieldAlert } from "lucide-react";
import { useState } from "react";
import "./Rtn950aSlotLayout.css";

const slots = [
  { id: "shelf", label: "Shelf-0", type: "Shelf", detail: "RTN950A training chassis", state: "Ready" },
  { id: "ism6", label: "1-ISM6-LRTN(P-1)", type: "IF / Service", detail: "Link 1 · 2+0 training pair", state: "Configured" },
  { id: "odu21", label: "21-ODU", type: "ODU", detail: "Near end · Site A", state: "Training green" },
  { id: "odu41", label: "41-ODU", type: "ODU", detail: "Far end · Site B", state: "Training green" },
  { id: "empty1", label: "2-Empty", type: "Empty slot", detail: "Available in training view", state: "Empty" },
  { id: "empty2", label: "3-Empty", type: "Empty slot", detail: "Available in training view", state: "Empty" },
];

export default function Rtn950aSlotLayout() {
  const [selected, setSelected] = useState("ism6");
  const [expanded, setExpanded] = useState(true);
  const selectedSlot = slots.find((slot) => slot.id === selected) ?? slots[1];

  return <main className="slot-page" dir="ltr">
    <div className="slot-disclosure">TRAINING REPLICA · RTN950A SLOT LAYOUT · NO LIVE NE / NO DEVICE WRITE</div>
    <header className="slot-header"><a href="/rtn950a-link-lab" className="slot-back"><ChevronLeft size={15}/> Microwave Link Configuration</a><div className="slot-brand"><span>✺</span><b>Web LCT</b><em>Slot Layout · RTN950A Training</em></div><div className="slot-actions"><button aria-label="Help"><ShieldAlert size={15}/></button><button aria-label="Reset" onClick={() => setSelected("ism6")}><RotateCcw size={15}/></button></div></header>
    <div className="slot-status"><span>NE NAME: RTN950A-TRAINING-NE</span><i/><span>DEVICE TYPE: RTN950A</span><i/><span>NE STATE: OFFLINE / SIMULATED</span><b>TRAINING VIEW</b></div>
    <section className="slot-shell">
      <aside className="slot-tree"><section className="slot-tree-head"><b><ChevronDown size={12}/> RTN950A-TRAINING-NE</b><span><ChevronDown size={12}/> Shelf-0 (training)</span></section><section className="slot-tree-list">{slots.map((slot) => <button key={slot.id} className={selected === slot.id ? "selected" : ""} onClick={() => setSelected(slot.id)}><span className={`slot-dot ${slot.type === "ODU" ? "odu" : slot.type === "Empty slot" ? "empty" : "if"}`}/>{slot.label}<small>{slot.type}</small></button>)}</section><div className="slot-source"><FileWarning size={15}/><p>المصدر العام يثبت عرض Slot Layout وإضافة ISM6 وODU ضمن مسار RTN950A 2+0. هذه الشاشة لا تدّعي اكتشاف بطاقات فعلية.</p></div></aside>
      <section className="slot-main"><div className="slot-tabs"><button className="active">Slot Layout</button><a href="/rtn950a-link-lab">Microwave Link Configuration</a><button>Physical Link Aggregation</button></div><div className="slot-heading"><div><p>NE EXPLORER / SLOT LAYOUT</p><h1>Slot Layout</h1><span>عرض تدريبي تفاعلي لتوزيع البطاقات وODU في هيكل RTN950A.</span></div><div className="slot-scope"><Server size={17}/><b>RTN950A 2+0</b><small>Training Profile</small></div></div><div className="slot-toolbar"><button onClick={() => setExpanded((value) => !value)}><ChevronDown size={14}/> {expanded ? "Collapse Shelf" : "Expand Shelf"}</button><span><Radio size={14}/> {slots.filter((slot) => slot.state === "Training green").length} training ODU states</span></div>{expanded && <div className="slot-chassis"><div className="slot-chassis-label">SHELF-0 · RTN950A TRAINING CHASSIS</div><div className="slot-bay-grid">{slots.map((slot) => <button key={slot.id} className={`slot-bay ${selected === slot.id ? "selected" : ""} ${slot.type === "Empty slot" ? "empty" : ""}`} onClick={() => setSelected(slot.id)}><span className="slot-number">{slot.id === "shelf" ? "S" : slot.label.split("-")[0]}</span><span className="slot-bay-icon">{slot.type === "ODU" ? <Radio size={22}/> : slot.type === "IF / Service" ? <Server size={22}/> : <span className="empty-mark">—</span>}</span><b>{slot.label}</b><small>{slot.type}</small><em>{slot.state}</em></button>)}</div><div className="slot-legend"><span><i className="if"/> IF / Service</span><span><i className="odu"/> ODU</span><span><i className="empty"/> Empty / training available</span></div></div>}<section className="slot-detail"><div className="slot-detail-title"><div><span>SELECTED ELEMENT</span><h2>{selectedSlot.label}</h2></div><b className={selectedSlot.state === "Training green" ? "green" : selectedSlot.state === "Empty" ? "grey" : "blue"}>{selectedSlot.state}</b></div><div className="slot-detail-grid"><div><span>Element type</span><b>{selectedSlot.type}</b></div><div><span>Training mapping</span><b>{selectedSlot.detail}</b></div><div><span>Interaction</span><b>Click to inspect</b></div></div></section><div className="slot-notice"><ShieldAlert size={15}/><span>الحالة الخضراء تمثيل تعليمي لتسلسل التحقق، وليست دليلاً على اتصال ODU أو قبول ميداني. لا تُرسل أي تغييرات من هذه الشاشة.</span></div></section>
    </section>
    <footer className="slot-footer">Huawei Web LCT-inspired training replica · RTN950A scope only · visual structure reconstructed from public evidence</footer>
  </main>;
}
