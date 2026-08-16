/**
 * Design reminder — Field Control Room: an RTL operational simulator with fixed context,
 * proof-led actions, and signal-aqua verification. This is deliberately a training simulation,
 * not a claim to reproduce Huawei's original software.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  HelpCircle,
  Layers3,
  LockKeyhole,
  MapPinned,
  MonitorCog,
  Radio,
  Route,
  ScanLine,
  ShieldCheck,
  TowerControl,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./HomeLabs.css";

type Step = {
  key: string;
  title: string;
  short: string;
  action: string;
  helper: string;
  proof: string;
  icon: typeof ScanLine;
};

type SourceLab = {
  title: string;
  scope: string;
  description: string;
  href?: string;
  state: "ready" | "locked";
};

const steps: Step[] = [
  {
    key: "scope",
    title: "تثبيت نطاق المهمة",
    short: "01",
    action: "ابدأ مراجعة خطة الربط",
    helper: "راجع مخطط المسار، إصدار الجهاز، والـ BOM قبل إدخال أي إعداد.",
    proof: "سجل المهمة: لا توجد قيم تشغيلية مدخلة.",
    icon: ClipboardCheck,
  },
  {
    key: "sites",
    title: "فحص الموقعين",
    short: "02",
    action: "تحقق من جاهزية الطرفين",
    helper: "افحص الطاقة، التأريض، الرف، الكابلات، والـ ODU في الموقعين قبل تشغيل المسار.",
    proof: "دليل التحقق: طرفا الربط ظاهرين في قائمة الفحص.",
    icon: TowerControl,
  },
  {
    key: "version",
    title: "تثبيت الإصدار",
    short: "03",
    action: "أضف مرجع الإصدار",
    helper: "لا تُظهر المحاكاة أسماء قوائم أو أوامر دقيقة قبل ربطها بالدليل وإصدار البرنامج الفعلي.",
    proof: "قيد الحماية: يتطلب دليل RTN 910 أو RTN 950 المعتمد.",
    icon: BookOpenCheck,
  },
  {
    key: "radio",
    title: "إعداد الراديو",
    short: "04",
    action: "راجع معلمات التصميم",
    helper: "تُقرأ الترددات والاستقطاب والطاقة من Link Engineering Sheet المعتمد، لا من نموذج عام.",
    proof: "المعلمات: بانتظار ورقة التصميم المعتمدة.",
    icon: Radio,
  },
  {
    key: "align",
    title: "المحاذاة والتحقق",
    short: "05",
    action: "ابدأ فحص الإشارة",
    helper: "حرّك الهوائي تدريجيًا وفق إجراءات السلامة وسجل القياسات في الموقعين.",
    proof: "حالة الوصلة: لم يتم إثبات RSL أو الجودة بعد.",
    icon: Gauge,
  },
  {
    key: "acceptance",
    title: "القبول والتسليم",
    short: "06",
    action: "افتح حزمة القبول",
    helper: "اختبر استمرارية الخدمة والإنذارات والنسخ الاحتياطي ثم أنشئ As-Built وAcceptance Pack.",
    proof: "المخرج: مشروع ربط موقع «أ» بموقع «ب» قابل للتدقيق.",
    icon: FileCheck2,
  },
];

const sourceLabs: SourceLab[] = [
  { title: "تركيب الرف والكروت", scope: "RTN950A 2+0 · Slot Layout", description: "سحب وإفلات ISM6 وODU في منافذ تدريبية مع رفض الإسقاط غير المتوافق.", href: "/rtn950a-slot-layout", state: "ready" },
  { title: "تكوين وصلة بين موقعين", scope: "RTN950A 2+0 · Link Configuration", description: "فحص الطرفين، مسودة Link، توافق Site A/Site B، تحذير Apply والتحقق المحلي.", href: "/rtn950a-link-lab", state: "ready" },
  { title: "تغيير الهوية وإعادة الدخول", scope: "RTN950 · Web LCT 5.76.07.24", description: "تدريب منفصل على تحذير انقطاع الاتصال ومحاكاة إعادة الدخول، بلا هوية أو NE حية.", href: "/rtn950-ne-attribute-lab", state: "ready" },
  { title: "Navigator للاسترداد المقيد", scope: "RTN910V1R1 · Huawei FAQ", description: "أوامر الفحص والاسترداد المنشورة فقط، منفصلة عن مسار RTN950/950A.", href: "/navigator-demo", state: "ready" },
  { title: "Physical Link Aggregation", scope: "مرئي في RTN950A 2+0", description: "مؤجل حتى توثيق لقطات الواجهة الكاملة ونطاق الخدمة للإصدار المطابق.", state: "locked" },
  { title: "E-LAN / VLAN وخدمات النقل", scope: "مرئي في مصدر منفصل", description: "محجوب حتى تتوفر وثائق خدمة ولقطات مرخصة تمنع خلط RTN950A وRTN380/380AX.", state: "locked" },
];

const modelInfo = {
  "RTN 910": {
    release: "يلزم تأكيد إصدار الجهاز",
    descriptor: "مسار تدريب منفصل للطراز RTN 910. لا تُعمم الواجهات أو الأوامر من جهاز آخر.",
  },
  "RTN 950": {
    release: "اختَر فرع البرنامج الفعلي",
    descriptor: "مسار تدريب منفصل للطراز RTN 950، مع فصل إعدادات الشاسيه واللوحات والحماية بحسب المرجع.",
  },
};

export default function Home() {
  const initialStep = Math.min(
    Math.max(Number(new URLSearchParams(window.location.search).get("step") ?? 0) || 0, 0),
    steps.length - 1,
  );
  const [activeStep, setActiveStep] = useState(initialStep);
  const [model, setModel] = useState<keyof typeof modelInfo>("RTN 910");
  const [checked, setChecked] = useState<string[]>([]);
  const current = steps[activeStep];
  const CurrentIcon = current.icon;
  const verifiedCount = checked.length;
  const progress = Math.round((activeStep / (steps.length - 1)) * 100);

  const checkItems = useMemo(
    () => [
      { id: "site-a", label: "الموقع «أ»: هوية الجهاز وملصق اللوحة موثقان" },
      { id: "site-b", label: "الموقع «ب»: الطاقة والتأريض ومسار الكابل مفحوصة" },
      { id: "release", label: "إصدار البرنامج والدليل المرجعي مُثبتان" },
    ],
    [],
  );

  const toggleCheck = (id: string) => {
    setChecked((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const advance = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  const retreat = () => setActiveStep((step) => Math.max(step - 1, 0));

  return (
    <main className="sim-shell" dir="rtl">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="sim-topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src="/manus-storage/rtn-link-mark_2bee8544.png" alt="رمز وصلة تدريبية" />
          <div>
            <p className="eyebrow">FIELDLINK / TRAINING CONSOLE</p>
            <h1>محاكي مسار RTN</h1>
          </div>
        </div>
        <div className="topbar-status" aria-label="حالة المحاكاة">
          <span className="status-chip simulation"><MonitorCog size={15} /> محاكاة تعليمية</span>
          <span className="status-chip"><LockKeyhole size={14} /> دون شبكة إنتاج</span>
          <span className="status-chip healthy"><CheckCircle2 size={15} /> سياق المهمة محفوظ</span>
        </div>
      </header>

      <section className="mission-strip">
        <div className="mission-title">
          <span className="kicker">مهمة التخرّج</span>
          <strong>ربط موقع «أ» ↔ موقع «ب»</strong>
          <span className="mission-divider" />
          <span className="mono">TWO-SITE LINK / TRAINING TRACK</span>
        </div>
        <div className="model-toggle" role="group" aria-label="اختيار طراز التدريب">
          {(Object.keys(modelInfo) as Array<keyof typeof modelInfo>).map((item) => (
            <button key={item} className={model === item ? "model-button selected" : "model-button"} onClick={() => setModel(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="step-rail" aria-label="مراحل المحاكاة">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index === activeStep;
          const done = index < activeStep;
          return (
            <button
              className={`rail-step ${active ? "active" : ""} ${done ? "done" : ""}`}
              key={step.key}
              onClick={() => setActiveStep(index)}
              aria-current={active ? "step" : undefined}
            >
              <span className="rail-index">{done ? <Check size={12} /> : step.short}</span>
              <span className="rail-copy"><Icon size={15} /><span>{step.title}</span></span>
            </button>
          );
        })}
      </section>

      <div className="workspace">
        <aside className="mission-sidebar">
          <div className="field-card">
            <div className="field-photo" />
            <div className="field-card-content">
              <span className="card-label">سياق مسار التدريب</span>
              <h2>وصلة ميكروويف ثنائية الموقع</h2>
              <p>تتدرج المحاكاة من فحص الوثائق إلى القبول، ولا تدّعي أن قيمها تشغيلية.</p>
              <div className="site-pair">
                <span><MapPinned size={15} /> موقع «أ»</span>
                <Waves size={15} className="link-waves" />
                <span><MapPinned size={15} /> موقع «ب»</span>
              </div>
            </div>
          </div>

          <div className="side-panel">
            <div className="side-panel-heading"><Route size={16} /><span>تقدّم المهمة</span><b>{progress}%</b></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            <p>الخطوة {activeStep + 1} من {steps.length}: {current.title}</p>
          </div>

          <div className="side-panel evidence-panel">
            <div className="side-panel-heading"><ShieldCheck size={16} /><span>سجل الإثبات</span><b>{verifiedCount}/3</b></div>
            {checkItems.map((item) => (
              <label className={checked.includes(item.id) ? "evidence-row checked" : "evidence-row"} key={item.id}>
                <input type="checkbox" checked={checked.includes(item.id)} onChange={() => toggleCheck(item.id)} />
                <span className="custom-check">{checked.includes(item.id) && <Check size={12} />}</span>
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className="console-stage" aria-label="منطقة المحاكاة">
          <div className="console-window">
            <div className="console-titlebar">
              <div className="window-dots"><i /><i /><i /></div>
              <div className="console-title"><span className="pulse-dot" /> تدريب محلي — {model} — {modelInfo[model].release}</div>
              <span className="readonly-label">READ ONLY / TRAINING</span>
            </div>

            <div className="console-body">
              <aside className="console-nav">
                <span className="nav-caption">WORKFLOW</span>
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <button className={index === activeStep ? "console-nav-item active" : "console-nav-item"} onClick={() => setActiveStep(index)} key={step.key}>
                      <Icon size={17} /><span>{step.title}</span>
                    </button>
                  );
                })}
                <div className="nav-footnote"><CircleAlert size={15} /> لا تُطبق أي خطوة على شبكة إنتاج من دون مراجعة الدليل.</div>
              </aside>

              <div className="console-content">
                <div className="content-heading">
                  <div>
                    <span className="step-number">STEP {current.short}</span>
                    <h2>{current.title}</h2>
                    <p>{current.helper}</p>
                  </div>
                  <div className="step-icon-box"><CurrentIcon size={27} /></div>
                </div>

                <div className="context-cards">
                  <div className="context-card">
                    <span>الطراز المحدد</span>
                    <strong>{model}</strong>
                    <small>{modelInfo[model].descriptor}</small>
                  </div>
                  <div className="context-card alert-card">
                    <span>حاجز الدقة</span>
                    <strong>مرجع الإصدار مطلوب</strong>
                    <small>تتوقف حقول الأوامر الدقيقة حتى اعتماد دليل الطراز والإصدار.</small>
                  </div>
                </div>

                <div className="action-zone">
                  <div className="action-copy">
                    <span className="card-label">النقرة التدريبية التالية</span>
                    <h3>{current.action}</h3>
                    <p>ينفذ هذا الزر تقدمًا داخل سيناريو التدريب فقط. لا يرسل أي أمر إلى جهاز أو شبكة.</p>
                  </div>
                  <button className="guided-action" onClick={advance}>
                    <span className="click-ring" aria-hidden="true" />
                    <span>{current.action}</span>
                    <ChevronLeft size={19} />
                  </button>
                </div>

                <div className="two-site-canvas">
                  <div className="canvas-topline"><span><Layers3 size={15} /> المخطط المصغّر للمهمة</span><span className="mono">SITE-A · {model} · SITE-B</span></div>
                  <div className="site-node site-a"><span className="site-marker">A</span><div><b>الموقع «أ»</b><small>جرد العتاد · التأريض · ODU</small></div></div>
                  <div className="radio-path"><span className="path-line" /><span className="path-beacon one" /><span className="path-beacon two" /><span className="path-label">الوصلة تحت التدريب</span></div>
                  <div className="site-node site-b"><span className="site-marker">B</span><div><b>الموقع «ب»</b><small>التحقق المقابل · الخدمة · القبول</small></div></div>
                </div>

                <div className="proof-bar"><CheckCircle2 size={16} /><span>{current.proof}</span></div>

                <section className="source-lab-panel" aria-label="المختبرات المتاحة حسب المصدر">
                  <div className="source-lab-heading"><div><span className="card-label">مسار تعلم مصدرّي</span><h3>المختبرات المتاحة حسب الطراز والإصدار</h3></div><span className="mono">{sourceLabs.filter((lab) => lab.state === "ready").length} READY / {sourceLabs.length} MAPPED</span></div>
                  <div className="source-lab-grid">
                    {sourceLabs.map((lab) => lab.href ? (
                      <a className="source-lab-card ready" href={lab.href} key={lab.title}>
                        <span><MonitorCog size={16} /> {lab.scope}</span><b>{lab.title}</b><p>{lab.description}</p><em>Open training lab <ArrowLeft size={14} /></em>
                      </a>
                    ) : (
                      <article className="source-lab-card locked" key={lab.title}>
                        <span><LockKeyhole size={15} /> {lab.scope}</span><b>{lab.title}</b><p>{lab.description}</p><em>Evidence required</em>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <footer className="console-footer">
              <Button variant="outline" className="back-button" onClick={retreat} disabled={activeStep === 0}><ArrowRight size={16} /> الخطوة السابقة</Button>
              <div className="footer-note"><HelpCircle size={15} /> استخدم لقطات الدليل الرسمية لإكمال الشاشات والأوامر الدقيقة.</div>
              <Button className="next-button" onClick={advance} disabled={activeStep === steps.length - 1}>الخطوة التالية <ArrowLeft size={16} /></Button>
            </footer>
          </div>
        </section>

        <aside className="coach-sidebar">
          <div className="coach-header"><ScanLine size={17} /><span>ملاحظة المدرب</span></div>
          <div className="coach-message">
            <span className="coach-index">{current.short}</span>
            <p>{current.helper}</p>
          </div>
          <div className="coach-card">
            <span className="card-label">حدود المحاكاة</span>
            <p>هذه الواجهة تبني تسلسل النقرات وتوثق نقاط التحقق. شاشة الأوامر النهائية ستُطابق المرجع المتاح للطراز والإصدار، ولا تُنشأ من التخمين.</p>
          </div>
          <div className="coach-card visual-card">
            <img src="/manus-storage/rtn-equipment-room_479e04fb.png" alt="غرفة معدات اتصال نموذجية" />
            <div><span className="card-label">لقطة سياق</span><b>غرفة المعدات</b><p>ابدأ من الجرد، لا من أول أمر.</p></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
