# مراجعة قائمة فيديوهات Huawei RTN المقدمة

> **المرجع المرئي:** قائمة YouTube بعنوان “Huawei RTN” من Adnan Farooq، وتتضمن 23 فيديو بحسب صفحة القائمة. الرابط: https://youtube.com/playlist?list=PLctvYMZoXdH84zOjYr_wURn8DFswXLDke

## المجالات الظاهرة في الجزء الأول من القائمة

| المجال | أمثلة عناوين ظاهرة | استخدامه في المحاكاة |
|---|---|---|
| الوصول وتسجيل الدخول | How To Login Huawei RTN؛ Login Abnormal Communication Status RTN 380s | يمكن استخدامه لترتيب مشهد الدخول فقط؛ الواجهة الفعلية تعتمد على الأداة والإصدار. |
| أداء وصلة MW | Check MW Link Performance؛ Check XPD Value | صالح كمرجع لتسلسل مراقبة الأداء، لا لقيم أو إنذارات أو تسميات قوائم غير متحققة. |
| الاختبارات الميدانية | IF Cable Hardware Test؛ Synchronize NE Time | صالح لتمثيل مراحل الفحص والتهيئة بشرط مراجعة دليل الإصدار. |
| خدمات Ethernet | VLAN and Ports؛ PLA | خاص غالبًا بطرازات RTN380/380AX الظاهرة في العناوين، ولا يخلط مع RTN910 من دون مرجع مطابق. |
| الأعطال | Ethernet Link Down؛ HARD_BAD؛ NB_UNREACHABLE؛ PLA_MEMBER_DOWN | يستخدم لتحديد حلقات أعطال مستقلة، وليس لتخمين سبب أو معالجة على RTN910. |
| العتاد والتداخل | RTN 950 Slot Layout؛ External and Internal Interference on 4+0 XPIC | يشكل مراجع سياقية للطراز/السيناريو لا لتكرار واجهة Huawei أو تعميمها. |

## قيد الدقة

القائمة تضم طرازات وإجراءات متعددة، منها RTN380 وRTN380AX وRTN950 ووصلة 4+0 XPIC؛ لذلك لا يجوز اعتبارها مرجعًا موحدًا لواجهة RTN910 أو إصدار واحد. أي محاكاة تظل موسومة كمحاكاة تدريبية إلى أن تتوفر لقطات أو دليل أو بيئة عمل للطراز والإصدار المستهدفين.

## بقية المجالات الظاهرة بعد متابعة القائمة

تظهر في بقية القائمة حلقة تهيئة RTN380/380AX، وحلقات معالجة إنذارات **IN PWR LOW** و**BUS_ERR** و**RADIO TSL LOW** و**LAG MEMBER DOWN**، إضافة إلى عتاد وتركيب XMC 800. هذه العناوين تؤكد أن القائمة مرجع تدريبي متعدد المنتجات، لا سجلًا مرجعيًا موحدًا لواجهة RTN 910.

## مراجعة مرئية لحلقتين أساسيتين

| الفيديو | ما ظهر بوضوح | دلالته للمحاكاة |
|---|---|---|
| How To Login Huawei RTN | واجهة **Web LCT**: قائمة NE أعمدة، أزرار إدارة NE في الأسفل، ثم NE Explorer وفيه Function Tree يسارًا ومنطقة Slot Layout أو إعداد الوصلة يمينًا. يظهر إصدار Web LCT/NE Explorer مختلف عن نسخة الأداء. | يمكن اعتماد البنية العامة فقط: NE List → NE Login → NE Explorer → Function Tree. لا ننسخ عناصر العلامة أو الواجهة الأصلية. |
| How To Check MW Link Performance in RTN | Web LCT/NE Explorer V200R021C10SPC200، Function Tree → Radio Links → Microwave Link Performance، ثم Current Performance أو History Performance، اختيار interval والفترة وزر Query وجدول/رسم بياني. | هذا مرجع قوي لبناء **تسلسل تفاعلي** لمراقبة الأداء: اختيار المسار، اختيار نوع الأداء/الفترة، Query، قراءة near/far end ومؤشرات الأداء. لا تُستخدم قيم الفيديو أو جدول Huawei الحقيقي في محاكاة عامة. |

## متطلب الدقة العالية

حتى ضمن القائمة نفسها، يظهر إصدار دخول مختلف عن إصدار NE Explorer في فيديو الأداء؛ لذلك لا توجد «واجهة RTN واحدة» يمكن نسخها بدقة صادقة. للوصول إلى محاكاة عالية الدقة لإصدار محدد، يلزم تأكيد الهدف مثل **Web LCT / NE Explorer V200R021C10SPC200** مع لقطات كاملة للقوائم والشاشات المقصودة، أو الوصول المشروع إلى بيئة اختبار لذلك الإصدار.

## مراجعة مرئية إضافية: الأداء والإنذارات

حلقة XPD تعرض Web LCT/NE Explorer ببنية واضحة: Slot Layout، ثم Function Tree يحوي Configuration وDiagnosis & Maintenance وAlarm وPerformance وReport؛ وبعد اختيار بطاقة، يمكن الوصول إلى Performance → Current/History Performance، اختيار فترة 15 دقيقة أو 24 ساعة، اختيار نوع Performance Event ثم Query. تظهر في نتائجها بنية جدول تشمل Monitored Object وPerformance Event وMonitor Period وStart Time وPerformance Value وValidity. المثال نفسه يعرض أحداثًا مثل XPIC_XPD وSNR، لكنه لا يثبت أنها صالحة لكل طراز أو إصدار.

حلقة IN PWR LOW تعرض سياقًا مختلفًا لإصدار NE Version 5.212.20.25 وتنتقل من Browse Current Alarms إلى Configuration → Interface Management → Ethernet Interface ثم Optical Power Manager، وتنتهي بتأكيد زوال الإنذار. هذا المثال يتعلق بواجهة Ethernet/Optical وليس Radio Link في RTN910؛ لذلك لا يستخدم كمعالجة مباشرة لعطل راديوي.

**الاستنتاج:** المرجع المرئي يبرر محاكاة تدفق Web LCT عالي المستوى (قائمة NE، Function Tree، بطاقات، tabs، Query، جدول/رسم)، لكنه لا يبرر دمج قوائم طرز وإصدارات متعددة في شاشة واحدة أو تسميتها «واجهة Huawei الحقيقية».

## مصفوفة الدقة للمحاكاة المقترحة

| العنصر | ما يمكن تمثيله بصدق | ما لا يجوز ادعاؤه أو نسخه دون مرجع/بيئة رسمية |
|---|---|---|
| تسلسل العمل | NE List → NE Login → NE Explorer → Function Tree → Radio Links/Performance → Current أو History → Query → نتائج | أن هذا هو مسار ثابت لكل طراز أو إصدار. |
| بنية الشاشة | شجرة وظائف يسارًا، tabs، جدول Near/Far end، اختيار 15 دقيقة/24 ساعة، زر Query، عرض جدول أو رسم | واجهة Web LCT الأصلية نفسها أو كل عناصرها البصرية/الوظيفية. |
| بيانات الأداء | أسماء فئات عامة ومؤشرات تدريبية ونتيجة «Training only» | RSL أو قدرة أو عدادات خطأ أو XPD أو SNR حقيقية أو حدود قبول. |
| أوامر RTN910 | صيغ قراءة منشورة ومقيدة بـ RTN910V1R1 | معاملات أو أوامر غير منشورة، أو نتائج جهاز، أو إعدادات تشغيلية. |
| دقة الإصدار | محاكاة عالية الدقة لإصدار محدد بعد توفير لقطات كاملة/دليل/وصول اختبار مشروع | وعد بدقة 100% اعتمادًا على فيديوهات تضم إصدارات وطرازات مختلفة. |
