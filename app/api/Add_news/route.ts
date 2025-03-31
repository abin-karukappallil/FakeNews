import {NextResponse} from "next/server";
import {db} from "@/lib/db"
export async function POST(req:Request) {
    try{
        const {link,rating}= await req.json();
        if( !rating  || !link){
            return NextResponse.json({status:400,error:"Need valuesss"})
        }
        await db`INSERT INTO FAKENEWS(RATING,LINK) VALUES(${rating},${link})`;
        return NextResponse.json({status:200,message:"Successss"})
    }catch(e){
        console.log(e);
        return NextResponse.json({status:500,error:"Internal server error"})
    }
}