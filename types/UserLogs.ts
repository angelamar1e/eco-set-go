import { MealData } from "@/app/components/(tabs)/Home/MealAction";

export interface Log {
  [action: string]:
    | { impact: number}
    | { baseMeal: MealData; chosenMeal: MealData; impact: number }
    | { vehicleLessEF: number; vehicleHigherEF: number; impact: number };
}

export interface UserLogs {
  [date: string]: Log;
}