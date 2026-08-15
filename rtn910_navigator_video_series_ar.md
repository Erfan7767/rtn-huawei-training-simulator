# سلسلة فيديوهات RTN 910 — Navigator

> **التسمية الصادقة:** هذه سلسلة تدريبية مبنية على مقال Huawei الرسمي EKB0000559092 لحالة **RTN910V1R1**. لا تمثل واجهة Huawei الأصلية، ولا تستخدم قيم تردد أو قدرة تشغيلية حقيقية.

| الحلقة | الملف | محورها | المحتوى الموثق | حد الدقة |
|---|---|---|---|---|
| 01 | `RTN910_01_inventory_ar.mp4` | الجرد | `cfg-get-phybd` و`cfg-get-board` وصيغة `cfg-add-board` | إضافة اللوحة تحتاج slot وboard type من الجهاز الفعلي والدليل المطابق. |
| 02 | `RTN910_02_odu_frequency_ar.mp4` | تردد وقدرة ODU | `radio-cfg-get-odu-txfreq` وصيغتا ضبط التردد والقدرة | لا تستخدم أمثلة Huawei الرقمية؛ القيم من Link Engineering Sheet ومرجع الإصدار. |
| 03 | `RTN910_03_if_linkid_ar.mp4` | IF وLink ID | `radio-cfg-get-if-bandwidth` وصيغة ضبط العرض و`radio-cfg-get-linkid` | لا تضبط الطرف الواحد؛ لا تستخدم أمر modulation لأن معاملاته غير موثقة في النص المفتوح. |

## تسلسل التوسعة بعد تأكيد الإصدار

الحلقات التالية لا تُنتج كأوامر تشغيلية حتى تتوفر صورة الإصدار ومرجع معاملات Navigator أو دليل WebLCT/U2000 المطابق. ستغطي: التحقق من معلومات ODU، إعداد T/R spacing وتردد الطرفين، ATPC، AM/modulation، إنشاء الوصلة واكتشافها في U2000، ثم التحقق من الإنذارات وRSL والخدمة.

## المصدر

[1] Huawei Knowledge Base: https://support.huawei.com/enterprise/en/knowledge/EKB0000559092
