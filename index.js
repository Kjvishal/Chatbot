import { GoogleGenAI } from "@google/genai";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

async function main(input) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: input,
  });
  var ans = "";
  for await (const chunk of response) {
    ans += chunk.text + "";
  }
  return ans;
}

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));

var chatHistory = [];
app.get("/", (req, res) => {
  res.render("index.ejs", { chatHistory });
});

app.post("/chat", async (req, res) => {
  var input = req.body.inp;
  if (input.toLowerCase() === "clear") {
    res.redirect("/clear");
  } else if (input.toLowerCase() === "hii" || input.toLowerCase() === "hello") {
    var output = await main("Hii");
    chatHistory.push({ input: input, output: output });
    res.redirect("/");
  } else {
    var output = await main(
      input + " Give me answer in simple and short with out any bold and italic"
    );
    chatHistory.push({ input: input, output: output });
    res.redirect("/");
  }
});

app.get("/clear", (req, res) => {
  chatHistory = [];
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Listening");
});
