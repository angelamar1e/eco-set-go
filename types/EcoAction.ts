import { template } from '@babel/core';
export interface EcoAction {
    id: string;
    title: string;
    impact: number;
    category: string;
    updated_at: Date;
    template: number;
    options?: Map<string,number>;
    baseMeal?: Map<string, string>;
    baseEmission?: string;
    defaultKmTravelled?: number
}