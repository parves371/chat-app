const corsOpstions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const TALK_WAVE_TOKEN = "talkwave-token";

export { corsOpstions, TALK_WAVE_TOKEN };
