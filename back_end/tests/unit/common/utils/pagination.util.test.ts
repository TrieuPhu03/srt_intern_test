import { parsePagination } from "../../../../src/common/utils/pagination.util";

describe("parsePagination", () => {
  it("defaults to page 1, limit 10, sortBy createdAt, and sortOrder desc", () => {
    expect(parsePagination({})).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("computes skip for later pages", () => {
    expect(parsePagination({ page: "3", limit: "10" }).skip).toBe(20);
  });

  it("clamps page below 1 back to 1", () => {
    expect(parsePagination({ page: "-5" }).page).toBe(1);
    expect(parsePagination({ page: "0" }).page).toBe(1);
  });

  it("clamps limit into the supported 1 to 100 range", () => {
    expect(parsePagination({ limit: "-10" }).limit).toBe(1);
    expect(parsePagination({ limit: "500" }).limit).toBe(100);
  });

  it("falls back to createdAt when sortBy is not allowed", () => {
    expect(parsePagination({ sortBy: "updatedAt" }).sortBy).toBe("createdAt");
  });

  it("accepts all supported sort fields", () => {
    expect(parsePagination({ sortBy: "createdAt" }).sortBy).toBe("createdAt");
    expect(parsePagination({ sortBy: "title" }).sortBy).toBe("title");
    expect(parsePagination({ sortBy: "status" }).sortBy).toBe("status");
  });

  it("falls back to desc unless sortOrder is asc", () => {
    expect(parsePagination({ sortOrder: "banana" }).sortOrder).toBe("desc");
    expect(parsePagination({ sortOrder: "desc" }).sortOrder).toBe("desc");
    expect(parsePagination({ sortOrder: "asc" }).sortOrder).toBe("asc");
  });

  it("uses defaults for non-numeric page and limit values", () => {
    const result = parsePagination({ page: "abc", limit: "xyz" });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
