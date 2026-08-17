# محاكي التدريب Huawei RTN 910/950

> **محاكاة تدريبية موثقة النطاق وليست برنامج Huawei الأصلي.** يعمل هذا المشروع بالكامل داخل المتصفح بحالة محلية وتعليمية؛ فلا يتصل بأي NE حي، ولا يكتب إعدادات إلى جهاز، ولا ينشئ خدمة إنتاجية، ولا يصلح كبديل عن تصميم وصلة معتمد أو إجراءات موقع أو دليل طراز/إصدار مطابق.

[![Repository](https://img.shields.io/badge/GitHub-Erfan7767%2Frtn--huawei--training--simulator-181717?logo=github)](https://github.com/Erfan7767/rtn-huawei-training-simulator) [![Training scope](https://img.shields.io/badge/Scope-Evidence--bounded%20training-0d7f88)](rtn_curriculum_evidence_matrix_ar.md)

## الغرض من المشروع

هذا المستودع يقدّم **بيئة تدريب عربية تفاعلية** لتعلّم منطق العمل المنظّم في شبكات **Huawei RTN Microwave Transmission**، مع فصل صارم بين الطرازات والإصدارات والمراجع. وهو يركّز على ترتيب القرار، والتحقق التدريجي، وتوثيق المخاطر، وليس على نقل قيم أو أوامر إلى شبكة حية. ويعتمد كل جزء من المحتوى على نطاق دليل محدد؛ لذلك لا تُعرض الشاشة التدريبية بوصفها نسخة مطابقة لواجهة Huawei ما لم يكن ذلك مدعومًا بمرجع بصري مناسب.

يتدرج المسار من مراجعة الجاهزية، إلى مختبر تركيب رف RTN950A، ثم إعداد وصلة بين موقعين والتحقق من توافقها قبل الإجراء التدريبي، ثم وحدات مستقلة للهوية والخدمات والحماية والأداء والإنذارات. تدعم عائلة RTN خدمات Ethernet أصلية مثل E-Line وE-LAN بحسب وثائق العائلة، لكن ذلك **لا يثبت** أن حقول أي مختبر مفاهيمي هنا هي حقول Web LCT مطابقة لإصدار بعينه [1].

| العنصر | ما يقدمه المشروع | ما لا يدّعيه |
|---|---|---|
| بيئة التدريب | واجهات عربية تفاعلية، خطوات واضحة، وحواجز تحقق قبل الإجراء التدريبي | التحكم في عنصر شبكة أو ODU أو بطاقة حقيقية |
| دقة المصدر | فصل RTN910V1R1 وRTN950 وRTN950A، وفصل مراجع واجهات Web LCT المختلفة | توحيد كل الطرازات أو الإصدارات في واجهة واحدة |
| القيم والإجراءات | **Training Profiles** ومسودات محفوظة محليًا داخل المتصفح | صحة تردد أو قدرة أو عرض نطاق أو مخطط RF لموقع فعلي |
| النتيجة | سجل تحقق محلي وتدريب على اتخاذ القرار | قبول ميداني أو إثبات جودة/توفر الخدمة |

## صور من المحاكي

الصور التالية لقطات فعلية من الواجهات الموجودة في هذا المستودع. وهي معروضة من إصدار توثيقي عام حتى تظل روابطها مستقرة داخل README.

### مختبر إعداد وصلة RTN950A ثنائية الموقع

[![مختبر إعداد وصلة ثنائية الموقع](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/link-lab.png)](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/link-lab.png)

> يوضح هذا المختبر تمييز Site A وSite B، وفحص الجاهزية، ثم إنشاء مسودة قبل الانتقال إلى فحص التوافق والتحقق المحلي. لا تُرسل عملية **Apply** أي إعداد إلى جهاز.

### مختبر تركيب الرف والكروت

[![مختبر Slot Layout](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/slot-layout.png)](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/slot-layout.png)

> محاكاة سحب وإفلات لبطاقات تدريبية في منافذ معرّفة للمختبر، مع رفض واضح للإسقاط غير المتوافق. قواعد القبول هنا **قواعد تدريبية معلنة** وليست فحص توافق عتاد حي.

### مختبر مفهوم حماية 1+1 HSB

[![مختبر حماية 1+1 HSB](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/protection-lab.png)](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/download/readme-assets/protection-lab.png)

> يتدرّب المتعلم على علاقة Working/Protection ومجموعة الحماية ضمن حالة محلية فقط، دون إنشاء مجموعة HSB فعلية أو تشغيل failover على الشبكة.

## المختبرات والواجهات المتاحة

توضح الخريطة التالية نطاق كل مسار. يؤدي الرابط إلى المسار المحلي بعد تشغيل المشروع؛ ولا يعني وجود مسار أن مكوناته صالحة للتطبيق في بيئة إنتاج.

| المسار | الوحدة | النطاق التوثيقي | السلوك التدريبي |
|---|---|---|---|
| [`/course-roadmap`](http://localhost:3000/course-roadmap) | خريطة الكورس | تجميع الوحدات حسب المصدر | مسار تعلّم، مختبرات متاحة، ووحدات مقفلة لحين توافر الدليل |
| [`/rtn950a-slot-layout`](http://localhost:3000/rtn950a-slot-layout) | تركيب الرف والكروت | RTN950A 2+0 | سحب/إفلات ISM6 وODU، رفض غير المتوافق، إزالة وإعادة ضبط محلية |
| [`/rtn950a-link-lab`](http://localhost:3000/rtn950a-link-lab) | إعداد وصلة بين موقعين | RTN950A 2+0 | فحص الطرفين، مسودة Link، مراجعة Basic/RF، Compatibility Gate، تحذير، تحقق وRollback محليان |
| [`/rtn950-ne-attribute-lab`](http://localhost:3000/rtn950-ne-attribute-lab) | تغيير هوية NE وإعادة الدخول | RTN950 / Web LCT 5.76.07.24 | سيناريو تحذير انقطاع الاتصال وإعادة دخول محاكاة، بلا تغيير NE حي |
| [`/rtn950-elan-vlan-lab`](http://localhost:3000/rtn950-elan-vlan-lab) | E-LAN/VLAN | RTN950/950A — **تحقق مفاهيمي** | فحص VLAN ID، وعلاقة Access/Trunk، وهوية الطرفين قبل Apply محلي |
| [`/protection-hsb-lab`](http://localhost:3000/protection-hsb-lab) | حماية 1+1 HSB | RTN — **تحقق مفاهيمي** | فحص العضوين والمجموعة والدور، ثم اختيار عضو نشط داخل حالة تدريبية |
| [`/navigator-demo`](http://localhost:3000/navigator-demo) | Navigator | RTN910V1R1 فقط | محاكاة الأوامر المنشورة في FAQ المقيدة بالنطاق [2] |
| [`/weblct-reference-52121927`](http://localhost:3000/weblct-reference-52121927) | Microwave Link Performance | NE VERSION 5.212.19.27 | شاشة مرجعية مستقلة للأداء ببيانات تدريبية |
| [`/weblct-reference-2121921-alarms`](http://localhost:3000/weblct-reference-2121921-alarms) | Browse Current Alarms | NE VERSION 212.19.21 | شاشة مرجعية مستقلة للإنذارات ببيانات تدريبية |

### وحدات محجوبة عمدًا

تظل **Physical Link Aggregation** وخدمات النقل المتقدمة مغلقة في خريطة الكورس. السبب ليس نقصًا شكليًا في الواجهة، بل غياب لقطات مرخّصة أو وثيقة Web LCT مطابقة لإصدار محدد تمنع خلط النماذج والطرازات. لا تُملأ هذه الفجوات بتخمين أو بقيم مأخوذة من فيديو أو شبكة أخرى.

## كيف تتعلم باستخدام المحاكي

ينبغي البدء من خريطة الكورس، ثم تنفيذ المختبرات بالتسلسل: مراجعة حدود المهمة وتصميم الوصلة المعتمد، تركيب الرف في بيئة التدريب، بناء مسودة Site A/Site B، ثم تصحيح التعارضات قبل الإجراء التدريبي. بعد ذلك ينتقل المتدرب إلى التحقق المحلي ووحدات مفاهيم الخدمات والحماية والمراقبة. وجود اللون الأخضر أو رسالة نجاح في المحاكي يعني فقط أن **قواعد المختبر المحلية** اجتازت التحقق؛ ولا يمثل قبولاً ميدانيًا أو قياس RSL أو جودة فعلية.

| الترتيب المقترح | الهدف التعليمي | شرط الانتقال |
|---:|---|---|
| 1 | تثبيت النطاق، التصميم، والإصدار المرجعي | لا تستخدم قيمة غير معتمدة أو مرجع طراز آخر |
| 2 | تركيب الرف والكروت في Slot Layout | فهم أن المطابقة تدريبية وليست جردًا حيًا |
| 3 | بناء مسودة وصلة RTN950A بين موقعين | فصل هوية Site A عن Site B |
| 4 | اجتياز Compatibility Gate | توحيد معلمات التدريب المطلوبة للطرفين |
| 5 | مراجعة التحقق والرجوع المحلي | توثيق النتيجة التدريبية دون قبول ميداني |
| 6 | توسعة المفاهيم: VLAN/HSB/Performance/Alarms | الحفاظ على فصل المصدر والطراز والإصدار |

## حدود الدقة والسلامة

توجد أدلة Huawei منفصلة للتركيب وcommissioning وO&M عبر طرازات RTN 910A وRTN 950 وRTN 950A [3] [4] [5]. لذلك لا يمكن تحويل هذا المستودع إلى تعليمات موقعية بديلة، ولا يجوز نسخ أي قيمة من هذه الواجهات إلى شبكة إنتاج. تتطلب أعمال التركيب، والهوائيات، والطاقة، والتأريض، وRF، وخطة التردد، والـ link budget، والقبول النهائي تصميم العميل المعتمد، والتصاريح، والتدريب والسلامة، والوثائق المطابقة للطراز والإصدار.

> **قاعدة المشروع:** ظهور حقل أو زر أو خطأ داخل المحاكي لا يثبت ظهوره أو دلالته أو صلاحية تطبيقه في برنامج Huawei الأصلي. تُوسَم الإضافات التعليمية بوضوح، وتبقى شاشات الأداء والإنذارات المنسوبة إلى إصدارات مختلفة منفصلة عن بعضها.

| المجال | الحد المطبق في المستودع |
|---|---|
| اتصال الشبكة | لا يوجد اتصال بجهاز RTN أو NE أو ODU أو شبكة إنتاج |
| التعديل | لا توجد كتابة إعدادات أو تطبيق خدمة أو إنشاء Protection Group حي |
| بيانات التشغيل | الرسوم والإنذارات والنتائج داخل المحاكي بيانات تدريبية وليست Telemetry فعلية |
| RF والتصميم | لا يوجد حساب تلقائي معتمد لموقع أو تردد أو قدرة أو مودوليشن إنتاجية |
| مطابقة Web LCT | المطابقة مقيدة بالدليل المرئي والإصدار المحدد؛ الوحدات المفاهيمية ليست نسخًا مطابقة |

تتوفر تفاصيل نطاق كل وحدة، ومصفوفة الفجوات، وروابط الأدلة في [مصفوفة المنهج والأدلة](rtn_curriculum_evidence_matrix_ar.md) و[تدقيق المطابقة المصدرية](rtn_fidelity_audit_round3_ar.md).

## التشغيل المحلي

يتطلب المشروع بيئة Node.js حديثة ومدير الحزم `pnpm`. تنسخ الأوامر التالية المستودع العام ثم تبدأ خادم التطوير:

```bash
git clone https://github.com/Erfan7767/rtn-huawei-training-simulator.git
cd rtn-huawei-training-simulator
pnpm install
pnpm dev
```

بعد بدء الخادم، افتح `http://localhost:3000/course-roadmap` لخريطة الكورس أو أي مسار من الجدول السابق. يمكن تنفيذ فحوصات النوع والاختبارات بالآتي:

```bash
pnpm check
pnpm test
```

| الأمر | الغرض |
|---|---|
| `pnpm dev` | تشغيل بيئة التطوير محليًا |
| `pnpm check` | تدقيق TypeScript دون توليد مخرجات |
| `pnpm test` | تنفيذ اختبارات Vitest الانحدارية |
| `pnpm build` | بناء الواجهة والخادم للإنتاج |

لا تُدرج ملفات البيئة أو المفاتيح في Git. يوضح ملف [GITHUB_BACKUP_AR.md](GITHUB_BACKUP_AR.md) خطوات النسخ الاحتياطي والتحقق من الاتصال بالمستودع.

## البنية التقنية

الواجهة مبنية باستخدام **React 19** و**TypeScript** و**Tailwind CSS 4**، مع توجيه Wouter. يتضمن المستودع أيضًا خادم Express وطبقة tRPC وقوالب مصادقة/قاعدة بيانات من البنية الأساسية، بينما تعتمد المختبرات الحالية على حالة تدريبية داخل المتصفح ولا تحتاج إلى جهاز خارجي لإجراء السيناريوهات.

```text
client/src/pages/       واجهات المختبرات ومسارات التدريب
client/src/App.tsx      تعريف المسارات
server/                 طبقة Express وtRPC
drizzle/                مخطط قاعدة البيانات والبنية المرافقة
*.md                    الأدلة، التدقيق، وسجل النسخ الاحتياطي
```

## التحقق الحالي والمساهمة

يحتوي المشروع على اختبارات انحدار تغطي قواعد التحقق والسياقات المفصولة، ويجب تشغيل `pnpm check` و`pnpm test` قبل فتح طلب دمج. عند توسيع المحتوى، أضف أولاً مصدرًا محددًا للطراز والإصدار، ثم وثّق نطاقه وحدوده، ثم أضف الاختبارات. لا تقبل مساهمة تضيف واجهة غير موثقة بوصفها نسخة Huawei أصلية، أو تضيف قيم RF/تشغيلية صالحة ظاهريًا من دون تصميم معتمد.

لنسخ احتياطي عام للمشروع، استخدم مستودع GitHub: [Erfan7767/rtn-huawei-training-simulator](https://github.com/Erfan7767/rtn-huawei-training-simulator). أما صور README فتوجد في [الإصدار التوثيقي](https://github.com/Erfan7767/rtn-huawei-training-simulator/releases/tag/readme-assets).

## المراجع

[1] [Huawei — 6–42 GHz Traditional Frequency IP Microwave](https://e.huawei.com/en/products/wireless/microwave/traditional-band)

[2] [Huawei — FAQ: How to Configure Basic Parameters for the Microwave Link by Navigator (RTN910V1R1)](https://support.huawei.com/enterprise/en/knowledge/EKB0000559092)

[3] [Huawei — OptiX RTN 910A Support Guide](https://support.huawei.com/enterprise/en/enterprise-network-microwave/optix-rtn-910a-pid-21402366)

[4] [Huawei — OptiX RTN 950 Support Guide](https://support.huawei.com/enterprise/en/enterprise-network-microwave/optix-rtn-950-pid-60964)

[5] [Huawei — OptiX RTN 950A Support Guide](https://support.huawei.com/enterprise/en/enterprise-network-microwave/optix-rtn-950a-pid-8691595)

[6] [Huawei — Configuring LAN Interfaces](https://support.huawei.com/enterprise/en/doc/EDOC1100373532/629c11fe/configuring-lan-interfaces)

[7] [Delta Telecom — RTN950A 2+0 public configuration reference](https://www.youtube.com/watch?v=B_e3zePeGWA)

---

**الحالة:** مستودع عام، محاكاة تعليمية محلية، وتوثيق محدود بالمصادر المتاحة.  
**آخر تحديث للتوثيق:** 17 أغسطس 2026.
