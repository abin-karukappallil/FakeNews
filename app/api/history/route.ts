import {NextResponse} from "next/server";
import {db} from "@/lib/db"
export async function GET(req:Request) {
    try{
       const history = await db`SELECT * FROM FAKENEWS`;
       return NextResponse.json({status:200,history})
    }catch(e){
        console.log(e);
        return NextResponse.json({status:500,error:"Internal server error"})
    }
}