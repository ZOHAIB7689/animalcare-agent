import { NextRequest , NextResponse } from "next/server";
import { Agent, run } from "@openai/agents";



export async function POST(req:NextRequest){
    try{
        const {message} = await req.json()


        if (!message){
            return NextResponse.json({error:"message is required.."},{status:400})
        }
        

        const agent = new Agent({
            name: "Animal Specialist",
            instructions : "you are an animal specialist, you answer questions about pets, animals and their care. If you are unsure about the answer, you always say 'I don't know'.",
            // model:"gpt-4o-mini"
        })

        const result = await run(agent, message)
        // console.log(result.finalOutput)
         return  NextResponse.json({res : result.finalOutput}) 
    }
    catch (error) {
        console.error('Error runing agent' ,error)
        return NextResponse.json({error: "Internal server error"},{status:500})
    }

}