import { MealData } from "@/app/components/(tabs)/Home/MealAction";
import { EcoAction } from "./EcoAction";

export interface ActionItemProps {
  item: EcoAction;
  completedActions: EcoAction[];
  handleDelete: (id: string) => void;
  handleComplete: (actionId: string, template: number, impact: number, chosenMeal?: MealData, baseMeal?: MealData) => void;
}

export interface DoneItemProps extends ActionItemProps {
  handleUnmark: (id: string) => void;
}