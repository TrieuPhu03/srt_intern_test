import { memo, useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_DEBOUNCE_MS = 400;

interface SearchInputProps {
  value: string;
  onDebouncedChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  inputClassName?: string;
}

const SearchInput = ({
  value,
  onDebouncedChange,
  ariaLabel,
  placeholder,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  className,
  inputClassName,
}: SearchInputProps) => {
  const [draftValue, setDraftValue] = useState(value);
  const isFirstDebounce = useRef(true);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    if (isFirstDebounce.current) {
      isFirstDebounce.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      onDebouncedChange(draftValue);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, draftValue, onDebouncedChange]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDraftValue(event.target.value);
  }, []);

  return (
    <label className={cn("relative flex-1", className)}>
      <span className="sr-only">{ariaLabel}</span>
      <Search
        data-icon="inline-start"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={draftValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-9", inputClassName)}
      />
    </label>
  );
};

export default memo(SearchInput);
