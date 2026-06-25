import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const sections = [
  {
    titleAr: 'قبول الشروط والأحكام',
    titleEn: 'Acceptance of Terms',
    contentAr: 'بوصولك إلى الموقع الإلكتروني أو تصفحه أو إتمام أي عملية شراء عبره، فإنك تُقرّ بأنك قرأت هذه الشروط والأحكام وفهمتها وتوافق على الالتزام الكامل بها. إذا كنت لا توافق على أي بند من هذه الشروط، يُرجى التوقف الفوري عن استخدام الموقع.',
    contentEn: 'By accessing, browsing, or completing any purchase on our website, you acknowledge that you have read, understood, and agree to be fully bound by these Terms and Conditions. If you do not agree to any provision herein, please immediately discontinue use of the website.',
  },
  {
    titleAr: 'الطلبات والدفع',
    titleEn: 'Orders & Payment',
    contentAr: 'تُعتبر الطلبات مؤكدة فور إتمام معالجة الدفع بنجاح. نقبل الدفع نقدًا عند الاستلام، والتحويل الإلكتروني عبر فودافون كاش وإنستا باي والتحويل البنكي. نحتفظ بالحق في رفض أي طلب أو إلغائه في حالات الاشتباه بالاحتيال أو عدم صحة بيانات الدفع أو نفاد المخزون، على أن يُخطر العميل فورًا.',
    contentEn: 'Orders are considered confirmed upon successful payment processing. We accept cash on delivery, and electronic transfers via Vodafone Cash, InstaPay, and bank transfer. We reserve the right to decline or cancel any order in cases of suspected fraud, invalid payment details, or stock unavailability, with immediate customer notification.',
  },
  {
    titleAr: 'التوصيل والشحن',
    titleEn: 'Delivery & Shipping',
    contentAr: 'التوصيل للقاهرة والجيزة من 3 إلى 5 أيام والمحافظات من أسبوع إلى 10 أيام. تُحسب رسوم الشحن وتُعرض بوضوح أثناء إتمام الطلب. في حالات التأخير الناجمة عن ظروف خارجة عن إرادتنا — كالكوارث الطبيعية أو الإضرابات أو القرارات الحكومية — سنبذل قصارى جهدنا للتواصل الفوري مع العميل وإيجاد الحل الأمثل.',
    contentEn: 'Delivery to Cairo and Giza takes 3 to 5 days, and to other governorates from one week to 10 days. Shipping fees are calculated and clearly displayed during checkout. In cases of delay caused by circumstances beyond our control — including natural disasters, strikes, or governmental decisions — we will make every effort to immediately communicate with the customer and find the optimal resolution.',
  },
  {
    titleAr: 'سياسة الإرجاع والاستبدال والمنتجات التالفة',
    titleEn: 'Returns, Exchanges & Damaged Items Policy',
    contentAr: 'عند استلامك للطلب، يحق لك خلال نافذة زمنية لا تتجاوز عشر (١٠) دقائق من لحظة التسليم الفعلي، فحص جميع المنتجات والإبلاغ عن أي منتج تالف أو معيب أو مغاير لما تم طلبه.\n\nيجب أن يكون الإبلاغ خلال هذه المدة مصحوبًا بصور فوتوغرافية واضحة تُرسل فورًا عبر واتساب على الرقم: +20 110 290 3151\n\nبعد انقضاء عشر (١٠) دقائق من لحظة الاستلام الفعلي، لن يُقبل أي طلب للاسترداد أو الإرجاع أو الاستبدال، تحت أي سبب أو ظرف كان، وذلك دون أي استثناء مهما كانت الأسباب.\n\nباستلامك للطلب، تُقرّ صراحةً وتوافق على أن المنتجات وصلت في حالة سليمة ومُرضية تمامًا.',
    contentEn: 'Upon receiving your order, you have a window of no more than ten (10) minutes from the moment of actual delivery to inspect all items and report any damaged, defective, or incorrect product.\n\nAll reports within this window must be accompanied by clear photographic evidence sent immediately via WhatsApp to: +20 110 290 3151\n\nAfter ten (10) minutes have elapsed from the moment of actual delivery, no refund, return, or exchange request will be accepted for any reason or under any circumstances whatsoever, without exception, regardless of the nature of the claim.\n\nBy accepting delivery of your order, you expressly acknowledge and agree that all products were received in fully satisfactory condition.',
  },
  {
    titleAr: 'الخصوصية',
    titleEn: 'Privacy',
    contentAr: 'يخضع استخدامك للموقع أيضًا لسياسة الخصوصية الخاصة بنا، والتي تُعدّ جزءًا لا يتجزأ من هذه الشروط والأحكام. تحكم سياسة الخصوصية طريقة جمع بياناتك الشخصية واستخدامها وحمايتها.',
    contentEn: 'Your use of our website is also governed by our Privacy Policy, which forms an integral part of these Terms and Conditions. The Privacy Policy governs how your personal data is collected, used, and protected.',
  },
]

export default function Terms() {
  const { lang } = useLanguage()

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-garamond text-display-mobile md:text-display-lg text-primary mb-4">
          {lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </h1>
        <p className="font-jakarta text-body-md text-on-surface-variant">
          {lang === 'ar' ? 'آخر تحديث: يناير ٢٠٢٥' : 'Last updated: January 2025'}
        </p>
        <div className="h-1 w-20 bg-secondary-container mx-auto rounded-full mt-6" />
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            {...fadeUp(i * 0.04)}
            className={`rounded-2xl p-8 border shadow-sm ${
              section.highlight
                ? 'bg-error/5 border-error/30'
                : 'bg-surface-container-lowest border-outline-variant/10'
            }`}
          >
            <h2 className={`font-garamond text-headline-sm mb-4 flex items-center gap-3 ${section.highlight ? 'text-error' : 'text-primary'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-jakarta text-label-md flex-shrink-0 ${section.highlight ? 'bg-error text-white' : 'bg-primary text-on-primary'}`}>
                {i + 1}
              </span>
              {lang === 'ar' ? section.titleAr : section.titleEn}
            </h2>
            {section.highlight && (
              <div className={`flex items-center gap-2 mb-4 text-error font-jakarta text-label-md`}>
                <span className="material-symbols-outlined text-[18px]">warning</span>
                {lang === 'ar' ? 'هذا البند ملزم قانونيًا' : 'This clause is legally binding'}
              </div>
            )}
            <p className="font-jakarta text-body-md text-on-surface-variant leading-loose whitespace-pre-line">
              {lang === 'ar' ? section.contentAr : section.contentEn}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
