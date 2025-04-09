import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const rows = await db`SELECT rating FROM FAKENEWS WHERE link=${url}`;
        console.log(rows);
        if(rows.length > 0) {
        return NextResponse.json(
            {"rating":rows[0].rating},
            { status: 200 }
        );
    }
        const response = await fetch('https://fakenewsapi.abinthomas.dev/check', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to check news integirty" },
                { status: 500 }
            )
        }
        const data = await response.json();
        const rating = data.rating;
        const heading = data.heading;
        const link = data.link;
        const image = data.image;
        await db`INSERT INTO FAKENEWS (LINK, RATING,HEADING,IMAGE) VALUES (${link}, ${rating},${heading}, ${image})`;
        if(!rating){
            return NextResponse.json(
                { error: "Failed to check news integirty" },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { rating: rating, heading: heading, link: link, image: image },
            { status: 200 }
        );
    } catch (e) {
        console.error("Server Error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
