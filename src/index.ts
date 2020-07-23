import express from "express";
import { getHyunamMeal } from "./meal";

const app = express();

app.get("/meal", async (req, res) => {
    const content = await getHyunamMeal();
    res.json({
        success: true,
        data: content
    });
});

app.listen(3000);
console.log("Listening on port 3000!");

