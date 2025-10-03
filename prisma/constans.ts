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
  { name: 'Textile', slug: 'textile'},
  { name: 'Fabric', slug: 'fabric' },
]

// hex обязателен (в схеме Color.hex)
export const colors = [
  { name: 'Black',  slug: 'black',  hex: '#000000' },
  { name: 'White',  slug: 'white',  hex: '#FFFFFF' },
  { name: 'Grey',   slug: 'grey',   hex: '#9CA3AF' },
  { name: 'Blue',   slug: 'blue',   hex: '#3B82F6' },
  { name: 'Green',  slug: 'green',  hex: '#10B981' },
  { name: 'Orange', slug: 'orange', hex: '#F59E0B' },
  { name: 'Gold',   slug: 'gold',   hex: '#D4AF37' },
  { name: 'Brown',  slug: 'brown',  hex: '#8B5E3C' },
];

// размеры: одежда + обувь (EU)
const apparelSizes = ['S', 'M', 'L', 'XL']
const shoeSizes    = ['40', '41', '42', '43', '44', '45']
export const sizes = [...apparelSizes, ...shoeSizes].map((name) => ({ name }))

// категории — как в твоей Studio
export const categories = [
  { name: 'NEW',       slug: 'novinki', 
    sections: [
      { name: 'Новинки & Рекомендуемое', slug: 'novinki-rekomenduemoe', parentSlug: 'novinki', 
        dropdown: [
          { name: 'Скидки до 40%', slug: 'novinki-rekomenduemoe-skidki-do-40', parentSlug: 'novinki-rekomenduemoe' },
          { name: 'Новое поступление', slug: 'novinki-rekomenduemoe-novoe-postuplenie', parentSlug: 'novinki-rekomenduemoe' },
          { name: 'Лучшие по продажам', slug: 'novinki-rekomenduemoe-luchshie-po-prodazham', parentSlug: 'novinki-rekomenduemoe' },
          { name: 'Лимитированная коллекция', slug: 'novinki-rekomenduemoe-limit', parentSlug: 'novinki-rekomenduemoe' },
        ]
      },
      { name: 'Новое в магазине', slug: 'novinki-novoe-v-magazine', parentSlug: 'novinki', 
        dropdown: [
          { name: 'Мужчины',   slug: 'novinki-novoe-v-magazine-muzhchiny',   parentSlug: 'novinki-novoe-v-magazine' },
          { name: 'Женщины',   slug: 'novinki-novoe-v-magazine-zhenshchiny', parentSlug: 'novinki-novoe-v-magazine' },
          { name: 'Дети',      slug: 'novinki-novoe-v-magazine-deti',        parentSlug: 'novinki-novoe-v-magazine' },
          { name: 'Аксессуары',slug: 'novinki-novoe-v-magazine-aksessuary',  parentSlug: 'novinki-novoe-v-magazine' },
        ]
      }
    ]},
  { name: 'SALE',      slug: 'skidki',
    sections: [
      {name: 'Ограниченное время', slug: 'skidki-ogr-vremya', parentSlug: 'skidki', 
        dropdown: [
          { name: 'Скидки до 40%', slug: 'skidki-ogr-vremya-40', parentSlug: 'skidki-ogr-vremya' },
        ]
      },
      { name: 'Мужчины', slug: 'skidki-muzhchiny', parentSlug: 'skidki',
        dropdown: [
          { name: 'Обувь', slug: 'skidki-muzhchiny-obuv', parentSlug: 'skidki-muzhchiny' },
          { name: 'Одежда', slug: 'skidki-muzhchiny-odezhda', parentSlug: 'skidki-muzhchiny' },
          { name: 'Аксессуары', slug: 'skidki-muzhchiny-aksessuary', parentSlug: 'skidki-muzhchiny' },
          { name: 'Всё', slug: 'skidki-muzhchiny-all', parentSlug: 'skidki-muzhchiny' },
        ]
      },
      { name: 'Женщины', slug: 'skidki-zhenshchiny', parentSlug: 'skidki', 
        dropdown: [
          { name: 'Обувь', slug: 'skidki-zhenshchiny-obuv', parentSlug: 'skidki-zhenshchiny' },
          { name: 'Одежда', slug: 'skidki-zhenshchiny-odezhda', parentSlug: 'skidki-zhenshchiny' },
          { name: 'Аксессуары', slug: 'skidki-zhenshchiny-aksessuary', parentSlug: 'skidki-zhenshchiny' },
          { name: 'Всё', slug: 'sskidki-zhenshchiny-all', parentSlug: 'skidki-zhenshchiny' },
        ]
      },
      { name: 'Дети', slug: 'skidki-deti', parentSlug: 'skidki', 
        dropdown: [
          { name: 'Обувь', slug: 'skidki-deti-obuv', parentSlug: 'skidki-deti' },
          { name: 'Одежда', slug: 'skidki-deti-odezhda', parentSlug: 'skidki-deti' },
          { name: 'Аксессуары', slug: 'skidki-deti-aksessuary', parentSlug: 'skidki-deti' },
          { name: 'Всё', slug: 'skidki-deti-all', parentSlug: 'skidki-deti' },
        ]
      },
    ]
  },
  { name: 'Мужчины',   slug: 'muzhchiny', 
    sections: [
      { name: 'Новинки & Рекомендуемое', slug: 'muzhchiny-rekomenduemoe', parentSlug: 'muzhchiny', 
        dropdown: [
          { name: 'Скидки до 40%', slug: 'muzhchiny-rekomenduemoe-skidki-do-40', parentSlug: 'muzhchiny-rekomenduemoe' },
          { name: 'Новое поступление', slug: 'muzhchiny-rekomenduemoe-novoe-postuplenie', parentSlug: 'muzhchiny-rekomenduemoe' },
          { name: 'Лучшие по продажам', slug: 'muzhchiny-rekomenduemoe-best-sellers', parentSlug: 'muzhchiny-rekomenduemoe' },
          { name: 'Лимитированная коллекция', slug: 'muzhchiny-rekomenduemoe-limit', parentSlug: 'muzhchiny-rekomenduemoe' },
        ]
      },
      { name: 'Обувь', slug: 'muzhchiny-obuv', parentSlug: 'muzhchiny', 
        dropdown: [
          { name: 'Вся Обувь', slug: 'muzhchiny-obuv-vsya-obuv', parentSlug: 'muzhchiny-obuv' },
          { name: 'Лайф-Стайл', slug: 'muzhchiny-obuv-lifestyle', parentSlug: 'muzhchiny-obuv' },
          { name: 'Для бега', slug: 'muzhchiny-obuv-running', parentSlug: 'muzhchiny-obuv' },
          { name: 'В спортзал', slug: 'muzhchiny-obuv-gym', parentSlug: 'muzhchiny-obuv' },
        ]
      },
      { name: 'Одежда', slug: 'muzhchiny-odezhda', parentSlug: 'muzhchiny', 
        dropdown: [
          { name: 'Вся одежда', slug: 'muzhchiny-odezhda-vsya-odezhda', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Худи & Свитшоты', slug: 'muzhchiny-odezhda-hoodies-sweatshirts', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Куртки & Жилеты', slug: 'muzhchiny-odezhda-jackets-vests', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Рубашки', slug: 'muzhchiny-odezhda-rubashki', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Футболки', slug: 'muzhchiny-odezhda-futbolki', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Одинаковые комплекты', slug: 'muzhchiny-odezhda-matching-sets', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Штаны', slug: 'muzhchiny-odezhda-shtany', parentSlug: 'muzhchiny-odezhda' },
          { name: 'Шорты', slug: 'muzhchiny-odezhda-shorty', parentSlug: 'muzhchiny-odezhda' },
        ]
      },
      { name: 'Аксессуары', slug: 'muzhchiny-aksessuary', parentSlug: 'muzhchiny', 
        dropdown: [
          { name: 'Головные уборы', slug: 'muzhchiny-aksessuary-headwear', parentSlug: 'muzhchiny-aksessuary' },
          { name: 'Ремни', slug: 'muzhchiny-aksessuary-belts', parentSlug: 'muzhchiny-aksessuary' },
          { name: 'Солнцезащитные очки', slug: 'muzhchiny-aksessuary-sunglasses', parentSlug: 'muzhchiny-aksessuary' },
          { name: 'Сумки & рюкзаки', slug: 'muzhchiny-aksessuary-bags', parentSlug: 'muzhchiny-aksessuary' },
          { name: 'Часы', slug: 'muzhchiny-aksessuary-watches', parentSlug: 'muzhchiny-aksessuary' },
        ]
       },
    ]
  },
  { name: 'Женщины',   slug: 'zhenshchiny',
    sections: [
      { name: 'Новинки & Рекомендуемое', slug: 'zhenshchiny-rekomenduemoe', parentSlug: 'zhenshchiny',
        dropdown: [
          { name: 'Скидки до 40%', slug: 'zhenshchiny-rekomenduemoe-skidki-do-40', parentSlug: 'zhenshchiny-rekomenduemoe' },
          { name: 'Новое поступление', slug: 'zhenshchiny-rekomenduemoe-novoe-postuplenie', parentSlug: 'zhenshchiny-rekomenduemoe' },
          { name: 'Лучшие по продажам', slug: 'zhenshchiny-rekomenduemoe-best-sellers', parentSlug: 'zhenshchiny-rekomenduemoe' },
          { name: 'Лимитированная коллекция', slug: 'zhenshchiny-rekomenduemoe-limit', parentSlug: 'zhenshchiny-rekomenduemoe' },
        ]
       },
      { name: 'Обувь', slug: 'zhenshchiny-obuv', parentSlug: 'zhenshchiny',
        dropdown: [
          { name: 'Вся Обувь', slug: 'zhenshchiny-obuv-vsya-obuv', parentSlug: 'zhenshchiny-obuv' },
          { name: 'Лайф-Стайл', slug: 'zhenshchiny-obuv-lifestyle', parentSlug: 'zhenshchiny-obuv' },
          { name: 'Для бега', slug: 'zhenshchiny-obuv-running', parentSlug: 'zhenshchiny-obuv' },
          { name: 'В спортзал', slug: 'zhenshchiny-obuv-gym', parentSlug: 'zhenshchiny-obuv' },
        ]
       },
      { name: 'Одежда', slug: 'zhenshchiny-odezhda', parentSlug: 'zhenshchiny',
        dropdown: [
          { name: 'Вся одежда', slug: 'zhenshchiny-odezhda-vsya-odezhda', parentSlug: 'zhenshchiny-odezhda' },
          { name: 'Толстовки & Свитшоты', slug: 'zhenshchiny-odezhda-hoodies-sweatshirts', parentSlug: 'zhenshchiny-odezhda' },
          { name: 'Куртки & Жилеты', slug: 'zhenshchiny-odezhda-jackets-vests', parentSlug: 'zhenshchiny-odezhda' },
          { name: 'Футболки', slug: 'zhenshchiny-odezhda-futbolki', parentSlug: 'zhenshchiny-odezhda' },
          { name: 'Одинаковые комплекты', slug: 'zhenshchiny-odezhda-matching-sets', parentSlug: 'zhenshchiny-odezhda' },
          { name: 'Штаны', slug: 'zhenshchiny-odezhda-shtany', parentSlug: 'zhenshchiny-odezhda' },
        ]
       },
      { name: 'Аксессуары', slug: 'zhenshchiny-aksessuary', parentSlug: 'zhenshchiny',
        dropdown: [
          { name: 'Головные уборы', slug: 'zhenshchiny-aksessuary-headwear', parentSlug: 'zhenshchiny-aksessuary' },
          { name: 'Ремни', slug: 'zhenshchiny-aksessuary-belts', parentSlug: 'zhenshchiny-aksessuary' },
          { name: 'Солнцезащитные очки', slug: 'zhenshchiny-aksessuary-sunglasses', parentSlug: 'zhenshchiny-aksessuary' },
          { name: 'Сумки & рюкзаки', slug: 'zhenshchiny-aksessuary-bags', parentSlug: 'zhenshchiny-aksessuary' },
          { name: 'Часы', slug: 'zhenshchiny-aksessuary-watches', parentSlug: 'zhenshchiny-aksessuary' },
        ]
       },
    ]
   },
  { name: 'Дети',      slug: 'deti',
    sections: [
      { name: 'Новинки & Рекомендуемое', slug: 'deti-rekomenduemoe', parentSlug: 'deti',
        dropdown: [
          { name: 'Скидки до 40%', slug: 'deti-rekomenduemoe-skidki-do-40', parentSlug: 'deti-rekomenduemoe' },
          { name: 'Новое поступление', slug: 'deti-rekomenduemoe-novoe-postuplenie', parentSlug: 'deti-rekomenduemoe' },
          { name: 'Лучшие по продажам', slug: 'deti-rekomenduemoe-best-sellers', parentSlug: 'deti-rekomenduemoe' },
          { name: 'Лимитированная коллекция', slug: 'deti-rekomenduemoe-limit', parentSlug: 'deti-rekomenduemoe' },
        ]
       },
      { name: 'Обувь', slug: 'deti-obuv', parentSlug: 'deti',
        dropdown: [
          { name: 'Вся Обувь', slug: 'deti-obuv-vsya-obuv', parentSlug: 'deti-obuv' },
          { name: 'Лайф-Стайл', slug: 'deti-obuv-lifestyle', parentSlug: 'deti-obuv' },
          { name: 'Для бега', slug: 'deti-obuv-running', parentSlug: 'deti-obuv' },
          { name: 'В спортзал', slug: 'deti-obuv-gym', parentSlug: 'deti-obuv' },
        ]
       },
      { name: 'Одежда', slug: 'deti-odezhda', parentSlug: 'deti',
        dropdown: [
          { name: 'Вся одежда', slug: 'deti-odezhda-vsya-odezhda', parentSlug: 'deti-odezhda' },
          { name: 'Худи & Свитшоты', slug: 'deti-odezhda-hoodies-sweatshirts', parentSlug: 'deti-odezhda' },
          { name: 'Куртки & Жилеты', slug: 'deti-odezhda-jackets-vests', parentSlug: 'deti-odezhda' },
          { name: 'Рубашки', slug: 'deti-odezhda-rubashki', parentSlug: 'deti-odezhda' },
          { name: 'Футболки', slug: 'deti-odezhda-futbolki', parentSlug: 'deti-odezhda' },
          { name: 'Одинаковые комплекты', slug: 'deti-odezhda-matching-sets', parentSlug: 'deti-odezhda' },
          { name: 'Штаны', slug: 'deti-odezhda-shtany', parentSlug: 'deti-odezhda' },
          { name: 'Шорты', slug: 'deti-odezhda-shorty', parentSlug: 'deti-odezhda' },
        ]
       },
      { name: 'Аксессуары', slug: 'deti-aksessuary', parentSlug: 'deti',
        dropdown: [
          { name: 'Головные уборы', slug: 'deti-aksessuary-headwear', parentSlug: 'deti-aksessuary' },
          { name: 'Ремни', slug: 'deti-aksessuary-belts', parentSlug: 'deti-aksessuary' },
          { name: 'Солнцезащитные очки', slug: 'deti-aksessuary-sunglasses', parentSlug: 'deti-aksessuary' },
          { name: 'Сумки & рюкзаки', slug: 'deti-aksessuary-bags', parentSlug: 'deti-aksessuary' },
          { name: 'Часы', slug: 'deti-aksessuary-watches', parentSlug: 'deti-aksessuary' },
        ]
       },
    ]
   }
]

