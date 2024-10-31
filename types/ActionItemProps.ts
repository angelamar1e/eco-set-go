import { MealData } from "@/app/components/(tabs)/Home/MealAction";
import { EcoAction } from "./EcoAction";

export interface ActionItemProps {
  item: EcoAction;
  completedActions: EcoAction[];
  handleDelete: (id: string) => void;
  handleComplete: (actionId: string, template: number, impact: number, baseMeal?: MealData, chosenMeal?: MealData, vehicleHigherEF?: number, vehicleLessEF?: number) => void;
}

export interface DoneItemProps extends ActionItemProps {
  handleUnmark: (id: string) => void;
}