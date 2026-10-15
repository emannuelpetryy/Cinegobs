import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Plus, Trash2, Edit2, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Profile } from '../types/index.ts';
import { PinModal } from './PinModal.tsx';
import { ProfileModal } from './ProfileModal.tsx';
import { AvatarDisplay } from './AvatarDisplay.tsx';
import { MOVIES_DATA } from '../data/movies.ts';

interface CinemaWelcomeScreenProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (data: { name: string; avatarUrl: string; accentColor: string }) => void;
  onUpdateProfile: (id: string, data: { name: string; avatarUrl: string; accentColor: string }) => void;
  onDeleteProfile: (id: string) => void;
}

export const CinemaWelcomeScreen: React.FC<CinemaWelcomeScreenProps> = ({
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

  // Parallax tilt tracking for desktop
  const [tilt, setTilt] = useState<{ id: string | null; x: number; y: number }>({
    id: null,
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ id, x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ id: null, x: 0, y: 0 });
  };

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

  // Sample backdrop posters for subtle ambient poster wall
  const ambientPosters = MOVIES_DATA.slice(0, 10).map((m) => m.posterUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden bg-[#07080C]"
      data-testid="welcome-screen"
    >
      {/* Background Poster Wall (Subtle ambient depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.14] scale-105 filter blur-[2px]">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 w-[120%] -ml-[10%] -mt-[5%]">
          {ambientPosters.concat(ambientPosters).map((url, idx) => (
            <div key={idx} className="aspect-[2/3] rounded-xl overflow-hidden bg-[#151821]">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Projector Spotlight and Radial Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07080C]/80 to-[#07080C] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-violet-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07080C_85%)] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-4 sm:pt-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/imgs/logo.png"
            alt="Cinegobetti"
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(139,92,246,0.35)]"
          />
          <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            PRO
          </span>
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
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>Concluir</span>
            </>
          ) : (
            <>
              <Settings2 className="w-4 h-4" strokeWidth={1.75} />
              <span>Gerenciar</span>
            </>
          )}
        </button>
      </header>

      {/* Center Hero: "Quem está assistindo?" */}
      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center my-auto py-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
            <span>Sessão de Cinema Pessoal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Quem está assistindo?
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-md mx-auto">
            {isManaging
              ? 'Toque em um perfil para editar foto e nome, ou no botão vermelho para excluir.'
              : 'Escolha seu perfil para acessar seu catálogo, avaliações e ver as notas dos amigos.'}
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl px-4">
          <AnimatePresence>
            {profiles.map((profile) => {
              const isTilted = tilt.id === profile.id;
              const completedCount = Object.values(profile.list || {}).filter(
                (item) => item.status === 'completed'
              ).length;

              return (
                <motion.div
                  key={profile.id}
                  layout
                  className="group flex flex-col items-center"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onMouseMove={(e) => handleMouseMove(e, profile.id)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        if (isManaging) {
                          setEditingProfile(profile);
                        } else {
                          onSelectProfile(profile);
                        }
                      }}
                      style={{
                        transform: isTilted
                          ? `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.04, 1.04, 1.04)`
                          : undefined,
                        boxShadow: `0 14px 40px -10px ${profile.accentColor}40`,
                      }}
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 transition-all duration-200 transform group-hover:scale-105 active:scale-94 focus:outline-none focus:ring-4 focus:ring-violet-500/50 shadow-2xl bg-[#11131C] border border-white/10"
                      aria-label={`Entrar no perfil de ${profile.name}`}
                    >
                      {/* Shared Element Avatar with motion layoutId */}
                      <motion.div
                        layoutId={`avatar-${profile.id}`}
                        className="w-full h-full rounded-[22px] overflow-hidden border-2 border-white/20 group-hover:border-white transition-colors"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      >
                        <AvatarDisplay
                          avatar={profile.avatarUrl}
                          name={profile.name}
                          className="w-full h-full"
                        />
                      </motion.div>

                      {/* Apple specular sheen overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      {isManaging && (
                        <div className="absolute inset-0 bg-black/65 rounded-3xl flex items-center justify-center text-white backdrop-blur-[2px]">
                          <Edit2 className="w-6 h-6 text-white" strokeWidth={1.75} />
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
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 border-2 border-[#07080C]"
                        title="Excluir perfil (requer PIN)"
                        aria-label={`Excluir perfil de ${profile.name}`}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isManaging) {
                        setEditingProfile(profile);
                      } else {
                        onSelectProfile(profile);
                      }
                    }}
                    className="mt-3 flex flex-col items-center focus:outline-none"
                    aria-label={`Entrar no perfil de ${profile.name}`}
                  >
                    <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors text-center line-clamp-1">
                      {profile.name}
                    </span>
                    <span className="text-[11px] text-white/40 tabular-nums">
                      {completedCount} assistidos
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Profile Button */}
          {profiles.length < 6 && (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-dashed border-white/20 hover:border-violet-400 bg-white/5 hover:bg-violet-500/10 transition-all flex flex-col items-center justify-center text-white/50 hover:text-white group active:scale-94"
                aria-label="Criar novo perfil"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" strokeWidth={1.75} />
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
      <footer className="relative z-10 w-full text-center pb-4 text-xs text-white/40 font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-400" strokeWidth={1.75} />
        <span>Cinegobetti Privado • Sincronização Local e em Nuvem</span>
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
    </motion.div>
  );
};
