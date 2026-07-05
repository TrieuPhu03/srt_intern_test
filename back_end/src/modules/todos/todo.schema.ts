import { z } from "zod";

const todoStatusSchema = z.enum(["PENDING", "COMPLETED"]);

export const createTodoSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1, "Title is required").max(200),
      description: z.string().trim().max(1000).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid todo id"),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().max(1000).optional(),
      status: todoStatusSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  query: z.object({}).optional(),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid todo id"),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const listTodoQuerySchema = z.object({
  query: z
    .object({
      search: z.string().trim().max(200).optional(),
      status: todoStatusSchema.optional(),
      page: z.string().regex(/^-?\d+$/).optional(),
      limit: z.string().regex(/^-?\d+$/).optional(),
      sortBy: z.enum(["createdAt", "title", "status"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});
