import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-theme-input rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform animate-in zoom-in-95 duration-200 border border-theme-glass-border transition-colors duration-300">
        <div className="flex items-center justify-between p-6 border-b border-theme-glass-border">
          <h3 className="text-xl font-bold text-theme-base">{t('termsTitle')}</h3>
          <button
            onClick={onClose}
            className="text-theme-muted hover:text-theme-base transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-theme-muted leading-relaxed whitespace-pre-wrap text-base md:text-lg">
            {t('termsContent')}
          </p>
        </div>
        <div className="p-6 bg-theme-glass bg-opacity-10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
