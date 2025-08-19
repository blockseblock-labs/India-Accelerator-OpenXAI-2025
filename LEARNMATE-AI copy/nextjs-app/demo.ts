import Together from "together-ai";

// const together = new Together(c7571a9043c9536bd3df2c89ea51fce39c369563264e328a92ea33765c33abd6);
// TOGETHER_API_KEY=c7571a9043c9536bd3df2c89ea51fce39c369563264e328a92ea33765c33abd6
 // auth defaults to process.env.TOGETHER_API_KEY
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY! });

const response = await together.chat.completions.create({
  messages: [
    {
      role: "user",
      content: "What are some fun things to do in New York?"
    }
  ],
  model: "openai/gpt-oss-120b"
});

console.log(response.choices[0].message.content)