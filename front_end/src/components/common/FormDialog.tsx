import { memo, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  error?: string | null;
  children: ReactNode;
  contentClassName?: string;
  errorClassName?: string;
}

const FormDialog = ({
  open,
  onOpenChange,
  title,
  error,
  children,
  contentClassName,
  errorClassName,
}: FormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {error ? (
          <div
            className={cn(
              "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
              errorClassName,
            )}
          >
            {error}
          </div>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default memo(FormDialog);
