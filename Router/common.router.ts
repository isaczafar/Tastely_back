import { Router } from "express";
import { Common } from "../Controllers";
const router = Router();
router.get("/", Common.buildQuery, Common.list);
router.get("/:id", Common.getById);
router.get(
    "/(:prop1/:val1)(/:prop2/:val2)?(/:prop3/:val3)?(/:prop4/:val4)?(/:prop5/:val5)?(/:prop6/:val6)?(/:prop7/:val7)?(/:prop8/:val8)?",
    Common.buildQuery,
    Common.list,
);

export default router;
