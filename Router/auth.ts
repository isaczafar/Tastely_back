import { Router } from "express";
import { User, Auth, Token } from "../Controllers";
const router = Router();
router.get("/", (req, res, next) => {
    res.json({ model: "auth" });
});
router.post("/login", Auth.login);
router.post("/logout", Auth.verifyToken, Auth.logout);
router.post("/signup", User.checkExistingUser, Auth.signup);
router.post("/refreshtoken", Auth.refreshToken);
export default router;
