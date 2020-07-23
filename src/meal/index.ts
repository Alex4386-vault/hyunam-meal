import { JSDOM } from "jsdom";
import axios from "axios";

export function generateHyunamMealURL(dateForUrl: Date) {
    const year = dateForUrl.getFullYear();
    const month = dateForUrl.getMonth() + 1;
    const date = dateForUrl.getDate();

    return `http://www.hyunam.hs.kr/wah/main/schoolmeal/view.htm?menuCode=28&domain.year=${year}&domain.month=${month}&domain.day=${date}`;
}

export async function getHyunamMeal(date?: Date) {
    if (!date) {
        date = new Date();
    }

    const url = generateHyunamMealURL(date);

    const meal = await axios.get(generateHyunamMealURL(date), {
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36"
        }
    });

    const { window: { document } } = new JSDOM(meal.data);

    const mealDiv = document.getElementsByClassName("Schoolmeal_Cont_Cont_Cont")[0];
    const mealRawContent = mealDiv.innerHTML.trim();

    const mealTempArray = mealRawContent.replace(/\#/g,'').split("<br>");

    const mealArray = [];
    const allergicRegex = /(.+)\((.+)\)/g;

    for (const meal of mealTempArray) {
        let mealName = meal;
        let allergicArray: string[] = [];
        allergicRegex.lastIndex = 0;

        if (allergicRegex.test(meal)) {
            allergicRegex.lastIndex = 0;
            const parsed = (allergicRegex.exec(meal) as RegExpExecArray);

            mealName = parsed[1];
            const allergicData = parsed[2];

            allergicArray = allergicData.split(".").filter(a => a !== "");
        }

        mealArray.push({
            name: mealName,
            allergyInfo: allergicArray
        });
    }

    return mealArray;
}
