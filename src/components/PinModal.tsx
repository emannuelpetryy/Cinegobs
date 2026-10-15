import React, { useState } from 'react';
import { Lock, X, Delete } from 'lucide-react';
import { validatePin } from '../utils/movieLogic.ts';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  correctPin?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Confirmação de Segurança',
  description = 'Digite o PIN numérico para confirmar a exclusão do perfil (PIN padrão: 123).',
  correctPin = '123',
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setHasError(false);

    if (nextPin.length === correctPin.length) {
      if (validatePin(nextPin, correctPin)) {
        setTimeout(() => {
          setPinInput('');
          onSuccess();
        }, 150);
      } else {
        setHasError(true);
        setTimeout(() => {
          setPinInput('');
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  const handleClear = () => {
    setPinInput('');
    setHasError(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div className="relative w-full max-w-xs bg-[#12151E] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-full transition-colors"
          aria-label="Fechar modal de PIN"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
          <Lock className="w-6 h-6" strokeWidth={1.75} />
        </div>

        <h3 id="pin-modal-title" className="text-lg font-bold text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">
          {description}
        </p>

        {/* PIN Dots indicator */}
        <div
          className={`flex justify-center gap-3 mb-8 ${
            hasError ? 'animate-shake' : ''
          }`}
          data-testid="pin-dots"
        >
          {[0, 1, 2].map((idx) => {
            const isFilled = idx < pinInput.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                  hasError
                    ? 'border-red-500 bg-red-500/40 scale-110'
                    : isFilled
                    ? 'border-violet-400 bg-violet-400 scale-110 shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                    : 'border-white/20 bg-white/5'
                }`}
              />
            );
          })}
        </div>

        {hasError && (
          <p className="text-xs text-red-400 font-medium -mt-5 mb-5" role="alert">
            PIN incorreto. Tente novamente (padrão: 123)
          </p>
        )}

        {/* Numeric Keypad iOS Style */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 flex items-center justify-center text-xl font-semibold text-white transition-all tabular-nums"
              aria-label={`Dígito ${digit}`}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-transparent hover:bg-white/5 text-xs font-medium text-white/50 active:scale-95 flex items-center justify-center transition-all"
            aria-label="Limpar PIN"
          >
            Limpar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 flex items-center justify-center text-xl font-semibold text-white transition-all tabular-nums"
            aria-label="Dígito 0"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-transparent hover:bg-white/5 active:scale-95 flex items-center justify-center text-white/60 hover:text-white transition-all"
            aria-label="Apagar último dígito"
          >
            <Delete className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};
