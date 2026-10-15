import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Dices,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  Tv,
  Bookmark,
  ChevronRight,
  Brain,
  Zap,
  Heart,
  Moon,
  Smile,
  Palette,
  Film,
  Flame,
  Compass,
  Check,
} from 'lucide-react';
import { Movie, DiscoverSurvey, UserMovieData } from '../types/index.ts';
import { recommendMovie, formatRuntime } from '../utils/movieLogic.ts';
import { StreamingIcon } from './StreamingIcons.tsx';

interface DiscoverWizardProps {
  movies: Movie[];
  onOpenMovie: (movie: Movie) => void;
  onAddToWatchlist: (movieId: string) => void;
  userList: Record<string, UserMovieData>;
}

interface MoodOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  desc: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'qualquer',
    label: 'Surpreenda-me',
    icon: Sparkles,
    desc: 'Aberto a qualquer experiência de alto impacto',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/30',
  },
  {
    id: 'pensativo',
    label: 'Pensativo & Filosófico',
    icon: Brain,
    desc: 'Roteiros profundos que ecoam na mente por dias',
    accentBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-400',
    accentBorder: 'border-indigo-500/30',
  },
  {
    id: 'adrenalina',
    label: 'Pura Adrenalina',
    icon: Flame,
    desc: 'Ritmo acelerado, perseguições ou tensão contínua',
    accentBg: 'bg-rose-500/10',
    accentText: 'text-rose-400',
    accentBorder: 'border-rose-500/30',
  },
  {
    id: 'emocionante',
    label: 'Emocionante & Tocante',
    icon: Heart,
    desc: 'Histórias humanas e conexão sincera',
    accentBg: 'bg-pink-500/10',
    accentText: 'text-pink-400',
    accentBorder: 'border-pink-500/30',
  },
  {
    id: 'sombrio',
    label: 'Sombrio & Misterioso',
    icon: Moon,
    desc: 'Suspense psicológico, crime ou atmosfera densa',
    accentBg: 'bg-purple-500/10',
    accentText: 'text-purple-300',
    accentBorder: 'border-purple-500/30',
  },
  {
    id: 'descontraido',
    label: 'Leve & Divertido',
    icon: Smile,
    desc: 'Para relaxar o cérebro, dar risadas ou assistir em família',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
  },
  {
    id: 'fascinante',
    label: 'Visualmente Fascinante',
    icon: Palette,
    desc: 'Direção de arte estonteante, fotografia épica e estética',
    accentBg: 'bg-cyan-500/10',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
  },
];

const TIME_OPTIONS = [
  {
    id: 'qualquer',
    label: 'Tanto Faz',
    icon: Clock,
    desc: 'O tempo que a história precisar levar',
    accentBg: 'bg-white/10',
    accentText: 'text-white/80',
  },
  {
    id: 'rapido',
    label: 'Direto ao Ponto (< 90 min)',
    icon: Zap,
    desc: 'Filmes curtos ou episódios ágeis',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
  },
  {
    id: 'medio',
    label: 'Padrão (90 - 130 min)',
    icon: Film,
    desc: 'A clássica duração das melhores salas de cinema',
    accentBg: 'bg-violet-500/10',
    accentText: 'text-violet-400',
  },
  {
    id: 'epico',
    label: 'Experiência Épica (> 2h20)',
    icon: Flame,
    desc: 'Narrativas monumentais e clássicos grandiosos',
    accentBg: 'bg-red-500/10',
    accentText: 'text-red-400',
  },
  {
    id: 'serie',
    label: 'Maratonar uma Série',
    icon: Tv,
    desc: 'Mergulho contínuo de múltiplos episódios',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-400',
  },
];

const PLATFORM_OPTIONS = [
  { id: 'qualquer', label: 'Qualquer Streaming', type: 'lucide' as const },
  { id: 'netflix', label: 'Netflix', type: 'streaming' as const },
  { id: 'prime', label: 'Prime Video', type: 'streaming' as const },
  { id: 'max', label: 'Max', type: 'streaming' as const },
  { id: 'appletv', label: 'Apple TV+', type: 'streaming' as const },
  { id: 'disney', label: 'Disney+', type: 'streaming' as const },
];

export const DiscoverWizard: React.FC<DiscoverWizardProps> = ({
  movies,
  onOpenMovie,
  onAddToWatchlist,
  userList,
}) => {
  const [step, setStep] = useState<number>(1);
  const [survey, setSurvey] = useState<DiscoverSurvey>({
    mood: 'qualquer',
    timeLimit: 'qualquer',
    platform: 'qualquer',
  });
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [recommendedMovie, setRecommendedMovie] = useState<Movie | null>(null);
  const [shuffleMovie, setShuffleMovie] = useState<Movie | null>(null);
  const [shufflePoster, setShufflePoster] = useState<string>('');
  const [isDecelerating, setIsDecelerating] = useState<boolean>(false);

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      runRoulette();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const runRoulette = () => {
    setStep(4);
    setIsShuffling(true);
    setIsDecelerating(false);
    setRecommendedMovie(null);

    // Realistic slot-machine deceleration curve (total ~3.2 seconds)
    const delays = [
      45, 45, 50, 50, 50, 55, 55, 60, 65, 70, 80, 90,
      105, 125, 150, 185, 230, 290, 360, 460, 580
    ];
    let stepIndex = 0;

    const tick = () => {
      const randIndex = Math.floor(Math.random() * movies.length);
      const candidate = movies[randIndex];
      setShuffleMovie(candidate);
      setShufflePoster(candidate?.posterUrl || '');

      stepIndex++;
      if (stepIndex > 14) {
        setIsDecelerating(true);
      }

      if (stepIndex < delays.length) {
        setTimeout(tick, delays[stepIndex]);
      } else {
        // Dramatic final suspense pause before the champion match reveals
        setTimeout(() => {
          const result = recommendMovie(movies, survey);
          setRecommendedMovie(result);
          setIsShuffling(false);
          setIsDecelerating(false);
        }, 400);
      }
    };

    tick();
  };

  const handleReroll = () => {
    runRoulette();
  };

  const handleReset = () => {
    setSurvey({
      mood: 'qualquer',
      timeLimit: 'qualquer',
      platform: 'qualquer',
    });
    setRecommendedMovie(null);
    setStep(1);
  };

  const isMovieInWatchlist = recommendedMovie
    ? userList[recommendedMovie.id]?.status === 'watchlist'
    : false;

  return (
    <div className="w-full max-w-xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6" data-testid="discover-wizard">
      {/* Wizard Progress Bar with full span across 100% width */}
      <div className="w-full flex items-center mb-7 sm:mb-8">
        {[
          { num: 1, label: 'Humor' },
          { num: 2, label: 'Tempo' },
          { num: 3, label: 'Onde' },
          { num: 4, label: 'Sortear' },
        ].map((item, idx) => {
          const isPassed = step > item.num;
          const isCurrent = step === item.num;

          return (
            <React.Fragment key={item.num}>
              {/* Step indicator circle node */}
              <button
                type="button"
                onClick={() => {
                  if (item.num < step) setStep(item.num);
                }}
                disabled={item.num > step}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-600/40 ring-4 ring-violet-500/20 scale-110 z-10'
                    : isPassed
                    ? 'bg-violet-600 text-white shadow-sm cursor-pointer hover:bg-violet-500 active:scale-95 z-10'
                    : 'bg-white/10 text-white/35 z-10 cursor-not-allowed'
                }`}
                aria-label={`Passo ${item.num}: ${item.label}`}
              >
                {item.num === 4 ? (
                  <Dices className="w-4 h-4" strokeWidth={1.75} />
                ) : isPassed ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={1.75} />
                ) : (
                  <span>{item.num}</span>
                )}
              </button>

              {/* Connecting progress track line between nodes */}
              {idx < 3 && (
                <div className="flex-1 h-1 mx-2 sm:mx-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step > item.num
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-500 w-full shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Mood */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Passo 1 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
                Qual é a sua vibe ou humor hoje?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Escolha a sensação que você quer ter ao final dos créditos.
              </p>
            </div>

            <div className="space-y-2.5">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = survey.mood === mood.id;
                const MoodIcon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setSurvey({ ...survey, mood: mood.id });
                      handleNextStep();
                    }}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl ${mood.accentBg} ${mood.accentText} border ${mood.accentBorder} flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <MoodIcon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{mood.label}</div>
                        <div className="text-xs text-white/50 mt-0.5">{mood.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 shrink-0" strokeWidth={1.75} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Passo 2 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
                Quanto tempo você tem disponível?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Adaptamos a recomendação ao seu tempo livre.
              </p>
            </div>

            <div className="space-y-2.5">
              {TIME_OPTIONS.map((time) => {
                const isSelected = survey.timeLimit === time.id;
                const TimeIcon = time.icon;
                return (
                  <button
                    key={time.id}
                    onClick={() => {
                      setSurvey({ ...survey, timeLimit: time.id });
                      handleNextStep();
                    }}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl ${time.accentBg} ${time.accentText} border border-white/5 flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <TimeIcon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{time.label}</div>
                        <div className="text-xs text-white/50 mt-0.5">{time.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 shrink-0" strokeWidth={1.75} />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-start">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Voltar ao humor</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Platform */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Passo 3 de 3
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight">
                Onde prefere assistir?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Selecione seu serviço de streaming favorito ou qualquer um.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PLATFORM_OPTIONS.map((plat) => {
                const isSelected = survey.platform === plat.id;
                return (
                  <button
                    key={plat.id}
                    onClick={() => {
                      setSurvey({ ...survey, platform: plat.id });
                    }}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/30 ring-2 ring-violet-400/40'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80'
                    }`}
                  >
                    {plat.type === 'streaming' ? (
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-2 shadow-inner">
                        <StreamingIcon platform={plat.id as any} size={24} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                        <Compass className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                    )}
                    <span className="text-xs font-bold">{plat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/5 active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Voltar</span>
              </button>

              <button
                onClick={runRoulette}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Dices className="w-4 h-4" strokeWidth={1.75} />
                <span>Sortear Recomendação</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Result Roulette */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            {isShuffling ? (
              <div className="flex flex-col items-center py-8 sm:py-10">
                <div
                  className={`w-40 sm:w-48 aspect-[2/3] rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-300 relative bg-[#151821] ${
                    isDecelerating
                      ? 'border-amber-400 shadow-amber-500/40 ring-4 ring-amber-400/30 scale-102'
                      : 'border-violet-500 shadow-violet-600/40 animate-pulse'
                  }`}
                >
                  {shufflePoster ? (
                    <img
                      src={shufflePoster}
                      alt="Sorteando filme"
                      className="w-full h-full object-cover transition-opacity duration-75"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Dices className="w-12 h-12 animate-spin" strokeWidth={1.75} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {shuffleMovie && (
                    <div className="absolute bottom-3 inset-x-2 text-center pointer-events-none">
                      <p className="text-xs font-bold text-white line-clamp-1 drop-shadow-md">
                        {shuffleMovie.title}
                      </p>
                      <p className="text-[10px] text-amber-300 font-semibold drop-shadow-sm mt-0.5">
                        {shuffleMovie.year} · ★ {(shuffleMovie.letterboxdRating || shuffleMovie.rating || 8.0).toFixed(1)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-bold mt-4 shadow-sm">
                  <Dices className={`w-3.5 h-3.5 ${isDecelerating ? 'animate-bounce text-amber-400' : 'animate-spin'}`} strokeWidth={1.75} />
                  <span>
                    {isDecelerating ? 'Quase lá... Parando no filme ideal!' : `Girando roleta entre ${movies.length} obras...`}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-3 mb-1">
                  {isDecelerating ? 'Preparando a sua sessão...' : 'Consultando a melhor obra...'}
                </h3>
                <p className="text-xs text-white/50 max-w-sm">
                  Cruzando humor, tempo livre e notas dos 217 títulos.
                </p>
              </div>
            ) : recommendedMovie ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="py-2"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Combinação Perfeita para Você!</span>
                </div>

                {/* Recommendation Card */}
                <div className="bg-[#12151E] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl text-left">
                  <div className="flex gap-4 sm:gap-6 items-start">
                    <div className="w-24 sm:w-28 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-[#151821]">
                      <img
                        src={recommendedMovie.posterUrl}
                        alt={recommendedMovie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-extrabold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" strokeWidth={1.75} />
                        <span>{recommendedMovie.letterboxdRating.toFixed(1)} Letterboxd</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">{recommendedMovie.year}</span>
                      </div>

                      <h3 className="text-base sm:text-xl font-extrabold text-white leading-tight truncate">
                        {recommendedMovie.title}
                      </h3>

                      <p className="text-xs text-white/50 mt-1 truncate">
                        {recommendedMovie.director} • {formatRuntime(recommendedMovie.runtimeMinutes)}
                      </p>

                      <p className="text-xs text-white/70 mt-2 line-clamp-3 leading-relaxed">
                        {recommendedMovie.synopsis}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {recommendedMovie.genres.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/60 font-medium"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Single line nowrap) */}
                  <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      onClick={() => onOpenMovie(recommendedMovie)}
                      className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all whitespace-nowrap"
                    >
                      <span>Ver Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>

                    <button
                      onClick={() => onAddToWatchlist(recommendedMovie.id)}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 border transition-all active:scale-95 whitespace-nowrap ${
                        isMovieInWatchlist
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      }`}
                    >
                      {isMovieInWatchlist ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                          <span>Na Sua Lista!</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
                          <span>Quero Ver</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reroll / Reset */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={handleReroll}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
                    <span>Sortear Outro Filme</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-xs text-white/50 hover:text-white font-medium transition-colors"
                  >
                    Reiniciar
                  </button>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
