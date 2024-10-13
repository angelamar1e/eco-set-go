import { FlightData } from '../types/FlightData';
export const TransportEmission = {
  Car: {
    efPerKm: 0.2136499,
    kmTravelled: 3650,
    constructionScale: 4500,
    lifeSpan: 225000,
    footprintPerLiter: 2.33982,
    consumptionPerKm: 0.13,
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
    ef: 0.06528 // Simple rice meal EF 
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
      'Hot chocolate': 0
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
      consumption: 0.305,
      ef: 0.71
    },
    alcohol: {
      consumption: 0.017,
      ef: 1.2
    }
  },
  BottledWater: {
    consumption: 1.8,
    ef: 0.27
  }
}

export const ElectricityEmissions = {
  householdSize: 4,
  Grid: {
    householdConsumption: 200,
    ef: 0.6935
  },
  Solar: {
    isUsed: false,
    annualProduction: 2000,
    percentConsumed: 1,
  }
}