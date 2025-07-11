"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LayoutShell from "../../components/LayoutShell";
import Loading from "../../components/Loading";
import EpisodeCard, { type Episode } from "../../components/cards/EpisodeCard";
import AnimeInfo, { type AnimeInfoProps } from "../../components/AnimePage/AnimeInfo";
import VideoPlayer from "../../components/VideoPlayer";

const apiUrl = "http://localhost:4000";

interface Server {
  serverName: string;
  type: string;
  server_id?: string;
  data_id?: string;
}

const getAnimeInfo = async (id: string | undefined) => {
  if (!id) return null;
  try {
    const response = await axios.get(`${apiUrl}/api/info`, { params: { id } });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
};

const getEpisodes = async ({ id }: { id: string | undefined }) => {
  try {
    const res = await axios.get(`${apiUrl}/api/episodes/${id}`, { params: { id } });
    return res.data.results.episodes as Episode[];
  } catch (err) {
    console.error("Failed to fetch episodes", err);
  }
};

const getServers = async (episodeId: string) => {
  try {
    const res = await axios.get(`${apiUrl}/api/servers/${episodeId}`);
    return res.data.results as Server[];
  } catch (err) {
    console.error("Failed to fetch servers", err);
    return [];
  }
};

const getVideoStream = async (episodeId: string, serverName: string, type: string) => {
  try {
    const res = await axios.get(`${apiUrl}/api/stream`, {
      params: { id: episodeId, server: serverName, type },
    });
    return res.data.results;
  } catch (err) {
    console.error("Failed to fetch stream info", err);
    return null;
  }
};

export default function AnimePage() {
  const { id } = useParams();
  const [animeInfo, setAnimeInfo] = useState<AnimeInfoProps | null>(null);
  const [episodes, setEpisodes] = useState<Episode[] | undefined>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<"sub" | "dub">("sub");
  const [videoStream, setVideoStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load anime info, episodes, servers, and first stream
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const animeData = await getAnimeInfo(id);
        setAnimeInfo(animeData?.data ?? null);

        const episodeData = await getEpisodes({ id });
        setEpisodes(episodeData);

        if (episodeData && episodeData.length > 0) {
          const firstEpisodeId = episodeData[0].id;
          const allServers = await getServers(firstEpisodeId);
          setServers(allServers);

          // Pick preferred server by name + type, fallback to first matching type, then first server
          const preferredServer =
            allServers.find((s) => s.serverName === "HD-1" && s.type === selectedType) ||
            allServers.find((s) => s.type === selectedType) ||
            allServers[0];

          const index = allServers.indexOf(preferredServer);
          setSelectedServerIndex(index >= 0 ? index : 0);

          if (preferredServer) {
            const stream = await getVideoStream(
              firstEpisodeId,
              preferredServer.serverName,
              preferredServer.type
            );
            setVideoStream(stream);
          }
        }
      } catch (error) {
        console.error("Failed to fetch anime page data", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, selectedType]);

  // When user changes server or type, fetch new stream
  useEffect(() => {
    const fetchStream = async () => {
      if (!episodes || episodes.length === 0) return;
      const episodeId = episodes[0].id;
      if (!servers || servers.length === 0) return;

      const filteredServers = servers.filter((s) => s.type === selectedType);
      if (filteredServers.length === 0) return;

      const server = filteredServers[selectedServerIndex] || filteredServers[0];
      if (!server) return;

      const stream = await getVideoStream(episodeId, server.serverName, server.type);
      setVideoStream(stream);
    };

    fetchStream();
  }, [selectedServerIndex, selectedType, episodes, servers]);

  if (loading) {
    return (
      <LayoutShell>
        <Loading />
      </LayoutShell>
    );
  }

  console.log('videoStream', videoStream);
  return (
    <LayoutShell>
      <VideoPlayer
        src={videoStream?.streamingLink?.link?.file || null}
        videoData={videoStream}
        selectedServerIndex={selectedServerIndex}
        setSelectedServerIndex={setSelectedServerIndex}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <div className="flex flex-col md:flex-row justify-center gap-6 p-4 sm:p-6">
        <div className="shrink-0 flex justify-center">
          <EpisodeCard episodes={episodes} />
        </div>
        <AnimeInfo data={animeInfo} />
      </div>
    </LayoutShell>
  );
}
