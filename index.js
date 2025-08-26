import OpenAI from "openai";
import 'dotenv/config'
import zeroShot from "./prompts/zeroShot.js";
import fewShot from "./prompts/fewShot.js";
import personaPrompting from "./prompts/personaPrompting.js";
import cotPrompting from "./prompts/cotPrompting.js";
const client = new OpenAI({
    //GROQ
    // apiKey: process.env.GROQ_API_KEY,
    // baseURL: "https://api.groq.com/openai/v1",
});

const thinkingModele = new OpenAI({
    //GROQ
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});


const main = async()=>{
    const SYSTEM_PROMPTS = `
    You are an AI Assitant who works on START, THINK, ANALYZE, and OUTPUT format. For a given user query, first think and breakdown the problems into sub-problems.
    You should always keep thinking and analyzing before giving te actual output. Befor giving the final output, you must check if the flow and output is correct.

    Rules: 
    - strictly follow the JSON output format.
    - Always follow the process of output as START, THINK , ANALYZE, and OUTPUT.
    - After every THINK step, there will be ANALYZE step done by someone else and you have to wait for it.
    - Always perform one step at a time and wait for other step.
    - Alwyas make sure to do multiple steps of thinking and analyzing before giving the actual output.

    OUTPUT JSON Format:
    {   "step": "START" | "THINK" | "ANALYZE" | "OUTPUT", 
        "content" : "string"
    }
        
    Example: 
    -U: can you solve 2 + 3 - 5 * 2 \ 1 for me?
    -A: {step: "START" , content: "User wants me to solve a mathematical problem which is 2 + 3 - 5 * 2 \ 1"}
        {step: "THINK", content: "I must follow the standard BODMAS rule to solve this equation."}
        {step: "THINK", content: "Looking at the equation, let's start with the Divison first"}
        {step: "ANALYZE", content: "Hmmm... Looks like we are following the standard rules of BODMAS to solve the equation which is right."}
        {step: "THINK", content: "The value of 2/1 will be 2. Now, the equation is 2 + 3 - 5 * 2"}
        {step: "ANALYZE", content: "2 is divided by 1 and it gives the output as 2, which is correct. we can move to next step now."}
        {step: "THINK", content: "5 * 2 will be 10. Now the equation will look something like 2 + 3 - 10"}
        {step: "ANALYZE", content: "5 multiplied by 2 equals to 10 is also correct. Till now equations seems right and following the BODMAS principle. Moving to next step"}
        {step: "THINK", content: "We will now go with Addition now. so 2 + 3 = 5. The updated equation will be 5 - 10"}
        {step: "ANALYZE", content: "That seems right 2 + 3 = 5. Moving to the next step now."}
        {step: "THINK", content: "Finally we will do the last equation that is substracting. 5 - 10 = -5"}
        {step: "ANALYZE", content: " 5 - 10 = -5 This equation also seems right and doesn't need any further inspections. The equation till here is absolutely correct."}
        {step: "OUTPUT", content: "The final output is -5"}

    `
    
    let outputArray = [
        { role: "system", content: SYSTEM_PROMPTS },
        { role: "user", content: "what is react" }
    ]

    while(true){
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: outputArray,
        })

        let parsedContent

        try{
            parsedContent = JSON.parse(response.choices[0].message.content)
        }catch(err){
            console.log("Received non JSON data")
        }

        outputArray.push({role: "assistant", content: response.choices[0].message.content})
        
        console.log(parsedContent)
        if(parsedContent.step === "OUTPUT"){
            break;
        }else if(parsedContent.step === 'THINK'){
            const thinkingModel = await thinkingModele.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [
                    ...outputArray,
                    {role: "assistant", content: JSON.stringify(parsedContent)}
                ],
            })
            const analyzedParsedContent =  JSON.parse(thinkingModel.choices[0].message.content)
            console.log(analyzedParsedContent)
            outputArray.push( {role:"assistant", content: thinkingModel.choices[0].message.content} )
            continue
        }
    }
}

main()