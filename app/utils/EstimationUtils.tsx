import { TransportEmission } from '@/constants/DefaultValues';
import { FlightData } from '@/types/FlightData';

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

export function computeAirplaneEmission(data: FlightData): number{
    let aveSpeed: number = data['aveDistance'] / data['aveDuration'];
    let airplaneEmission: number = data['flightDuration'] * aveSpeed * TransportEmission.Airplane.efPerKm;
    return airplaneEmission
}

export function computeTotalAirplaneEmissions(
    shortHaul: FlightData,
    mediumHaul: FlightData,
    longHaul: FlightData,
    travelledbyPlane: boolean,
)
{
    let airplaneEmission: number = 0;
    if (travelledbyPlane == false){
        return airplaneEmission
    }
    if (shortHaul) {
        airplaneEmission += computeAirplaneEmission(shortHaul)
    }
    if (mediumHaul) {
        airplaneEmission += computeAirplaneEmission(mediumHaul)
    }
    if (longHaul) {
        airplaneEmission += computeAirplaneEmission(longHaul)
    }
    return airplaneEmission / 1000 // results in kg, converted to tons by dividing by 1000
}

export function computeTwoWheelersEmissions(efPerKm: number, kmTravelled: number, usesTwoWheelers: boolean){
    let twoWheelersEmissions = 0;

    if (usesTwoWheelers) {
        twoWheelersEmissions = kmTravelled * efPerKm;
        return twoWheelersEmissions / 1000;
    }
    return twoWheelersEmissions;
}