import { TransportEmission } from '@/constants/DefaultValues';

export function computeCarEmissions(
    efPerKm: number,
    kmTravelled: number, 
    constructionScale: number,
    lifeSpanInKm : number,
    footprintPerLiter: number,
    consumptionPerKm: number,
    numOfPassengers: number,
    user: string)
{
    let carEmission: number;

    if (kmTravelled == 0){
        return carEmission = 0;
    }
    
    efPerKm = consumptionPerKm * footprintPerLiter;
    let amortization: number = 1 / lifeSpanInKm;
    let constructionPerKm: number = constructionScale * amortization;
    let thresholdKm: number = lifeSpanInKm / 20;
    let manufacture: number;

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