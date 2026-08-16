# خريطة الأدلة — Web LCT Microwave Link Performance

> **معرّف المرجع:** `NE VERSION 5.212.19.27` الظاهر في لقطة عامة مرتبطة بفيديو «How To Check MW Link Performance in RTN» من قائمة المستخدم. لا توجد وثيقة Huawei عامة تربط هذا المعرّف نصيًا برقم إصدار منتج آخر؛ لذلك يستخدم كما هو، ولا يستبدل بـ `V200R021C10SPC200`.

## مصدر الأدلة

| رمز الدليل | المصدر | النوع | ما يثبته |
|---|---|---|---|
| P-01 | `reference_images/mw_performance_public.jpg` | لقطة عامة 1280×720 | البنية الكاملة لشاشة History Performance، شريط الحالة، الشجرتان اليساريتان، التبويبات، الفلاتر، الجدول والرسم. |
| V-03 | فيديو YouTube `VIJjq1Xw56A` | تحليل بصري | تسلسل Radio Links → Microwave Link Performance → Current/History Performance، وأسماء الأحداث الظاهرة. |
| H-01 | Huawei EKB0000579539 | مصدر Huawei رسمي | وجود Web LCT وNE Search وManage Domain كمسار إدارة RTN، لا يثبت تخطيط الشاشة أو الإصدار. |

## الهيكل المرئي المثبت

| المنطقة | التفاصيل التي تظهر بوضوح | قرار البناء |
|---|---|---|
| نافذة المتصفح | Microsoft Edge مع صفحة Web LCT محلية؛ العنوان يبدأ بـ NE Explorer | تعرض النسخة التدريبية إطارًا محليًا محايدًا بعنوان Training NE Explorer ولا تنسخ بيانات جلسة حقيقية. |
| الرأس | شعار Huawei وعبارة Web LCT على خلفية أخضر/رمادي، ثم NE NAME وNE VERSION وCURRENT USER وNE STATE | تطابق توزيع الرأس والحالة. تستبدل هوية العميل والمستخدم واسم NE ببيانات تدريبية. |
| مؤشرات الإنذار | خمس كتل لونية صغيرة في أعلى اليمين | تعرض كتلًا تدريبية صامتة بلا أرقام أو حالات حية. |
| الشجرة العلوية | NE ثم رف/لوحات ثم Radio Links ثم وصلة مختارة | تبنى بأسماء تدريبية محايدة وبنفس التسلسل المكاني. |
| Function Tree | أسفل الشجرة العلوية؛ Configuration وDiagnosis & Maintenance ومداخل ميكروويف | تبنى العناصر الظاهرة في اللقطة فقط؛ لا تضاف وحدات غير مثبتة. |
| تبويبات المحتوى | Slot Layout، HOP Management، Microwave Link Performance | ترتب بهذه الصيغة وتبقى الأخيرة نشطة. |
| تعيين الطرفين | Source وSink مع حقل اختيار لكل منهما | تبنى حقول قراءة فقط بقيم تدريبية؛ لا تشغل Link أو اتصالًا. |
| تبويبات الأداء | Current Performance وHistory Performance | History هو المشهد المرجعي الأول؛ Current يمثل منطق الفيديو فقط ويُوسم بأن تفاصيله مستمدة من الفيديو لا من لقطة كاملة. |
| History controls | Resolution 15-Minute/24-Hour، Period Time From/To، Display Format Chart/Report، Link TX/RX Power، Link Errors، Legend | تطابق المجموعات وترتيبها بصريًا؛ لا تظهر قياسات راديوية حقيقية. |
| جدول التاريخ | عمود NE Name وMax RX Power وMin RX Power وفيه طرفان | يستخدم صفوفًا تدريبية مسماة Training Source/Sink، ولا يضع قيم RSL أو قدرة حقيقية. |
| الرسم | خطوط متعددة مع محاور تاريخية وLegend | يبنى كرسم تدريبي بدون قيم أو نقاط من شبكة حقيقية. |

## تسلسل التفاعل المثبت

1. يفتح المتدرب Radio Links من شجرة NE، ثم يختار وصلة قائمة في الشجرة.
2. يفتح تبويب Microwave Link Performance.
3. يختار Current Performance أو History Performance.
4. في History Performance يحدد Resolution وPeriod Time وDisplay Format ثم Query.
5. عند اختيار Chart يمكن تبديل Link TX/RX Power وLink Errors وإظهار Legend.

## حدود الدقة

لا تثبت اللقطة: منطق الحساب، مصدر القياسات، صيغة التصدير، وظائف Apply، صلاحيات المستخدم، أو تفاصيل جميع القوائم المنسدلة. لذلك تبقى هذه العناصر تعليمية أو معطلة حتى يتوفر مرجع للإصدار نفسه أو بيئة اختبار مرخصة.

## المراجع

[1]: https://www.youtube.com/watch?v=VIJjq1Xw56A
[2]: https://support.huawei.com/enterprise/en/knowledge/EKB0000579539
