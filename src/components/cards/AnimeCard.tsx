"use client";
import { Play } from "lucide-react";

interface Anime {
  data_id: number;
  id: string;
  japanese_title: string;
  number: string;
  poster: string;
  title: string;
  tvInfo: {
    sub: string;
    dub: string;
    eps?: string;
  };
}

export default function AnimeCard({ animes }: { animes: Anime[] }) {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {animes.length ? (
          animes.map((anime, index) => (
            <a
              href={`/anime/${anime.id}`}
              key={index}
              className="group cursor-pointer"
              title={anime.title}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {/* Poster Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Episode count */}
                  {anime.tvInfo.eps && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md">
                      {anime.tvInfo.eps} eps
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h3 className="truncate text-sm font-semibold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {anime.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      <span>Sub: {anime.tvInfo.sub}</span>
                      <span>Dub: {anime.tvInfo.dub}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 text-lg">
            No animes found
          </div>
        )}
      </div>
    </div>
  );
}
