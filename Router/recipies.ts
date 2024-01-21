import { Router } from "express";
import { Auth, Recipie } from "../Controllers";
const router = Router();
router.get("/", (req, res, next) => {
    res.json({ model: "resipe" });
});
router.post("/create", Auth.verifyToken, Recipie.create);
router.post("/bulkcreate", Auth.verifyToken, Recipie.create);
export default router;
