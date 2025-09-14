// prisma/constans.ts

export type ProductSeed = {
  name: string
  slug: string
  imageUrl: string
  images?: string[]
  price: number
  currency?: string
  discountPercent?: number | null
  description?: string
  brandSlug: string
  categorySlugs: string[]
  materialSlugs?: string[]
  colorSlugs: string[]
  sizeNames: string[]
  stock?: number
}

/* ===== Справочники ===== */

export const brands = [
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Puma', slug: 'puma' },
  { name: 'Jordan', slug: 'jordan' },
  { name: 'New Balance', slug: 'new-balance' },
  { name: 'ASICS', slug: 'asics' },
  { name: 'Under Armour', slug: 'under-armour' },
  { name: 'Reebok', slug: 'reebok' },
]

export const materials = [
  { name: 'Cotton', slug: 'cotton' },
  { name: 'Polyester', slug: 'polyester' },
  { name: 'Spandex', slug: 'spandex' },
  { name: 'Leather', slug: 'leather' },
  { name: 'Suede', slug: 'suede' },
  { name: 'Mesh', slug: 'mesh' },
]

// hex обязателен (в схеме Color.hex)
export const colors = [
  { name: 'Black', slug: 'black', hex: '#000000' },
  { name: 'White', slug: 'white', hex: '#FFFFFF' },
  { name: 'Grey',  slug: 'grey',  hex: '#9CA3AF' },
  { name: 'Red',   slug: 'red',   hex: '#EF4444' },
  { name: 'Blue',  slug: 'blue',  hex: '#3B82F6' },
]

// размеры: одежда + обувь (EU)
const apparelSizes = ['S', 'M', 'L', 'XL']
const shoeSizes    = ['40', '41', '42', '43', '44', '45']
export const sizes = [...apparelSizes, ...shoeSizes].map((name) => ({ name }))

// категории — как в твоей Studio
export const categories = [
  { name: 'HIT',       slug: 'hit' },
  { name: 'NEW',       slug: 'new' },
  { name: 'SALE',      slug: 'sale' },
  { name: 'Мужчины',   slug: 'muzhchiny' },
  { name: 'Женщины',   slug: 'zhenshchiny' },
  { name: 'Дети',      slug: 'deti' },
  { name: 'Обувь',     slug: 'obuv' },
  { name: 'Одежда',    slug: 'odezhda' },
]

/* ===== Товары ===== */

// 10 КРОССОВОК
const sneakers: ProductSeed[] = [
  {
    name: 'Nike Air Force 1 ’07 White',
    slug: 'nike-air-force-1-07-white',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/13fbf6d7-b41c-4ee0-966f-1c1f2c1a1c36/air-force-1-07-mens-shoes-WrLlWX.png',
    price: 119.99, brandSlug: 'nike',
    categorySlugs: ['obuv', 'hit'], materialSlugs: ['leather', 'mesh'],
    colorSlugs: ['white'], sizeNames: shoeSizes, stock: 12,
  },
  {
    name: 'Adidas Samba OG Black',
    slug: 'adidas-samba-og-black',
    imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ab0d3c6a2f6849a19a23ad1800d02f64_9366/SAMBA_OG_Shoes_Black_B75807_01_standard.jpg',
    price: 110.0, brandSlug: 'adidas',
    categorySlugs: ['obuv', 'new'], materialSlugs: ['leather', 'suede'],
    colorSlugs: ['black', 'white'], sizeNames: shoeSizes, stock: 10,
  },
  {
    name: 'Puma Suede Classic Red',
    slug: 'puma-suede-classic-red',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/374915/01/sv01/fnd/PNA/fmt/png',
    price: 89.99, brandSlug: 'puma',
    categorySlugs: ['obuv', 'sale'], materialSlugs: ['suede'],
    colorSlugs: ['red'], sizeNames: shoeSizes, stock: 8,
  },
  {
    name: 'New Balance 530 Grey',
    slug: 'new-balance-530-grey',
    imageUrl: 'https://nb.scene7.com/is/image/NB/mr530sg_nb_02_i?$pdpflexf2$',
    price: 129.99, brandSlug: 'new-balance',
    categorySlugs: ['obuv', 'new'], materialSlugs: ['mesh', 'leather'],
    colorSlugs: ['grey', 'white'], sizeNames: shoeSizes, stock: 14,
  },
  {
    name: 'ASICS Gel-Kayano 14 White/Black',
    slug: 'asics-gel-kayano-14-white-black',
    imageUrl: 'https://images.asics.com/is/image/asics/1203A072_100_SR_RT_GLB-1?$sfcc-product$',
    price: 159.99, brandSlug: 'asics',
    categorySlugs: ['obuv'], materialSlugs: ['mesh', 'leather'],
    colorSlugs: ['white', 'black'], sizeNames: shoeSizes, stock: 9,
  },
  {
    name: 'Nike Air Max 97 “Silver Bullet”',
    slug: 'nike-air-max-97-silver-bullet',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7a1d0c99-1adf-4d1f-9f27-0b0b1e84cf22/air-max-97.png',
    price: 179.99, brandSlug: 'nike',
    categorySlugs: ['obuv', 'hit'], materialSlugs: ['mesh', 'leather'],
    colorSlugs: ['grey', 'white'], sizeNames: shoeSizes, stock: 11,
  },
  {
    name: 'Adidas Ultraboost 1.0 Triple Black',
    slug: 'adidas-ultraboost-triple-black',
    imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/1e7eaf5f8cba4b90a4d0ad6c00d06a13_9366/ULTRABOOST_1.0_Shoes_Black_GZ2640_01_standard.jpg',
    price: 189.99, brandSlug: 'adidas',
    categorySlugs: ['obuv'], materialSlugs: ['mesh'],
    colorSlugs: ['black'], sizeNames: shoeSizes, stock: 13,
  },
  {
    name: 'New Balance 990v6 Navy',
    slug: 'new-balance-990v6-navy',
    imageUrl: 'https://nb.scene7.com/is/image/NB/m990gl6_nb_02_i?$pdpflexf2$',
    price: 219.99, brandSlug: 'new-balance',
    categorySlugs: ['obuv', 'new'], materialSlugs: ['mesh', 'leather'],
    colorSlugs: ['blue', 'grey'], sizeNames: shoeSizes, stock: 6,
  },
  {
    name: 'Jordan 4 Retro “Black Cat”',
    slug: 'jordan-4-retro-black-cat',
    imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/35d7a6c1-dc4b-448f-8a9f-8a4af46e61e2/air-jordan-4-retro.png',
    price: 299.99, brandSlug: 'jordan',
    categorySlugs: ['obuv', 'hit'], materialSlugs: ['leather'],
    colorSlugs: ['black'], sizeNames: shoeSizes, stock: 5,
  },
  {
    name: 'Puma RS-X White/Blue',
    slug: 'puma-rsx-white-blue',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/369666/22/sv01/fnd/PNA/fmt/png',
    price: 109.99, brandSlug: 'puma',
    categorySlugs: ['obuv', 'sale'], materialSlugs: ['mesh'],
    colorSlugs: ['white', 'blue'], sizeNames: shoeSizes, stock: 15,
  },
]

// 10 ОДЕЖДЫ
const apparel: ProductSeed[] = [
  {
    name: 'Jordan Flight Fleece Hoodie',
    slug: 'jordan-flight-fleece-hoodie',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/d1d72a54-6bd8-4cbb-82a1-90d3f4a3f7f1/Jordan-Flight-Fleece-Pullover-Hoodie.png',
    price: 84.99, brandSlug: 'jordan',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['cotton', 'polyester'],
    colorSlugs: ['black', 'grey'], sizeNames: apparelSizes, stock: 30,
  },
  {
    name: 'Nike Club Fleece Hoodie',
    slug: 'nike-club-fleece-hoodie',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/9c1e9e5d-1b70-4a7b-8b5b-0db58a3f3d9f/Sportswear-Club-Fleece-Pullover-Hoodie.png',
    price: 69.99, brandSlug: 'nike',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['cotton', 'polyester'],
    colorSlugs: ['black'], sizeNames: apparelSizes, stock: 40,
  },
  {
    name: 'Adidas Essentials 3-Stripes Tee',
    slug: 'adidas-essentials-3stripes-tee',
    imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/8b3e2f0b2d144f2f89d6ad9600b0ab38_9366/Essentials_3-Stripes_Tee_White_HS3451_01_laydown.jpg',
    price: 29.99, brandSlug: 'adidas',
    categorySlugs: ['odezhda', 'muzhchiny', 'new'],
    materialSlugs: ['cotton'],
    colorSlugs: ['white', 'black'], sizeNames: apparelSizes, stock: 60,
  },
  {
    name: 'Puma Essentials Logo Leggings',
    slug: 'puma-essentials-logo-leggings',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/848167/01/sv01/fnd/PNA/fmt/png',
    price: 34.99, brandSlug: 'puma',
    categorySlugs: ['odezhda', 'zhenshchiny'],
    materialSlugs: ['cotton', 'spandex'],
    colorSlugs: ['black'], sizeNames: apparelSizes, stock: 35,
  },
  {
    name: 'Nike Sportswear Club Joggers',
    slug: 'nike-sportswear-club-joggers',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/2aa04fd1-fd7a-42a4-95fc-5c0a3ed3b5b6/Sportswear-Club-Fleece-Joggers.png',
    price: 59.99, brandSlug: 'nike',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['cotton', 'polyester'],
    colorSlugs: ['grey', 'black'], sizeNames: apparelSizes, stock: 45,
  },
  {
    name: 'Adidas Tiro 23 Training Pants',
    slug: 'adidas-tiro-23-training-pants',
    imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/0d9f2d0f9a1c4455a9acaf7a00e3a0af_9366/Tiro_23_Club_Training_Pants_Black_IB8090_01_laydown.jpg',
    price: 54.99, brandSlug: 'adidas',
    categorySlugs: ['odezhda', 'muzhchiny', 'sale'],
    materialSlugs: ['polyester'],
    colorSlugs: ['black'], sizeNames: apparelSizes, stock: 38,
  },
  {
    name: 'Under Armour Tech 2.0 T-Shirt',
    slug: 'under-armour-tech-2-tee',
    imageUrl: 'https://underarmour.scene7.com/is/image/Underarmour/1326413-001_DEFAULT?qlt=75&fmt=png-alpha&wid=720&hei=720',
    price: 24.99, brandSlug: 'under-armour',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['polyester'],
    colorSlugs: ['black', 'grey'], sizeNames: apparelSizes, stock: 55,
  },
  {
    name: 'Nike Dri-FIT Academy Shorts',
    slug: 'nike-drifit-academy-shorts',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/1b0c3f8a-24e9-4f1e-a3f3-4e2f0d048b6a/Dri-FIT-Academy-Shorts.png',
    price: 34.99, brandSlug: 'nike',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['polyester'],
    colorSlugs: ['black', 'blue'], sizeNames: apparelSizes, stock: 70,
  },
  {
    name: 'Puma Classics T7 Track Jacket',
    slug: 'puma-classics-t7-jacket',
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/530094/01/sv01/fnd/PNA/fmt/png',
    price: 79.99, brandSlug: 'puma',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['polyester'],
    colorSlugs: ['black', 'white'], sizeNames: apparelSizes, stock: 25,
  },
  {
    name: 'Jordan Essential Fleece Pants',
    slug: 'jordan-essential-fleece-pants',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/9b5f9e3e-1c12-4f1a-9b98-8d0a2f606c01/Jordan-Essential-Fleece-Pants.png',
    price: 74.99, brandSlug: 'jordan',
    categorySlugs: ['odezhda', 'muzhchiny'],
    materialSlugs: ['cotton', 'polyester'],
    colorSlugs: ['black', 'grey'], sizeNames: apparelSizes, stock: 33,
  },
]

// итоговый экспорт
export const products: ProductSeed[] = [...sneakers, ...apparel]







  
  
  