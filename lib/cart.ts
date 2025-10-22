import { CartLine } from '@/store/cart';

export const CART_TAX_RATE = 0.05;

const cartPluralRules = new Intl.PluralRules('ru-RU');
const cartItemsDictionary: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'товар',
  few: 'товара',
  many: 'товаров',
  other: 'товаров',
};
const fallbackCartItemsWord = 'товаров';

export const formatCartTitle = (itemCount: number) => {
  if (itemCount <= 0) {
    return 'Корзина';
  }

  const pluralCategory = cartPluralRules.select(itemCount);
  const noun = cartItemsDictionary[pluralCategory] ?? fallbackCartItemsWord;

  return `В корзине ${itemCount} ${noun}`;
};

export const calculateTaxAmount = (totalAmount: number, taxRate = CART_TAX_RATE) => totalAmount * taxRate;

export const getCartLineTotal = (line: Pick<CartLine, 'unitPrice' | 'quantity'>) =>
  line.unitPrice * line.quantity;
