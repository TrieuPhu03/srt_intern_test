import {
  createTodoSchema,
  idParamSchema,
  listTodoQuerySchema,
  updateTodoSchema,
} from "../../../../src/modules/todos/todo.schema";

const validId = "550e8400-e29b-41d4-a716-446655440000";

describe("createTodoSchema", () => {
  it("accepts a valid title-only payload", () => {
    expect(
      createTodoSchema.safeParse({ body: { title: "Buy milk" }, query: {}, params: {} })
        .success
    ).toBe(true);
  });

  it("accepts a valid payload with description", () => {
    expect(
      createTodoSchema.safeParse({
        body: { title: "Buy milk", description: "Low fat" },
        query: {},
        params: {},
      }).success
    ).toBe(true);
  });

  it("rejects empty, whitespace-only, too long, or missing titles", () => {
    expect(createTodoSchema.safeParse({ body: { title: "" }, query: {}, params: {} }).success).toBe(false);
    expect(createTodoSchema.safeParse({ body: { title: "   " }, query: {}, params: {} }).success).toBe(false);
    expect(
      createTodoSchema.safeParse({
        body: { title: "a".repeat(201) },
        query: {},
        params: {},
      }).success
    ).toBe(false);
    expect(createTodoSchema.safeParse({ body: {}, query: {}, params: {} }).success).toBe(false);
  });

  it("rejects unknown body fields", () => {
    expect(
      createTodoSchema.safeParse({
        body: { title: "Buy milk", priority: "high" },
        query: {},
        params: {},
      }).success
    ).toBe(false);
  });
});

describe("updateTodoSchema", () => {
  it("accepts partial updates", () => {
    expect(
      updateTodoSchema.safeParse({
        params: { id: validId },
        body: { status: "COMPLETED" },
        query: {},
      }).success
    ).toBe(true);
  });

  it("rejects an empty update body", () => {
    expect(
      updateTodoSchema.safeParse({
        params: { id: validId },
        body: {},
        query: {},
      }).success
    ).toBe(false);
  });

  it("rejects invalid UUIDs and invalid status values", () => {
    expect(
      updateTodoSchema.safeParse({
        params: { id: "not-a-uuid" },
        body: { title: "x" },
        query: {},
      }).success
    ).toBe(false);
    expect(
      updateTodoSchema.safeParse({
        params: { id: validId },
        body: { status: "DONE" },
        query: {},
      }).success
    ).toBe(false);
  });
});

describe("idParamSchema", () => {
  it("accepts a valid UUID", () => {
    expect(idParamSchema.safeParse({ params: { id: validId }, body: {}, query: {} }).success).toBe(true);
  });

  it("rejects a non-UUID string", () => {
    expect(idParamSchema.safeParse({ params: { id: "123" }, body: {}, query: {} }).success).toBe(false);
  });
});

describe("listTodoQuerySchema", () => {
  it("accepts an empty query", () => {
    expect(listTodoQuerySchema.safeParse({ query: {}, params: {}, body: {} }).success).toBe(true);
  });

  it("accepts valid filters and sorting options", () => {
    expect(
      listTodoQuerySchema.safeParse({
        query: {
          search: "milk",
          status: "PENDING",
          page: "2",
          limit: "20",
          sortBy: "title",
          sortOrder: "asc",
        },
        params: {},
        body: {},
      }).success
    ).toBe(true);
  });

  it("rejects invalid status, page, sortBy, and unknown query fields", () => {
    expect(
      listTodoQuerySchema.safeParse({ query: { status: "INVALID" }, params: {}, body: {} })
        .success
    ).toBe(false);
    expect(
      listTodoQuerySchema.safeParse({ query: { page: "abc" }, params: {}, body: {} })
        .success
    ).toBe(false);
    expect(
      listTodoQuerySchema.safeParse({
        query: { sortBy: "randomField" },
        params: {},
        body: {},
      }).success
    ).toBe(false);
    expect(
      listTodoQuerySchema.safeParse({ query: { includeDeleted: "true" }, params: {}, body: {} })
        .success
    ).toBe(false);
  });
});
