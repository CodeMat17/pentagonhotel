import { describe, expect, it } from "vitest";

import { calculatePrice } from "../lib/booking";
import type { ExtraService, RoomSummary } from "../lib/content";
import { pricingCases } from "./pricing-cases";

/**
 * The website's half of the pricing agreement — see `pricing-cases.ts` for why
 * these cases exist and what to do when the rules change.
 *
 * The summary a guest watches while they book has to land on the same naira as
 * the server's `priceStay`, or they are quoted one number and charged another.
 */
describe("calculatePrice", () => {
  for (const stay of pricingCases) {
    it(stay.name, () => {
      const extras: ExtraService[] = stay.extras.map((extra, index) => ({
        id: `extra-${index}`,
        price: extra.price,
        unit: extra.unit,
      })) as ExtraService[];

      const price = calculatePrice({
        room: { rate: stay.rate } as RoomSummary,
        nights: stay.nights,
        roomCount: stay.roomCount,
        extraIds: extras.map((extra) => extra.id),
        extras,
        promo: stay.discountRate
          ? { code: "TEST", discount: stay.discountRate, label: "Test promo" }
          : null,
        taxRates: { vatRate: stay.vatRate, serviceRate: stay.serviceRate },
      });

      expect({
        roomSubtotal: price.roomSubtotal,
        extrasSubtotal: price.extrasSubtotal,
        discount: price.discount,
        vat: price.vat,
        serviceCharge: price.serviceCharge,
        total: price.total,
      }).toEqual(stay.expected);
    });
  }
});
