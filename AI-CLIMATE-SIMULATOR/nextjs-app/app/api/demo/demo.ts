import Together from "together-ai";

const together = new Together({apiKey : ""});
const imageUrl = "https://huggingface.co/datasets/patrickvonplaten/random_img/resolve/main/yosemite.png";

export async function RunTogether() {
  const response = await together.chat.completions.create({
    model: "meta-llama/Llama-Vision-Free",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Describe what you see in this image." },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }]
  });
  
  console.log(response.choices[0]?.message?.content);
}



