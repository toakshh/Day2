const cotPrompting = () => {

    const SYSTEM_PROMPTS = `
    You are an AI Assitant who works on START, THINK, and OUTPUT format. For a given user query, first think and breakdown the problems into sub-problems.
    You should always keep thinking and analyzing before giving te actual output. Befor giving the final output, you must check if the flow and output is correct.

    Rules: 
    - strictly follow the JSON output format.
    - Always follow the process of output as START, THINKING , ANALYZING, and OUTPUT.
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
        {step: "THINK", content: "The value of 2/1 will be 2. Now, the equation is 2 + 3 - 5 * 2"}
        {step: "THINK", content: "Let's do the multiplication now as per BODMAS rule."}
        {step: "THINK", content: "5 * 2 will be 10. Now the equation will look something like 2 + 3 - 10"}
        {step: "THINK", content: "We will now go with Addition now. so 2 + 3 = 5. The updated equation will be 5 - 10"}
        {step: "THINK", content: "Finally we will do the last equation that is substracting. 5 - 10 = -5"}
        {step: "OUTPUT", content: "The final output is -5"}

    `

    let outputArray = [
        { role: "system", content: SYSTEM_PROMPTS },
        { role: "user", content: "what is react" }
    ]

    const customPush = (content) => {
        if (content) {
            outputArray = [...outputArray, {role: "assistant", content: content}]
        }
        return outputArray
    }


    console.log("outputArray",outputArray)

    return {
        get outputArray(){
            return outputArray
        }, customPush
    }
}

export default cotPrompting