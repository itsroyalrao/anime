export interface AnimeInfoProps {
  adultContent: boolean;
  data_id: string;
  id: string;
  anilistId: string;
  malId: string;
  title: string;
  japanese_title: string;
  poster: string;
  showType: string;
  synonyms: string;
  animeInfo: {
    Aired: string;
    Duration: string;
    Genres: string[];
    Japanese: string;
    "MAL Score": string;
    Overview: string;
    Premiered: string;
    Producers: string[];
    Status: string;
    Studios: string;
    Synonyms: string;
    tvInfo: {
      sub: string;
      dub: string;
      duration: string;
      quality: string;
      rating: string;
    };
  };
  charactersVoiceActors: {
    character: any;
    voiceActors: any[];
  }[];
  recommended_data: any[];
  related_data: any[];
}

export default function AnimeInfo({ data }: { data: AnimeInfoProps | null }) {
  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <div className="text-gray-400 text-lg">No anime data available</div>
        </div>
      </div>
    );
  }
//   console.log("Anime Info", data);
  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row">
          <div className="p-6 shrink-0">
            <img
              src={data.poster}
              alt={data.title}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {data.title}
            </h1>
            <p className="text-gray-300 text-lg mb-4">{data.japanese_title}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-semibold">Type:</span>
                <span className="text-white">{data.showType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-semibold">Status:</span>
                <span className="text-white">{data.animeInfo.Status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-semibold">MAL Score:</span>
                <span className="text-yellow-400 font-semibold">
                  {data.animeInfo["MAL Score"]}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-blue-400 font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {data.animeInfo.Genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                {data.animeInfo.Overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Anime Details */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Anime Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Aired:</span>
              <span className="text-white">{data.animeInfo.Aired}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{data.animeInfo.Duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Premiered:</span>
              <span className="text-white">{data.animeInfo.Premiered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Studios:</span>
              <span className="text-white">{data.animeInfo.Studios}</span>
            </div>
          </div>
        </div>

        {/* TV Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">TV Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Sub Episodes:</span>
              <span className="text-white">{data.animeInfo.tvInfo.sub}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dub Episodes:</span>
              <span className="text-white">{data.animeInfo.tvInfo.dub}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quality:</span>
              <span className="text-white">
                {data.animeInfo.tvInfo.quality}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rating:</span>
              <span className="text-white">{data.animeInfo.tvInfo.rating}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Producers */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4">Producers</h2>
        <div className="flex flex-wrap gap-2">
          {data.animeInfo.Producers.map((producer, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600/30"
            >
              {producer}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
