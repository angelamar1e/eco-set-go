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
  Lunches_Dinners: {
    weeklyMealsCount: {
      vegan: 1,
      vegetarian: 1,
      beef: 0,
      chicken: 5,
      pork: 5,
      fish: 2
    },
    mealsEf: {
      vegan: 0.004,
      vegetarian: 0.0265,
      pork: 0.7013,
      beef: 2.3,
      fish: 0.5561,
      chicken: 0.6485
    }
  }
}
