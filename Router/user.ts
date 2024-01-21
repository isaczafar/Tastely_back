import { Router } from "express";
const router = Router();
router.use((req, res, next) => {
    res.json({ model: "user" });
    return;
});

export default router;
