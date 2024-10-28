// FOR VERCEL ROUTES
export default function handler(req, res) {
    const WEATHER_API = process.env.WEATHER_API; 
    if (!WEATHER_API) {
        return res.status(500).json({ error: 'Bearer token is not set' });
    }
    res.status(200).json({ WEATHER_API });
}