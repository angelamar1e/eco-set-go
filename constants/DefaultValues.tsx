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
    defaultSelected: ["bicycle"],
    bicycle : {
        construction: 116,
        lifespan: 12,
    },
    electricBike: {
        efPerKm: 0.00223,
        distanceTravelled: 400,
        construction: 262,
        lifespan: 12
    },
    smallElectricVehicles: {
        efPerKm: 0.002,
        distanceTravelled: 400,
        construction: 91.9,
        lifespan: 4
    }
  },
  Train: {
    kmTravelled: 960,
    efPerKm: 0.03479,
  },
  PublicTransport: {
    busEFperKm: 3.48,
    jeepneyEFperKm: 2.61,
    tricycleEFperKm: 2.46,
    hoursTravelled: 3.5
  }
};
