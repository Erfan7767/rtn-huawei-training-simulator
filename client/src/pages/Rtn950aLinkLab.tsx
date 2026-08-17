import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, FileWarning, Network, Radio, RotateCcw, ShieldAlert, X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import TrainingConsoleBanner from "@/components/TrainingConsoleBanner";
import { useTrainingProgress } from "@/contexts/TrainingProgressContext";
import "./Rtn950aLinkLab.css";

type LabStep = "precheck" | "add" | "basic" | "rf" | "confirm" | "applied" | "verify";

const stepMeta: { id: LabStep; number: number; arabic: string; english: string }[] = [
  { id: "precheck", number: 1, arabic: "فحص الجاهزية", english: "Pre-check" },
  { id: "add", number: 2, arabic: "إضافة الوصلة", english: "Add Link" },
  { id: "basic", number: 3, arabic: "المعاملات الأساسية", english: "Basic Parameters" },
  { id: "rf", number: 4, arabic: "مراجعة RF", english: "RF Information" },
  { id: "confirm", number: 5, arabic: "تأكيد التغيير", english: "Risk Confirmation" },
  { id: "applied", number: 6, arabic: "نتيجة التنفيذ", english: "Operation Result" },
  { id: "verify", number: 7, arabic: "التحقق", english: "Verify" },
];

const labLogLabels: Record<LabStep, string> = {
  precheck: "لم تُنشأ مسودة إعداد بعد.",
  add: "تمت إضافة وصلة تدريبية إلى المسودة المحلية.",
  basic: "تم حفظ معاملات الخدمة والتعديل في المسودة التدريبية.",
  rf: "تمت مراجعة ملف RF التدريبي؛ لا توجد قيمة ميدانية أو جهاز حي.",
  confirm: "المسودة جاهزة لتأكيد المخاطر داخل المحاكاة.",
  applied: "نتيجة تنفيذ تدريبية: Success — لا توجد جلسة NE أو ODU.",
  verify: "اكتمل تحقق تدريبي بصري؛ القبول الميداني يحتاج إجراءات الموقع المعتمدة.",
};

export default function Rtn950aLinkLab() {
  const { completeModule } = useTrainingProgress();
  const [step, setStep] = useState<LabStep>("precheck");
  const [ready, setReady] = useState({ inventory: false, design: false, remote: false });
  const [endpoints, setEndpoints] = useState({ siteA: "", siteB: "" });
  const [compatibility, setCompatibility] = useState({ bandwidthA: "28 MHz", bandwidthB: "56 MHz", txA: "QPSK Strong", txB: "1024QAM", xpicA: "Enabled", xpicB: "Disabled" });
  const [linkAdded, setLinkAdded] = useState(false);
  const [basic, setBasic] = useState({ service: "Hybrid (Native E1+Eth)", bandwidth: "28 MHz", am: "Enabled", txMode: "QPSK Strong", rxMode: "1024QAM" });
  const [rfProfile, setRfProfile] = useState("Observed 2+0 training profile");
  const [reviewed, setReviewed] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [verify, setVerify] = useState({ visual: false, remote: false, record: false });
  const [feedback, setFeedback] = useState("ابدأ بفحص الجاهزية. كل خطوة تسجل داخل المتصفح فقط.");

  const currentIndex = stepMeta.findIndex((item) => item.id === step);
  const allReady = ready.inventory && ready.design && ready.remote && endpoints.siteA.trim().length > 0 && endpoints.siteB.trim().length > 0;
  const allVerified = verify.visual && verify.remote && verify.record;
  const stepLog = useMemo(() => stepMeta.slice(0, currentIndex + 1).map((item) => ({ ...item, message: item.id === step ? labLogLabels[item.id] : "تمت هذه المرحلة في المختبر التدريبي." })), [currentIndex, step]);

  useEffect(() => {
    if (allVerified) completeModule("link-configuration");
  }, [allVerified, completeModule]);

  const selectStep = (target: LabStep) => {
    const targetIndex = stepMeta.findIndex((item) => item.id === target);
    if (targetIndex <= currentIndex) { setStep(target); setFeedback(`عرض المرحلة: ${stepMeta[targetIndex].arabic}.`); return; }
    setFeedback("أكمل المرحلة الحالية أولًا. لا تسمح المحاكاة بتجاوز نقاط التحقق.");
  };

  const continueFromPrecheck = () => {
    if (!allReady) return setFeedback("يلزم تأكيد الجرد، مراجعة تصميم الموقع المعتمد، وتأكيد الطرف البعيد قبل إنشاء مسودة الوصلة.");
    setStep("add"); setFeedback("الجاهزية مكتملة داخل المحاكاة. افتح نافذة Add لإنشاء Link 1 تدريبي.");
  };
  const continueFromAdd = () => {
    if (!linkAdded) return setFeedback("اضغط Add وأنشئ المسودة التدريبية على بطاقة ISM6 الظاهرة قبل متابعة معاملات الوصلة.");
    setStep("basic"); setFeedback("أُنشئت Link 1 داخل الذاكرة المحلية للمحاكاة فقط.");
  };
  const continueFromBasic = () => { setStep("rf"); setFeedback("راجع ملف RF التدريبي. لا تستخدم أي قيمة ظاهرة كخطة تردد أو قدرة إنتاجية."); };
  const continueFromRf = () => {
    if (!reviewed) return setFeedback("أكد أن ملف RF التدريبي قابل للمراجعة فقط وأن تصميم الموقع المعتمد هو مصدر أي قيمة حقيقية.");
    setStep("confirm"); setFeedback("ستظهر رسالة الخطر المرئية من تسلسل المصدر عند طلب Apply.");
  };
  const compatibilityIssues = [
    compatibility.bandwidthA !== compatibility.bandwidthB ? "IF Channel Bandwidth غير متطابق بين Site A وSite B." : "",
    compatibility.txA !== compatibility.txB ? "TX/RX Modulation profile غير متطابق بين الطرفين." : "",
    compatibility.xpicA !== compatibility.xpicB ? "XPIC state غير متطابق بين الطرفين." : "",
  ].filter(Boolean);
  const compatibilityReady = compatibilityIssues.length === 0;
  const requestApply = () => {
    if (!compatibilityReady) return setFeedback("تم منع Apply: صحّح توافق Site A وSite B في لوحة Compatibility Gate أولًا.");
    setRiskOpen(true);
  };
  const confirmApply = () => { setRiskOpen(false); setApplied(true); setStep("applied"); setFeedback("Operation Result: Success داخل المحاكاة. لم يُرسل أي أمر إلى Web LCT أو جهاز RTN."); };
  const rollback = () => {
    setStep("precheck"); setLinkAdded(false); setApplied(false); setRiskOpen(false); setReviewed(false); setVerify({ visual: false, remote: false, record: false }); setFeedback("تمت إزالة مسودة المختبر محليًا. لا توجد عملية رجوع على معدات فعلية.");
  };

  return <main className="rtnlab-page" dir="ltr">
    <TrainingConsoleBanner moduleId="link-configuration" moduleTitle="مختبر ربط RTN950A ثنائي الموقع" sourceScope="RTN950A 2+0 · مرجع تدريبي مقيد" />
    <div className="rtnlab-disclosure">TRAINING REPLICA · RTN950A 2+0 REFERENCE WORKFLOW · NO LIVE NE / NO DEVICE WRITE</div>
    <header className="rtnlab-header"><div className="rtnlab-wordmark"><span>✺</span><b>Web LCT</b><em>Microwave Link Configuration Training Lab</em></div><div className="rtnlab-icons"><button aria-label="Help"><CircleHelp size={16}/></button><button aria-label="Close"><X size={16}/></button></div></header>
    <div className="rtnlab-status"><span>NE NAME: RTN950A-TRAINING-NE</span><i/><span>DEVICE TYPE: RTN950A — REFERENCE SCOPE</span><i/><span>NE STATE: OFFLINE / SIMULATED</span><span className="rtnlab-state"><b className={applied ? "online" : ""}/>{applied ? "TRAINING RESULT: SUCCESS" : "DRAFT: NOT APPLIED"}</span></div>
    <section className="rtnlab-shell">
      <aside className="rtnlab-tree"><section className="rtnlab-ne-tree"><b><ChevronDown size={12}/> RTN950A-TRAINING-NE</b><span><ChevronDown size={12}/> Shelf-0 (training)</span><span className={linkAdded ? "installed" : ""}>1-ISM6-LRTN(P-1)</span><span className={applied ? "installed" : ""}>21-ODU</span><span className={applied ? "installed" : ""}>41-ODU</span></section><div className="rtnlab-rule"/><section className="rtnlab-function-tree"><b>Function Tree</b><span><ChevronDown size={12}/> Configuration</span><button className="selected"><Network size={13}/> Microwave Link Configuration</button><button><ChevronRight size={12}/> Physical Link Aggregation</button><button><ChevronRight size={12}/> Ethernet Service</button><button><ChevronRight size={12}/> DCN Management</button><button><ChevronRight size={12}/> Fault</button><button><ChevronRight size={12}/> Performance</button></section><div className="rtnlab-source-card"><FileWarning size={15}/><p>المرجع البصري: RTN950A 2+0، تسلسل Web LCT عام. لا يُعمم على RTN910 أو إصدار آخر.</p></div></aside>
      <section className="rtnlab-main">
        <div className="rtnlab-tabs"><Link href="/rtn950a-slot-layout">Slot Layout</Link><button className="active">Microwave Link Configuration <X size={12}/></button><button>Physical Link Aggregation</button></div>
        <div className="rtnlab-heading"><div><p>CONFIGURATION / MICROWAVE LINK CONFIGURATION</p><h1>Microwave Link Configuration</h1><span>مختبر عربي تدريبي: أدخل وراجع ثم نفّذ محاكاة آمنة لخطوات الإعداد المرئية.</span></div><button className="rtnlab-reset" onClick={rollback}><RotateCcw size={14}/> Rollback training draft</button></div>
        <nav className="rtnlab-steps" aria-label="خطوات المختبر">{stepMeta.map((item, index) => <button key={item.id} className={`${index === currentIndex ? "current" : ""} ${index < currentIndex ? "complete" : ""}`} onClick={() => selectStep(item.id)}><b>{index < currentIndex ? <CheckCircle2 size={15}/> : item.number}</b><span>{item.arabic}<small>{item.english}</small></span></button>)}</nav>
        <div className="rtnlab-feedback"><ShieldAlert size={16}/><span>{feedback}</span></div>
        <section className="rtnlab-workspace" data-testid="rtnlab-workspace" data-active-step={step}>
          {step === "precheck" && <Precheck ready={ready} setReady={setReady} endpoints={endpoints} setEndpoints={setEndpoints} onContinue={continueFromPrecheck}/>} 
          {step === "add" && <AddLink linkAdded={linkAdded} setLinkAdded={setLinkAdded} endpoints={endpoints} onContinue={continueFromAdd}/>} 
          {step === "basic" && <BasicParameters basic={basic} setBasic={setBasic} onContinue={continueFromBasic}/>} 
          {step === "rf" && <RfReview profile={rfProfile} setProfile={setRfProfile} reviewed={reviewed} setReviewed={setReviewed} onContinue={continueFromRf}/>} 
          {step === "confirm" && <ConfirmApply endpoints={endpoints} compatibility={compatibility} setCompatibility={setCompatibility} issues={compatibilityIssues} onRequest={requestApply}/>} 
          {step === "applied" && <AppliedResult onVerify={() => { setStep("verify"); setFeedback("تحقق من عناصر القبول التدريبية قبل إغلاق المختبر."); }}/>} 
          {step === "verify" && <Verify endpoints={endpoints} verify={verify} setVerify={setVerify} allVerified={allVerified} onRollback={rollback}/>} 
        </section>
        <section className="rtnlab-log"><div><ClipboardCheck size={15}/><b>Training action log</b><span>محلي وغير قابل للتصدير إلى جهاز</span></div>{stepLog.map((entry) => <p key={entry.id}><i className={entry.id === step ? "current" : ""}/><b>{entry.number}. {entry.english}</b><span>{entry.message}</span></p>)}</section>
        <footer>الحقول الإنجليزية أدناه مقلدة من مسار مرئي عام لـ RTN950A. القيم المختارة هي Training Profile فقط، وليست إعدادات شبكة أو توصية تشغيلية.</footer>
      </section>
    </section>
    {riskOpen && <RiskDialog onCancel={() => { setRiskOpen(false); setFeedback("تم إلغاء طلب Apply. ما زالت المسودة غير منفذة."); }} onConfirm={confirmApply}/>} 
  </main>;
}

function Panel({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children: React.ReactNode; actions?: React.ReactNode }) { return <div className="rtnlab-panel"><div className="rtnlab-panel-title"><span>{eyebrow}</span><h2>{title}</h2></div>{children}{actions && <div className="rtnlab-panel-actions">{actions}</div>}</div>; }

function Precheck({ ready, setReady, endpoints, setEndpoints, onContinue }: { ready: { inventory: boolean; design: boolean; remote: boolean }; setReady: React.Dispatch<React.SetStateAction<{ inventory: boolean; design: boolean; remote: boolean }>>; endpoints: { siteA: string; siteB: string }; setEndpoints: React.Dispatch<React.SetStateAction<{ siteA: string; siteB: string }>>; onContinue: () => void }) { return <Panel eyebrow="STEP 1 / PRE-CHECK" title="فحص الجاهزية قبل بناء المسودة" actions={<button className="rtnlab-primary" onClick={onContinue}>Continue to Add Link <ChevronRight size={15}/></button>}><p className="rtnlab-intro">عرّف طرفي التدريب بصورة منفصلة. الاسمان محليان داخل المتصفح ولا يمثلان NE حقيقية أو عنونة تشغيلية.</p><div className="rtnlab-endpoint-grid"><label><span>Site A / Near End (training label)</span><input value={endpoints.siteA} placeholder="مثال: SITE-A-TRAINING" onChange={(event) => setEndpoints((current) => ({ ...current, siteA: event.target.value }))}/><small>طرف الإرسال/الاستقبال في مسودة المتدرب، وليس جهازًا حيًا.</small></label><div className="rtnlab-endpoint-link"><i/><Network size={18}/><b>2+0 training path</b><i/></div><label><span>Site B / Far End (training label)</span><input value={endpoints.siteB} placeholder="مثال: SITE-B-TRAINING" onChange={(event) => setEndpoints((current) => ({ ...current, siteB: event.target.value }))}/><small>طرف بعيد تدريبي مستقل للمقارنة قبل Apply.</small></label></div><div className="rtnlab-check-grid"><CheckItem checked={ready.inventory} onChange={(value) => setReady((prev) => ({...prev, inventory: value}))} title="Physical inventory reviewed" text="تمت مراجعة الجرد المعتمد خارج المحاكي؛ لم يُستكشف عتاد حقيقي."/><CheckItem checked={ready.design} onChange={(value) => setReady((prev) => ({...prev, design: value}))} title="Approved link design available" text="أي تردد أو قدرة أو عرض نطاق حقيقي يجب أن يأتي من التصميم المعتمد فقط."/><CheckItem checked={ready.remote} onChange={(value) => setReady((prev) => ({...prev, remote: value}))} title="Far-end identity confirmed" text="تأكيد تدريبي للطرف البعيد؛ لا توجد جلسة NE أو تحقق من شبكة."/></div></Panel>; }

function AddLink({ linkAdded, setLinkAdded, endpoints, onContinue }: { linkAdded: boolean; setLinkAdded: (value: boolean) => void; endpoints: { siteA: string; siteB: string }; onContinue: () => void }) { return <Panel eyebrow="STEP 2 / ADD" title="إضافة Link 1 تدريبية" actions={<><button className="rtnlab-secondary" onClick={() => setLinkAdded(true)} disabled={linkAdded}>{linkAdded ? "Added to draft" : "Add"}</button><button className="rtnlab-primary" onClick={onContinue}>Continue <ChevronRight size={15}/></button></>}><div className="rtnlab-two-cols"><div className="rtnlab-form-block"><label>Board<select defaultValue="1-ISM6-LRTN(P-1)"><option>1-ISM6-LRTN(P-1)</option></select></label><label>Link ID<input value="1 — training draft" readOnly/></label><label>Near End / Site A<input value={endpoints.siteA} readOnly/></label><label>Far End / Site B<input value={endpoints.siteB} readOnly/></label><label>Configuration window<select defaultValue="Link 1"><option>Link 1</option></select></label></div><aside className="rtnlab-observed"><b>Observed interaction</b><p>يفتح المصدر المرئي Configuration → Microwave Link Configuration ثم يختار Add وبطاقة ISM6 قبل عرض حقول الوصلة.</p><small>أضيفت حقول Site A وSite B للتمييز التدريبي بين الطرفين؛ لا تثبتها اللقطة العامة كحقول أصلية في نفس الإصدار.</small></aside></div>{linkAdded && <div className="rtnlab-success"><CheckCircle2 size={16}/> Operation Result: Success — training draft created locally for Site A ↔ Site B.</div>}</Panel>; }

function BasicParameters({ basic, setBasic, onContinue }: { basic: { service: string; bandwidth: string; am: string; txMode: string; rxMode: string }; setBasic: React.Dispatch<React.SetStateAction<{ service: string; bandwidth: string; am: string; txMode: string; rxMode: string }>>; onContinue: () => void }) { const update = (key: keyof typeof basic, value: string) => setBasic((current) => ({ ...current, [key]: value })); return <Panel eyebrow="STEP 3 / BASIC PARAMETERS" title="معاملات الوصلة الأساسية" actions={<button className="rtnlab-primary" onClick={onContinue}>Review RF Information <ChevronRight size={15}/></button>}><p className="rtnlab-intro">تعرض القيم المرصودة في العرض العام كـ <b>Training Profile</b>. لا تعدلها المحاكاة ولا تقدمها كخيار هندسي لموقعك.</p><div className="rtnlab-form-grid"><SelectField label="IF Service Type" value={basic.service} onChange={(value) => update("service", value)} options={["Hybrid (Native E1+Eth)", "Training profile — select approved design"]}/><SelectField label="IF Channel Bandwidth" value={basic.bandwidth} onChange={(value) => update("bandwidth", value)} options={["28 MHz", "Training profile — select approved design"]}/><SelectField label="AM Status" value={basic.am} onChange={(value) => update("am", value)} options={["Enabled", "Disabled"]}/><SelectField label="TX Modulation Mode" value={basic.txMode} onChange={(value) => update("txMode", value)} options={["QPSK Strong", "Training profile — select approved design"]}/><SelectField label="RX Modulation Mode" value={basic.rxMode} onChange={(value) => update("rxMode", value)} options={["1024QAM", "Training profile — select approved design"]}/></div></Panel>; }

function RfReview({ profile, setProfile, reviewed, setReviewed, onContinue }: { profile: string; setProfile: (value: string) => void; reviewed: boolean; setReviewed: (value: boolean) => void; onContinue: () => void }) { return <Panel eyebrow="STEP 4 / RF INFORMATION" title="مراجعة ملف RF التدريبي" actions={<button className="rtnlab-primary" onClick={onContinue}>Continue to Risk Confirmation <ChevronRight size={15}/></button>}><div className="rtnlab-two-cols"><div className="rtnlab-form-block"><label>Training profile<select value={profile} onChange={(event) => setProfile(event.target.value)}><option>Observed 2+0 training profile</option><option>Blank site-design review profile</option></select></label><label>TX Frequency<input value={profile.startsWith("Observed") ? "Source-visible training value" : "Read authorized site design"} readOnly/></label><label>RX Frequency<input value={profile.startsWith("Observed") ? "Source-visible training value" : "Read authorized site design"} readOnly/></label><label>TX Power<input value="Never a live device setting" readOnly/></label><label>ATPC Status<select defaultValue="Disabled"><option>Disabled</option><option>Enabled</option></select></label></div><aside className="rtnlab-risk-note"><AlertTriangle size={18}/><b>إجراء محمي</b><p>يحاكي المصدر المرئي حقول التردد والاستقبال والفصل وقدرة الإرسال ثم Apply. في هذا المختبر لا يمكن إدخال قيمة رقمية فعلية أو تطبيقها.</p><label><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)}/> راجعت أن تصميم الموقع المعتمد هو المصدر الوحيد للقيم الفعلية.</label></aside></div></Panel>; }

function ConfirmApply({ endpoints, compatibility, setCompatibility, issues, onRequest }: { endpoints: { siteA: string; siteB: string }; compatibility: { bandwidthA: string; bandwidthB: string; txA: string; txB: string; xpicA: string; xpicB: string }; setCompatibility: React.Dispatch<React.SetStateAction<{ bandwidthA: string; bandwidthB: string; txA: string; txB: string; xpicA: string; xpicB: string }>>; issues: string[]; onRequest: () => void }) { const update = (key: keyof typeof compatibility, value: string) => setCompatibility((current) => ({ ...current, [key]: value })); const match = (left: keyof typeof compatibility, right: keyof typeof compatibility, value: string) => { update(left, value); update(right, value); }; return <Panel eyebrow="STEP 5 / RISK CONFIRMATION" title="ملخص المقارنة وطلب تنفيذ تدريبـي" actions={<button className="rtnlab-danger" onClick={onRequest} disabled={issues.length > 0}><AlertTriangle size={15}/> {issues.length > 0 ? "Apply blocked — fix compatibility" : "Apply training draft"}</button>}><div className="rtnlab-confirm-grid"><div><b>Site A / Near End</b><p>{endpoints.siteA}</p><p>Training draft endpoint</p></div><div><b>Site B / Far End</b><p>{endpoints.siteB}</p><p>Training comparison endpoint</p></div><div><b>تغيير مشترك</b><p>Link 1 / RTN950A 2+0 Training Profile</p><p>Basic Parameters + RF Information</p></div></div><section className={`rtnlab-compatibility ${issues.length ? "blocked" : "matched"}`}><div className="rtnlab-compatibility-head"><div><span>TRAINING COMPATIBILITY GATE</span><h3>{issues.length ? "Apply محظور حتى تصحيح التوافق" : "التوافق مكتمل بين الطرفين"}</h3></div><b>{issues.length ? `${issues.length} issue(s)` : "READY"}</b></div><div className="rtnlab-compatibility-grid"><label>Bandwidth A<select value={compatibility.bandwidthA} onChange={(event) => update("bandwidthA", event.target.value)}><option>28 MHz</option><option>56 MHz</option></select></label><label>Bandwidth B<select value={compatibility.bandwidthB} onChange={(event) => update("bandwidthB", event.target.value)}><option>28 MHz</option><option>56 MHz</option></select></label><button type="button" onClick={() => match("bandwidthA", "bandwidthB", compatibility.bandwidthA)}>Match bandwidth</button><label>Modulation A<select value={compatibility.txA} onChange={(event) => update("txA", event.target.value)}><option>QPSK Strong</option><option>1024QAM</option></select></label><label>Modulation B<select value={compatibility.txB} onChange={(event) => update("txB", event.target.value)}><option>QPSK Strong</option><option>1024QAM</option></select></label><button type="button" onClick={() => match("txA", "txB", compatibility.txA)}>Match modulation</button><label>XPIC A<select value={compatibility.xpicA} onChange={(event) => update("xpicA", event.target.value)}><option>Enabled</option><option>Disabled</option></select></label><label>XPIC B<select value={compatibility.xpicB} onChange={(event) => update("xpicB", event.target.value)}><option>Enabled</option><option>Disabled</option></select></label><button type="button" onClick={() => match("xpicA", "xpicB", compatibility.xpicA)}>Match XPIC</button></div>{issues.length > 0 ? <div className="rtnlab-compatibility-errors"><b><ShieldAlert size={15}/> تصحيح مطلوب قبل Apply</b>{issues.map((issue) => <p key={issue}>• {issue}</p>)}</div> : <div className="rtnlab-compatibility-ok"><CheckCircle2 size={15}/> تماثل Training Profile للطرفين. أصبح Apply متاحًا للتجربة التعليمية.</div>}</section><div className="rtnlab-limit-note"><b>الحدود:</b> لا توجد جلسة NE أو اتصال ODU أو مقارنة قياسات حية. هذا الحاجز إضافة تدريبية صريحة، وليس تحققًا أصليًا من برنامج Huawei.</div></Panel>; }

function AppliedResult({ onVerify }: { onVerify: () => void }) { return <Panel eyebrow="STEP 6 / OPERATION RESULT" title="نتيجة التنفيذ داخل المحاكاة" actions={<button className="rtnlab-primary" onClick={onVerify}>Open verification <ChevronRight size={15}/></button>}><div className="rtnlab-operation-result"><CheckCircle2 size={38}/><div><b>Operation Result: Success</b><p>تمت ترقية مسودة التدريب إلى حالة «مطبقة» داخل المتصفح. لا يعادل ذلك نجاح تطبيق منظم شبكة أو قبول وصلة ميدانية.</p></div></div></Panel>; }

function Verify({ endpoints, verify, setVerify, allVerified, onRollback }: { endpoints: { siteA: string; siteB: string }; verify: { visual: boolean; remote: boolean; record: boolean }; setVerify: React.Dispatch<React.SetStateAction<{ visual: boolean; remote: boolean; record: boolean }>>; allVerified: boolean; onRollback: () => void }) { return <Panel eyebrow="STEP 7 / VERIFY" title="تحقق تدريبي وإغلاق المسار" actions={<button className="rtnlab-secondary" onClick={onRollback}><RotateCcw size={14}/> Rollback training draft</button>}><div className="rtnlab-verify-topology"><div className="rtnlab-odu green"><Radio size={21}/><b>{endpoints.siteA}</b><span>Site A / training green state</span></div><div className="rtnlab-link-line"><i/><span>2+0 training topology</span><i/></div><div className="rtnlab-odu green"><Radio size={21}/><b>{endpoints.siteB}</b><span>Site B / training green state</span></div></div><div className="rtnlab-check-grid"><CheckItem checked={verify.visual} onChange={(value) => setVerify((prev) => ({...prev, visual: value}))} title="Slot Layout visual review" text="الرموز الخضراء هنا تمثيل لتسلسل الفيديو وليست حالة اتصال."/><CheckItem checked={verify.remote} onChange={(value) => setVerify((prev) => ({...prev, remote: value}))} title="Near/far-end comparison recorded" text="تمثيل تدريبي لمراجعة Site A وSite B؛ لا توجد مقارنة حية."/><CheckItem checked={verify.record} onChange={(value) => setVerify((prev) => ({...prev, record: value}))} title="Site acceptance procedure required" text="القبول الفعلي يتطلب إجراء الموقع المعتمد وقياسات موثقة."/></div>{allVerified && <div className="rtnlab-success"><CheckCircle2 size={16}/> اكتمل مسار المختبر لموقعي A وB. النتيجة تثبت إتمام التدريب فقط، لا صحة وصلة حقيقية.</div>}</Panel>; }

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function CheckItem({ checked, onChange, title, text }: { checked: boolean; onChange: (value: boolean) => void; title: string; text: string }) { return <label className={`rtnlab-check ${checked ? "checked" : ""}`}><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><span><b>{title}</b><small>{text}</small></span></label>; }
function RiskDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) { return <div className="rtnlab-modal-backdrop" role="presentation"><section className="rtnlab-modal" role="dialog" aria-modal="true" aria-labelledby="risk-title"><div className="rtnlab-modal-title"><AlertTriangle size={21}/><div><span>TRAINING WARNING</span><h2 id="risk-title">The operation may break links.</h2></div></div><p>هذه صياغة تحذير مستندة إلى تسلسل المصدر المرئي. الضغط على Yes يحاكي تطبيق المسودة داخل المتصفح فقط؛ لا يرسل أي أمر ولا يؤثر في وصلة.</p><div><button onClick={onCancel}>No / Cancel</button><button className="rtnlab-danger" onClick={onConfirm}>Yes / Continue training</button></div></section></div>; }
