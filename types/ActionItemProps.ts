import { EcoAction } from "./EcoAction";

export interface ActionItemProps {
  item: EcoAction;
  completedActions: EcoAction[];
  handleDelete: (id: string) => void;
  handleComplete: (actionId: string, impact: number) => void;
}

export interface DoneItemProps extends ActionItemProps {
  handleUnmark: (id: string) => void;
}