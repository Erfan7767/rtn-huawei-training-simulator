import { CheckCircle2, ChevronDown, ChevronLeft, FileWarning, Radio, RotateCcw, Server, ShieldAlert } from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import "./Rtn950aSlotLayout.css";

type CardKind = "ism6" | "odu21" | "odu41";
type Placement = Record<string, CardKind | null>;

const cardCatalog: Record<CardKind, { label: string; hardwareLabel: string; detail: string; Icon: typeof Server }> = {
  ism6: { label: "ISM6 Training Card", hardwareLabel: "1-ISM6-LRTN(P-1)", detail: "IF / Service training module", Icon: Server },
  odu21: { label: "ODU 21 Training Module", hardwareLabel: "21-ODU", detail: "Near-end training module", Icon: Radio },
  odu41: { label: "ODU 41 Training Module", hardwareLabel: "41-ODU", detail: "Far-end training module", Icon: Radio },
};

const slotDefinitions: { id: string; number: string; expected: string; accepts: CardKind | null; detail: string }[] = [
  { id: "slot-1", number: "1", expected: "ISM6 Training Card", accepts: "ism6", detail: "Training slot for the visible ISM6 module." },
  { id: "slot-21", number: "21", expected: "ODU 21 Training Module", accepts: "odu21", detail: "Training ODU position mapped to the near end." },
  { id: "slot-41", number: "41", expected: "ODU 41 Training Module", accepts: "odu41", detail: "Training ODU position mapped to the far end." },
  { id: "slot-2", number: "2", expected: "Unmapped training bay", accepts: null, detail: "Shown only as an available training bay; no card may be installed here in this exercise." },
  { id: "slot-3", number: "3", expected: "Unmapped training bay", accepts: null, detail: "Shown only as an available training bay; no card may be installed here in this exercise." },
];

export default function Rtn950aSlotLayout() {
  const [placements, setPlacements] = useState<Placement>({ "slot-1": null, "slot-21": null, "slot-41": null, "slot-2": null, "slot-3": null });
  const [selectedCard, setSelectedCard] = useState<CardKind | null>(null);
  const [draggingCard, setDraggingCard] = useState<CardKind | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [feedback, setFeedback] = useState("اسحب كرتًا من الكتالوج إلى المنفذ المتوقع، أو اختر الكرت ثم انقر المنفذ. لا يوجد اتصال بمعدة حية.");

  const installedCount = Object.values(placements).filter(Boolean).length;
  const allInstalled = ["slot-1", "slot-21", "slot-41"].every((slotId) => placements[slotId]);
  const selectedDetail = useMemo(() => selectedCard ? cardCatalog[selectedCard] : null, [selectedCard]);

  const startDrag = (event: DragEvent<HTMLElement>, kind: CardKind) => {
    event.dataTransfer.setData("text/plain", kind);
    event.dataTransfer.effectAllowed = "move";
    setDraggingCard(kind);
    setSelectedCard(kind);
    setFeedback(`يتم نقل ${cardCatalog[kind].hardwareLabel} داخل المختبر التدريبي.`);
  };

  const attemptPlace = (slotId: string, requestedCard?: CardKind) => {
    const card = requestedCard ?? selectedCard;
    const target = slotDefinitions.find((slot) => slot.id === slotId);
    if (!card || !target) return setFeedback("اختر كرتًا من الكتالوج أولًا، ثم حدد منفذًا تدريبيًا.");
    if (target.accepts !== card) {
      return setFeedback(`رفض تدريبي: ${cardCatalog[card].hardwareLabel} لا يطابق المنفذ ${target.number}. المنفذ يتوقع ${target.expected}.`);
    }
    if (placements[slotId] && placements[slotId] !== card) {
      return setFeedback(`المنفذ ${target.number} مشغول داخل المسودة التدريبية. انقر نقرًا مزدوجًا لإفراغه ثم أعد المحاولة.`);
    }
    setPlacements((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => { if (next[key] === card) next[key] = null; });
      next[slotId] = card;
      return next;
    });
    setSelectedCard(null);
    setFeedback(`تم تركيب ${cardCatalog[card].hardwareLabel} في المنفذ ${target.number} داخل المحاكاة. لا تُرسل أي كتابة إلى RTN950A.`);
  };

  const removePlacement = (slotId: string) => {
    if (!placements[slotId]) return;
    const target = slotDefinitions.find((slot) => slot.id === slotId);
    setPlacements((current) => ({ ...current, [slotId]: null }));
    setFeedback(`أُفرغ المنفذ ${target?.number ?? ""} من المسودة التدريبية.`);
  };

  const resetLab = () => {
    setPlacements({ "slot-1": null, "slot-21": null, "slot-41": null, "slot-2": null, "slot-3": null });
    setSelectedCard(null);
    setFeedback("أُعيد تعيين رف التدريب. ابدأ تركيب الكروت من الكتالوج.");
  };

  return <main className="slot-page" dir="ltr">
    <div className="slot-disclosure">TRAINING REPLICA · RTN950A SLOT INSTALLATION LAB · NO LIVE NE / NO DEVICE WRITE</div>
    <header className="slot-header"><a href="/rtn950a-link-lab" className="slot-back"><ChevronLeft size={15}/> Microwave Link Configuration</a><div className="slot-brand"><span>✺</span><b>Web LCT</b><em>Slot Layout · RTN950A Training</em></div><div className="slot-actions"><button aria-label="Reset training shelf" onClick={resetLab}><RotateCcw size={15}/></button></div></header>
    <div className="slot-status"><span>NE NAME: RTN950A-TRAINING-NE</span><i/><span>DEVICE TYPE: RTN950A</span><i/><span>NE STATE: OFFLINE / SIMULATED</span><b>{installedCount}/3 TRAINING CARDS INSTALLED</b></div>
    <section className="slot-shell">
      <aside className="slot-tree"><section className="slot-tree-head"><b><ChevronDown size={12}/> RTN950A-TRAINING-NE</b><span><ChevronDown size={12}/> Shelf-0 (training)</span></section><section className="slot-tree-list">{slotDefinitions.map((slot) => <button key={slot.id} className={placements[slot.id] ? "installed" : ""} onClick={() => attemptPlace(slot.id)}><span className={`slot-dot ${placements[slot.id] ? "odu" : "empty"}`}/>{placements[slot.id] ? cardCatalog[placements[slot.id]!].hardwareLabel : `${slot.number}-Empty`}<small>{placements[slot.id] ? "Training installed" : slot.expected}</small></button>)}</section><div className="slot-source"><FileWarning size={15}/><p>المصدر العام يثبت Slot Layout وظهور ISM6 وODU ضمن مسار RTN950A 2+0. قواعد قبول المنفذ في هذه الشاشة تدريبية صريحة وليست فحصًا حيًا من Huawei.</p></div></aside>
      <section className="slot-main" data-testid="slot-install-lab">
        <div className="slot-tabs"><button className="active">Slot Layout</button><a href="/rtn950a-link-lab">Microwave Link Configuration</a><button>Physical Link Aggregation</button></div>
        <div className="slot-heading"><div><p>NE EXPLORER / SLOT LAYOUT</p><h1>Slot Installation Lab</h1><span>ركّب الكروت في المنافذ التدريبية بالسحب والإفلات أو بالاختيار ثم النقر.</span></div><div className="slot-scope"><Server size={17}/><b>RTN950A 2+0</b><small>Training Profile</small></div></div>
        <section className="slot-catalog" aria-label="Training card catalog"><div><span>TRAINING CARD CATALOG</span><b>اسحب كرتًا أو حدده</b></div><div className="slot-card-list">{(Object.keys(cardCatalog) as CardKind[]).map((kind) => { const item = cardCatalog[kind]; const Icon = item.Icon; const alreadyPlaced = Object.values(placements).includes(kind); return <button key={kind} data-card-kind={kind} className={`slot-card ${selectedCard === kind ? "selected" : ""} ${alreadyPlaced ? "placed" : ""}`} draggable={!alreadyPlaced} onDragStart={(event) => startDrag(event, kind)} onDragEnd={() => { setDraggingCard(null); setHoveredSlot(null); }} onClick={() => { if (!alreadyPlaced) { setSelectedCard(kind); setFeedback(`اختير ${item.hardwareLabel}. اسحبه أو انقر منفذًا متوافقًا.`); } }} disabled={alreadyPlaced}><Icon size={19}/><span><b>{item.label}</b><small>{item.hardwareLabel} · {item.detail}</small></span><em>{alreadyPlaced ? "Installed" : "Drag"}</em></button>; })}</div></section>
        <div className="slot-toolbar"><button onClick={() => setExpanded((value) => !value)}><ChevronDown size={14}/> {expanded ? "Collapse Shelf" : "Expand Shelf"}</button><span><Radio size={14}/> {installedCount} installed in training draft</span></div>
        {expanded && <section className="slot-chassis" aria-label="RTN950A training shelf"><div className="slot-chassis-label">SHELF-0 · RTN950A TRAINING CHASSIS <small>Double-click an installed bay to remove it</small></div><div className="slot-bay-grid">{slotDefinitions.map((slot) => { const placed = placements[slot.id]; const isDropTarget = slot.accepts !== null; const hovered = hoveredSlot === slot.id; const Icon = placed ? cardCatalog[placed].Icon : slot.accepts === "ism6" ? Server : slot.accepts ? Radio : null; return <div key={slot.id} data-slot-id={slot.id} data-placement={placed ?? "empty"} role="button" tabIndex={0} className={`slot-bay ${placed ? "installed" : ""} ${!isDropTarget ? "unmapped" : ""} ${hovered ? "drop-hover" : ""}`} onClick={() => attemptPlace(slot.id)} onDoubleClick={() => removePlacement(slot.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); attemptPlace(slot.id); } }} onDragOver={(event) => { if (isDropTarget) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setHoveredSlot(slot.id); } }} onDragLeave={() => setHoveredSlot(null)} onDrop={(event) => { event.preventDefault(); const kind = event.dataTransfer.getData("text/plain") as CardKind; setHoveredSlot(null); setDraggingCard(null); attemptPlace(slot.id, kind || undefined); }}><span className="slot-number">{slot.number}</span><span className="slot-bay-icon">{Icon ? <Icon size={22}/> : <span className="empty-mark">—</span>}</span><b>{placed ? cardCatalog[placed].hardwareLabel : "Empty"}</b><small>{placed ? cardCatalog[placed].detail : `Expected: ${slot.expected}`}</small><em>{placed ? "Training installed" : isDropTarget ? "Drop target" : "Unmapped"}</em>{draggingCard && isDropTarget && <span className="slot-drop-hint">Drop {cardCatalog[draggingCard].hardwareLabel}</span>}</div>; })}</div><div className="slot-legend"><span><i className="if"/> IF / Service training card</span><span><i className="odu"/> ODU training module</span><span><i className="empty"/> Empty or unmapped training bay</span></div></section>}
        <section className={`slot-feedback ${feedback.includes("رفض تدريبي") ? "error" : allInstalled ? "success" : ""}`}><ShieldAlert size={16}/><span>{feedback}</span></section>
        {allInstalled && <section className="slot-complete"><CheckCircle2 size={17}/><div><b>اكتمل تركيب رف التدريب</b><span>ISM6 وODU 21 وODU 41 موجودة في مواضعها التدريبية. هذه النتيجة لا تثبت تركيبًا ميدانيًا أو قبول وصلة.</span></div></section>}
        <div className="slot-notice"><ShieldAlert size={15}/><span>السحب والإفلات، قبول/رفض المنفذ، والحالة الخضراء هنا منطق تدريبي محلي. لا توجد قراءة عتاد أو كتابة إعداد أو صلاحية قبول ميداني.</span></div>
      </section>
    </section>
    <footer className="slot-footer">Huawei Web LCT-inspired training replica · RTN950A scope only · visual structure reconstructed from public evidence</footer>
  </main>;
}
