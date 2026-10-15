import React, { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Check, Camera, Sparkles } from 'lucide-react';
import { Profile } from '../types/index.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: { name: string; avatarUrl: string; accentColor: string }) => void;
  initialProfile?: Profile | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
];

const ACCENT_COLORS = [
  { name: 'Violeta Cinema', hex: '#8B5CF6' },
  { name: 'Dourado Oscar', hex: '#F59E0B' },
  { name: 'Esmeralda', hex: '#10B981' },
  { name: 'Ciano Neon', hex: '#06B6D4' },
  { name: 'Rubi Carmim', hex: '#F43F5E' },
  { name: 'Safira Apple', hex: '#3B82F6' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    initialProfile?.avatarUrl || PRESET_AVATARS[0]
  );
  const [accentColor, setAccentColor] = useState<string>(
    initialProfile?.accentColor || ACCENT_COLORS[0].hex
  );
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  // Process user uploaded photo through HTML5 Canvas with auto center crop
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Crop square center
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(croppedDataUrl);
        }
        setIsProcessingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      avatarUrl,
      accentColor,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#11141D] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow backdrop */}
        <div
          className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <h2 id="profile-modal-title" className="text-xl font-bold text-white">
              {initialProfile ? 'Editar Perfil' : 'Novo Perfil'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar preview and upload */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-3">
              <div
                className="w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all p-1 shadow-lg"
                style={{ borderColor: accentColor }}
              >
                <img
                  src={avatarUrl}
                  alt="Avatar do perfil"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity"
                aria-label="Trocar foto do perfil"
              >
                <Camera className="w-5 h-5 mb-1" strokeWidth={1.75} />
                <span>Upload</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{isProcessingPhoto ? 'Recortando...' : 'Carregar Foto Personalizada'}</span>
            </button>
            <p className="text-[11px] text-white/40 mt-1">
              Recorte automático em alta definição
            </p>
          </div>

          {/* Preset Avatars */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-2">
              Ou escolha um avatar:
            </label>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-11 h-11 rounded-2xl overflow-hidden border-2 transition-transform active:scale-95 shrink-0 ${
                    avatarUrl === url
                      ? 'scale-105 border-white ring-2 ring-white/30'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Escolher avatar preset ${idx + 1}`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Profile Name */}
          <div>
            <label htmlFor="profile-name-input" className="block text-xs font-semibold text-white/80 mb-2">
              Nome do Perfil
            </label>
            <input
              id="profile-name-input"
              type="text"
              required
              maxLength={24}
              placeholder="Ex: João, Cineasta, Pipoca..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#171B26] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 text-sm transition-all"
            />
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">
              Cor de Destaque
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setAccentColor(col.hex)}
                  title={col.name}
                  className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                    accentColor === col.hex ? 'scale-110 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  aria-label={`Cor ${col.name}`}
                >
                  {accentColor === col.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-all border border-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={1.75} />
              <span>{initialProfile ? 'Salvar' : 'Criar Perfil'}</span>
            </button>
          </div>
        </form>

        {/* Hidden canvas for auto-crop */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
