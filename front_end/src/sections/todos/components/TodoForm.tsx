import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Todo } from "../types/todo.types";

const todoSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }).max(200),
  description: z.string().trim().max(1000).optional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialValues?: Todo | null;
  onSubmit: (values: TodoFormValues) => Promise<void>;
  onCancel: () => void;
}

const TodoForm = ({ initialValues, onSubmit, onCancel }: TodoFormProps) => {
  const { t } = useTranslation();
  const isEditing = Boolean(initialValues);

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    });
  }, [form, initialValues]);

  const handleSubmit = async (values: TodoFormValues) => {
    await onSubmit({
      title: values.title,
      description: values.description || undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("todos.field_title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("todos.title_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("todos.field_description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("todos.description_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("todos.cancel")}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isEditing ? t("todos.submit_update") : t("todos.submit_create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TodoForm;
