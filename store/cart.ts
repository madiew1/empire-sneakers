import { create } from 'zustand';

export type CartLine = {
  productId: number;
  variantId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  sizeLabel: string | null;
  previewImage: string | null;
  isFavorite: boolean;
};

export type AddToCartPayload = {
  productId: number;
  variantId: number;
  productName: string;
  unitPrice: number;
  quantity?: number;
  sizeLabel?: string | null;
  previewImage?: string | null;
  isFavorite?: boolean;
};

export type CartSummary = {
  totalAmount: number;
  totalQuantity: number;
};

export type CartState = {
  items: CartLine[];
  summary: CartSummary;
  addItem: (payload: AddToCartPayload) => void;
  getItemByVariant: (variantId: number) => CartLine | undefined;
  removeItem: (variantId: number) => void;
  incrementItemQuantity: (variantId: number, delta?: number) => void;
  decrementItemQuantity: (variantId: number, delta?: number) => void;
  setItemQuantity: (variantId: number, quantity: number) => void;
  toggleItemFavorite: (variantId: number) => void;
};

const normalizeQuantity = (maybeQty: number | undefined) => {
  const value = Number(maybeQty ?? 1);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
};

const computeSummary = (items: CartLine[]): CartSummary =>
  items.reduce<CartSummary>(
    (acc, line) => {
      acc.totalQuantity += line.quantity;
      acc.totalAmount += line.quantity * line.unitPrice;
      return acc;
    },
    { totalQuantity: 0, totalAmount: 0 },
  );

const withUpdatedSummary = (items: CartLine[]) => ({
  items,
  summary: computeSummary(items),
});

type CartLineUpdater = (line: CartLine) => CartLine | null;

const updateItems = (items: CartLine[], variantId: number, updater: CartLineUpdater) => {
  let changed = false;
  const nextItems: CartLine[] = [];

  for (const line of items) {
    if (line.variantId !== variantId) {
      nextItems.push(line);
      continue;
    }

    const updatedLine = updater(line);

    if (updatedLine === null) {
      changed = true;
      continue;
    }

    if (updatedLine !== line) {
      changed = true;
    }

    nextItems.push(updatedLine);
  }

  return changed ? nextItems : items;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  summary: { totalAmount: 0, totalQuantity: 0 },

  addItem: ({
    productId,
    variantId,
    productName,
    unitPrice,
    quantity,
    sizeLabel = null,
    previewImage = null,
    isFavorite = false,
  }) => {
    const safeQuantity = normalizeQuantity(quantity);

    set((state) => {
      const existingLineIndex = state.items.findIndex((line) => line.variantId === variantId);

      if (existingLineIndex === -1) {
        const nextItems = [
          ...state.items,
          {
            productId,
            variantId,
            productName,
            unitPrice,
            quantity: safeQuantity,
            sizeLabel,
            previewImage,
            isFavorite,
          },
        ];

        return withUpdatedSummary(nextItems);
      }

      const nextItems = updateItems(state.items, variantId, (line) => ({
        ...line,
        productName,
        unitPrice,
        sizeLabel: sizeLabel ?? line.sizeLabel,
        previewImage: previewImage ?? line.previewImage,
        quantity: line.quantity + safeQuantity,
      }));

      if (nextItems === state.items) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },

  getItemByVariant: (variantId: number) => get().items.find((line) => line.variantId === variantId),

  removeItem: (variantId: number) => {
    set((state) => {
      const nextItems = state.items.filter((line) => line.variantId !== variantId);

      if (nextItems.length === state.items.length) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },

  incrementItemQuantity: (variantId: number, delta = 1) => {
    const safeDelta = normalizeQuantity(delta);

    set((state) => {
      const nextItems = updateItems(state.items, variantId, (line) => ({
        ...line,
        quantity: line.quantity + safeDelta,
      }));

      if (nextItems === state.items) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },

  decrementItemQuantity: (variantId: number, delta = 1) => {
    const safeDelta = normalizeQuantity(delta);

    set((state) => {
      const nextItems = updateItems(state.items, variantId, (line) => {
        const nextQuantity = line.quantity - safeDelta;
        if (nextQuantity <= 0) {
          return null;
        }

        if (nextQuantity === line.quantity) {
          return line;
        }

        return {
          ...line,
          quantity: nextQuantity,
        };
      });

      if (nextItems === state.items) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },

  setItemQuantity: (variantId: number, quantity: number) => {
    const safeQuantity = normalizeQuantity(quantity);

    set((state) => {
      const nextItems = updateItems(state.items, variantId, (line) => {
        if (line.quantity === safeQuantity) {
          return line;
        }

        return {
          ...line,
          quantity: safeQuantity,
        };
      });

      if (nextItems === state.items) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },

  toggleItemFavorite: (variantId: number) => {
    set((state) => {
      const nextItems = updateItems(state.items, variantId, (line) => ({
        ...line,
        isFavorite: !line.isFavorite,
      }));

      if (nextItems === state.items) {
        return state;
      }

      return withUpdatedSummary(nextItems);
    });
  },
}));

export const selectCartSummary = (state: CartState) => state.summary;

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartSummary = () => useCartStore(selectCartSummary);
