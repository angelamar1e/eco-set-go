import { TransportEmission } from '@/constants/DefaultValues';
import { FlightData } from '@/types/FlightData';

export function converKgToTons(inTons: number){ // metric tons
    const inKg = inTons / 1000; 

    return inKg;
}

export function computeCarEmissions(
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
    
    let efPerKm = consumptionPerKm * footprintPerLiter;
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

    return converKgToTons(carEmission);
}

export function computeAirplaneEmission(data: FlightData): number{
    let aveSpeed: number = data['aveDistance'] / data['aveDuration'];
    let airplaneEmission: number = data['flightDuration'] * aveSpeed * TransportEmission.Airplane.efPerKm;

    return airplaneEmission
}

export function computeTotalAirplaneEmissions(
    travelledbyPlane: boolean,
    shortHaulDuration: number,
    mediumHaulDuration: number,
    longHaulDuration: number,
)
{
    let airplaneEmission: number = 0;

    if (travelledbyPlane == false){
        return airplaneEmission
    }
    else {
        airplaneEmission += computeAirplaneEmission({
            aveDistance: TransportEmission.Airplane.shortHaul.aveDistance,
            aveDuration: TransportEmission.Airplane.shortHaul.aveDuration,
            flightDuration: shortHaulDuration
        })
        airplaneEmission += computeAirplaneEmission({
            aveDistance: TransportEmission.Airplane.mediumHaul.aveDistance,
            aveDuration: TransportEmission.Airplane.mediumHaul.aveDuration,
            flightDuration: mediumHaulDuration
        })
        airplaneEmission += computeAirplaneEmission({
            aveDistance: TransportEmission.Airplane.longHaul.aveDistance,
            aveDuration: TransportEmission.Airplane.longHaul.aveDuration,
            flightDuration: longHaulDuration
        })
    }

    return converKgToTons(airplaneEmission); // results in kg, converted to tons by dividing by 1000
}

export function computeTwoWheelersEmissions(efPerKm: number, kmTravelled: number, usesTwoWheelers: boolean){
    let twoWheelersEmissions = 0;

    if (usesTwoWheelers) {
        twoWheelersEmissions = kmTravelled * efPerKm;
        return converKgToTons(twoWheelersEmissions);
    }

    return twoWheelersEmissions;
}

export function computeEfficientTravelEmissions(efPerKm: number, kmTravelled: number, construction: number, lifespan: number){
    const emissions = (efPerKm * kmTravelled) + (construction/lifespan)
    
    return emissions;
}

export function computeBicycleEmissions(){
    let bicycleEmissions: number;

    const bicycleConstruction = TransportEmission.EfficientTransport.bicycle.construction;
    const bicycleLifespan = TransportEmission.EfficientTransport.bicycle.lifespan;

    return bicycleEmissions = bicycleConstruction / bicycleLifespan;
}

export function computeTotalEfficientTravelEmissions(
    selectedTransports: string[],
    eBikeKmTravelled: number,
    smallVehKmTravelled: number,
){
    let efficientTravelEmissions = 0;

    if ('bike' in selectedTransports){
        efficientTravelEmissions += computeBicycleEmissions();
    }
    if ('eBike' in selectedTransports){
        efficientTravelEmissions += computeEfficientTravelEmissions(
            TransportEmission.EfficientTransport.electricBike.efPerKm,
            eBikeKmTravelled,
            TransportEmission.EfficientTransport.electricBike.construction, 
            TransportEmission.EfficientTransport.electricBike.lifespan)
    }
    if ('smallVh' in selectedTransports){
        efficientTravelEmissions += computeEfficientTravelEmissions(
            TransportEmission.EfficientTransport.smallElectricVehicles.efPerKm,
            smallVehKmTravelled,
            TransportEmission.EfficientTransport.smallElectricVehicles.construction,
            TransportEmission.EfficientTransport.smallElectricVehicles.lifespan)
    }

    return converKgToTons(efficientTravelEmissions);
}