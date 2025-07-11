import { useState } from "react";

export interface Episode {
  episode_no: number;
  title: string;
  japanese_title: string;
  filler: boolean;
  id: string;
}

export default function EpisodeCard({
  episodes,
}: {
  episodes: Episode[] | undefined;
}) {
  const [rangeStart, setRangeStart] = useState(1);
  const rangeSize = 100;

  const totalEpisodes = episodes?.length || 0;
  const totalRanges = Math.ceil(totalEpisodes / rangeSize);
  const ranges = Array.from(
    { length: totalRanges },
    (_, i) => i * rangeSize + 1
  );

  const filteredEpisodes = episodes?.filter(
    (ep) =>
      ep.episode_no >= rangeStart && ep.episode_no < rangeStart + rangeSize
  );
  // console.log("Episodes", episodes);
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Episodes</h1>
          <div className="text-sm text-gray-400">{totalEpisodes} total</div>
        </div>

        <div className="mb-4">
          <select
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none"
            onChange={(e) => setRangeStart(Number(e.target.value))}
            value={rangeStart}
          >
            {ranges.map((start) => (
              <option key={start} value={start}>
                Episodes {start}–
                {Math.min(start + rangeSize - 1, totalEpisodes)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {filteredEpisodes?.map((ep) => (
            <div
              key={ep.id}
              className={`text-white text-center p-3 rounded-md border transition
                ${
                  ep.filler
                    ? "bg-red-900 border-red-700 hover:bg-red-800"
                    : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                }`}
              title={`${ep.title}${
                ep.japanese_title ? ` (${ep.japanese_title})` : ""
              }`}
            >
              {ep.episode_no}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>Filler</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span>Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
