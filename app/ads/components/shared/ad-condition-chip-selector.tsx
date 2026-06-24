"use client"

import { useTranslations } from "@/lib/i18n/use-translations"
import { cn } from "@/lib/utils"

interface AdConditionChipSelectorProps {
  value: number | null
  onValueChange: (value: number | null) => void
  options: readonly number[]
  labelFor: (option: number) => string
  className?: string
}

export default function AdConditionChipSelector({
  value,
  onValueChange,
  options,
  labelFor,
  className,
}: AdConditionChipSelectorProps) {
  const { t } = useTranslations()

  const chips: Array<{ key: string; value: number | null; label: string }> = [
    { key: "any", value: null, label: t("adForm.conditionAny") },
    ...options.map((option) => ({
      key: String(option),
      value: option,
      label: labelFor(option),
    })),
  ]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {chips.map((chip) => {
        const isSelected = chip.value === value
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onValueChange(chip.value)}
            aria-pressed={isSelected}
            className={cn(
              "flex-1 h-10 rounded-full text-base font-normal transition-colors",
              "border-[1.5px] text-grayscale-100",
              isSelected
                ? "bg-grayscale-500 border-black"
                : "bg-transparent border-grayscale-400",
            )}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
