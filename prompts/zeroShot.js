// zeroshot prompting :-  

const zeroShot = ()=> {
    const SYSTEM_PROMPTS = ``

    return [
        {role: "system", content: SYSTEM_PROMPTS},
        {role: "user", content: "Give me the list of all types of system Prompts for AI"}
    ]
}

export default zeroShot