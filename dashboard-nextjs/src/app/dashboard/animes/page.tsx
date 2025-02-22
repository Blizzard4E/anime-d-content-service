"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Genre = {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type Studio = {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type Episode = {
    _id: string;
    title: string;
    episodeNumber: string;
    videoUrl: string;
    animeId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type Anime = {
    _id: string;
    title: string;
    posterUrl: string;
    coverUrl: string;
    logoUrl: string;
    genres: Genre[];
    studio: Studio;
    description: string;
    releaseDate: string;
    episodes: Episode[];
    trailerUrl: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export default function Page() {
    const session = useSession();
    const [animes, setAnimes] = useState<Anime[]>([]);

    useEffect(() => {
        async function getAnimes() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/anime"
            );
            const result = await response.json();
            if (result.data) {
                setAnimes(result.data);
            }
        }
        getAnimes();
    }, []);

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="font-bold text-3xl">Animes</h1>
                <a
                    href="/dashboard/animes/create"
                    className="bg-blue-600 text-white px-4 py-2"
                >
                    Create Anime
                </a>
            </div>
            <ul>
                {animes.map((anime, i) => (
                    <li
                        key={i}
                        className="text-lg flex border-b border-gray-600 py-4 justify-between"
                    >
                        <h2>{anime.title}</h2>
                        <a
                            href={"/dashboard/animes/" + anime._id}
                            className="bg-blue-600 text-white px-4 py-2"
                        >
                            Add Episode
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
