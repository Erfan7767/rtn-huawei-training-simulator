# بحث موثق: Huawei OptiX RTN 910 — Radio Link

## المصدر الرسمي المفتوح

تم فتح صفحة دعم Huawei الرسمية للطراز **OptiX RTN 910**:

https://support.huawei.com/enterprise/en/enterprise-network-microwave/optix-rtn-910-pid-60977

تظهر الصفحة فئات الوثائق الرسمية التالية: **Hardware Installation Guide** و**Maintenance Guide** و**Training Presentation**، كما تعرض محدد إصدار ووثائق RTN 900 ذات الصلة. وظهرت أسماء وثائق منها *RTN ODU&Antenna&Accessory Hardware Description 15* و*(Video) RTN 900 Installation_Installing the IDU* و*Huawei Transport Network Maintenance Reference-RTN Microwave 03*.

## الاستنتاج المبدئي

هذه الصفحة الرسمية تؤكد مسار الوثائق والمعدات المساندة، لكنها لا تعرض في محتوى الصفحة المفتوح نص أوامر Radio Link بعد. لا يجوز تحويل اسم فئة أو فيديو تثبيت إلى أوامر تهيئة. يجب العثور على **Configuration Guide** أو **Commissioning Guide** المطابقين لإصدار RTN 910، والتحقق من نص الإجراء والأوامر أو أسماء الواجهات من المصدر نفسه قبل تقديمها للمستخدم.

## مصدر ثانوي قيد التحقق

أظهر البحث فهرسًا خارجيًا بعنوان *Huawei OptiX RTN 910 Commissioning Guide (V100R006)*؛ لا يعتمد عليه وحده في أي أمر. سيستخدم فقط لتحديد اسم المستند والإصدار ثم مقارنته بمصادر Huawei الرسمية أو ملف يقدمه المستخدم.

## متابعة البحث في البوابة الرسمية

تم إرسال بحث `Commissioning Guide` من داخل صفحة دعم Huawei للطراز RTN 910 إلى مسار البحث الرسمي التالي:

https://support.huawei.com/enterprisesearch/#type=searchAll&lang=en&keyword=Commissioning%20Guide&productPath=1558081023535|1558081171973|60977

لم يكتمل تحميل النتائج في جلسة المتصفح بسبب تعطل الجلسة. لذلك لا تُستنتج نتيجة سلبية من هذا التعطل، ولا تُعتبر أي أوامر مؤكدة منه. ستُتابع المطابقة عبر واجهات Huawei العامة أو المصادر القابلة للاستخراج، مع الإبقاء على شرط المطابقة بالإصدار.

## مقال Huawei رسمي ذي صلة

أظهر بحث Huawei الرسمي مقالًا بعنوان **How to Configure Basics Paramenters for the Microwave Link by Navigator** برقم EKB0000559092:

https://support.huawei.com/enterprise/en/knowledge/EKB0000559092

يشير عنوان ونتيجة المقال إلى إعداد معلمات وصلة ميكروويف لطراز RTN 910 عبر Navigator، بما في ذلك تردد الإرسال وإضافة اللوحات الفعلية. لكن المحتوى التفصيلي لم يتاح في جلسة المتصفح الحالية؛ لذلك لا تُنسب إليه أوامر أو أسماء قوائم إضافية حتى يتم استخراج نص الصفحة أو الوثيقة نفسها.

## أوامر Navigator الموثقة في Huawei FAQ

تم استخراج نص المقال الرسمي EKB0000559092 عبر خدمة القراءة النصية. المقال يخص حالة **RTN910V1R1** عندما تعذر تشغيل WebLCT/U2000، ويعرض هذه أوامر Navigator حرفيًا:

| الغرض المذكور في المقال | الأمر المذكور | ملاحظة الدقة |
|---|---|---|
| عرض اللوحات الفعلية | `:cfg-get-phybd` | أمر فحص قبل التغيير. |
| عرض اللوحات المنطقية | `:cfg-get-board` | أمر فحص قبل التغيير. |
| إضافة لوحة | `:cfg-add-board:24,tnd1odu` | المثال يعتمد على slot وboard type خاصين بالحالة؛ لا يعمم. |
| قراءة تردد إرسال ODU | `:radio-cfg-get-odu-txfreq:23,0xFF` | المثال يعتمد على معرف ODU في الحالة. |
| ضبط تردد إرسال ODU | `:radio-cfg-set-odu-txfreq:23,0xFF,7177000;` | القيمة المنشورة مثال حالة وليست قيمة يوصى بإعادة استخدامها. |
| ضبط قدرة الإرسال | `:radio-cfg-set-odu-tsl:23,0xFF,200;` | لا تستخدم قيمة القدرة المنشورة دون Link Budget وترخيص التردد. |
| قراءة IF channel bandwidth | `:radio-cfg-get-if-bandwidth:3,0xFF,0` | يعتمد على board/port identifiers. |
| ضبط IF channel bandwidth | `:radio-cfg-set-if-bandwidth:3,0xFF,1,4;` | معلمات المثال يجب أن تطابق خطة القناة واللوحة. |
| قراءة Link ID | `:radio-cfg-get-linkid:3,0xFF,1` | فحص فقط في النص المستخرج. |
| فحص/تعيين modulation حسب نص المقال | `:radio-cfg-set-if-currmod` | المقال يصفه بأنه للتحقق من modulation رغم أن اسم الأمر يبدأ بـ `set`؛ لا يكتب أو ينفذ دون attachment/parameter reference. |

المقال نفسه يصرح بأنه «for reference only» ويوصي بعدم استخدام Navigator للتهيئة في الحالات العادية وأن تكون WebLCT/U2000 متاحة. لذلك يُعرض هذا المسار كـ **إجراء استرداد/Commissioning محكوم لإصدار V1R1**، وليس بديلًا عامًا لواجهة الإدارة.
