import { Request, Response, NextFunction, Router } from "express";
import Event from "../../data/models/event/Event";

const router = Router();

/**
 * GET /event/latest?limit=200
 */
router.get("/latest", async (req: Request, res: Response, next: NextFunction) => {
    const limit = Math.min(parseInt((req.query.limit as string) || "200", 10), 1000);

    try {
        const events = await Event.find({})
            .sort({ date: -1 })
            .limit(limit);

        return res.status(200).send(events);
    } catch (error) {
        console.error("Couldn't retrieve latest events", error);
        return res.status(500).send(error);
    }
});

export default router;
