import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  recommended?: boolean;
  hint?: string;
  error?: string;
}

const fieldBase =
  'w-full bg-[#1c1c1c] border border-[#262626] px-4 rounded-lg text-white placeholder:text-neutral-500 text-sm focus:ring-1 focus:ring-[#E8C766]/60 focus:border-[#E8C766]/60 focus:outline-none transition-all';

export const FormField = ({
  label,
  required,
  recommended,
  hint,
  error,
  id,
  ...inputProps
}: FormFieldProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-semibold text-white flex items-center gap-1.5">
      {label}
      {required && <span className="text-[#E8C766]">*</span>}
      {recommended && !required && (
        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400/80">
          Recomendado
        </span>
      )}
    </label>
    <input
      id={id}
      className={`${fieldBase} h-12 ${error ? 'ring-1 ring-red-500 border-red-500' : ''}`}
      aria-invalid={Boolean(error)}
      {...inputProps}
    />
    {error ? (
      <span className="text-xs text-red-400">{error}</span>
    ) : hint ? (
      <span className="text-xs text-neutral-500">{hint}</span>
    ) : null}
  </div>
);

interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const FormTextArea = ({ label, hint, id, ...textareaProps }: FormTextAreaProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-semibold text-white">
      {label}
    </label>
    <textarea id={id} rows={3} className={`${fieldBase} py-3`} {...textareaProps} />
    {hint && <span className="text-xs text-neutral-500">{hint}</span>}
  </div>
);

export default FormField;
