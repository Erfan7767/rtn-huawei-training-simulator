# مرجع المحاكاة عالي الدقة: مسار أداء الوصلة

> **الإصدار المستهدف للمسار الحالي:** Web LCT / NE Explorer **V200R021C10SPC200** كما ظهر في فيديو `How To Check MW Link Performance in RTN` ضمن القائمة المقدمة. هذا الملف يصف ما ظهر للمراقبة التدريبية؛ لا ينسخ برنامج Huawei ولا يضمن مسارات إصدار آخر.

| المرحلة | المسار المرئي | البنية القابلة للمحاكاة | الإجراء التفاعلي |
|---|---|---|---|
| 1 | NE Explorer → Fault → Browse Alarms | Function Tree؛ قائمة إنذارات؛ تفاصيل/أسباب أسفلها | اختيار Radio Links من الشجرة. |
| 2 | Radio Links → HOP Management | Tabs تشمل Slot Layout وHOP Management وMicrowave Link Performance وBrowse Current/History Alarms؛ مخطط وصلة بين NEين | اختيار Microwave Link Performance. |
| 3 | Microwave Link Performance → Current Performance | Auto Refresh؛ Save As؛ Query؛ جدول Near-End/Far-End وفترات 15 دقيقة و24 ساعة | Query ثم History Performance. |
| 4 | History Performance → Table | Resolution؛ Period Time؛ Display Format Table/Chart/Report؛ Query؛ Save As | اختيار 24 Hour ثم Query ثم Chart. |
| 5 | History Performance → Chart / Link TX-RX Power | خطوط اتجاه power متعددة وLegend | تبديل نوع الرسم. |
| 6 | History Performance → Chart / Link Errors | رسم أخطاء أو حالة عدم وجود نقاط | مراجعة النتيجة ضمن نطاق المراقبة. |

## حدود النسخة التدريبية

ستحاكي النسخة التدريبية الشجرة وtabs وحقول Resolution وPeriod Time وDisplay Format وQuery والانتقال بين Current/History/Chart. أما أسماء NEs وقيَم القدرة وعدادات ES/SES/CSES/UAS/BBE وRSL فتظل بيانات تدريبية غير حية، ولا تستخدم لتشغيل أو قبول وصلة حقيقية.

## المرجع

* YouTube playlist supplied by the user: https://youtube.com/playlist?list=PLctvYMZoXdH84zOjYr_wURn8DFswXLDke
* Video reference: https://www.youtube.com/watch?v=VIJjq1Xw56A
