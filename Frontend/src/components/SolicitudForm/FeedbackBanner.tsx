import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface FeedbackBannerProps {
  variant: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export const FeedbackBanner = ({ variant, title, message, onClose }: FeedbackBannerProps) => {
  const isSuccess = variant === 'success';

  return (
    <div
      role="status"
      className={`w-full p-6 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${
        isSuccess ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-red-500/10 border-red-500/40'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isSuccess ? <FaCheckCircle size={22} /> : <FaExclamationTriangle size={22} />}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={`font-sport text-lg uppercase ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
            {title}
          </h3>
          <p className="text-sm text-neutral-200">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`h-10 px-4 rounded-lg bg-[#161616] hover:bg-[#1f1f1f] font-semibold text-xs shrink-0 ${
          isSuccess ? 'text-white' : 'text-red-400'
        }`}
      >
        {isSuccess ? 'CERRAR' : 'REINTENTAR'}
      </button>
    </div>
  );
};

export default FeedbackBanner;
