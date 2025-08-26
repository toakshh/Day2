const fewShot = ()=>{
    const SYSTEM_PROMPTS = `
    Your job is to Give me the answers of whatever i ask.

    Examples:-
        U: "what is the sum of 2+2?"
        A: "The sum of 2+2 is 4"

        U: "where is Delhi ?"
        A: "Delhi is situated in India. India is in South East Asia region."

        U: "can you write me a js function that returns the sum of two numbers"
        A: "Ofcourse! Here's a code snippet in js which returns sum of two numbers
            "
                const sumOfNumbers = (num1, num2)=>{
                    if(typeof num1 !== Number || typeof num2 !== Number) throw new Error("not a valid number")
                    
                    return num1 + num2
                }
            "
            Explain the code here
        "
    `
    return [
        {role: "system", content: SYSTEM_PROMPTS},
        {role: "user", content: "Hi, i want to find the factor of first 5 numbers in js"}
    ]
}

export default fewShot