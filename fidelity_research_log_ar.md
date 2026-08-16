# سجل بحث المطابقة البصرية والإجرائية

## نطاق العمل

الهدف ليس نسخ برنامج Huawei أو الادعاء بأنه جلسة تشغيل حية، بل بناء نسخة تدريبية مقيدة بإصدار واحد وبشاشات وتدفقات يمكن إثباتها من مراجع عامة أو مواد يملك المستخدم حق استخدامها.

## النتائج الأولية المؤكدة

| المصدر | الحالة | ما يثبته | حد المطابقة |
|---|---|---|---|
| قائمة YouTube التي قدمها المستخدم | تم فهرسة 23 فيديو | تتضمن RTN 380/380AX وRTN 950 و4+0 XPIC وXMC 80D، وتغطي دخول Web LCT والأداء والإنذارات والتداخلات | لا يجوز دمج هذه الطرازات أو الإصدارات في شاشة واحدة أو اعتبارها مرجعًا لإصدار RTN 910 تلقائيًا |
| Huawei iManager U2000 Web LCT support page | استخراج رسمي ناجح | البوابة تصف المنتج بأنه EOS ولا تعرض موارد قابلة للتنزيل علنًا | لا توجد نسخة عامة حالية يمكن استخراجها لتأكيد كل حقل أو قائمة |
| Huawei iMaster NCE Web LCT support-page result | ظهور نتيجة بحث رسمية لـ R021C10 User Guide | وجود سياق R021C10 للمنتج | النص الكامل لم يكن متاحًا للاستخراج من البوابة العامة ويحتاج مصدرًا رسميًا قابلًا للوصول أو لقطة مرجعية قانونية |

## قرار النطاق المؤقت

لن يشار إلى أي واجهة باعتبارها «مطابقة 100%» قبل ثبوت: الطراز، رقم الإصدار، وسلسلة لقطات كاملة لنفس الشاشة. المسار الذي لديه أقوى دليل مرئي حتى الآن هو أداء وصلة الميكروويف في Web LCT R021C10، مع فصل واضح عن فيديوهات RTN 380/380AX وRTN 950 وRTN 910.

## أدلة مرئية من لقطات عامة

| اللقطة | حقائق مرئية | أثرها على البناء |
|---|---|---|
| Microwave Link Performance | متصفح Microsoft Edge، شريط Huawei/Web LCT، سطر NE NAME وNE VERSION وCURRENT USER وNE STATE، شجرة معدات في أعلى اليسار وFunction Tree في أسفله، تبويبات Slot Layout وHOP Management وMicrowave Link Performance، ثم History Performance مع Resolution وPeriod Time وChart/Report وLink TX/RX Power وLink Errors وLegend | هذا المرجع يثبت تخطيط شاشة الأداء وتوزيع المساحات. الإصدار المرئي هو 5.212.19.27، ويجب ألا يوسم باسم V200R021 ما لم يثبت ربطهما رسميًا. |
| XPD Meter-free Test | نفس شريط Web LCT والمتصفح، لكن NE VERSION المرئي 5.207.19.28، وتبويبات Slot Layout وMicrowave Link Configuration وXPD Meter-free Test، مع Slot Layout ولوحة Legend | يثبت أن بنية التطبيق متشابهة، لكنه مرجع إصدار وNE مختلفان؛ لا تستخدم عناصر XPD لتأكيد شكل شاشة الأداء للإصدار 5.212.19.27. |

> النتيجة: النسخة السابقة التي سمت تدفق الأداء V200R021C10SPC200 كانت غير مدعومة بالدليل البصري المتاح. الدليل الأقوى المتاح لتدفق الأداء هو Web LCT مع NE VERSION 5.212.19.27، وسيبقى ذلك معرف المرجع حتى يتوفر دليل رسمي يربطه برقم إصدار منتج مختلف.

## خريطة الأدلة حسب الشاشة

| الشاشة أو المسار | المصدر المرئي | الإصدار أو النموذج الظاهر | مستوى الثقة | ما يمكن تمثيله الآن |
|---|---|---|---|---|
| Microwave Link Performance — History chart | فيديو قائمة التشغيل رقم 3 ولقطة عامة | NE VERSION 5.212.19.27 | مرتفع | شريط الحالة، شجرة الجهاز/Function Tree، تبويبات Slot Layout/HOP Management/Microwave Link Performance، فلاتر History، Chart/Report، Link TX/RX Power وLink Errors وLegend. |
| XPD Meter-free Test وSlot Layout | فيديو رقم 4 ولقطة عامة | NE VERSION 5.207.19.28 | مرتفع | Slot Layout والـ Legend وتبويبات XPD، ولكنها مسار منفصل عن شاشة الأداء أعلاه. |
| Browse Current Alarms — جدول وتفاصيل | لقطة عامة وتحليل فيديو رقم 14 | اللقطة: NE VERSION 5.51.15.38؛ الفيديو: NE_1 VERSION 212.19.27 | متوسط | أعمدة Severity/Alarm Name/Monitored Object/Rising Time/Alarm Type، التنقل First/Previous/Next/Last، نافذتا Alarm Details وAlarm Causes، وأزرار Delete/Filter/Print/Save As. لا يجوز نسبها إلى 5.212.19.27 بلا لقطة لهذه النسخة. |
| RADIO_TSL_LOW alarm | فيديو رقم 21 | RTN905؛ NE VERSION 5.190.20.26 | متوسط | العلاقة بين تحديد صف الإنذار وتفاصيله، ومسار Slot Layout → Microwave Link Configuration. لا يستخدم لإثبات نموذج RTN 950/380AX. |
| Login وNE Explorer/NE List | فيديو رقم 1 | RTN950/RTN980AX/RTN380AX؛ NE VERSION 5.196.19.27 | متوسط | منطق الدخول وNE List وNE Login وNE Explorer وحالات الاتصال؛ لا يثبت شاشة الأداء لإصدار 5.212.19.27. |
| RTN380AX configuration | فيديو رقم 18 | RTN380AX؛ Web LCT 2009-2021 | متوسط | بنية Function Tree وعائلة النوافذ، لكن ليس بديلًا مرجعيًا لطراز RTN 910 أو RTN 950. |

> القرار الفني: ستقسم المحاكاة إلى وحدات مرجعية، لا إلى واجهة هجينة. الوحدة الأولى التي يمكن إعادة بنائها بدقة أعلى هي **Microwave Link Performance (NE VERSION 5.212.19.27)**. شاشة الإنذارات ستُعاد فقط بوصفها مرجعًا بصريًا مستقلًا حتى تتوفر لقطة من نفس الإصدار أو بيئة اختبار مرخصة.

## تحقق من مصادر Huawei الرسمية

تؤكد صفحة Huawei الرسمية لـ OptiX RTN 950 أن صفحة الدعم تفصل وثائق المنتج إلى Configuration & Commissioning وOperation & Maintenance وTroubleshooting، وتعرض حزم وثائق لإصدارات حديثة متعددة مثل V100R022C10 وV100R023C10 وV100R025C10. لا تثبت هذه الصفحة أن مقاطع قائمة التشغيل، أو واجهة Web LCT فيها، تخص إصدارًا بعينه من RTN 950. [1]

كما توضح Huawei أن RTN 380AX جهاز E-band كامل خارجي بسعات ونطاقات وقنوات خاصة به؛ لذلك لا يجوز استخدام فيديو RTN 380AX مرجعًا تقنيًا أو بصريًا دقيقًا لطراز RTN 910 أو RTN 950، حتى لو كانت عائلة Web LCT متشابهة. [2]

## المراجع

[1]: https://support.huawei.com/enterprise/en/enterprise-network-microwave/optix-rtn-950-pid-60964
[2]: https://carrier.huawei.com/en/products/wireless-network/microwave/e-band/rtn380ax

## نتيجة التنفيذ والتحقق

أعيد بناء شاشة الأداء كمسار مستقل على الرابط الجذري للمشروع، ومقيد صراحة بالمرجع المرئي `NE VERSION 5.212.19.27`. يطابق التنفيذ توزيع الشريط العلوي، سطر الحالة، العدادات، شجرة NE، Function Tree، تبويبات Slot/HOP/Performance، حقلي Source وSink، تبويبات Current/History، خيارات Resolution وPeriod Time وChart/Report ومبدلات Link TX/RX Power وLink Errors وLegend.

تم اختبار التسلسل آليًا: فتح History chart، الانتقال إلى Current، العودة إلى History، فتح Error chart، العودة إلى Power chart، وإخفاء Legend. لم تُدخل قياسات راديوية أو أسماء مستخدمين أو جلسات فعلية في النسخة التدريبية.
