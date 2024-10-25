export const Multipliers = {
  "Weeks in a year": 52,
  "Days in a year": 365
}

export const TransportEmission = {
  Car: {
    efPerKm: 0.2136499,
    kmTravelled: 3650,
    constructionScale: 4500,
    lifeSpan: 225000,
    footprintPerLiter: 2.33982,
    consumptionPerKm: 13,
    numOfPassengers: 2,
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
    }
  },
  TwoWheelers: {
    usesTwoWheelers: false,
    efPerKm: 0.08,
    kmTravelled: 2000
  },
  EfficientTransport: {
    selectedTransports: ['bike',],
    bicycle : {
        construction: 116,
        lifespan: 12,
    },
    electricBike: {
        efPerKm: 0.00223,
        kmTravelled: 400,
        construction: 262,
        lifespan: 12
    },
    smallElectricVehicles: {
        efPerKm: 0.002,
        kmTravelled: 400,
        construction: 91.9,
        lifespan: 4
    }
  },
  Train: {
    kmTravelled: 960,
    efPerKm: 0.03479,
  },
  PublicTransport: {
    selectedPublicTransport: ['bus', 'jeep', 'trike'],
    bus: {
      efPerKm: 0.2902192,
      aveSpeed: 12,
      hrsTravelled: 1
    },
    jeepney: {
      efPerKm: 0.2902192,
      aveSpeed: 9,
      hrsTravelled: 1
    },
    tricycle: {
      efPerKm: 0.1235702,
      aveSpeed: 19.94,
      hrsTravelled: 1
    }
  }
};

export const FoodEmission = {
  Breakfast: {
    type: 'Traditional Filipino Breakfast',
    ef: 0.06528 // Simple rice meal EF as default EF
  },
  LunchesDinners: {
    mealTypeFrequency: {
      'Vegan': 0,
      'Vegetarian': 1,
      'Beef meat meal': 1,
      'Chicken meat meal': 5,
      'Pork meat meal': 5,
      'Fish meat meal': 2
    },
    mealTypeEF: {
      vegan: 0.004,
      vegetarian: 0.0265,
      pork: 0.7013,
      beef: 2.3,
      fish: 0.5561,
      chicken: 0.6485
    }
  },
  HotDrinks: {
    drinkTypeFrequency: {
      'Coffee': 1,
      'Tea': 0,
      'Hot Chocolate': 0
    },
    drinkTypeEF: {
      coffee: 16.5,
      tea: 0.03,
      hotChoco: 18.7
    },
    kgPerCup: {
      coffee: 0.012,
      tea: 0.25,
      hotChoco: 0.02
    }
  },
  ColdDrinks: {
    sweetDrinks: {
      frequency: 1,
      litersPerDay: 0.305,
      ef: 0.71
    },
    alcohol: {
      frequency: 1,
      litersPerDay: 0.017,
      ef: 1.2
    }
  },
  BottledWater: {
    boughtRegularly: false,
    consumption: 1.8,
    ef: 0.27
  }
}

export const ElectricityEmissions = {
  householdSize: 4,
  Grid: {
    ratePerKwh: 11.6339, // in pesos
    monthlySpend: 2326.78, // for 200 kWh
    efPerKwh: 0.6935 // per kWh
  },
  Solar: {
    isUsed: false,
    annualProduction: 2000,
    percentConsumed: 100,
  }
}

type Meal = Record<string, number>;
type CompositeKey = string;

export const weightDistribution: Record<CompositeKey, Meal> = {
  // Traditional Filipino Breakfast
  "Traditional Filipino Breakfast:Breakfast": {
    "Fish": 0.044,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
    "Vegetables": 0.01933,
  },
  "Traditional Filipino Breakfast:Fish meat meal": {
    "Fish": 0.044,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
    "Vegetables": 0.01933,
  },
  "Traditional Filipino Breakfast:Chicken meat meal": {
    "Chicken": 0.044,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
    "Vegetables": 0.01933,
  },
  "Traditional Filipino Breakfast:Pork meat meal": {
    "Pork": 0.044,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
    "Vegetables": 0.01933,
  },
  "Traditional Filipino Breakfast:Beef meat meal": {
    "Beef": 0.044,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
    "Vegetables": 0.01933,
  },
  "Traditional Filipino Breakfast:Vegetarian meal": {
    "Vegetables": 0.06333,
    "Egg": 0.00433,
    "Cooking Oil": 0.002,
  },
  "Traditional Filipino Breakfast:Vegan meal": {
    "Vegetables": 0.06333,
    "Cooking Oil": 0.002,
  },
  "Traditional Filipino Breakfast:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Other Cereal Products": 0.045,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Milk": 0.005,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Fruits": 0.021,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },

  // Simple Rice Meal
  "Simple Rice Meal:Breakfast": {
    "Pork or Chicken": 0.044,
    "Cooking Oil": 0.002,
  },
  "Simple Rice Meal:Fish meat meal": {
    "Fish": 0.044,
    "Egg": 0.0065,
    "Cooking Oil": 0.002,
    "Vegetables": 0.029,
  },
  "Simple Rice Meal:Chicken meat meal": {
    "Chicken": 0.044,
    "Egg": 0.0065,
    "Cooking Oil": 0.002,
    "Vegetables": 0.029,
  },
  "Simple Rice Meal:Pork meat meal": {
    "Pork": 0.044,
    "Egg": 0.0065,
    "Cooking Oil": 0.002,
    "Vegetables": 0.029,
  },
  "Simple Rice Meal:Beef meat meal": {
    "Beef": 0.044,
    "Egg": 0.0065,
    "Cooking Oil": 0.002,
    "Vegetables": 0.029,
  },
  "Simple Rice Meal:Vegetarian meal": {
    "Vegetables": 0.073,
    "Egg": 0.0065,
    "Cooking Oil": 0.002,
  },
  "Simple Rice Meal:Vegan meal": {
    "Vegetables": 0.073,
    "Cooking Oil": 0.002,
  },
  "Simple Rice Meal:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Other Cereal Products": 0.045,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Milk": 0.005,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Fruits": 0.021,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },

  // Dairy and Cereal
  "Dairy and Cereal:Breakfast": {
    "Other Cereal Products": 0.045,
    "Milk": 0.005,
  },
  "Dairy and Cereal:Fish meat meal": {
    "Fish": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Dairy and Cereal:Chicken meat meal": {
    "Chicken": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Dairy and Cereal:Pork meat meal": {
    "Pork": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Dairy and Cereal:Beef meat meal": {
    "Beef": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Dairy and Cereal:Vegetarian meal": {
    "Vegetables": 0.0945,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
  },
  "Dairy and Cereal:Vegan meal": {
    "Vegetables": 0.0945,
    "Cooking Oil": 0.004,
  },
  "Dairy and Cereal:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Fruits": 0.021,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },

  // Bread and Jam
  "Bread and Jam:Breakfast": {
    "Other Cereal Products": 0.045,
  },
  "Bread and Jam:Fish meat meal": {
    "Fish": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Bread and Jam:Chicken meat meal": {
    "Chicken": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Bread and Jam:Pork meat meal": {
    "Pork": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Bread and Jam:Beef meat meal": {
    "Beef": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Bread and Jam:Vegetarian meal": {
    "Vegetables": 0.0945,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
  },
  "Bread and Jam:Vegan meal": {
    "Vegetables": 0.0945,
    "Cooking Oil": 0.004,
  },
  "Bread and Jam:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Milk": 0.005,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Fruits": 0.021,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },

  // Fruits
  "Fruits:Breakfast": {
    "Fruits": 0.021,
  },
  "Fruits:Fish meat meal": {
    "Fish": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Fruits:Chicken meat meal": {
    "Chicken": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Fruits:Pork meat meal": {
    "Pork": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Fruits:Beef meat meal": {
    "Beef": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "Fruits:Vegetarian meal": {
    "Vegetables": 0.0945,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
  },
  "Fruits:Vegan meal": {
    "Vegetables": 0.0945,
    "Cooking Oil": 0.004,
  },
  "Fruits:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Other Cereal Products": 0.045,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Milk": 0.005,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },

  // No Breakfast
  "No breakfast:Breakfast": {},
  "No breakfast:Fish meat meal": {
    "Fish": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "No breakfast:Chicken meat meal": {
    "Chicken": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "No breakfast:Pork meat meal": {
    "Pork": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "No breakfast:Beef meat meal": {
    "Beef": 0.0655,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
    "Vegetables": 0.029,
  },
  "No breakfast:Vegetarian meal": {
    "Vegetables": 0.0945,
    "Egg": 0.0065,
    "Cooking Oil": 0.004,
  },
  "No breakfast:Vegan meal": {
    "Vegetables": 0.0945,
    "Cooking Oil": 0.004,
  },
  "No breakfast:Additionals": {
    "Rice and Rice Products": 0.271,
    "Corn and Corn Products": 0.011,
    "Other Cereal Products": 0.045,
    "Starchy Roots and Tubers": 0.007,
    "Sugars and Syrups": 0.051,
    "Milk": 0.005,
    "Dried Beans, Nuts, and Seeds": 0.006,
    "Fruits": 0.021,
    "Condiments and Spices": 0.002,
    "Others": 0.003,
  },
};

export const FoodItemEF = {
  "Rice and Rice Products": 3.8,
  "Corn and Corn Products": 1,
  "Other Cereal Products": 1.4,
  "Starchy Roots and Tubers": 0.7,
  "Sugars and Syrups": 1,
  "Cooking Oil": 4.8,
  "Fish": 3.2,
  "Pork": 7.3,
  "Beef": 42.8,
  "Chicken": 6.1,
  "Pork or Chicken": 6.8,
  "Egg": 4.5,
  "Milk": 3.6,
  "Dried Beans, Nuts, and Seeds": 1.1,
  "Vegetables": 0.5,
  "Fruits": 0.7,
  "Condiments and Spices": 11.9,
  "Others": 6.8
}