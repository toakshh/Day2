import OpenAI from "openai"
import "dotenv/config"

const agent = async() => {

    const SYSTEM_PROMPTS = `
    You are an AI Assitant who works on START, THINK, and OUTPUT format. For a given user query, first think and breakdown the problems into sub-problems.
    You should always keep thinking before giving te actual output. Before giving the final output, you must check if the flow and output is correct. You have some tools as well to call from. Feel free to use them when necessary.
    
    For every tool call , wait for the response from the tool

    Available ToolS:
    - getWeatherData(cityName: string) : Returns the current weather data of the city.

    Rules: 
    - strictly follow the JSON output format.
    - Always follow the process of output as START, THINKING , OBSERVE, and OUTPUT.
    - Always perform one step at a time and wait for other step.
    - Alwyas make sure to do multiple steps of thinking and analyzing before giving the actual output.

    OUTPUT JSON Format:
    {   "step": "START" | "THINK" | "OUTPUT" | "OBSERVE" | "TOOL", 
        "content" : string,
        "tool_name": string,
        "input" : string
    }
        
    Example: 
    -U: can you tell me the current weather in Delhi ?
    -A: {step: "START" , content: "The User wants to know about the current weather details of Delhi."}
    -A: {step: "THINK", content: " Let me see if i have any tool for that."}
    -A: {step: "THINK", content: "I can see there's a tool to fetch weather data of a particular place."}
    -A: {step: "THINK", content: "Let's fetch the current data through tool and wait for its result."}
    -A: {step: "TOOL", input: "Delhi", tool_name: getWeatherData}
    -D: {step: "OBSERVE", content: "The weather is cloudy with 27 deg cel in Delhi."}
    -A: {step: "OUTPUT", content: "Woo ! seems like it's chilly 2 deg cel in Delhi right now. Don't forget to take your jacket out."}
    `

    let outputArray = [
        { role: "system", content: SYSTEM_PROMPTS },
        { role: "user", content: "what's the weather in pune now?" }
    ]

    const getWeatherData = async (cityName)=>{
        try{
            const res = await fetch(`https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`,{
                responseType: 'text'
            })
            const response = await res.text();
            return `The current weather in ${cityName} is ${response}`
        }catch(e){
            console.log("Error while fetching data ", e)
        }
    }

    const TOOL_MAP = {getWeatherData}

    const aiAgent = new OpenAI()
    while(true){

        try{
            const res = await aiAgent.chat.completions.create({
                model: "o3-mini",
                messages: outputArray,
            })

            const response = JSON.parse(res.choices[0].message.content)

            outputArray.push({role: "assistant", content: JSON.stringify(response)})
            console.log(response)
            if(response.step === "OUTPUT"){
                break
            }else if(response.step === "TOOL"){
                const tool_to_call = response.tool_name
                if(!TOOL_MAP[tool_to_call]){
                    outputArray.push({
                        role: "developer",
                        content: "There is no such tool to get the weather data as of now."
                    })
                    continue;        
                }
                await TOOL_MAP[tool_to_call](`${response.input}`);
                // console.log(weatherResult)
            }else{
                continue
            }
        }catch(err){
            console.log(err)
        }

    }

}

agent()