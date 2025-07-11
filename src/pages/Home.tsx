"use client";
import AnimeCard from "../components/cards/AnimeCard";
import LayoutShell from "../components/LayoutShell";
import Loading from "../components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";

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
  };
}

const apiUrl = "http://localhost:4000";

const fetchTopAnimes = async () => {
  const response = await axios(`${apiUrl}/api/top-ten`);
  console.log("response", response);
  const data = await response.data.results;
  return data;
};

export default function Home() {
  const [today, setToday] = useState<Anime[]>([]);
  const [weekly, setWeekly] = useState<Anime[]>([]);
  const [monthly, setMonthly] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopAnimes = async () => {
      try {
        const data = await fetchTopAnimes();
        setToday(data.today);
        setWeekly(data.weekly);
        setMonthly(data.monthly);
      } catch (error) {
        console.error("Error fetching top animes:", error);
      } finally {
        setLoading(false);
      }
    };
    getTopAnimes();
  }, []);

  console.log("today", today);

  if (loading) {
    return (
      <LayoutShell>
        <Loading />
      </LayoutShell>
    );
  }
  return (
    <LayoutShell>
      <div className="w-full flex flex-col items-center justify-center h-full">
        <h1 className="w-full text-center text-2xl sm:text-3xl text-yellow-400">
          Welcome to Animeverse
        </h1>
        <AnimeCard animes={today} />
      </div>
    </LayoutShell>
  );
}
