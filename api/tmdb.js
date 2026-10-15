export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY || '15d2ea6d0dc1d476efbca3eba2b9bbfb';
  const query = req.query.q || req.query.query;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query required (?q=...)' });
  }

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encoded}&page=1&include_adult=false`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'TMDB API error' });
    }

    const data = await response.json();
    const results = (data.results || [])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 10)
      .map((item) => {
        const isMovie = item.media_type === 'movie';
        const title = isMovie ? item.title : item.name;
        const releaseDate = isMovie ? item.release_date : item.first_air_date;
        const year = releaseDate ? parseInt(releaseDate.split('-')[0], 10) : null;

        return {
          id: `tmdb_${item.id}`,
          tmdbId: item.id,
          title: title || 'Sem título',
          originalTitle: isMovie ? item.original_title : item.original_name,
          type: isMovie ? 'movie' : 'series',
          year,
          overview: item.overview || 'Sinopse não disponível.',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
          backdrop: item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
          voteAverage: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : null,
          voteCount: item.vote_count || 0,
        };
      });

    return res.status(200).json({ results });
  } catch (err) {
    console.error('TMDB search error:', err);
    return res.status(500).json({ error: err.message });
  }
}
