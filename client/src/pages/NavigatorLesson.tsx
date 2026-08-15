/**
 * Design reminder — Field Control Room: command lessons use a restrained terminal panel,
 * version chips, and prominent evidence notes; never imply an original Huawei application.
 */
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, Copy, FileText, KeyRound, MonitorCog, Play, ShieldCheck, TerminalSquare } from "lucide-react";
import "./NavigatorLesson.css";

type CommandLine = {
  command: string;
  intent: string;
  category: "فحص" | "ضبط";
};

type Lesson = {
  index: string;
  title: string;
  subtitle: string;
  stage: string;
  rule: string;
  commands: CommandLine[];
  checks: string[];
  warning: string;
};

const lessons: Lesson[] = [
  {
    index: "01",
    title: "ابدأ بالجرد، لا بالإعداد",
    subtitle: "فحص اللوحات الفعلية والمنطقية قبل كتابة أي قيمة Radio Link.",
    stage: "فحص العتاد",
    rule: "نفّذ أوامر الفحص أولًا وسجّل النتيجة. لا تضف لوحة إلا إذا تطابقت مع الـ BOM واللوحة المركبة فعليًا.",
    commands: [
      { command: ":cfg-get-phybd", intent: "يعرض اللوحات الفعلية المثبتة في الجهاز.", category: "فحص" },
      { command: ":cfg-get-board", intent: "يعرض اللوحات المنطقية التي تعرّف عليها النظام.", category: "فحص" },
      { command: ":cfg-add-board:<slot>,<board_type>", intent: "صيغة إضافة لوحة؛ املأها فقط من الجرد والدليل المطابقين.", category: "ضبط" },
    ],
    checks: ["طابق Physical Boards مع الـ BOM.", "طابق Logical Boards مع الفتحات الفعلية.", "احفظ نتيجة الأمرين قبل أي تعديل."],
    warning: "لا تستخدم slot أو board type من مثال Huawei المنشور؛ تلك القيم تخص حالة مرجعية مختلفة.",
  },
  {
    index: "02",
    title: "تردد الـ ODU: اقرأ ثم طابق الطرفين",
    subtitle: "تكوين تردد الإرسال لا يبدأ من رقم محفوظ؛ يبدأ من Link Engineering Sheet المعتمد.",
    stage: "راديو ODU",
    rule: "يجب أن يطابق T/R spacing المعتمد في الطرفين، وأن يكون الفرق بين ترددي الإرسال وفق مخطط الوصلة ووضع Tx high أو Tx low.",
    commands: [
      { command: ":radio-cfg-get-odu-txfreq:<odu_id>,0xFF", intent: "قراءة تردد الإرسال الحالي للـ ODU المحدد.", category: "فحص" },
      { command: ":radio-cfg-set-odu-txfreq:<odu_id>,0xFF,<tx_frequency>;", intent: "صيغة ضبط تردد الإرسال وفق الخطة المعتمدة فقط.", category: "ضبط" },
      { command: ":radio-cfg-set-odu-tsl:<odu_id>,0xFF,<planned_power>;", intent: "صيغة ضبط قدرة الإرسال؛ قيمة القدرة وترميزها من مرجع الإصدار وخطة المسار.", category: "ضبط" },
    ],
    checks: ["راجع تردد الطرفين قبل التغيير.", "طابق T/R spacing في الموقعين.", "تحقق من حدود ODU والترخيص قبل ضبط القدرة."],
    warning: "الأرقام المنشورة في Huawei FAQ أمثلة لحالة V1R1؛ لا تُنسخ كتردد أو قدرة في رابط آخر.",
  },
  {
    index: "03",
    title: "عرض القناة وLink ID ثم التحقق",
    subtitle: "استخدم أوامر القراءة لتأكيد سياق IF قبل أي ضبط متزامن للطرفين.",
    stage: "IF والتحقق",
    rule: "عرض القناة يجب أن يتطابق مع Link Engineering Sheet ومع اللوحة والـ ODU، ولا يعدّل في طرف واحد بمعزل عن الطرف المقابل.",
    commands: [
      { command: ":radio-cfg-get-if-bandwidth:<board>,0xFF,<port>", intent: "قراءة عرض قناة IF الحالي للمسار المحدد.", category: "فحص" },
      { command: ":radio-cfg-set-if-bandwidth:<board>,0xFF,<port>,<planned_code>;", intent: "صيغة ضبط عرض القناة من قيمة مخططة ومرجع معاملات الإصدار.", category: "ضبط" },
      { command: ":radio-cfg-get-linkid:<board>,0xFF,<port>", intent: "قراءة Link ID للتحقق من سياق الوصلة.", category: "فحص" },
    ],
    checks: ["أعد القراءة بعد التطبيق.", "قارن النتائج بين الطرفين.", "تحقق من حالة ODU والإنذارات والخدمة قبل القبول."],
    warning: "يستثنى أمر modulation من هذه الحلقة لأن مقال Huawei لا يذكر معاملاته رغم تسميته؛ لا تخمّنها.",
  },
];

export default function NavigatorLesson() {
  const initial = Math.min(Math.max(Number(new URLSearchParams(window.location.search).get("lesson") ?? 1) || 1, 1), lessons.length);
  const [selected, setSelected] = useState(initial - 1);
  const [copied, setCopied] = useState<string | null>(null);
  const lesson = lessons[selected];

  const lessonProgress = useMemo(() => `${selected + 1} / ${lessons.length}`, [selected]);
  const copyCommand = async (command: string) => {
    await navigator.clipboard?.writeText(command);
    setCopied(command);
    window.setTimeout(() => setCopied(null), 1300);
  };

  return (
    <main className="navigator-lesson" dir="rtl">
      <div className="nav-grid" aria-hidden="true" />
      <header className="nav-header">
        <a href="/" className="nav-back"><ArrowLeft size={16} /> العودة إلى المحاكي</a>
        <div className="nav-brand"><TerminalSquare size={21} /><span>RTN 910 / NAVIGATOR LESSONS</span></div>
        <span className="nav-chip"><MonitorCog size={14} /> محاكاة نصية وليست واجهة Huawei الأصلية</span>
      </header>

      <section className="nav-hero">
        <div>
          <p className="nav-kicker">HUAWEI EKB0000559092 · RTN910V1R1</p>
          <h1>سلسلة أوامر Radio Link الموثقة</h1>
          <p>ثلاث حلقات عربية قصيرة تشرح الأوامر التي نشرتها Huawei لحالة Navigator محددة، مع تحويل كل قيمة تشغيلية إلى متغير لا يُملأ إلا من خطة المسار المعتمدة.</p>
        </div>
        <div className="source-card"><FileText size={19} /><span>المصدر الأساسي</span><b>Huawei Knowledge Base</b><small>المقال منشور «for reference only» ويؤكد أن WebLCT/U2000 هو المسار الاعتيادي.</small></div>
      </section>

      <section className="nav-workspace">
        <aside className="lesson-rail">
          <div className="rail-title"><Play size={15} /> الحلقات <span>{lessonProgress}</span></div>
          {lessons.map((item, index) => (
            <button className={selected === index ? "lesson-button active" : "lesson-button"} onClick={() => setSelected(index)} key={item.index}>
              <span className="lesson-number">{item.index}</span><span><b>{item.stage}</b><small>{item.title}</small></span>
            </button>
          ))}
          <div className="lesson-ref"><ShieldCheck size={15} /> لا تعرض الحلقات أمرًا غير منشور في المرجع أو قيمة تشغيلية حقيقية.</div>
        </aside>

        <section className="lesson-console">
          <div className="lesson-console-bar"><div className="terminal-dots"><i /><i /><i /></div><span>Navigator recovery lesson · {lesson.stage}</span><span className="console-readonly">READ ONLY TRAINING</span></div>
          <div className="lesson-console-body">
            <div className="lesson-title-row"><div><span className="lesson-step">EPISODE {lesson.index}</span><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div><div className="lesson-stage-icon"><KeyRound size={26} /></div></div>

            <div className="lesson-rule"><CircleHelp size={17} /><div><b>قاعدة التنفيذ</b><p>{lesson.rule}</p></div></div>

            <div className="command-list">
              {lesson.commands.map((item) => (
                <article className="command-card" key={item.command}>
                  <div className="command-meta"><span className={item.category === "فحص" ? "command-kind query" : "command-kind change"}>{item.category}</span><span>{item.intent}</span></div>
                  <div className="command-code"><code>{item.command}</code><button aria-label="نسخ صيغة الأمر" onClick={() => copyCommand(item.command)}>{copied === item.command ? <CheckCircle2 size={16} /> : <Copy size={16} />}</button></div>
                </article>
              ))}
            </div>

            <div className="verification-panel"><div><span>تحقق قبل الانتقال</span><h3>{lesson.stage}</h3></div><ol>{lesson.checks.map((check) => <li key={check}><CheckCircle2 size={15} /> {check}</li>)}</ol></div>
            <div className="warning-panel"><AlertTriangle size={18} /><p>{lesson.warning}</p></div>
          </div>
        </section>
      </section>

      <footer className="nav-footer"><span>المصدر: Huawei EKB0000559092 · راجع نسخة البرنامج وLink Engineering Sheet قبل التنفيذ.</span><span>Navigator commands shown as documented syntax only.</span></footer>
    </main>
  );
}
