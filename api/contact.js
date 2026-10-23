const recipient = "jdaulong03@gmail.com";

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !from) {
        return res.status(503).json({
            error: "Email delivery is not configured. Please try again later."
        });
    }

    const { name, email, message } = req.body || {};
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (
        cleanName.length < 1 ||
        cleanName.length > 100 ||
        cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
        cleanMessage.length < 1 ||
        cleanMessage.length > 5000
    ) {
        return res.status(400).json({
            error: "Enter a valid name, email address, and message (up to 5,000 characters)."
        });
    }

    const subjectName = cleanName.replace(/[\r\n]+/g, " ");

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from,
                to: [recipient],
                reply_to: cleanEmail,
                subject: `Portfolio message from ${subjectName}`,
                text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`
            })
        });

        if (!response.ok) {
            console.error("Resend email request failed:", response.status, await response.text());
            return res.status(502).json({
                error: "The email service could not send your message. Please try again later."
            });
        }

        return res.status(200).json({ message: "Message sent." });
    } catch (error) {
        console.error("Unable to reach Resend:", error);
        return res.status(502).json({
            error: "The email service is temporarily unavailable. Please try again later."
        });
    }
};
