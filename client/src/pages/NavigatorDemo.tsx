/**
 * Design reminder — Field Control Room: the terminal must feel operational, but every result
 * is visibly marked TRAINING / NON-LIVE so it cannot be mistaken for a Huawei system output.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, CircleCheck, CirclePlay, DatabaseZap, MousePointer2, Pause, Play, ShieldAlert, Terminal, TimerReset } from "lucide-react";
import { useLocation } from "wouter";
import { useTrainingProgress } from "@/contexts/TrainingProgressContext";
import "./NavigatorDemo.css";

type DemoCommand = { command: string; objective: string; operation: "READ" | "WRITE"; output: string[] };
type Lesson = { id: number; title: string; source: string; commands: DemoCommand[]; rule: string };

const lessonData: Lesson[] = [
  {
    id: 1,
    title: "فحص اللوحات قبل الإعداد",
    source: "Huawei EKB0000559092 · RTN910V1R1",
    rule: "هذه أوامر فحص فقط. لا تضف لوحة إلا بعد مطابقة الجرد الفعلي، رقم الفتحة، ونوع اللوحة مع دليل الإصدار.",
    commands: [
      { command: ":cfg-get-phybd", objective: "قراءة اللوحات الفعلية", operation: "READ", output: ["Physical-board query completed.", "Training task: compare every returned slot with the installed chassis.", "No configuration was written."] },
      { command: ":cfg-get-board", objective: "قراءة اللوحات المنطقية", operation: "READ", output: ["Logical-board query completed.", "Training task: reconcile logical recognition with the physical inventory.", "No configuration was written."] },
      { command: ":cfg-add-board:<slot>,<board_type>", objective: "شرح صيغة إضافة لوحة", operation: "WRITE", output: ["TRAINING VALIDATION ONLY — variables detected.", "<slot> and <board_type> must come from the actual chassis and release-specific guide.", "No live board-add command was issued."] },
    ],
  },
  {
    id: 2,
    title: "تردد وقدرة ODU",
    source: "Huawei EKB0000559092 · RTN910V1R1",
    rule: "قيمة التردد والقدرة لا تُستخرج من هذا الدرس. أدخلها فقط من Link Engineering Sheet المعتمد ومرجع معاملات الإصدار.",
    commands: [
      { command: ":radio-cfg-get-odu-txfreq:<odu_id>,0xFF", objective: "قراءة تردد إرسال ODU", operation: "READ", output: ["ODU transmit-frequency query completed.", "Training task: compare the returned value with the approved plan at both sites.", "Do not infer T/R spacing from an example value."] },
      { command: ":radio-cfg-set-odu-txfreq:<odu_id>,0xFF,<tx_frequency>;", objective: "شرح صيغة ضبط التردد", operation: "WRITE", output: ["TRAINING VALIDATION ONLY — placeholders detected.", "<tx_frequency> is not populated in this simulator.", "No live frequency change was issued."] },
      { command: ":radio-cfg-set-odu-tsl:<odu_id>,0xFF,<planned_power>;", objective: "شرح صيغة ضبط القدرة", operation: "WRITE", output: ["TRAINING VALIDATION ONLY — placeholders detected.", "Power coding and allowable limits are release- and ODU-specific.", "No live power change was issued."] },
    ],
  },
  {
    id: 3,
    title: "IF bandwidth وLink ID",
    source: "Huawei EKB0000559092 · RTN910V1R1",
    rule: "غيّر عرض القناة فقط ضمن خطة تغيير متزامنة للطرفين. لا يُستخدم أمر modulation هنا لأن المرجع المفتوح لا يوضح معاملاته.",
    commands: [
      { command: ":radio-cfg-get-if-bandwidth:<board>,0xFF,<port>", objective: "قراءة عرض قناة IF", operation: "READ", output: ["IF bandwidth query completed.", "Training task: compare board, port, and planned channel bandwidth at both ends.", "No configuration was written."] },
      { command: ":radio-cfg-set-if-bandwidth:<board>,0xFF,<port>,<planned_code>;", objective: "شرح صيغة ضبط عرض القناة", operation: "WRITE", output: ["TRAINING VALIDATION ONLY — placeholders detected.", "<planned_code> must be resolved from the release-specific parameter reference.", "No live bandwidth change was issued."] },
      { command: ":radio-cfg-get-linkid:<board>,0xFF,<port>", objective: "قراءة Link ID", operation: "READ", output: ["Link-ID query completed.", "Training task: confirm that the queried path matches the approved link plan.", "No configuration was written."] },
    ],
  },
];

const FRAMES_PER_COMMAND = 100;

export default function NavigatorDemo() {
  const [, setLocation] = useLocation();
  const { completeModule, visitModule } = useTrainingProgress();
  const params = useMemo(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search), []);
  const requestedLesson = Math.min(Math.max(Number(params.get("lesson") ?? 1), 1), lessonData.length);
  const fixedFrame = params.get("frame");
  const [lessonId, setLessonId] = useState(requestedLesson);
  const [frame, setFrame] = useState(Number(fixedFrame ?? 0));
  const [playing, setPlaying] = useState(params.get("autoplay") === "1");
  const lesson = lessonData[lessonId - 1];
  const totalFrames = lesson.commands.length * FRAMES_PER_COMMAND;
  const activeFrame = fixedFrame === null ? frame : Math.min(Math.max(Number(fixedFrame) || 0, 0), totalFrames);
  const activeIndex = Math.min(Math.floor(activeFrame / FRAMES_PER_COMMAND), lesson.commands.length - 1);
  const localFrame = activeFrame - activeIndex * FRAMES_PER_COMMAND;
  const typedLength = localFrame < 22 ? 0 : Math.min(lesson.commands[activeIndex].command.length, Math.floor(((localFrame - 22) / 40) * lesson.commands[activeIndex].command.length));
  const outputVisible = localFrame >= 68;
  const actionVisible = localFrame >= 14;
  const commandReady = localFrame >= 62;

  useEffect(() => {
    if (fixedFrame !== null || !playing) return;
    const timer = window.setInterval(() => setFrame((current) => (current >= totalFrames ? totalFrames : current + 1)), 145);
    return () => window.clearInterval(timer);
  }, [fixedFrame, playing, totalFrames]);

  useEffect(() => {
    setFrame(0);
    setPlaying(false);
  }, [lessonId]);

  useEffect(() => {
    visitModule("navigator");
  }, [visitModule]);

  useEffect(() => {
    if (activeFrame >= totalFrames) completeModule("navigator");
  }, [activeFrame, completeModule, totalFrames]);

  const selectLesson = (value: number) => {
    if (fixedFrame !== null) {
      setLocation(`/navigator-demo?lesson=${value}&frame=0`);
      return;
    }
    setLessonId(value);
  };
  const reset = () => { if (fixedFrame === null) setFrame(0); };
  const pointerPosition = localFrame < 14 ? { left: "80%", top: "15%" } : { left: "78%", top: "58%" };

  return (
    <main className="demo-page" dir="rtl">
      <div className="demo-noise" aria-hidden="true" />
      <header className="demo-header">
        <a href="/navigator" className="demo-return"><ArrowLeft size={16} /> مسار الدروس</a>
        <div className="demo-logo"><Terminal size={19} /> <span>RTN 910 · NAVIGATOR TRAINING TERMINAL</span></div>
        <span className="demo-safety"><ShieldAlert size={14} /> محاكاة تدريبية — Non-live</span>
      </header>

      <div className="demo-shell">
        <aside className="demo-sidebar">
          <p className="demo-eyebrow">PRACTICAL SIMULATIONS</p>
          <h1>اكتب.<br />نفّذ.<br /><em>تحقّق.</em></h1>
          <p className="demo-intro">لا يظهر هنا أي ناتج جهاز حقيقي. النتائج توضح فقط ما يجب فحصه بعد تنفيذ الأمر المنشور.</p>
          <nav className="demo-lesson-nav" aria-label="اختيار الحلقة">
            {lessonData.map((item) => <button key={item.id} onClick={() => selectLesson(item.id)} className={item.id === lessonId ? "demo-nav-item selected" : "demo-nav-item"}><b>0{item.id}</b><span>{item.title}</span></button>)}
          </nav>
          <div className="demo-source"><DatabaseZap size={16} /><div><b>مرجع الأمر</b><span>{lesson.source}</span></div></div>
        </aside>

        <section className="demo-stage">
          <div className="demo-stage-heading"><div><span>EPISODE 0{lesson.id}</span><h2>{lesson.title}</h2></div><div className="demo-run-status"><i className={playing ? "live-dot pulse" : "live-dot"} /> {fixedFrame === null ? (playing ? "AUTOPLAY" : "PAUSED") : "CAPTURE FRAME"} · {activeFrame}/{totalFrames}</div></div>
          <div className="demo-rule"><AlertTriangle size={17} /><p>{lesson.rule}</p></div>

          <section className="sim-terminal" aria-label="طرفية محاكاة تدريبية">
            <div className="sim-terminal-bar"><div className="sim-window-dots"><i /><i /><i /></div><span>Navigator · Offline training session · non-live</span><small>{lesson.commands[activeIndex].operation}</small></div>
            <div className="sim-terminal-body">
              <div className="terminal-prelude"><span className="terminal-green">TRAINING@RTN910</span><span> lesson {lesson.id} · step {activeIndex + 1}/{lesson.commands.length}</span></div>
              {lesson.commands.slice(0, activeIndex).map((item) => <CompletedBlock item={item} key={item.command} />)}
              <div className="active-command-block">
                <div className="command-caption"><span className={lesson.commands[activeIndex].operation === "READ" ? "op-read" : "op-write"}>{lesson.commands[activeIndex].operation}</span><b>{lesson.commands[activeIndex].objective}</b></div>
                <div className={actionVisible ? "sim-input focused" : "sim-input"}>
                  <span className="prompt">RTN910&gt;</span><code>{lesson.commands[activeIndex].command.slice(0, typedLength)}{!commandReady && <span className="typing-caret" />}</code>
                  {commandReady && <span className="enter-key">ENTER ↵</span>}
                </div>
                {outputVisible && <OutputBlock item={lesson.commands[activeIndex]} />}
              </div>
              {activeFrame >= totalFrames && <div className="sim-complete"><CircleCheck size={17} /> انتهى الدرس التدريبي. راجع دليلك وإصدار جهازك قبل أي تنفيذ فعلي.</div>}
              <div className="sim-pointer" style={pointerPosition}><MousePointer2 size={34} fill="#e5f4f0" /></div>
            </div>
          </section>

          {fixedFrame === null && <div className="demo-controls"><button onClick={() => setFrame((value) => Math.max(0, value - 1))} aria-label="الإطار السابق"><ChevronRight size={18} /></button><button className="demo-main-control" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={18} /> : <Play size={18} />} {playing ? "إيقاف مؤقت" : "تشغيل المحاكاة"}</button><button onClick={() => setFrame((value) => Math.min(totalFrames, value + 1))} aria-label="الإطار التالي"><ChevronLeft size={18} /></button><button onClick={reset} className="demo-reset"><TimerReset size={16} /> إعادة</button></div>}
        </section>
      </div>
      <footer className="demo-footer">النتائج المعروضة أمثلة تدريبية غير حية. الأوامر مستندة إلى Huawei EKB0000559092، لحالة RTN910V1R1 فقط.</footer>
    </main>
  );
}

function CompletedBlock({ item }: { item: DemoCommand }) {
  return <div className="completed-block"><div className="sim-input executed"><span className="prompt">RTN910&gt;</span><code>{item.command}</code><span className="done-mark">↵</span></div><OutputBlock item={item} /></div>;
}

function OutputBlock({ item }: { item: DemoCommand }) {
  return <div className="sim-output"><span>TRAINING OUTPUT — NOT A DEVICE RESULT</span>{item.output.map((line) => <p key={line}>{line}</p>)}</div>;
}
