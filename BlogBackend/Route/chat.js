// routes/chat.js
// Add this to your BlogBackend
// Register in index.js: app.use('/api/chat', require('./Route/chat'));
// Install: npm install openai

const router = require("express").Router();
const OpenAI = require("openai");
const Blog = require("../Modal/BlogSchema");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
    try {
        const { messages } = req.body;

        // Fetch latest blogs from MongoDB to give AI context
        const blogs = await Blog.find()
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .limit(20)
            .select("title description user createdAt");

        const blogList = blogs
            .map(
                (b) =>
                    `- "${b.title}" by ${b.user?.name || "Unknown"} | ${b.description?.slice(0, 100)}...`
            )
            .join("\n");

        const systemPrompt = `You are Nexus — a smart, friendly AI assistant for BlogNest, a modern blogging platform.

YOUR JOB:
- Answer questions about blogs on this platform
- Help users find interesting content
- Summarize blog topics and themes
- Tell users about authors and their writing
- Give writing tips and encourage users to write blogs

CURRENT BLOGS ON THE PLATFORM:
${blogList || "No blogs published yet — encourage users to write the first one!"}

GUIDELINES:
- Be concise, friendly and enthusiastic about writing
- If asked about a specific blog, use the data above
- If asked something unrelated to blogging, gently redirect
- Keep responses under 120 words unless a detailed answer is needed
- Never make up blogs that aren't in the list above`;

        // Stream response
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            stream: true,
            max_tokens: 300,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;