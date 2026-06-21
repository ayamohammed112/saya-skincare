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
    titleAr: 'مقدمة',
    titleEn: 'Introduction',
    contentAr: 'تلتزم سايا للعناية الطبيعية بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها عند تسوقك في موقعنا. باستخدامك للموقع أو إتمامك لأي طلب شراء، فإنك توافق على الشروط الواردة في هذه السياسة.',
    contentEn: 'SAYA Natural Skincare is committed to protecting your privacy and personal data. This policy explains how your information is collected, used, and protected when you shop with us. By using our website or completing a purchase, you agree to the terms outlined in this policy.',
  },
  {
    titleAr: 'المعلومات التي نجمعها',
    titleEn: 'Information We Collect',
    contentAr: 'عند إتمامك طلبًا، نجمع المعلومات التالية:\n• الاسم الكامل ورقم الهاتف\n• عنوان التسليم والمحافظة\n• البريد الإلكتروني (اختياري)\n• تفاصيل الطلب وطريقة الدفع\n• بيانات الجهاز والمتصفح لأغراض التحليل وتحسين جودة الخدمة',
    contentEn: 'When you place an order, we collect the following information:\n• Full name and phone number\n• Delivery address and governorate\n• Email address (optional)\n• Order details and payment method\n• Device and browser data for analytics and service improvement',
  },
  {
    titleAr: 'كيف نستخدم بياناتك',
    titleEn: 'How We Use Your Information',
    contentAr: 'نستخدم بياناتك الشخصية للأغراض التالية حصرًا:\n• معالجة طلباتك وتأكيدها وتوصيلها\n• التواصل معك بشأن حالة طلبك وأي تحديثات ذات صلة\n• تحسين منتجاتنا وخدماتنا المقدمة\n• إرسال عروض ترويجية حصرية (بموافقتك الصريحة فقط)\n• الامتثال للمتطلبات القانونية والتنظيمية',
    contentEn: 'We use your personal data exclusively for the following purposes:\n• Processing, confirming, and delivering your orders\n• Communicating order status updates and relevant notifications\n• Improving our products and services\n• Sending exclusive promotional offers (with your explicit consent only)\n• Complying with legal and regulatory requirements',
  },
  {
    titleAr: 'حماية البيانات',
    titleEn: 'Data Protection',
    contentAr: 'نلتزم بحماية بياناتك وفق أعلى معايير الأمان المعمول بها:\n• يتم تخزين بياناتك بشكل آمن باستخدام أنظمة تشفير متقدمة\n• الوصول إلى بياناتك مقيد بالموظفين المخولين فقط\n• نجري مراجعات دورية لممارسات الأمان لضمان سلامة معلوماتك في جميع الأوقات',
    contentEn: 'We are committed to protecting your data according to the highest applicable security standards:\n• Your data is stored securely using advanced encryption systems\n• Access to your data is strictly restricted to authorized personnel only\n• We conduct regular security audits to ensure the integrity of your information at all times',
  },
  {
    titleAr: 'عدم مشاركة البيانات مع أطراف ثالثة',
    titleEn: 'No Third-Party Data Sharing',
    contentAr: 'نحن لا نبيع بياناتك الشخصية ولا نؤجرها ولا نشاركها ولا نكشف عنها لأي طرف ثالث تحت أي ظرف من الظروف.\n\nالاستثناء الوحيد هو شركاء التوصيل، الذين لا يتلقون سوى المعلومات الضرورية للغاية (الاسم ورقم الهاتف وعنوان التسليم) لإتمام عملية التوصيل فقط. يُحظر عليهم صراحةً استخدام هذه البيانات لأي غرض آخر.',
    contentEn: 'We do not sell, rent, share, or disclose your personal data to any third party under any circumstances whatsoever.\n\nThe sole exception is our delivery partners, who receive only the minimum necessary information (name, phone number, and delivery address) solely to complete your delivery. They are expressly prohibited from using this data for any other purpose.',
  },
  {
    titleAr: 'ملفات تعريف الارتباط',
    titleEn: 'Cookies',
    contentAr: 'نستخدم ملفات تعريف الارتباط الضرورية فقط لضمان عمل الموقع بالشكل الصحيح، كحفظ محتويات سلة التسوق وتذكر إعدادات اللغة المفضلة لديك. لا نستخدم ملفات تعريف ارتباط للتتبع الإعلاني دون الحصول على موافقتك الصريحة المسبقة.',
    contentEn: 'We use only essential cookies to ensure the website operates correctly, such as saving your cart contents and remembering your preferred language settings. We do not use advertising tracking cookies without your prior explicit consent.',
  },
  {
    titleAr: 'الاحتفاظ بالبيانات',
    titleEn: 'Data Retention',
    contentAr: 'يتم الاحتفاظ ببيانات الطلبات لمدة ثلاث (3) سنوات لأغراض الامتثال القانوني والمحاسبي. يمكنك في أي وقت طلب حذف بياناتك الشخصية عبر التواصل معنا مباشرةً، وسيتم معالجة طلبك خلال سبعة (7) أيام عمل.',
    contentEn: 'Order data is retained for three (3) years for legal and accounting compliance purposes. You may request deletion of your personal data at any time by contacting us directly, and your request will be processed within seven (7) business days.',
  },
  {
    titleAr: 'حقوقك',
    titleEn: 'Your Rights',
    contentAr: 'تتمتعين بالحقوق التالية فيما يتعلق ببياناتك الشخصية:\n• الحق في الاطلاع على البيانات التي نحتفظ بها عنك\n• الحق في تصحيح أي بيانات غير دقيقة أو منقوصة\n• الحق في طلب حذف بياناتك نهائيًا\n• الحق في سحب موافقتك على الاتصالات التسويقية في أي وقت\n\nلممارسة أي من هذه الحقوق، تواصلي معنا عبر واتساب.',
    contentEn: 'You have the following rights regarding your personal data:\n• The right to access the data we hold about you\n• The right to correct any inaccurate or incomplete information\n• The right to request permanent deletion of your data\n• The right to withdraw consent for marketing communications at any time\n\nTo exercise any of these rights, please contact us via WhatsApp.',
  },
  {
    titleAr: 'تواصلي معنا',
    titleEn: 'Contact Us',
    contentAr: 'لأي استفسارات تتعلق بسياسة الخصوصية أو ببياناتك الشخصية، يُرجى التواصل معنا عبر واتساب على الرقم:\n+20 110 290 3151',
    contentEn: 'For any inquiries regarding this Privacy Policy or your personal data, please contact us via WhatsApp at:\n+20 110 290 3151',
  },
]

export default function PrivacyPolicy() {
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
          {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
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
            className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm"
          >
            <h2 className="font-garamond text-headline-sm text-primary mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-jakarta text-label-md flex-shrink-0">
                {i + 1}
              </span>
              {lang === 'ar' ? section.titleAr : section.titleEn}
            </h2>
            <p className="font-jakarta text-body-md text-on-surface-variant leading-loose whitespace-pre-line">
              {lang === 'ar' ? section.contentAr : section.contentEn}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
