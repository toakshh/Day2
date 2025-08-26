const selfConsistency = ()=>{
    const SYSTEM_PROMPTS = ``

    return [
        {role: "system", content: SYSTEM_PROMPTS},
        {role: "user", content: "Give me the list of all types of system Prompts for AI"}
    ]
}

export default selfConsistency