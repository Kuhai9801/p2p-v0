import { Divider } from "@/components/ui/divider"

interface PaymentAmountRecipientCardProps {
  amountLabel: string
  amountValue: string
  recipientLabel: string
  recipientValue: string
}

export const PaymentAmountRecipientCard = ({
  amountLabel,
  amountValue,
  recipientLabel,
  recipientValue,
}: PaymentAmountRecipientCardProps) => (
  <div className="rounded-2xl border border-grayscale-200 bg-slate-75">
    <div className="p-4">
      <p className="text-xs text-grayscale-text-muted">{amountLabel}</p>
      <p className="text-base font-bold text-slate-1200">{amountValue}</p>
    </div>
    <Divider className="bg-slate-300" />
    <div className="p-4">
      <p className="text-xs text-grayscale-text-muted">{recipientLabel}</p>
      <p className="text-base font-bold text-slate-1200">{recipientValue}</p>
    </div>
  </div>
)
