// import { NextRequest, NextResponse } from "next/server";
// import Together from "together-ai";

// const together = new Together({
//   apiKey: process.env.TOGETHER_API_KEY, // set in your .env file
// });

// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json();

//     // Example: Running LLaMA-3 through Together
//     const response = await together.chat.completions.create({
//       model: "meta-llama/Llama-3-8b-chat-hf", // You can also use 70B if needed
//       messages: [
//         { role: "user", content: data.message }
//       ],
//     });

//     return NextResponse.json({
//       message: response.choices?.[0]?.message?.content ?? "",
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message ?? JSON.stringify(error) },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // set in your .env file
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Example: Running LLaMA-3 through Together
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3-8b-chat-hf", // You can also use 70B if needed
      messages: [
        { role: "user", content: data.message }
      ],
    });

    // Safely access response.choices[0]?.message?.content to avoid possible undefined errors
    return NextResponse.json({
      message: response.choices?.[0]?.message?.content ?? "No response from model",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? JSON.stringify(error) },
      { status: 500 }
    );
  }
}