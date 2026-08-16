import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, FileWarning, LogIn, Radio, RotateCcw, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import "./Rtn950NeAttributeLab.css";

type AttributeStep = "review" | "draft" | "risk" | "relogin" | "verified";

const steps: { id: AttributeStep; arabic: string; english: string }[] = [
  { id: "review", arabic: "مراجعة النطاق", english: "Review scope" },
  { id: "draft", arabic: "مسودة الهوية", english: "Draft attribute" },
  { id: "risk", arabic: "تأكيد الخطر", english: "Risk confirmation" },
  { id: "relogin", arabic: "إعادة الدخول", english: "Re-login" },
  { id: "verified", arabic: "تحقق محلي", english: "Local verification" },
];

export default function Rtn950NeAttributeLab() {
  const [step, setStep] = useState<AttributeStep>("review");
  const [checks, setChecks] = useState({ record: false, window: false, plan: false });
  const [draft, setDraft] = useState({ label: "RTN950-TRAINING-NE", id: "TRAINING-ID-B" });
  const [riskOpen, setRiskOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState("ابدأ بمراجعة نطاق التغيير. لا توجد جلسة NE أو اتصال إدارة في هذا المختبر.");
  const stepIndex = steps.findIndex((item) => item.id === step);
  const allChecked = checks.record && checks.window && checks.plan;

  const reset = () => {
    setStep("review"); setChecks({ record: false, window: false, plan: false }); setDraft({ label: "RTN950-TRAINING-NE", id: "TRAINING-ID-B" }); setRiskOpen(false); setApplied(false); setVerified(false); setFeedback("أُعيد تعيين المسودة التدريبية محليًا. لم تتغير هوية NE أو جلسة حية.");
  };
  const continueReview = () => {
    if (!allChecked) return setFeedback("أكمل تأكيد سجل الهوية ونافذة التغيير وخطة الموقع المعتمدة قبل إنشاء مسودة التدريب.");
    setStep("draft"); setFeedback("يمكنك الآن تحرير تسمية تدريبية ومعرّف تدريب محليين فقط.");
  };
  const requestApply = () => {
    if (!draft.label.trim()) return setFeedback("أدخل تسمية تدريبية غير فارغة داخل المتصفح قبل متابعة تحذير المخاطر.");
    setStep("risk"); setRiskOpen(true); setFeedback("ظهر تحذير الاتصال. لن يتغير أي NE حتى في المحاكاة إلا داخل الحالة المحلية.");
  };
  const acceptRisk = () => {
    setRiskOpen(false); setApplied(true); setStep("relogin"); setFeedback("تم تطبيق مسودة الهوية داخل المحاكاة فقط. يلزم محاكاة إعادة الدخول قبل التحقق المحلي.");
  };
  const relogin = () => { setStep("verified"); setFeedback("تمت محاكاة إعادة الدخول إلى NE التدريبية. راجع السجل المحلي قبل إغلاق السيناريو."); };

  return <main className="neattr-page" dir="ltr">
    <div className="neattr-disclosure">TRAINING REPLICA · RTN950 NE ATTRIBUTE WORKFLOW · REFERENCE UI: NE VERSION 5.76.07.24 · NO LIVE NE</div>
    <header className="neattr-header"><a href="/course-roadmap"><ChevronLeft size={15}/> Course roadmap</a><div><span>✺</span><b>Web LCT</b><em>NE Attribute Training Lab</em></div><button onClick={reset} aria-label="Reset NE Attribute training draft"><RotateCcw size={15}/></button></header>
    <div className="neattr-status"><span>REFERENCE DEVICE: RTN 950</span><i/><span>REFERENCE UI: iManager U2000 Web LCT</span><i/><span>NE VERSION: 5.76.07.24</span><i/><span>NE STATE: OFFLINE / SIMULATED</span><b>{applied ? "LOCAL DRAFT APPLIED" : "NO LIVE CHANGE"}</b></div>
    <section className="neattr-shell">
      <aside className="neattr-tree"><div className="neattr-ne"><b>RTN950-TRAINING-NE</b><span>NE Explorer (training)</span><span>Slot Layout</span></div><div className="neattr-rule"/><div className="neattr-function"><b>Function Tree</b><span>Configuration</span><button className="selected">NE Attribute</button><button>Microwave Link Configuration</button><button>Alarm</button><button>Performance</button></div><div className="neattr-source"><FileWarning size={15}/><p>المصدر المرئي RTN950 فقط، Web LCT 5.76.07.24، ويظهر صفحة NE Attribute ثم تحذير تغير الاتصال وإعادة الدخول. هذه الشاشة لا تمثل RTN950A 2+0.</p></div></aside>
      <section className="neattr-main" data-testid="ne-attribute-lab" data-active-step={step}>
        <div className="neattr-tabs"><button type="button" disabled title="Separate RTN950 source required">Slot Layout · separate source</button><button type="button" disabled title="Separate RTN950 source required">Microwave Link Configuration · separate source</button><button className="active">NE Attribute <X size={12}/></button></div>
        <div className="neattr-heading"><div><p>CONFIGURATION / NE ATTRIBUTE</p><h1>NE Attribute: change-and-relogin training</h1><span>وحدة تدريبية مستقلة لتعلم أثر تغيير الهوية على جلسة الإدارة، من دون عناوين أو هويات ميدانية.</span></div><div className="neattr-badge"><Radio size={17}/><b>RTN950 observed reference</b><small>Separate source scope</small></div></div>
        <nav className="neattr-steps">{steps.map((item, index) => <button key={item.id} className={`${index === stepIndex ? "current" : ""} ${index < stepIndex ? "complete" : ""}`} onClick={() => { if (index <= stepIndex) { setStep(item.id); setFeedback(`عرض مرحلة: ${item.arabic}.`); } else setFeedback("أكمل خطوة السيناريو الحالية قبل الانتقال."); }}><b>{index < stepIndex ? <CheckCircle2 size={14}/> : index + 1}</b><span>{item.arabic}<small>{item.english}</small></span></button>)}</nav>
        <section className="neattr-feedback"><ShieldAlert size={16}/><span>{feedback}</span></section>
        <section className="neattr-workspace">
          {step === "review" && <section className="neattr-panel"><div className="neattr-panel-title"><span>STEP 1 / REVIEW</span><h2>مراجعة النطاق قبل إنشاء مسودة الهوية</h2></div><p>تعرض اللقطة المرجعية NE Attribute قبل إعداد الوصلة. في الواقع، تغيير اسم أو معرّف NE قد يقطع جلسة الإدارة؛ لذلك يقتصر هذا السيناريو على التحقق من الإجراءات وليس تنفيذها.</p><div className="neattr-checks"><Check checked={checks.record} onChange={(value) => setChecks((current) => ({ ...current, record: value }))} title="Existing NE identity recorded" text="سجل الهوية الحالي خارج المختبر وبحسب إجراء العميل؛ لا يقرأ المحاكي NE."/><Check checked={checks.window} onChange={(value) => setChecks((current) => ({ ...current, window: value }))} title="Approved change window confirmed" text="تأكيد تدريبي فقط؛ لا ينشئ نافذة تغيير أو تصريح موقع."/><Check checked={checks.plan} onChange={(value) => setChecks((current) => ({ ...current, plan: value }))} title="Authorized naming plan reviewed" text="أي اسم أو معرّف حقيقي يأتي من وثائق العميل المعتمدة فقط."/></div><div className="neattr-actions"><button className="neattr-primary" onClick={continueReview}>Create training draft <ChevronRight size={15}/></button></div></section>}
          {step === "draft" && <section className="neattr-panel"><div className="neattr-panel-title"><span>STEP 2 / DRAFT ATTRIBUTE</span><h2>إنشاء فرق تغييرات محلي</h2></div><div className="neattr-compare"><section><span>CURRENT TRAINING SNAPSHOT</span><label>NE Label<input value="RTN950-TRAINING-NE" readOnly/></label><label>NE Identifier<input value="TRAINING-ID-A" readOnly/></label><small>لقطة افتراضية داخل المتصفح، وليست قراءة من جهاز.</small></section><section className="neattr-arrow">→</section><section><span>PROPOSED TRAINING DRAFT</span><label>NE Label<input value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}/></label><label>NE Identifier<select value={draft.id} onChange={(event) => setDraft((current) => ({ ...current, id: event.target.value }))}><option>TRAINING-ID-B</option><option>TRAINING-ID-C</option></select></label><small>التسمية والمعرّف هنا Synthetic ولا يرتبطان بعنوان شبكة أو NE حقيقي.</small></section></div><div className="neattr-limit"><AlertTriangle size={16}/><span>لا يعرض المختبر IP أو Gateway أو معرّفات ميدانية. تظهر هذه البيانات أحيانًا في مصادر الفيديو، لكنها غير قابلة للنقل أو التعميم.</span></div><div className="neattr-actions"><button className="neattr-danger" onClick={requestApply}><AlertTriangle size={15}/> Request training change</button></div></section>}
          {step === "risk" && <section className="neattr-panel"><div className="neattr-panel-title"><span>STEP 3 / RISK CONFIRMATION</span><h2>تحذير الاتصال وإجراء الاسترداد</h2></div><div className="neattr-risk-card"><AlertTriangle size={28}/><div><b>Communication interruption is possible.</b><p>تستند الفكرة إلى تحذير مرئي عند تغيير NE ID في مرجع RTN950. زر المتابعة سيغيّر حالة مختبر محلي فقط، ثم يفرض إعادة دخول تدريبية.</p></div></div><div className="neattr-actions"><button className="neattr-secondary" onClick={() => { setRiskOpen(false); setStep("draft"); setFeedback("أُلغي طلب التدريب. بقيت المسودة المحلية قابلة للمراجعة."); }}>Cancel</button><button className="neattr-danger" onClick={() => setRiskOpen(true)}>Open training warning</button></div></section>}
          {step === "relogin" && <section className="neattr-panel"><div className="neattr-panel-title"><span>STEP 4 / RE-LOGIN</span><h2>محاكاة استعادة جلسة الإدارة</h2></div><div className="neattr-relogin"><LogIn size={35}/><div><b>Local session marked as interrupted</b><p>تم تحديث الهوية داخل مسودة التدريب فقط: <strong>{draft.label}</strong> / <strong>{draft.id}</strong>. لا يوجد فحص شبكة أو جلسة حية.</p></div></div><div className="neattr-actions"><button className="neattr-primary" onClick={relogin}>Simulate re-login <ChevronRight size={15}/></button></div></section>}
          {step === "verified" && <section className="neattr-panel"><div className="neattr-panel-title"><span>STEP 5 / LOCAL VERIFICATION</span><h2>التحقق وإغلاق سيناريو التدريب</h2></div><div className="neattr-verified"><CheckCircle2 size={38}/><div><b>Training re-login completed</b><p>يراجع المتدرب الفرق المحلي ثم يوثق اكتمال التسلسل. لا يدل ذلك على نجاح اتصال NE أو تنفيذ تغيير في شبكة حية.</p></div></div><label className="neattr-verify-check"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)}/><span><b>Record local verification</b><small>تأكيد أن هذا التدريب لا يغني عن إجراء الموقع وسجل العميل المعتمد.</small></span></label>{verified && <div className="neattr-success"><ClipboardCheck size={17}/> اكتملت وحدة NE Attribute التدريبية. لا توجد نتيجة تشغيلية أو جهازية.</div>}<div className="neattr-actions"><button className="neattr-secondary" onClick={reset}><RotateCcw size={15}/> Reset training scenario</button></div></section>}
        </section>
        <footer>Source scope: RTN950 / iManager U2000 Web LCT / NE Version 5.76.07.24 visible reference. Training-only sequence; no live change.</footer>
      </section>
    </section>
    {riskOpen && <div className="neattr-modal-backdrop"><section className="neattr-modal" role="dialog" aria-modal="true" aria-labelledby="ne-risk-title"><div><AlertTriangle size={21}/><span>TRAINING WARNING</span><h2 id="ne-risk-title">The operation may interrupt NE communication.</h2></div><p>المتابعة تحاكي فقط انفصال جلسة التدريب، ثم تتطلب Re-login داخل المتصفح. لا يتم إرسال اسم أو معرف أو أمر إلى RTN 950.</p><section><button onClick={() => { setRiskOpen(false); setFeedback("أُلغي تحذير التدريب؛ لا توجد مسودة مطبقة."); }}>No / Cancel</button><button className="neattr-danger" onClick={acceptRisk}>Yes / Continue training</button></section></section></div>}
  </main>;
}

function Check({ checked, onChange, title, text }: { checked: boolean; onChange: (value: boolean) => void; title: string; text: string }) { return <label className={`neattr-check ${checked ? "checked" : ""}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><span><b>{title}</b><small>{text}</small></span></label>; }
