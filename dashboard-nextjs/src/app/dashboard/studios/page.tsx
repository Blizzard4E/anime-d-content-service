"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface Studio {
    createdAt: string; // ISO date string
    title: string;
    updatedAt: string; // ISO date string
    __v: number;
    _id: string;
}

export default function Page() {
    const session = useSession();
    const [studios, setStudios] = useState<Studio[]>([]);
    const [newStudio, setNewStudio] = useState<string>("");

    useEffect(() => {
        async function getStudios() {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/studios"
            );
            const result = await response.json();
            setStudios(result.data);
        }
        getStudios();
    }, []);

    async function addStudio() {
        if (!newStudio) return; // Prevent adding empty studios

        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/studios",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + session.data?.token,
                },
                body: JSON.stringify({ title: newStudio }),
            }
        );

        const result = await response.json();
        setStudios([...studios, result.data]); // Add the new studio to the list
        setNewStudio(""); // Reset input field
    }

    return (
        <div>
            <h1 className="font-bold text-3xl">Studios</h1>
            <ul>
                {studios.map((studio, i) => (
                    <li key={i} className="text-lg">
                        {studio.title}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <input
                    type="text"
                    value={newStudio}
                    onChange={(e) => setNewStudio(e.target.value)}
                    placeholder="New Studio Title"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={addStudio}
                    className="p-2 bg-blue-500 text-white"
                >
                    Add Studio
                </button>
            </div>
        </div>
    );
}
