import { Activity, BookOpenCheck, ChevronRight, Map, RadioTower } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { type TrainingModuleId, useTrainingProgress } from "@/contexts/TrainingProgressContext";
import "./TrainingConsoleBanner.css";

type TrainingConsoleBannerProps = {
  moduleId: TrainingModuleId;
  moduleTitle: string;
  sourceScope: string;
  mode?: "lab" | "reference";
};

export default function TrainingConsoleBanner({ moduleId, moduleTitle, sourceScope, mode = "lab" }: TrainingConsoleBannerProps) {
  const { visited, completed, visitModule } = useTrainingProgress();

  useEffect(() => {
    visitModule(moduleId);
  }, [moduleId, visitModule]);

  const localState = completed.includes(moduleId) ? "تم التحقق محليًا" : "جلسة تدريب محلية";
  return (
    <section className="training-console-banner" dir="rtl" aria-label="سياق المحاكي التدريبي">
      <div className="training-console-brand">
        <span className="training-console-mark"><RadioTower size={16} /></span>
        <div><b>FIELDLINK / TRAINING CONSOLE</b><span>محاكي RTN الموثق النطاق</span></div>
      </div>
      <div className="training-console-context">
        <span><BookOpenCheck size={14} /> {moduleTitle}</span>
        <span><Activity size={14} /> {localState}</span>
        <span className="training-console-source">{sourceScope}</span>
      </div>
      <Link className="training-console-link" href="/course-roadmap"><Map size={14} /> خريطة الكورس <ChevronRight size={14} /></Link>
      <small>{visited.length} وحدة فُتحت محليًا · لا توجد شبكة إنتاج أو جلسة NE</small>
      {mode === "reference" && <em>مرجع واجهة منفصل</em>}
    </section>
  );
}
