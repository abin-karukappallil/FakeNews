import {NextResponse} from "next/server";
import {db} from "@/lib/db"
export async function POST(req:Request) {
    try{
        const {id}= await req.json();
        await db`DELETE * FROM FAKENEWS WHERE ID=${id}`
       return NextResponse.json({status:200,messgae:"Successss"})
    }catch(e){
        console.log(e);
        return NextResponse.json({status:500,error:"Internal server error"})
    }
}