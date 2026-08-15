/**
 * Design reminder — Field Control Room: show a plausible operational workflow, never a claimed
 * Huawei result. All indicator values and outcomes are explicitly training-only visual examples.
 */
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, CirclePlay, Crosshair, Gauge, MousePointer2, Pause, Play, RadioTower, ShieldAlert, TerminalSquare, TimerReset, Wrench } from "lucide-react";
import "./TroubleshootingDemo.css";

type Step = { label: string; title: string; note: string; kind: "observe" | "command" | "isolate" | "verify"; command?: string; output?: string[] };

const steps: Step[] = [
  { label: "التقاط الحالة", title: "لاحظ الاتجاه قبل لمس الإعدادات", note: "التنبيه ولوحة الأداء هنا مثالان تدريبيان فقط. لا يُنسب كود إنذار أو قيمة RSL إلى جهاز حقيقي.", kind: "observe" },
  { label: "ثبّت هوية المسار", title: "تحقق من Link ID", note: "استخدم أمر القراءة لتأكيد أن المسار المفحوص هو المسار الموجود في Link Engineering Sheet.", kind: "command", command: ":radio-cfg-get-linkid:<board>,0xFF,<port>", output: ["Link-ID query completed.", "Training task: compare the identified path with the approved link plan.", "No configuration was written."] },
  { label: "ثبّت الخطة", title: "اقرأ تردد ODU ولا تغيّره", note: "قراءة التردد تساعد على منع معالجة المسار الخطأ. لا يُنفذ ضبط التردد أو القدرة كإجراء أولي لاستكشاف العطل.", kind: "command", command: ":radio-cfg-get-odu-txfreq:<odu_id>,0xFF", output: ["ODU transmit-frequency query completed.", "Training task: compare the value with the approved plan at both ends.", "No live frequency change was issued."] },
  { label: "اعزل النطاق", title: "ابدأ بالفحص الآمن", note: "راجع الطاقة والكابل والموصل وODU/الهوائي والظرف الخارجي. لا تحوّل هذا التسلسل إلى تشخيص نهائي بلا فحص ميداني.", kind: "isolate" },
  { label: "تحقق من العودة", title: "راقب الاستقرار قبل القبول", note: "أعد فحص هوية المسار، راقب اتجاه الأداء في الطرفين، ثم افتح نافذة ملاحظة موثقة قبل اعتبار الخدمة مستقرة.", kind: "verify" },
];

const FRAMES_PER_STEP = 100;

export default function TroubleshootingDemo() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const fixedFrame = params.get("frame");
  const [frame, setFrame] = useState(Number(fixedFrame ?? 0));
  const [playing, setPlaying] = useState(params.get("autoplay") === "1");
  const totalFrames = steps.length * FRAMES_PER_STEP;
  const activeFrame = fixedFrame === null ? frame : Math.min(Math.max(Number(fixedFrame) || 0, 0), totalFrames);
  const activeIndex = Math.min(Math.floor(activeFrame / FRAMES_PER_STEP), steps.length - 1);
  const localFrame = activeFrame - activeIndex * FRAMES_PER_STEP;
  const step = steps[activeIndex];
  const commandCharacters = step.command ? Math.min(step.command.length, Math.max(0, Math.floor(((localFrame - 17) / 42) * step.command.length))) : 0;
  const commandReady = localFrame >= 61;
  const outputReady = localFrame >= 69;

  useEffect(() => {
    if (fixedFrame !== null || !playing) return;
    const timer = window.setInterval(() => setFrame((value) => (value >= totalFrames ? totalFrames : value + 1)), 145);
    return () => window.clearInterval(timer);
  }, [fixedFrame, playing, totalFrames]);

  const pointer = step.kind === "observe" ? { left: "80%", top: "34%" } : step.kind === "isolate" ? { left: "67%", top: "69%" } : step.kind === "verify" ? { left: "73%", top: "44%" } : { left: "75%", top: "62%" };
  const progress = Math.min(100, Math.round((activeFrame / totalFrames) * 100));
  return <main className="trouble-page" dir="rtl">
    <div className="trouble-grid" aria-hidden="true" />
    <header className="trouble-header"><a href="/navigator-demo" className="trouble-return"><ArrowLeft size={16} /> محاكاة الأوامر</a><div className="trouble-brand"><Wrench size={18} /> RTN 910 · TROUBLESHOOTING LAB</div><span className="trouble-nonlive"><ShieldAlert size={14} /> Training / Non-live data</span></header>
    <section className="trouble-hero"><div><p>HUAWEI EKB0000559092 · RTN910V1R1</p><h1>راقب. اعزل. <em>تحقّق.</em></h1><span>محاكاة عملية لاستكشاف الأعطال ومراقبة أداء الوصلة — لا تمثل جهازًا أو إنذارًا أو قياسًا حقيقيًا.</span></div><div className="trouble-hero-stat"><Activity size={20} /><span>TRAINING CASE</span><b>Link-quality degradation</b><small>Scenario label only · no live alarm code</small></div></section>
    <section className="trouble-layout">
      <aside className="trouble-steps"><div className="trouble-steps-title"><CirclePlay size={15} /> خطوات العزل <span>{activeIndex + 1}/5</span></div>{steps.map((item, index) => <div className={index === activeIndex ? "trouble-step active" : index < activeIndex ? "trouble-step done" : "trouble-step"} key={item.label}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{item.label}</b><small>{item.title}</small></div>{index < activeIndex && <CheckCircle2 size={14} />}</div>)}<div className="trouble-safety-note"><AlertTriangle size={15} /><p>غيّر الإعدادات فقط ضمن خطة تغيير معتمدة. هذا الدرس لا ينفذ أي تعديل.</p></div></aside>
      <section className="trouble-workspace">
        <div className="trouble-heading"><div><span>CASE STEP 0{activeIndex + 1}</span><h2>{step.title}</h2></div><div className="trouble-status"><i className={playing ? "trouble-dot pulse" : "trouble-dot"} />{fixedFrame === null ? (playing ? "AUTOPLAY" : "PAUSED") : "CAPTURE FRAME"} · {progress}%</div></div>
        <p className="trouble-note">{step.note}</p>
        <section className="monitor-grid">
          <MonitorCard icon={<Gauge size={18} />} title="اتجاه جودة الوصلة" state={activeIndex === 0 ? "Observe trend" : activeIndex === 4 ? "Observation window" : "Compare both ends"} bars={activeIndex === 0 ? [38, 55, 31, 44, 26, 42] : activeIndex === 4 ? [74, 71, 76, 73, 75, 76] : [52, 47, 51, 48, 50, 49]} tone={activeIndex === 4 ? "good" : activeIndex === 0 ? "warn" : "neutral"} />
          <MonitorCard icon={<RadioTower size={18} />} title="استمرارية الخدمة" state={activeIndex === 4 ? "Training check complete" : "Do not assume service state"} bars={activeIndex === 4 ? [72, 74, 76, 75, 78, 76] : [46, 51, 42, 49, 40, 45]} tone={activeIndex === 4 ? "good" : "neutral"} />
          <MonitorCard icon={<Crosshair size={18} />} title="نطاق العزل" state={activeIndex === 3 ? "Field checks in progress" : "Awaiting safe check"} bars={activeIndex === 3 ? [31, 49, 65, 73, 71, 78] : [40, 42, 40, 44, 41, 42]} tone={activeIndex === 3 ? "warn" : "neutral"} />
        </section>
        <section className="trouble-terminal"><div className="trouble-terminal-bar"><div><i /><i /><i /></div><span>Offline training terminal · all output is synthetic</span><small>{step.kind.toUpperCase()}</small></div><div className="trouble-terminal-body">{step.kind === "command" ? <CommandScene command={step.command!} typed={commandCharacters} ready={commandReady} outputReady={outputReady} output={step.output!} /> : step.kind === "isolate" ? <IsolationScene stage={localFrame} /> : step.kind === "verify" ? <VerifyScene stage={localFrame} /> : <ObserveScene stage={localFrame} />}<div className="trouble-pointer" style={pointer}><MousePointer2 size={33} fill="#eaf8f4" /></div></div></section>
        {fixedFrame === null && <div className="trouble-controls"><button onClick={() => setFrame((value) => Math.max(0, value - 1))}><ChevronRight size={18} /></button><button className="trouble-play" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={17} /> : <Play size={17} />}{playing ? "إيقاف مؤقت" : "تشغيل المحاكاة"}</button><button onClick={() => setFrame((value) => Math.min(totalFrames, value + 1))}><ChevronLeft size={18} /></button><button className="trouble-reset" onClick={() => setFrame(0)}><TimerReset size={15} />إعادة</button></div>}
      </section>
    </section>
    <footer className="trouble-footer">الأوامر الظاهرة هي صيغ قراءة منشورة لحالة RTN910V1R1؛ رسوم الأداء والتشخيص والنتائج تمثيلية وغير حية.</footer>
  </main>;
}

function MonitorCard({ icon, title, state, bars, tone }: { icon: React.ReactNode; title: string; state: string; bars: number[]; tone: "good" | "warn" | "neutral" }) { return <article className={`monitor-card ${tone}`}><div className="monitor-top"><span>{icon}</span><b>{title}</b></div><div className="monitor-bars">{bars.map((bar, index) => <i style={{ height: `${bar}%` }} key={`${bar}-${index}`} />)}</div><small>{state}</small><em>TRAINING TREND</em></article>; }

function CommandScene({ command, typed, ready, outputReady, output }: { command: string; typed: number; ready: boolean; outputReady: boolean; output: string[] }) { return <div className="trouble-scene"><p className="scene-title">تأكيد سياق الوصلة قبل المتابعة</p><div className={ready ? "training-command ready" : "training-command"}><span>RTN910&gt;</span><code>{command.slice(0, typed)}{!ready && <i />}</code>{ready && <b>ENTER ↵</b>}</div>{outputReady && <div className="training-output"><span>TRAINING OUTPUT — NOT A DEVICE RESULT</span>{output.map((line) => <p key={line}>{line}</p>)}</div>}</div>; }

function ObserveScene({ stage }: { stage: number }) { const visible = stage > 25; return <div className="trouble-scene observe-scene"><p className="scene-title">التقاط الحالة</p><div className="training-alert"><CircleAlert size={18} /><div><b>TRAINING OBSERVATION</b><p>Quality trend requires comparison between both link ends.</p></div></div>{visible && <div className="scene-checklist"><CheckCircle2 size={16} /><span>سجّل وقت الملاحظة ونطاق التأثير قبل بدء العزل.</span></div>}</div>; }

function IsolationScene({ stage }: { stage: number }) { const count = stage < 30 ? 1 : stage < 58 ? 2 : stage < 82 ? 3 : 4; const cards = ["الطاقة والتأريض", "كابل IF والموصلات", "ODU والهوائي", "الظرف الخارجي"];
 return <div className="trouble-scene"><p className="scene-title">فحص تدريبي آمن — دون ضبط راديو</p><div className="isolation-cards">{cards.map((card, index) => <div className={index < count ? "isolation-card selected" : "isolation-card"} key={card}><span>{index < count ? <CheckCircle2 size={15} /> : String(index + 1).padStart(2, "0")}</span><b>{card}</b><small>{index < count ? "تم تحديد الفحص" : "بانتظار التسلسل"}</small></div>)}</div></div>; }

function VerifyScene({ stage }: { stage: number }) { const done = stage > 45; return <div className="trouble-scene verify-scene"><p className="scene-title">نافذة مراقبة بعد الإجراء</p><div className="verify-rows"><div><span>هوية المسار</span><b>{done ? "مطابقة للخطة — تدريب" : "قيد التحقق"}</b></div><div><span>اتجاه الجودة</span><b>{done ? "مستقر خلال نافذة الملاحظة — تدريب" : "قيد المراقبة"}</b></div><div><span>حالة القبول</span><b>{done ? "لا قبول حي في المحاكاة" : "لا تُعلن الخدمة بعد"}</b></div></div></div>; }
