import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Profile, Movie, FilterState, ActiveTab, UserMovieData, WatchStatus } from './types/index.ts';
import { MOVIES_DATA, DEFAULT_PROFILES } from './data/movies.ts';
import { filterMovies, sortMovies, getActiveFiltersCount } from './utils/movieLogic.ts';
import { loadLocally, persistLocally, syncToCloud } from './utils/cloudSync.ts';
import { CinemaWelcomeScreen } from './components/CinemaWelcomeScreen.tsx';
import { TopBar } from './components/TopBar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { ExploreView } from './components/ExploreView.tsx';
import { MyListView } from './components/MyListView.tsx';
import { DiscoverWizard } from './components/DiscoverWizard.tsx';
import { FilterDrawer } from './components/FilterDrawer.tsx';
import { MovieModal } from './components/MovieModal.tsx';
import { AddMovieModal } from './components/AddMovieModal.tsx';

export default function App() {
  // Check autostart param from URL (e.g., ?autostart=1)
  const isAutoStart = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  }, []);

  // Persistent Profiles State initialized via local storage / defaults
  const [initialData] = useState(() => loadLocally(DEFAULT_PROFILES));
  const [profiles, setProfiles] = useState<Profile[]>(initialData.profiles);
  const [activeProfileId, setActiveProfileId] = useState<string>(initialData.activeId);

  // Custom user-added movies from TMDB persisted in localStorage
  const [customMovies, setCustomMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('cinegobetti_custom_movies_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Merged Catalog (217 curated titles + custom added titles)
  const allMovies = useMemo(() => {
    const customIds = new Set(customMovies.map((m) => m.id));
    const baseWithoutDuplicates = MOVIES_DATA.filter((m) => !customIds.has(m.id));
    return [...customMovies, ...baseWithoutDuplicates];
  }, [customMovies]);

  // Current view: welcome (Quem está assistindo?) or main app
  const [view, setView] = useState<'welcome' | 'app'>(() => {
    if (isAutoStart) return 'app';
    return 'welcome';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState<boolean>(false);

  // Selected Movie for Detail Modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    streamings: [],
    genres: [],
    mediaType: 'all',
    sortBy: 'rating',
  });

  // Save profiles to localStorage & debounced sync to cloud
  useEffect(() => {
    persistLocally(profiles, activeProfileId);
    const syncTimer = setTimeout(() => {
      syncToCloud(profiles);
    }, 800);
    return () => clearTimeout(syncTimer);
  }, [profiles, activeProfileId]);

  // Active Profile reference with fail-safe fallback
  const activeProfile = useMemo(() => {
    return (
      profiles.find((p) => p.id === activeProfileId) ||
      profiles[0] ||
      DEFAULT_PROFILES[0]
    );
  }, [profiles, activeProfileId]);

  // Compute filtered & sorted catalog
  const filteredAndSortedMovies = useMemo(() => {
    const filtered = filterMovies(allMovies, filters);
    return sortMovies(filtered, filters.sortBy);
  }, [allMovies, filters]);

  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount(filters);
  }, [filters]);

  const myListCount = useMemo(() => {
    return Object.keys(activeProfile?.list || {}).length;
  }, [activeProfile]);

  // Profile actions
  const handleSelectProfile = (profile: Profile) => {
    setActiveProfileId(profile.id);
    setView('app');
  };

  const handleCreateProfile = (data: {
    name: string;
    avatarUrl: string;
    accentColor: string;
  }) => {
    const newId = `p_${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      name: data.name,
      avatarUrl: data.avatarUrl,
      accentColor: data.accentColor,
      createdAt: new Date().toISOString(),
      isPinProtected: false,
      list: {},
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    setActiveProfileId(newId);
  };

  const handleUpdateProfile = (
    id: string,
    data: { name: string; avatarUrl: string; accentColor: string }
  ) => {
    const updated = profiles.map((p) =>
      p.id === id
        ? {
            ...p,
            name: data.name,
            avatarUrl: data.avatarUrl,
            accentColor: data.accentColor,
          }
        : p
    );
    setProfiles(updated);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    if (activeProfileId === id) {
      setActiveProfileId(updated[0].id);
    }
  };

  // Movie actions per profile
  const handleUpdateUserMovieData = (
    movieId: string,
    data: Partial<UserMovieData>
  ) => {
    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id !== activeProfileId) return prof;

        const currentList = prof.list || {};
        const existingEntry = currentList[movieId] || {
          movieId,
          status: 'none' as const,
        };

        const updatedEntry: UserMovieData = {
          ...existingEntry,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // If status is none and no rating or review or favorite, remove from map
        if (
          updatedEntry.status === 'none' &&
          !updatedEntry.userRating &&
          !updatedEntry.review &&
          !updatedEntry.isFavorite
        ) {
          const { [movieId]: _, ...rest } = currentList;
          return { ...prof, list: rest };
        }

        return {
          ...prof,
          list: {
            ...currentList,
            [movieId]: updatedEntry,
          },
        };
      })
    );
  };

  // Quick Watchlist toggle
  const handleToggleWatchlist = (movieId: string) => {
    const currentStatus = activeProfile?.list?.[movieId]?.status;
    const newStatus = currentStatus === 'watchlist' ? 'none' : 'watchlist';
    handleUpdateUserMovieData(movieId, { status: newStatus });
  };

  // Adding movie from TMDB or custom entry
  const handleAddMovie = (movie: Movie, initialStatus: WatchStatus) => {
    setCustomMovies((prev) => {
      const updated = [movie, ...prev.filter((m) => m.id !== movie.id)];
      try {
        localStorage.setItem(
          'cinegobetti_custom_movies_v2',
          JSON.stringify(updated)
        );
      } catch (err) {
        console.warn('Erro ao salvar filme customizado localmente:', err);
      }
      return updated;
    });

    if (initialStatus && initialStatus !== 'none') {
      handleUpdateUserMovieData(movie.id, { status: initialStatus });
    }

    // Open detail modal to review newly added title
    setSelectedMovie(movie);
  };

  // Quick genre toggle from Explore header pills
  const handleQuickGenreSelect = (category: string) => {
    if (category === 'Todos') {
      setFilters((prev) => ({
        ...prev,
        genres: [],
        mediaType: 'all',
      }));
    } else if (category === 'Em Alta') {
      setFilters((prev) => ({
        ...prev,
        sortBy: 'rating',
        genres: [],
      }));
    } else if (category === 'Filmes') {
      setFilters((prev) => ({
        ...prev,
        mediaType: 'movie',
      }));
    } else if (category === 'Séries') {
      setFilters((prev) => ({
        ...prev,
        mediaType: 'series',
      }));
    } else if (category === 'Kids') {
      setFilters((prev) => ({
        ...prev,
        genres: ['Animação'],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        genres: prev.genres.includes(category)
          ? prev.genres.filter((g) => g !== category)
          : [category],
      }));
    }
  };

  // Tab change
  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'filters') {
      setIsFilterDrawerOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#07080C] text-[#F1F3F9] flex flex-col selection:bg-violet-600 selection:text-white"
      data-testid="cinegobetti-app"
    >
      <AnimatePresence>
        {view === 'welcome' ? (
          <CinemaWelcomeScreen
            key="cinema-welcome"
            profiles={profiles}
            onSelectProfile={handleSelectProfile}
            onCreateProfile={handleCreateProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col pb-24"
          >
            {/* TopBar with h-16 calibrated header, prominent logo and [+ Novo] button */}
            <TopBar
              activeProfile={activeProfile}
              searchQuery={filters.query}
              onSearchChange={(query) => setFilters((prev) => ({ ...prev, query }))}
              onSwitchProfile={() => setView('welcome')}
              onLogoClick={() => {
                setActiveTab('explore');
                setFilters((prev) => ({ ...prev, query: '', genres: [], streamings: [] }));
              }}
              onOpenAddMovie={() => setIsAddMovieModalOpen(true)}
            />

            {/* Main Views */}
            <main className="flex-1">
              {activeTab === 'explore' && (
                <ExploreView
                  movies={filteredAndSortedMovies}
                  filters={filters}
                  onOpenMovie={(m) => setSelectedMovie(m)}
                  onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                  onQuickGenreSelect={handleQuickGenreSelect}
                  userList={activeProfile.list || {}}
                  onToggleWatchlist={handleToggleWatchlist}
                  onOpenAddMovie={() => setIsAddMovieModalOpen(true)}
                />
              )}

              {activeTab === 'mylist' && (
                <MyListView
                  profile={activeProfile}
                  movies={allMovies}
                  onOpenMovie={(m) => setSelectedMovie(m)}
                  onExploreClick={() => setActiveTab('explore')}
                />
              )}

              {activeTab === 'discover' && (
                <DiscoverWizard
                  movies={allMovies}
                  onOpenMovie={(m) => setSelectedMovie(m)}
                  onAddToWatchlist={handleToggleWatchlist}
                  userList={activeProfile.list || {}}
                />
              )}
            </main>

            {/* Floating Glass Bottom Navigation */}
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              activeFiltersCount={activeFiltersCount}
              myListCount={myListCount}
            />

            {/* Sliding Filter Bottom Sheet */}
            <FilterDrawer
              isOpen={isFilterDrawerOpen}
              onClose={() => setIsFilterDrawerOpen(false)}
              filters={filters}
              onUpdateFilters={setFilters}
              totalResultsCount={filteredAndSortedMovies.length}
            />

            {/* Movie Details Modal with Fluid Spring Animations */}
            <AnimatePresence>
              {selectedMovie && (
                <MovieModal
                  key={`modal-${selectedMovie.id}`}
                  movie={selectedMovie}
                  userData={activeProfile.list?.[selectedMovie.id]}
                  onClose={() => setSelectedMovie(null)}
                  onUpdateUserData={handleUpdateUserMovieData}
                  profiles={profiles}
                  activeProfileId={activeProfileId}
                  allMovies={allMovies}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                />
              )}
            </AnimatePresence>

            {/* Add Movie / TMDB Multi-Search Modal */}
            <AddMovieModal
              isOpen={isAddMovieModalOpen}
              onClose={() => setIsAddMovieModalOpen(false)}
              onAddMovie={handleAddMovie}
              initialQuery={filters.query}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
