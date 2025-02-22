"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface CreateAnimeInput {
    title: string;
    description: string;
    genres: string[];
    studio: string;
    releaseDate: string;
    status: "ongoing" | "completed";
}

export interface Genre {
    _id: string;
    title: string;
}

export interface Studio {
    _id: string;
    title: string;
}

export interface AnimeFiles {
    poster: File | null;
    cover: File | null;
    logo: File | null;
    trailer: File | null;
}

export default function Page() {
    const session = useSession();
    const [formData, setFormData] = useState<CreateAnimeInput>({
        title: "",
        description: "",
        genres: [],
        studio: "",
        releaseDate: new Date().toISOString().split("T")[0],
        status: "ongoing",
    });
    const [files, setFiles] = useState<AnimeFiles>({
        poster: null,
        cover: null,
        logo: null,
        trailer: null,
    });
    const [genres, setGenres] = useState<Genre[]>([]);
    const [studios, setStudios] = useState<Studio[]>([]);

    useEffect(() => {
        async function getGenres() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/genres"
            );
            const result = await response.json();
            if (result.data) {
                setGenres(result.data);
            }
        }
        getGenres();
    }, []);

    useEffect(() => {
        async function getStudios() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/studios"
            );
            const result = await response.json();
            if (result.data) {
                setStudios(result.data);
            }
        }
        getStudios();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange =
        (type: keyof AnimeFiles) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            setFiles((prev) => ({
                ...prev,
                [type]: file,
            }));
        };

    async function handleSubmit() {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "genres") {
                formDataToSend.append(key, JSON.stringify(value));
            } else {
                formDataToSend.append(key, value);
            }
        });

        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                formDataToSend.append(key, file);
            }
        });

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/anime",
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + session.data?.token,
                },
                body: formDataToSend,
            }
        );
        console.log(response);
        const result = await response.json();
        console.log("Anime created:", result);
    }

    return (
        <div className="p-6">
            <h1 className="font-bold text-3xl">Create Anime</h1>
            <div className="mt-4 flex flex-col gap-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border p-2"
                />
                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border p-2"
                />
                <select
                    name="genres"
                    multiple
                    value={formData.genres}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            genres: Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                            ),
                        })
                    }
                    className="border p-2"
                >
                    <option value="" disabled>
                        Select Genres
                    </option>
                    {genres.map((genre) => (
                        <option key={genre._id} value={genre._id}>
                            {genre.title}
                        </option>
                    ))}
                </select>
                <select
                    name="studio"
                    value={formData.studio}
                    onChange={handleChange}
                    className="border p-2"
                >
                    <option value="" disabled>
                        Select Studio
                    </option>
                    {studios.map((studio) => (
                        <option key={studio._id} value={studio._id}>
                            {studio.title}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="border p-2"
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border p-2"
                >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
                <input
                    type="file"
                    onChange={handleFileChange("poster")}
                    className="border p-2"
                />
                <input
                    type="file"
                    onChange={handleFileChange("cover")}
                    className="border p-2"
                />
                <input
                    type="file"
                    onChange={handleFileChange("logo")}
                    className="border p-2"
                />
                <input
                    type="file"
                    onChange={handleFileChange("trailer")}
                    className="border p-2"
                />
                <button
                    onClick={handleSubmit}
                    className="p-2 bg-blue-500 text-white"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
