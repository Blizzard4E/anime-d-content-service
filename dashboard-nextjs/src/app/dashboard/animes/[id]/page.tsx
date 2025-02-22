"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";

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
    const params = useParams<{ id: string }>(); // Get animeId from route params
    const [formData, setFormData] = useState({ title: "", episodeNumber: "" });
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoFile) {
            alert("Please select a video file");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("episodeNumber", formData.episodeNumber);
        formDataToSend.append("animeId", params.id!); // Ensure animeId is available
        formDataToSend.append("video", videoFile);
        console.log("Session", session);
        if (!session) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/episodes`, // Assuming endpoint is /episodes
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + session.data?.token,
                    },
                    body: formDataToSend,
                }
            );

            if (response.ok) {
                const result = await response.json();
                alert("Episode added successfully!");
                console.log("Episode created:", result);
                setFormData({ title: "", episodeNumber: "" });
                setVideoFile(null);
            } else {
                throw new Error("Failed to create episode");
            }
        } catch (error) {
            alert("Failed to create episode. Please try again.");
            console.error(error);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setVideoFile(file);
    };

    const [anime, setAnime] = useState<Anime>();

    useEffect(() => {
        async function getAnimes() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/anime/" + params.id
            );
            const result = await response.json();
            if (result.data) {
                setAnime(result.data);
            }
        }
        getAnimes();
    }, []);

    return (
        <div className="p-6">
            <h1 className="font-bold text-3xl">Episode List</h1>
            <ul>
                {anime &&
                    anime.episodes.map((episode, i) => (
                        <li key={i} className="text-lg flex gap-4">
                            <h2 className="font-bold">
                                {episode.episodeNumber}
                            </h2>
                            <h3>{episode.title}</h3>
                        </li>
                    ))}
            </ul>
            {anime && anime.episodes.length < 1 && <h3>No Episodes</h3>}

            <h1 className="font-bold text-3xl mt-4">Add Episode</h1>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                <TextField
                    label="Title"
                    variant="filled"
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleTextChange}
                />
                <TextField
                    label="Episode Number"
                    variant="filled"
                    fullWidth
                    name="episodeNumber"
                    value={formData.episodeNumber}
                    onChange={handleTextChange}
                />
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    className="border p-2"
                />
                <Button variant="contained" type="submit">
                    Upload Episode
                </Button>
            </form>
        </div>
    );
}
