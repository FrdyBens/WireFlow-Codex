import { PrismaClient, PricingItem } from '@prisma/client';

export const pricingDb = new PrismaClient();

export type PricingItemInput = Omit<PricingItem, 'price'> & { price: number };

export const upsertPricingItems = async (items: PricingItemInput[]) => {
  await pricingDb.$transaction(
    items.map((item) =>
      pricingDb.pricingItem.upsert({
        where: { sku: item.sku },
        create: item,
        update: item
      })
    )
  );
};

export const getPricingItems = async () => {
  return pricingDb.pricingItem.findMany();
};
