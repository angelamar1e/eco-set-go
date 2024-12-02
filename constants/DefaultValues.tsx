export const Multipliers = {
  "Weeks in a year": 52,
  "Days in a year": 365,
};

export const Car = {
  efPerKm: 0.2136499,
  kmTravelled: 19363,
  constructionScale: 4500,
  lifeSpan: 225000,
  footprintPerLiter: 2.33982,
  consumptionPerKm: 13,
  numOfPassengers: 1.58,
  user: "owner",
}

export const Airplane = {
  Airplane: {
    travelledByPlane: true,
    efPerKm: 0.129217,
    shortHaul: {
      aveDuration: 1,
      aveDistance: 310,
      duration: 2,
    },
    mediumHaul: {
      aveDuration: 3.5,
      aveDistance: 2190,
      duration: 0,
    },
    longHaul: {
      aveDuration: 12.5,
      aveDistance: 8012,
      duration: 0,
    },
  },
}

export const TransportEmission = {
  Car: {
    efPerKm: 0.2136499,
    kmTravelled: 19363,
    constructionScale: 4500,
    lifeSpan: 225000,
    footprintPerLiter: 2.33982,
    consumptionPerKm: 13,
    numOfPassengers: 1.58,
    user: "owner",
  },
  Airplane: {
    travelledByPlane: true,
    efPerKm: 0.129217,
    shortHaul: {
      aveDuration: 1,
      aveDistance: 310,
      duration: 2,
    },
    mediumHaul: {
      aveDuration: 3.5,
      aveDistance: 2190,
      duration: 3.5,
    },
    longHaul: {
      aveDuration: 12.5,
      aveDistance: 8012,
      duration: 25,
    },
  },
  TwoWheelers: {
    usesTwoWheelers: false,
    efPerKm: 0.08,
    kmTravelled: 32578.77,
  },
  EfficientTransport: {
    selectedTransports: [""],
    bicycle: {
      construction: 116,
      lifespan: 12,
    },
    electricBike: {
      efPerKm: 0.00223,
      kmTravelled: 400,
      construction: 262,
      lifespan: 12,
    },
    smallElectricVehicles: {
      efPerKm: 0.002,
      kmTravelled: 400,
      construction: 91.9,
      lifespan: 4,
    },
  },
  Train: {
    kmTravelled: 960,
    efPerKm: 0.03479,
  },
  PublicTransport: {
    selectedPublicTransport: ["jeep", "trike"],
    bus: {
      efPerKm: 0.2902192,
      aveSpeed: 12,
      hrsTravelled: 0.22,
    },
    jeepney: {
      efPerKm: 0.2902192,
      aveSpeed: 9,
      hrsTravelled: 0.33,
    },
    tricycle: {
      efPerKm: 0.1235702,
      aveSpeed: 19.94,
      hrsTravelled: 0.88,
    },
  },
};

// Define the emissions data for each food item
export type EmissionsData = {
  efPerKg: number;
  weightInKg: number;
};

// Food item type
export type FoodItem = keyof typeof MeanOneDayConsumption;

// Define MeanOneDayConsumption with corrected types
export const MeanOneDayConsumption: Record<string, EmissionsData> = {
  "Fish": { efPerKg: 3.2, weightInKg: 0.15 },
  "Pork": { efPerKg: 7.3, weightInKg: 0.15 },
  "Beef": { efPerKg: 42.8, weightInKg: 0.15 },
  "Chicken": { efPerKg: 6.1, weightInKg: 0.15 },
  "Pork or Chicken": { efPerKg: 6.8, weightInKg: 0.15 },
  "Vegetables": { efPerKg: 0.5, weightInKg: 0.15 },
  "Rice and Rice Products": { efPerKg: 3.8, weightInKg: 0.271 },
  "Corn and Corn Products": { efPerKg: 1, weightInKg: 0.011 },
  "Cereal Products": { efPerKg: 1.4, weightInKg: 0.045 },
  "Starchy Roots and Tubers": { efPerKg: 0.7, weightInKg: 0.007 },
  "Sugars and Syrups": { efPerKg: 1, weightInKg: 0.051 },
  "Cooking Oil": { efPerKg: 4.8, weightInKg: 0.006 },
  "Egg": { efPerKg: 4.5, weightInKg: 0.013 },
  "Milk": { efPerKg: 3.6, weightInKg: 0.005 },
  "Dried Beans, Nuts, and Seeds": { efPerKg: 1.1, weightInKg: 0.006 },
  "Fruits": { efPerKg: 0.7, weightInKg: 0.021 },
  "Condiments and Spices": { efPerKg: 11.9, weightInKg: 0.002 },
  "Others": { efPerKg: 6.8, weightInKg: 0.003 }
};

export const mealBase = ["Fish", "Pork", "Beef", "Chicken", "Pork or Chicken", "Vegetables"];

// Meal composition type: each meal name maps to an array of FoodItem strings
export type MealComposition = Record<string, FoodItem[]>;

// Define Meals with the correct structure
export const Meals: MealComposition = {
  "Traditional Filipino Breakfast": ["Fish", "Egg"],
  "Simple Rice Meal": ["Pork or Chicken"],
  "Dairy and Cereal": ["Cereal Products", "Milk"],
  "Bread and Jam": ["Cereal Products"],
  "Fruits": ["Fruits"],
  "No breakfast": [""],
  "Vegan": ["Vegetables"],
  "Vegetarian": ["Vegetables"],
  "Beef meat meal": ["Beef"],
  "Chicken meat meal": ["Chicken"],
  "Pork meat meal": ["Pork"],
  "Fish meat meal": ["Fish"]
};

export const Food = {
  defaultBreakfastType: "Traditional Filipino Breakfast",
  defaultMealFrequency: {
    "Vegan": 1,
    "Vegetarian": 1,
    "Beef meat meal": 1,
    "Chicken meat meal": 5,
    "Pork meat meal": 3,
    "Fish meat meal": 3,
  },
};

export const Beverages = {
  HotDrinks: {
    drinkTypeFrequency: {
      Coffee: 1,
      Tea: 0,
      "Hot Chocolate": 0,
    },
    drinkTypeEF: {
      coffee: 16.5,
      tea: 12.01,
      hotChoco: 18.7,
    },
    kgPerCup: {
      coffee: 0.012,
      tea: 0.002,
      hotChoco: 0.02,
    },
  },
  ColdDrinks: {
    sweetDrinks: {
      frequency: 1,
      litersPerDay: 0.305,
      ef: 0.71,
    },
    alcohol: {
      frequency: 1,
      litersPerDay: 0.017,
      ef: 1.2,
    },
  },
  BottledWater: {
    boughtRegularly: false,
    consumption: 1.8,
    ef: 0.27,
  },
};

export const ElectricityEmissions = {
  householdSize: 4.1,
  Grid: {
    ratePerKwh: 11.8569, // in pesos
    monthlySpend: 2371.38, // for 200 kWh
    efPerKwh: 0.6935, // per kWh
  },
  Solar: {
    isUsed: false,
    annualProduction: 1000,
    percentConsumed: 100,
  },
};
