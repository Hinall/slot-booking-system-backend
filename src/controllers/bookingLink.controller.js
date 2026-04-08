import BookingLink from "../models/bookingLink.model.js";

function randomSlug() {
    return `user-${Math.random().toString(36).substring(2, 8)}`;
}

export async function generateLink(req, res) {
    try {
        const userId = req.user.id;

        let link;
        for (let attempt = 0; attempt < 10; attempt += 1) {
            const slug = randomSlug();
            try {
                link = await BookingLink.create({ userId, slug });
                break;
            } catch (err) {
                if (err?.code === 11000) continue;
                throw err;
            }
        }

        if (!link) {
            return res.status(500).json({ message: "Could not generate unique link" });
        }

        res.json(link);
    } catch (error) {
        console.error("generateLink:", error);
        res.status(500).json({ message: "Error generating link" });
    }
}

export async function getLinkBySlug(req, res) {
    try {
        const { slug } = req.params;

        const link = await BookingLink.findOne({ slug });

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        res.json(link);
    } catch (error) {
        console.error("getLinkBySlug:", error);
        res.status(500).json({ message: "Server error" });
    }
}
