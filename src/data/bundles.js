import { products } from './products'

export const bundles = [
  {
    id: 'b1',
    name: 'روتين النضارة الكامل',
    nameEn: 'Complete Radiance Routine',
    productIds: [1, 4, 6],
    bundlePrice: 420,
    originalTotal: 525,
    badge: 'وفري ١٠٥ ج.م',
    badgeEn: 'Save 105 EGP',
    description: 'سيروم النضارة + تونر ماء الورد + غسول اللافندر — كل ما تحتاجينه لبشرة مشرقة في خطوات بسيطة.',
    descriptionEn: 'Radiance Serum + Rose Toner + Lavender Cleanser — everything you need for glowing skin.',
  },
  {
    id: 'b2',
    name: 'عناية الشعر الكاملة',
    nameEn: 'Complete Hair Care Set',
    productIds: [3, 7, 10],
    bundlePrice: 460,
    originalTotal: 580,
    badge: 'وفري ١٢٠ ج.م',
    badgeEn: 'Save 120 EGP',
    description: 'زيت الأرجان + إكسير الأرغان + بلسم المعادن — مجموعة متكاملة لشعر صحي ولامع.',
    descriptionEn: 'Argan Oil + Softening Elixir + Sea Minerals Conditioner — complete set for healthy shiny hair.',
  },
  {
    id: 'b3',
    name: 'طقم العناية الليلية',
    nameEn: 'Night Renewal Set',
    productIds: [2, 5, 8],
    bundlePrice: 499,
    originalTotal: 630,
    badge: 'وفري ١٣١ ج.م',
    badgeEn: 'Save 131 EGP',
    description: 'كريم اللافندر الليلي + سيروم التين الشوكي + كريم الورد الليلي — روتين ليلي متكامل لتجديد البشرة.',
    descriptionEn: 'Lavender Night Cream + Prickly Pear Serum + Rose Night Cream — complete nighttime renewal.',
  },
]

export function getBundleProducts(bundle) {
  return bundle.productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
}
