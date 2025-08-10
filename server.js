const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Mistral } = require("@mistralai/mistralai");

dotenv.config();
console.log("Loaded API Key:", process.env.MISTRAL_API_KEY ? "✅ Found" : "❌ Missing");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const portfolioData = `
Hari is an AI Developer and a B.Tech student specializing in Artificial Intelligence and Machine Learning at Kongu Engineering College, with a CGPA of 8.14 (2022–present). He has strong expertise in AI application development, RAG chatbot systems, and full-stack solutions. His resume is available at: https://drive.google.com/file/d/1kkPXVIm-WrqQYtKSwYPqElLXoaC3bqA2/view?usp=sharing. His GitHub profile is https://github.com/Hari-Kec and his LinkedIn profile is https://linkedin.com/in/h-a-r-i.

From January 2025 to February 2025, Hari worked as an AI Developer at Mawad Online, where he built a Retrieval-Augmented Generation (RAG) chatbot for answering customer queries. This involved using Python, LangChain, OpenAI APIs, and Vector Databases to ensure accurate and efficient responses. 

Between July 2024 and December 2024, he worked as a Full Stack AI Developer at Punchbiz, where he built an enterprise billing software solution that combined full-stack web development with AI-powered features.

From February 2024 to April 2024, Hari worked as a Full Stack Developer at Centillion Labs, where he developed Aristotle AI — a private chatbot — as part of a team. The tech stack included React, Vertex AI, and AWS Bedrock.

Hari’s technical skills cover multiple areas:  
In Machine Learning and Deep Learning, he is proficient with TensorFlow, PyTorch, Keras, OpenCV, YOLO, NLTK, Hugging Face, FastAPI, Streamlit, RAG Pipelines, LangChain, LangGraph, AWS Bedrock, Google Vertex AI, MCP, MLOps, Prompt Engineering, OpenAI, and Google Gemini.  
In programming and web development, he works with Java, C, Python, React.js, JavaScript, Tailwind CSS, Node.js, Express.js, RESTful APIs, and React Native.  
In databases and cloud technologies, he uses MongoDB, PostgreSQL, SQL, AWS, Google Cloud Platform, Firebase, Docker, and Git.  
His tools include GitHub, Figma, Power BI, Tableau, Jupyter Notebook, and Google Colab.

Hari has built numerous projects, including:  
1. FaceSwap AI — an application for face-swapping in images and videos.  
2. MCP Chatbot — a multi-service AI chatbot.  
3. CareerBuildAI — an AI-powered job search assistant.  
4. LangGraph News Chatbot — a real-time news search chatbot.  
5. Vehicle Tracking System — a live bus tracking application.  
6. Text-to-SQL LLM — a Gemini-powered SQL query generator.  
7. Yoga Pose Detection and Correction system.  
8. Chatbot for Resume Analysis.  
9. Task Assignment Platform for managers and employees.  
10. Book Recommendation Web App.  
11. Face Attendance System and Hostel Management System.  
12. Ingredient Health Checker and Analyzer.  
13. Craters and Boulders Detection and Enhancement of Permanently Shadowed Images.  
14. Movie Ticket Booking System.

This portfolio contains all of Hari’s professional experiences, skills, and projects for reference.

`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    const response = await client.chat.complete({
  model: "mistral-medium-latest",
  messages: [
    {
      role: "user",
      content: `
You are an AI chatbot that must answer ONLY from the following portfolio data. 
If the information is not explicitly present, reply with: "Not found in portfolio."

Portfolio Data:
${portfolioData}

User question: ${message}
`
    }
  ],
  temperature: 0,
  maxTokens: 1024,
  topP: 1
});


    let reply = response.choices[0]?.message?.content || "No answer found.";
    reply = reply.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]*)`/g, '$1');
    res.json({ reply });
  } catch (error) {
    console.error("Mistral API Error:", error);
    res.status(500).json({ reply: "Error fetching response from Mistral API." });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
