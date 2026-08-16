import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Network, Radio, RotateCcw, ShieldAlert, ShieldCheck, Shuffle, X } from "lucide-react";
import "./RtnProtectionHsbLab.css";

type Stage = "scope" | "pair" | "validate" | "apply" | "switch";
type Member = { label: string; role: "Working" | "Protection"; group: string; scope: string };

const stages: { id: Stage; ar: string; en: string }[] = [
  { id: "scope", ar: "النطاق", en: "Scope" },
  { id: "pair", ar: "زوج الحماية", en: "Protection pair" },
  { id: "validate", ar: "التحقق", en: "Validate" },
  { id: "apply", ar: "تطبيق تدريبي", en: "Training apply" },
  { id: "switch", ar: "تبديل محلي", en: "Local switch" },
];

const initial: { working: Member; protection: Member } = { working: { label: "WORKING-TRAINING-A", role: "Working", group: "HSB-TRAINING-A", scope: "Training service pair A" }, protection: { label: "PROTECTION-TRAINING-B", role: "Working", group: "HSB-TRAINING-A", scope: "Training service pair A" } };

export default function RtnProtectionHsbLab() {
  const [stage, setStage] = useState<Stage>("scope");
  const [checks, setChecks] = useState({ source: false, design: false, recovery: false });
  const [mode, setMode] = useState("1+1 HSB");
  const [pair, setPair] = useState(initial);
  const [applied, setApplied] = useState(false);
  const [active, setActive] = useState<"Working" | "Protection">("Working");
  const [feedback, setFeedback] = useState("ابدأ بتثبيت نطاق الحماية. لا توجد مجموعة حماية أو تبديل حي في هذا المختبر.");
  const index = stages.findIndex((item) => item.id === stage);
  const scopeReady = checks.source && checks.design && checks.recovery;
  const errors = useMemo(() => {
    const result: string[] = [];
    if (mode !== "1+1 HSB") result.push("وضع الحماية التدريبي يجب أن يبقى 1+1 HSB.");
    if (!pair.working.label.trim() || !pair.protection.label.trim()) result.push("تسمية العامل والحماية مطلوبة.");
    if (pair.working.label.trim() === pair.protection.label.trim()) result.push("لا يجوز أن تتطابق تسمية العامل والحماية.");
    if (!pair.working.group.trim() || pair.working.group.trim() !== pair.protection.group.trim()) result.push("معرّف مجموعة الحماية التدريبية يجب أن يكون متطابقًا للطرفين.");
    if (pair.working.role !== "Working" || pair.protection.role !== "Protection") result.push("عيّن دورًا واحدًا Working ودورًا واحدًا Protection.");
    if (pair.working.scope !== pair.protection.scope) result.push("نطاق الخدمة التدريبي غير متطابق بين العضوين.");
    return result;
  }, [mode, pair]);
  const update = (side: "working" | "protection", key: keyof Member, value: string) => setPair((current) => ({ ...current, [side]: { ...current[side], [key]: value } }));
  const reset = () => { setStage("scope"); setChecks({ source: false, design: false, recovery: false }); setMode("1+1 HSB"); setPair(initial); setApplied(false); setActive("Working"); setFeedback("أُعيدت مسودة حماية محلية. لم يُنشأ HSB group ولم يتبدل أي جهاز."); };
  const next = () => {
    if (stage === "scope" && !scopeReady) return setFeedback("أكد المرجع والتصميم وخطة الاسترداد قبل تعريف زوج الحماية التدريبي.");
    if (stage === "pair" && errors.length) return setFeedback("لا يمكن الانتقال: صحّح أدوار العامل/الحماية ومجموعة الحماية التدريبية أولًا.");
    setStage(stages[Math.min(index + 1, stages.length - 1)].id);
    setFeedback("انتقلت داخل المحاكاة المحلية فقط.");
  };
  const apply = () => { if (errors.length) return setFeedback("Training Apply محظور: توجد أخطاء في زوج الحماية."); setApplied(true); setStage("apply"); setFeedback("قُبلت المسودة داخل المتصفح فقط. لا توجد مجموعة HSB أو خدمة حية."); };
  const switchLocal = () => { setActive((current) => current === "Working" ? "Protection" : "Working"); setStage("switch"); setFeedback("تم تغيير العضو النشط في حالة تدريب محلية؛ لا يمثل ذلك failover على معدات."); };
  const rows = [
    ["Protection mode", mode === "1+1 HSB", "وضع الحماية التدريبي 1+1 HSB"],
    ["Member identities", pair.working.label !== pair.protection.label && pair.working.label !== "" && pair.protection.label !== "", "عضوان معرفان بشكل مختلف"],
    ["Protection group", pair.working.group.trim() !== "" && pair.working.group === pair.protection.group, "معرّف المجموعة متطابق"],
    ["Member roles", pair.working.role === "Working" && pair.protection.role === "Protection", "Working + Protection"],
    ["Training scope", pair.working.scope === pair.protection.scope, "نطاق خدمة تدريبي مشترك"],
  ] as const;
  return <main className="protection-page" dir="ltr">
    <div className="protection-disclosure">TRAINING REPLICA · 1+1 HSB CONCEPT LAB · LOCAL STATE ONLY · NO LIVE PROTECTION GROUP</div>
    <header className="protection-header"><a href="/course-roadmap"><ChevronLeft size={15}/> Course roadmap</a><div><span>✺</span><b>Web LCT</b><em>Protection Configuration Lab</em></div><button onClick={reset} aria-label="Reset protection training"><RotateCcw size={15}/></button></header>
    <div className="protection-status"><span>REFERENCE: RTN PROTECTION CONCEPT</span><i/><span>MODE: 1+1 HSB TRAINING</span><i/><span>STATE: OFFLINE / SIMULATED</span><b>{applied ? `LOCAL DRAFT · ${active.toUpperCase()} ACTIVE` : "APPLY BLOCKED UNTIL VALID"}</b></div>
    <section className="protection-shell"><aside className="protection-tree"><b>TRAINING-PROTECTION-NE</b><span>Shelf-0 / Protection training</span><span className="selected">Protection Configuration</span><span>Working member</span><span>Protection member</span><div className="protection-rule"/><div className="protection-source"><ShieldAlert size={15}/><p>المرجع الرسمي يثبت مفهوم 1+1 HSB والاستعلام عن حالة مجموعة الحماية، لا هذه الشاشة أو طرازًا وإصدارًا موحدين. قواعد المقارنة والتبديل هنا تدريبية فقط.</p></div></aside>
      <section className="protection-main" data-testid="protection-hsb-lab" data-active-step={stage}><div className="protection-tabs"><button type="button" disabled title="Separate source scope">Microwave Link Configuration · separate source</button><button className="active">Protection Configuration <X size={12}/></button></div><div className="protection-heading"><div><p>CONCEPT VALIDATION / PROTECTION</p><h1>1+1 HSB Protection Configuration</h1><span>محاكاة للتحقق من مسودة حماية محلية قبل قبول تدريبي، وليست تكوينًا أو تبديلًا للمعدات.</span></div><div className="protection-badge"><ShieldCheck size={17}/><b>Protection concept</b><small>Source-bounded training</small></div></div>
        <nav className="protection-steps">{stages.map((item, i) => <button key={item.id} className={`${i === index ? "current" : ""} ${i < index ? "complete" : ""}`} onClick={() => i <= index && setStage(item.id)}><b>{i < index ? <CheckCircle2 size={14}/> : i + 1}</b><span>{item.ar}<small>{item.en}</small></span></button>)}</nav><div className="protection-feedback"><ShieldAlert size={16}/><span>{feedback}</span></div>
        <section className="protection-workspace">
          {stage === "scope" && <Panel eyebrow="STEP 1 / SCOPE" title="تثبيت نطاق الحماية"><p>ثبّت أن مسار الحماية والمخطط وخطة الاسترداد معتمدة خارج المختبر. لا تنشئ الصفحة مجموعة HSB فعلية ولا تستعلم عن حالتها.</p><div className="protection-checks"><Check checked={checks.source} onChange={(v) => setChecks((c) => ({ ...c, source: v }))} title="Source boundary reviewed" text="المفهوم مثبت؛ الشاشة والقيم ليست مرجعًا لإصدار Web LCT."/><Check checked={checks.design} onChange={(v) => setChecks((c) => ({ ...c, design: v }))} title="Approved protection design available" text="أسماء الأعضاء وخطة الحماية تأتي من التصميم المعتمد."/><Check checked={checks.recovery} onChange={(v) => setChecks((c) => ({ ...c, recovery: v }))} title="Recovery plan reviewed" text="تأكيد تدريبي؛ لا ينفذ إجراءات تبديل أو استرداد موقع."/></div><Actions onNext={next}/></Panel>}
          {stage === "pair" && <Panel eyebrow="STEP 2 / PROTECTION PAIR" title="تعريف العامل والحماية"><div className="protection-mode"><label>Protection mode<select value={mode} onChange={(e) => setMode(e.target.value)}><option>1+1 HSB</option><option>Unclassified training mode</option></select></label><small>1+1 HSB هنا تسمية نطاق تدريبي؛ لا تحدد بطاقات أو ODU أو سياسات hardware.</small></div><div className="protection-members"><MemberCard title="Working member" label="Site A / working" value={pair.working} onChange={(k, v) => update("working", k, v)}/><div className="protection-link"><i/><Radio size={20}/><b>HSB<br/>training pair</b><i/></div><MemberCard title="Protection member" label="Site B / protection" value={pair.protection} onChange={(k, v) => update("protection", k, v)}/></div><Errors errors={errors}/><Actions onNext={next} onBack={() => setStage("scope")}/></Panel>}
          {stage === "validate" && <Panel eyebrow="STEP 3 / VALIDATE" title="فحص مسودة الحماية"><div className="protection-validation">{rows.map(([name, ok, detail]) => <div className={`protection-validation-row ${ok ? "ok" : "bad"}`} key={name}><span>{ok ? <CheckCircle2 size={17}/> : <AlertTriangle size={17}/>}</span><b>{name}</b><p>{detail}</p><em>{ok ? "PASS" : "FIX REQUIRED"}</em></div>)}</div><Errors errors={errors}/><Actions onNext={apply} nextLabel="Apply training draft" disabled={errors.length > 0} onBack={() => setStage("pair")}/></Panel>}
          {stage === "apply" && <Panel eyebrow="STEP 4 / TRAINING APPLY" title="نتيجة التطبيق المحلي"><div className="protection-success"><CheckCircle2 size={37}/><div><b>Training Apply: Success</b><p>قُبلت مسودة 1+1 HSB داخل المتصفح فقط. لا توجد حماية مفعلة أو إعداد على RTN أو تحقق من خدمة.</p></div></div><div className="protection-summary"><span>{pair.working.label}</span><b>1+1 HSB · TRAINING</b><span>{pair.protection.label}</span></div><Actions onNext={() => setStage("switch")} nextLabel="Open local switch simulation" onBack={() => setStage("validate")}/></Panel>}
          {stage === "switch" && <Panel eyebrow="STEP 5 / LOCAL SWITCH" title="محاكاة حالة العضو النشط"><div className="protection-switch"><Shuffle size={34}/><div><b>{active} selected in local training state</b><p>يمكنك تبديل العضو النشط لشرح أثر القرار داخل المختبر. لا يُرسل أمر حماية ولا يحدث failover في شبكة أو جهاز.</p></div></div><button className="protection-primary" onClick={switchLocal}><Shuffle size={15}/> Simulate local member selection</button><Actions onReset={reset}/></Panel>}
        </section><footer>Source-bounded protection concept lab. No live group, hardware validation, service test, or failover.</footer>
      </section></section>
  </main>;
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="protection-panel"><div className="protection-panel-title"><span>{eyebrow}</span><h2>{title}</h2></div>{children}</section>; }
function Check({ checked, onChange, title, text }: { checked: boolean; onChange: (value: boolean) => void; title: string; text: string }) { return <label className={`protection-check ${checked ? "checked" : ""}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><span><b>{title}</b><small>{text}</small></span></label>; }
function MemberCard({ title, label, value, onChange }: { title: string; label: string; value: Member; onChange: (key: keyof Member, value: string) => void }) { return <section className="protection-member"><b>{title}</b><small>{label}</small><label>Training label<input value={value.label} onChange={(e) => onChange("label", e.target.value)}/></label><label>Role<select value={value.role} onChange={(e) => onChange("role", e.target.value)}><option>Working</option><option>Protection</option></select></label><label>Training protection group<input value={value.group} onChange={(e) => onChange("group", e.target.value)}/></label><label>Training service scope<select value={value.scope} onChange={(e) => onChange("scope", e.target.value)}><option>Training service pair A</option><option>Training service pair B</option></select></label></section>; }
function Errors({ errors }: { errors: string[] }) { return errors.length ? <div className="protection-errors"><b><AlertTriangle size={15}/> تصحيح مطلوب</b>{errors.map((error) => <p key={error}>• {error}</p>)}</div> : <div className="protection-ok"><CheckCircle2 size={15}/> لا توجد أخطاء في مسودة الحماية التدريبية.</div>; }
function Actions({ onNext, onBack, onReset, disabled = false, nextLabel = "Continue" }: { onNext?: () => void; onBack?: () => void; onReset?: () => void; disabled?: boolean; nextLabel?: string }) { return <div className="protection-actions">{onBack && <button className="protection-secondary" onClick={onBack}><ChevronLeft size={14}/> Back</button>}{onReset && <button className="protection-secondary" onClick={onReset}><RotateCcw size={14}/> Reset</button>}{onNext && <button className="protection-primary" disabled={disabled} onClick={onNext}>{nextLabel}<ChevronRight size={14}/></button>}</div>; }
