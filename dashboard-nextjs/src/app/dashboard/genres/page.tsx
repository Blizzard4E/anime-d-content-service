"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface Genre {
    createdAt: string; // ISO date string
    title: string;
    updatedAt: string; // ISO date string
    __v: number;
    _id: string;
}

export default function Page() {
    const session = useSession();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [newGenre, setNewGenre] = useState<string>("");

    useEffect(() => {
        async function getGenres() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/genres"
            );
            const result = await response.json();
            console.log(result);
            if (result.data) {
                setGenres(result.data);
            }
        }
        getGenres();
    }, []);

    async function addGenre() {
        if (!newGenre) return; // Prevent adding empty genres

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/genres",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + session.data?.token,
                },
                body: JSON.stringify({ title: newGenre }),
            }
        );

        const result = await response.json();
        setGenres([...genres, result.data]); // Add the new genre to the list
        setNewGenre(""); // Reset input field
    }

    return (
        <div>
            <h1 className="font-bold text-3xl">
                Genres {process.env.NEXT_PUBLIC_API_URL}
            </h1>
            <ul>
                {genres.map((genre, i) => (
                    <li key={i} className="text-lg">
                        {genre.title}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="New Genre Title"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={addGenre}
                    className="p-2 bg-blue-500 text-white"
                >
                    Add Genre
                </button>
            </div>
        </div>
    );
}
