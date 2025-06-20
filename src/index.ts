import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import 'dotenv/config';
import { z } from "zod"

// const generateTextExample = async () => {
//     const result = await generateText({
//         model: google('gemini-2.0-flash-lite', {useSearchGrounding: true}),
//         prompt: "When is the next google build key?",
//     });
//     console.log(result.text);
//     console.log(result.sources);
// };

// const toolCalling = async () => {
//     const result = await generateText({
//         model: google('gemini-2.0-flash-lite'),
//         prompt: "What's 10 + 5?",
//         maxSteps: 3,
//         tools: {
//             addNumbers: tool({
//                 description: "Add two numbers together",
//                 parameters: z.object({
//                     num1: z.number(),
//                     num2: z.number()
//                 }),
//                 execute: async ({num1, num2}) => {
//                     const sum = num1 + num2;
//                     return sum
//                 }
//             })
//         }
//     });
//     console.log(result.steps.length)
//     console.log(result.text)
// };

const main = async () => {
    const result = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: "What is the weather in Nairobi and Nakuru, then add the temperatures together. Please infer the latitudes and longitudes",
        maxSteps: 10,
        tools: {
            addTemperatureValues: tool({
                description: "Add two temperatures together",
                parameters: z.object({
                    value1: z.number(),
                    value2: z.number()
                }),
                execute: async ({value1, value2}) => {
                    const sum = value1 + value2;
                    return sum
                }
            }),
            getWeather: tool({
                description: "Get the temperature at a location",
                parameters: z.object({
                    latitude: z.number(),
                    longitude: z.number(),
                    city: z.string()
                }),
                execute: async ({latitude, longitude, city}) => {
                   const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`,
                   )
                   const weatherData = await response.json()
                   return{
                        temperature: weatherData.current.temperature_2m,
                        weatherCode: weatherData.current.weathercode,
                        humidity: weatherData.current.relativehumidity_2m,
                        city
                   }
                }
            })
        }
    });
    console.log(result.steps.length)
    console.log(result.text)
};

main();