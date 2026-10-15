import React, { useState } from 'react';
import { Plus, Settings2, Trash2, Edit2, Film, Check, Sparkles } from 'lucide-react';
import { Profile } from '../types/index.ts';
import { LiquidGlassCanvas } from './LiquidGlassCanvas.tsx';
import { PinModal } from './PinModal.tsx';
import { ProfileModal } from './ProfileModal.tsx';

interface WelcomeScreenProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (data: { name: string; avatarUrl: string; accentColor: string }) => void;
  onUpdateProfile: (id: string, data: { name: string; avatarUrl: string; accentColor: string }) => void;
  onDeleteProfile: (id: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  profiles,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
}) => {
  const [isManaging, setIsManaging] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  const handleStartDelete = (profile: Profile) => {
    setProfileToDelete(profile);
    setIsPinModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      onDeleteProfile(profileToDelete.id);
      setProfileToDelete(null);
    }
    setIsPinModalOpen(false);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden bg-[#090A0F]"
      data-testid="welcome-screen"
    >
      {/* Liquid Glass Displacement Shader (Wabi Optics) */}
      <LiquidGlassCanvas intensity={1.15} />

      {/* Subtle radial darkening gradient over canvas so text is ultra-legible */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#090A0F]/50 to-[#090A0F]/90 pointer-events-none" />

      {/* Top Header / Brand */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-amber-500 p-[1.5px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-[#0E1017] rounded-2xl flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Cinegobetti</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-white/50 font-medium">Sua Lista de Filmes</p>
          </div>
        </div>

        <button
          onClick={() => setIsManaging(!isManaging)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border ${
            isManaging
              ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-white/5 text-white/80 hover:text-white border-white/10 hover:bg-white/10'
          }`}
          aria-label={isManaging ? 'Concluir gerenciamento' : 'Gerenciar perfis'}
        >
          {isManaging ? (
            <>
              <Check className="w-4 h-4" />
              <span>Concluir</span>
            </>
          ) : (
            <>
              <Settings2 className="w-4 h-4" />
              <span>Gerenciar</span>
            </>
          )}
        </button>
      </header>

      {/* Center Hero: "Quem está assistindo?" */}
      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center my-auto py-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Experiência Cinematográfica Pessoal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Quem está assistindo?
          </h2>
          <p className="text-sm text-white/50 mt-2 max-w-md mx-auto">
            {isManaging
              ? 'Edite dados ou toque no ícone para excluir (requer PIN).'
              : 'Selecione seu perfil para acessar sua lista de filmes, avaliações e recomendações.'}
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl px-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="group flex flex-col items-center transition-transform"
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (isManaging) {
                      setEditingProfile(profile);
                    } else {
                      onSelectProfile(profile);
                    }
                  }}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 transition-all duration-300 transform group-hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-violet-500/50 shadow-2xl"
                  style={{
                    backgroundColor: `${profile.accentColor}20`,
                    boxShadow: `0 10px 30px -10px ${profile.accentColor}40`,
                  }}
                  aria-label={`Entrar no perfil de ${profile.name}`}
                >
                  <div className="w-full h-full rounded-[22px] overflow-hidden border-2 border-white/20 group-hover:border-white transition-all">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {isManaging && (
                    <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center text-white">
                      <Edit2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>

                {/* Delete button in managing mode */}
                {isManaging && profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDelete(profile);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 border-2 border-[#090A0F]"
                    title="Excluir perfil (requer PIN)"
                    aria-label={`Excluir perfil de ${profile.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="mt-3 text-sm font-semibold text-white/90 group-hover:text-white transition-colors text-center line-clamp-1">
                {profile.name}
              </span>
              <span className="text-[11px] text-white/40 tabular-nums">
                {Object.keys(profile.list || {}).length} títulos
              </span>
            </div>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 6 && (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-dashed border-white/20 hover:border-violet-400 bg-white/5 hover:bg-violet-500/10 transition-all flex flex-col items-center justify-center text-white/50 hover:text-white group active:scale-95"
                aria-label="Criar novo perfil"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
              </button>
              <span className="mt-3 text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                Novo Perfil
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 w-full text-center pb-4 text-xs text-white/40 font-medium">
        <span>Toque na tela para deslocar o vidro líquido óptico • Benchmark Apple HIG & Letterboxd</span>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={(data) => {
          onCreateProfile(data);
          setIsCreateOpen(false);
        }}
      />

      {editingProfile && (
        <ProfileModal
          isOpen={true}
          initialProfile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={(data) => {
            onUpdateProfile(editingProfile.id, data);
            setEditingProfile(null);
          }}
        />
      )}

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleConfirmDelete}
        title="Excluir Perfil"
        description={`Confirme a exclusão do perfil "${profileToDelete?.name}". Todas as avaliações deste perfil serão removidas.`}
      />
    </div>
  );
};
