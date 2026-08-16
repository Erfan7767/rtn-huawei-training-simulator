import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, FileWarning, Network, RotateCcw, ShieldAlert, X } from "lucide-react";
import "./Rtn950ElanVlanLab.css";

type Stage = "scope" | "endpoints" | "vlan" | "validate" | "apply";
type Endpoint = { name: string; port: string; linkType: "Access" | "Trunk"; defaultVlan: string; allowedVlan: string };
const stages: { id: Stage; ar: string; en: string }[] = [
  { id: "scope", ar: "النطاق", en: "Scope" }, { id: "endpoints", ar: "الطرفان", en: "Endpoints" }, { id: "vlan", ar: "VLAN", en: "VLAN" }, { id: "validate", ar: "التحقق", en: "Validate" }, { id: "apply", ar: "تطبيق تدريبي", en: "Training Apply" },
];
const initial: { a: Endpoint; b: Endpoint } = {
  a: { name: "SITE-A-TRAINING", port: "GE1/0/1", linkType: "Trunk", defaultVlan: "100", allowedVlan: "100,200" },
  b: { name: "SITE-B-TRAINING", port: "GE1/0/1", linkType: "Trunk", defaultVlan: "100", allowedVlan: "100,200" },
};

export default function Rtn950ElanVlanLab() {
  const [stage, setStage] = useState<Stage>("scope");
  const [checked, setChecked] = useState({ source: false, design: false, service: false });
  const [service, setService] = useState("ELAN-TRAINING-01");
  const [vlan, setVlan] = useState("100");
  const [endpoints, setEndpoints] = useState(initial);
  const [applied, setApplied] = useState(false);
  const [feedback, setFeedback] = useState("ابدأ بتثبيت نطاق الوحدة. لا توجد خدمة أو VLAN حقيقية خلف هذه الواجهة.");
  const index = stages.findIndex((item) => item.id === stage);
  const scopeReady = checked.source && checked.design && checked.service;
  const parseVlanList = (value: string) => value.split(",").flatMap((part) => { const [from, to] = part.trim().split("-").map(Number); return Number.isFinite(to) ? Array.from({ length: to - from + 1 }, (_, i) => from + i) : [from]; }).filter(Number.isFinite);
  const errors = useMemo(() => {
    const result: string[] = [];
    const id = Number(vlan);
    if (!service.trim()) result.push("اسم E-LAN مطلوب.");
    if (!/^([1-9]|[1-9]\d{1,3}|40[0-8]\d|409[0-4])$/.test(vlan) || id < 1 || id > 4094) result.push("VLAN ID يجب أن يكون عددًا صحيحًا بين 1 و4094.");
    if (!endpoints.a.name.trim() || !endpoints.b.name.trim()) result.push("اسم Site A وSite B مطلوبان.");
    if (endpoints.a.name.trim() === endpoints.b.name.trim()) result.push("يجب أن يكون اسما الطرفين مختلفين.");
    if (endpoints.a.port === endpoints.b.port && endpoints.a.name === endpoints.b.name) result.push("الواجهة نفسها لا يمكن أن تمثل طرفين بالهوية نفسها.");
    for (const [key, item] of Object.entries(endpoints)) {
      const allowed = parseVlanList(item.allowedVlan);
      const defaultId = Number(item.defaultVlan);
      if (!/^\d+$/.test(item.defaultVlan) || defaultId < 1 || defaultId > 4094) result.push(`${key === "a" ? "Site A" : "Site B"}: Default VLAN غير صالح.`);
      if (allowed.length === 0 || allowed.some((v) => v < 1 || v > 4094)) result.push(`${key === "a" ? "Site A" : "Site B"}: Allowed VLAN خارج النطاق 1–4094.`);
      if (item.linkType === "Access" && allowed.length > 0 && !allowed.includes(defaultId)) result.push(`${key === "a" ? "Site A" : "Site B"}: Access يجب أن يتطابق مع Default VLAN.`);
      if (item.linkType === "Trunk" && !allowed.includes(id)) result.push(`${key === "a" ? "Site A" : "Site B"}: VLAN الخدمة غير موجود في Allowed VLAN.`);
    }
    if (endpoints.a.linkType !== endpoints.b.linkType) result.push("Link Type غير متطابق بين Site A وSite B.");
    if (endpoints.a.defaultVlan !== endpoints.b.defaultVlan) result.push("Default VLAN غير متطابق بين الطرفين.");
    if (endpoints.a.allowedVlan.replace(/\s/g, "") !== endpoints.b.allowedVlan.replace(/\s/g, "")) result.push("Allowed VLAN غير متطابق بين الطرفين.");
    return result;
  }, [service, vlan, endpoints]);
  const update = (side: "a" | "b", key: keyof Endpoint, value: string) => setEndpoints((current) => ({ ...current, [side]: { ...current[side], [key]: value } }));
  const reset = () => { setStage("scope"); setChecked({ source: false, design: false, service: false }); setService("ELAN-TRAINING-01"); setVlan("100"); setEndpoints(initial); setApplied(false); setFeedback("أعيدت المسودة محليًا. لا توجد خدمة حية أو تغيير على جهاز."); };
  const next = () => { if (stage === "scope" && !scopeReady) return setFeedback("أكمل إثبات المصدر والتصميم وهدف الخدمة أولًا."); if (stage === "vlan" && errors.length) return setFeedback("تم إيقاف الانتقال: صحّح أخطاء VLAN والواجهة قبل التحقق النهائي."); const nextStage = stages[Math.min(index + 1, stages.length - 1)].id; setStage(nextStage); setFeedback(nextStage === "validate" ? "شغّل الفحص التدريجي لرؤية كل قاعدة تحقق ونتيجتها." : "انتقلت إلى المرحلة التالية داخل المختبر فقط."); };
  const apply = () => { if (errors.length) return setFeedback("Apply محظور: توجد أخطاء في إعداد الخدمة أو توافق الطرفين."); setApplied(true); setStage("apply"); setFeedback("Training Apply: Success محليًا فقط؛ لم تُرسل أي VLAN أو خدمة إلى NE."); };
  const checkRows = [
    ["Service identity", service.trim().length > 0, "اسم الخدمة غير فارغ"], ["VLAN range", /^\d+$/.test(vlan) && Number(vlan) >= 1 && Number(vlan) <= 4094, "VLAN ID ضمن 1–4094"], ["Endpoint names", endpoints.a.name.trim() !== endpoints.b.name.trim() && endpoints.a.name.trim() !== "" && endpoints.b.name.trim() !== "", "هوية الطرفين مختلفة ومكتملة"], ["Link type", endpoints.a.linkType === endpoints.b.linkType, "Link Type متطابق"], ["Default VLAN", endpoints.a.defaultVlan === endpoints.b.defaultVlan, "Default VLAN متطابق"], ["Allowed VLAN", endpoints.a.allowedVlan.replace(/\s/g, "") === endpoints.b.allowedVlan.replace(/\s/g, ""), "Allowed VLAN متطابق"], ["Service membership", errors.filter((error) => error.includes("Allowed VLAN") || error.includes("VLAN الخدمة")).length === 0, "VLAN الخدمة عضو في قائمة السماح للطرفين"],
  ] as const;
  return <main className="elan-page" dir="ltr">
    <div className="elan-disclosure">TRAINING REPLICA · RTN950 / RTN950A FAMILY E-LAN/VLAN CONCEPT LAB · NO LIVE SERVICE / NO DEVICE WRITE</div>
    <header className="elan-header"><a href="/course-roadmap"><ChevronLeft size={15}/> Course roadmap</a><div><span>✺</span><b>Web LCT</b><em>E-LAN / VLAN Training Lab</em></div><button onClick={reset} aria-label="Reset E-LAN VLAN training"><RotateCcw size={15}/></button></header>
    <div className="elan-status"><span>REFERENCE FAMILY: RTN 950 / RTN 950A</span><i/><span>SERVICE SCOPE: E-LAN / VLAN CONCEPTS</span><i/><span>STATE: OFFLINE / SIMULATED</span><b>{applied ? "LOCAL DRAFT APPLIED" : "APPLY BLOCKED UNTIL VALID"}</b></div>
    <section className="elan-shell"><aside className="elan-tree"><b>RTN950-TRAINING-NE</b><span>Shelf-0 / Service training</span><span className="selected">E-LAN / VLAN</span><span>Ethernet Interfaces</span><span>Microwave Link</span><div className="elan-rule"/><div className="elan-source"><FileWarning size={15}/><p>المراجع العامة تثبت دعم E-LAN وIEEE 802.1q/p في عائلة RTN، بينما تسلسل Web LCT الخاص بالإصدار يحتاج دليلًا أو لقطة مطابقة. لذلك هذه الوحدة تحقق مفاهيم عامة فقط.</p></div></aside>
      <section className="elan-main" data-testid="elan-vlan-lab" data-active-step={stage}><div className="elan-tabs"><button type="button" disabled title="Separate source scope">Microwave Link Configuration · separate source</button><button className="active">E-LAN / VLAN <X size={12}/></button></div><div className="elan-heading"><div><p>CONCEPT VALIDATION / E-LAN / VLAN</p><h1>E-LAN / VLAN Service Validation</h1><span>وحدة تدريبية تراجع الإعداد خطوة بخطوة قبل السماح بتطبيق محلي.</span></div><div className="elan-badge"><Network size={17}/><b>Training service</b><small>Source-bounded concepts</small></div></div>
        <nav className="elan-steps">{stages.map((item, i) => <button key={item.id} className={`${i === index ? "current" : ""} ${i < index ? "complete" : ""}`} onClick={() => i <= index && setStage(item.id)}><b>{i < index ? <CheckCircle2 size={14}/> : i + 1}</b><span>{item.ar}<small>{item.en}</small></span></button>)}</nav><div className="elan-feedback"><ShieldAlert size={16}/><span>{feedback}</span></div>
        <section className="elan-workspace">
          {stage === "scope" && <Panel title="تثبيت نطاق الخدمة" eyebrow="STEP 1 / SCOPE"><p>اختر فقط المعلومات التي يملكها التصميم المعتمد. لا تُنشئ هذه الصفحة VLAN فعلية ولا تختبر عبور الحزم.</p><div className="elan-checks"><Check checked={checked.source} onChange={(v) => setChecked((c) => ({ ...c, source: v }))} title="Reference scope reviewed" text="RTN950/950A family support is context only."/><Check checked={checked.design} onChange={(v) => setChecked((c) => ({ ...c, design: v }))} title="Service design available" text="اسم الخدمة والطرفان مأخوذون من التصميم المعتمد."/><Check checked={checked.service} onChange={(v) => setChecked((c) => ({ ...c, service: v }))} title="VLAN plan reviewed" text="القيمة الفعلية لا تأتي من المثال التدريبي."/></div><Actions onNext={next}/></Panel>}
          {stage === "endpoints" && <Panel title="تعريف طرفي الخدمة" eyebrow="STEP 2 / ENDPOINTS"><div className="elan-service-name"><label>Training service name<input value={service} onChange={(e) => setService(e.target.value)} placeholder="ELAN-TRAINING-01"/></label><label>Service type<select defaultValue="Native E-LAN"><option>Native E-LAN</option><option>Training profile — confirm from release guide</option></select></label></div><div className="elan-endpoints"><EndpointCard label="Site A" value={endpoints.a} onChange={(k, v) => update("a", k, v)}/><div className="elan-link"><i/><Network size={20}/><b>E-LAN<br/>training path</b><i/></div><EndpointCard label="Site B" value={endpoints.b} onChange={(k, v) => update("b", k, v)}/></div><Actions onNext={next} onBack={() => setStage("scope")}/></Panel>}
          {stage === "vlan" && <Panel title="معاملات VLAN والواجهات" eyebrow="STEP 3 / VLAN PARAMETERS"><div className="elan-vlan-top"><label>Service VLAN ID<input value={vlan} onChange={(e) => setVlan(e.target.value.replace(/\D/g, "").slice(0, 4))}/><small>قاعدة عامة تدريبية: integer 1–4094.</small></label><div className={`elan-error-count ${errors.length ? "bad" : "good"}`}>{errors.length ? `${errors.length} errors` : "Ready for validation"}</div></div><div className="elan-inline-endpoints"><EndpointCard label="Site A" value={endpoints.a} onChange={(k, v) => update("a", k, v)}/><EndpointCard label="Site B" value={endpoints.b} onChange={(k, v) => update("b", k, v)}/></div><Actions onNext={next} onBack={() => setStage("endpoints")}/></Panel>}
          {stage === "validate" && <Panel title="فحص القواعد خطوة بخطوة" eyebrow="STEP 4 / VALIDATE"><div className="elan-validation">{checkRows.map(([name, ok, detail]) => <div className={`elan-validation-row ${ok ? "ok" : "bad"}`} key={name}><span>{ok ? <CheckCircle2 size={17}/> : <AlertTriangle size={17}/>}</span><b>{name}</b><p>{detail}</p><em>{ok ? "PASS" : "FIX REQUIRED"}</em></div>)}</div>{errors.length > 0 && <div className="elan-errors"><b><AlertTriangle size={15}/> تصحيح مطلوب</b>{errors.map((error) => <p key={error}>• {error}</p>)}</div>}<Actions onNext={apply} nextLabel="Apply training draft" disabled={errors.length > 0} onBack={() => setStage("vlan")}/></Panel>}
          {stage === "apply" && <Panel title="نتيجة التطبيق المحلي" eyebrow="STEP 5 / TRAINING APPLY"><div className="elan-success"><CheckCircle2 size={37}/><div><b>Training Apply: Success</b><p>تم قبول المسودة داخل المتصفح فقط. لا يعني ذلك أن E-LAN أو VLAN تعمل على RTN أو أن الحزم تعبر بين الموقعين.</p></div></div><div className="elan-summary"><span>{service}</span><b>VLAN {vlan}</b><span>{endpoints.a.name} ↔ {endpoints.b.name}</span></div><Actions onBack={() => setStage("validate")} onReset={reset} /></Panel>}
        </section><footer>Source-bounded training module. Huawei public materials confirm the concepts, not this exact Web LCT screen or any production value.</footer>
      </section></section>
  </main>;
}
function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="elan-panel"><div className="elan-panel-title"><span>{eyebrow}</span><h2>{title}</h2></div>{children}</section>; }
function Actions({ onNext, onBack, onReset, disabled = false, nextLabel = "Continue" }: { onNext?: () => void; onBack?: () => void; onReset?: () => void; disabled?: boolean; nextLabel?: string }) { return <div className="elan-actions">{onBack && <button className="elan-secondary" onClick={onBack}><ChevronLeft size={14}/> Back</button>}{onReset && <button className="elan-secondary" onClick={onReset}><RotateCcw size={14}/> Reset</button>}{onNext && <button className="elan-primary" onClick={onNext} disabled={disabled}>{nextLabel}<ChevronRight size={14}/></button>}</div>; }
function Check({ checked, onChange, title, text }: { checked: boolean; onChange: (v: boolean) => void; title: string; text: string }) { return <label className={`elan-check ${checked ? "checked" : ""}`}><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}/><span><b>{title}</b><small>{text}</small></span></label>; }
function EndpointCard({ label, value, onChange }: { label: string; value: Endpoint; onChange: (key: keyof Endpoint, value: string) => void }) { return <section className="elan-endpoint-card"><b>{label}</b><label>Endpoint name<input value={value.name} onChange={(e) => onChange("name", e.target.value)}/></label><label>Interface<select value={value.port} onChange={(e) => onChange("port", e.target.value)}><option>GE1/0/1</option><option>GE1/0/2</option><option>FE1/0/1</option></select></label><label>Link Type<select value={value.linkType} onChange={(e) => onChange("linkType", e.target.value as Endpoint["linkType"])}><option>Access</option><option>Trunk</option></select></label><div className="elan-two-fields"><label>Default VLAN<input value={value.defaultVlan} onChange={(e) => onChange("defaultVlan", e.target.value.replace(/\D/g, "").slice(0, 4))}/></label><label>Allowed VLAN<input value={value.allowedVlan} onChange={(e) => onChange("allowedVlan", e.target.value.replace(/[^\d,-]/g, "").slice(0, 32))}/></label></div></section>; }
