import { TransportEmission } from '@/constants/DefaultValues';

export function computeCarEmissions({
    efPerKm = TransportEmission.Car.efPerKm,
    kmTravelled = TransportEmission.Car.kmTravelled,
    constructionScale = TransportEmission.Car.constructionScale,
    lifeSpanInKm = TransportEmission.Car.lifeSpan, 
    footprintPerLiter = TransportEmission.Car.footprintPerLiter,
    consumptionPerKm = TransportEmission.Car.consumptionPerKm, 
    numOfPassengers = TransportEmission.Car.numOfPassengers,
    user = TransportEmission.Car.user
} = {}): number
{
    efPerKm = consumptionPerKm * footprintPerLiter;
    let amortization: number = 1 / lifeSpanInKm;
    let constructionPerKm: number = constructionScale * amortization;
    let thresholdKm: number = lifeSpanInKm / 20;
    let manufacture: number;
    let carEmission: number;

    switch (user) {
        case 'owner': 
            manufacture = constructionPerKm * thresholdKm
            break;
        case 'non-owner': 
            manufacture = constructionPerKm * kmTravelled
            break;
        case 'car-sharer':
            manufacture = 0
            efPerKm = TransportEmission.Car.efPerKm
            break;
        default: 
            manufacture = constructionPerKm * thresholdKm
            break;
        }
    
    let useOfCar: number = efPerKm * kmTravelled;
    carEmission = (useOfCar + manufacture) / numOfPassengers
    return carEmission / 1000 // results in kg, converted to tons by dividing by 1000
}