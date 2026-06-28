// grantMonths must derive the same whole-month count regardless of timezone.
//
// We can't pin the zone via process.env.TZ (V8 caches it before setup files run)
// or via moment-timezone (this Jest setup loads two separate `moment` instances,
// so setDefault never reaches the production copy). timezone-mock instead mocks
// the GLOBAL Date, which every moment instance reads — so it works file-scoped,
// with no global TZ env and no effect on any other test.
//
// timezone-mock has no Asia/Jerusalem (the deploy zone), so we use Europe/London:
// it crosses DST (BST +01:00 → GMT +00:00) the same way, reproducing the identical
// off-by-one that a bare local-time moment() diff produces.
import timezoneMock from "timezone-mock";

import { grantMonths } from "./useData";

describe("grantMonths — DST-crossing grants (mocked Europe/London)", () => {
  beforeAll(() => timezoneMock.register("Europe/London"));
  afterAll(() => timezoneMock.unregister()); // restore the real Date — no leakage

  // Grants are written as end_date = start_date + N months at the same UTC instant
  // (start is a UTC-midnight YYYY-MM-DD). A summer→winter grant crosses the DST
  // change, which a local-time diff would truncate by one month.
  it("counts a 3-month grant crossing DST as 3", () => {
    const grant = {
      start_date: "2024-09-15T00:00:00.000Z",
      end_date: "2024-12-15T00:00:00.000Z", // start + 3 months, same UTC instant
    };
    expect(grantMonths(grant)).toBe(3);
  });

  it("counts a 6-month grant crossing DST as 6", () => {
    const grant = {
      start_date: "2024-09-15T00:00:00.000Z",
      end_date: "2025-03-15T00:00:00.000Z", // start + 6 months, same UTC instant
    };
    expect(grantMonths(grant)).toBe(6);
  });
});
