import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { X, Upload, Check, Camera, Sparkles } from 'lucide-react';
import { Profile } from '../types/index.ts';
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from '../data/avatars.ts';
import { AvatarDisplay } from './AvatarDisplay.tsx';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: { name: string; avatarUrl: string; accentColor: string }) => void;
  initialProfile?: Profile | null;
}

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
  const [name, setName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>(AVATAR_OPTIONS[0].url);
  const [accentColor, setAccentColor] = useState<string>(ACCENT_COLORS[0].hex);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize modal state on open or profile change
  useEffect(() => {
    if (isOpen) {
      if (initialProfile) {
        setName(initialProfile.name || '');
        setAvatarUrl(initialProfile.avatarUrl || AVATAR_OPTIONS[0].url);
        setAccentColor(initialProfile.accentColor || ACCENT_COLORS[0].hex);
      } else {
        setName('');
        setAvatarUrl(AVATAR_OPTIONS[0].url);
        setAccentColor(ACCENT_COLORS[0].hex);
      }
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  // Filter avatars based on selected category
  const filteredAvatars = activeCategory === 'Todos'
    ? AVATAR_OPTIONS
    : AVATAR_OPTIONS.filter((av) => av.category === activeCategory);

  // Process user uploaded photo through HTML5 Canvas with auto center crop
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas');
          const size = 256;
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

            const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setAvatarUrl(croppedDataUrl);
          }
        } catch (err) {
          console.warn('Erro ao processar imagem:', err);
        } finally {
          setIsProcessingPhoto(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      img.onerror = () => {
        setIsProcessingPhoto(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#11141D] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow backdrop */}
        <div
          className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <h2 id="profile-modal-title" className="text-lg sm:text-xl font-bold text-white">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar preview and upload */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-3">
              <div
                className="w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all p-1 shadow-xl bg-[#0B0D14]"
                style={{ borderColor: accentColor }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <AvatarDisplay
                    avatar={avatarUrl}
                    name="Avatar selecionado"
                    className="w-full h-full"
                  />
                </div>
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
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{isProcessingPhoto ? 'Recortando foto...' : 'Carregar Foto Própria'}</span>
            </button>
            <p className="text-[10px] text-white/40 mt-1">
              Galeria ou câmera do dispositivo com recorte central inteligente
            </p>
          </div>

          {/* Full Avatar Gallery with Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-white/80">
                Galeria de Avatares Cinegobetti
              </label>
              <span className="text-[10px] text-white/40">
                {filteredAvatars.length} opções
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2.5">
              {AVATAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-[#0B0D14]/70 border border-white/5">
              {filteredAvatars.map((av) => {
                const isSelected = avatarUrl === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarUrl(av.url)}
                    title={av.name}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-transform duration-150 active:scale-95 p-0.5 bg-[#151926] ${
                      isSelected
                        ? 'border-violet-400 scale-105 shadow-md shadow-violet-500/30 ring-2 ring-violet-500/40'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div className="w-full h-full rounded-[14px] overflow-hidden">
                      <AvatarDisplay
                        avatar={av.url}
                        name={av.name}
                        className="w-full h-full"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
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
              placeholder="Ex: Manu, Gio, Irmão, Pipoca..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#171B26] border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 text-sm transition-all"
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
                    accentColor === col.hex ? 'scale-110 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100'
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
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all border border-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>{initialProfile ? 'Salvar Alterações' : 'Criar Perfil'}</span>
            </button>
          </div>
        </form>

        {/* Hidden canvas for auto-crop */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
