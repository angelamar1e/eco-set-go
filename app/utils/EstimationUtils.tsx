import { FoodEmission, TransportEmission } from '@/constants/DefaultValues';
import { FlightData } from '@/types/FlightData';
import { ElectricityEmissions } from '../../constants/DefaultValues';

export function converKgToTons(inTons: number){ // metric tons
    let inKg = inTons / 1000; 

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
    
    let efPerKm = (consumptionPerKm / 100) * footprintPerLiter;
    let amortization = 1 / lifeSpanInKm;
    let constructionPerKm = constructionScale * amortization;
    let thresholdKm = lifeSpanInKm / 20;
    let manufacture: number;

    switch (user) {
        case 'owner': 
            manufacture = constructionPerKm * thresholdKm
            break;
        case 'non-owner': 
            manufacture = constructionPerKm * kmTravelled
            break;
        case 'car-sharer':
            manufacture = 0;
            efPerKm = TransportEmission.Car.efPerKm;
            break;
        default: 
            manufacture = constructionPerKm * thresholdKm;
            break;
        }
    
    let useOfCar: number = efPerKm * kmTravelled;
    carEmission = (useOfCar + manufacture) / numOfPassengers;

    return carEmission / 1000;
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

export function computeTwoWheelersEmissions(usesTwoWheelers: boolean, efPerKm: number, kmTravelled: number){
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

    if (selectedTransports.length === 0){
        return efficientTravelEmissions;
    }
    if (selectedTransports.includes('bike')){
        efficientTravelEmissions += computeBicycleEmissions();
    }
    if (selectedTransports.includes('eBike')){
        efficientTravelEmissions += computeEfficientTravelEmissions(
            TransportEmission.EfficientTransport.electricBike.efPerKm,
            eBikeKmTravelled,
            TransportEmission.EfficientTransport.electricBike.construction, 
            TransportEmission.EfficientTransport.electricBike.lifespan)
    }
    if (selectedTransports.includes('smallVh')){
        efficientTravelEmissions += computeEfficientTravelEmissions(
            TransportEmission.EfficientTransport.smallElectricVehicles.efPerKm,
            smallVehKmTravelled,
            TransportEmission.EfficientTransport.smallElectricVehicles.construction,
            TransportEmission.EfficientTransport.smallElectricVehicles.lifespan)
    }

    return converKgToTons(efficientTravelEmissions);
}

export function computeTrainEmissions(kmTravelled: number){
    let trainEmissions = 0;

    trainEmissions = kmTravelled * TransportEmission.Train.efPerKm;

    return converKgToTons(trainEmissions);
}

export function computePublicTransportEmissions(efPerKm: number, aveSpeed: number, hrsTravelled: number){
    let efPerHr: number;
    efPerHr = efPerKm * aveSpeed;
    const emissions = (efPerHr * hrsTravelled) * 52 // weeks in a year
    
    return emissions;
}
export function computeTotalPublicTransportEmissions(
    selectedTransports: string[],
    busHrsTravelled: number,
    jeepHrsTravelled: number,
    tricycleHrsTravelled: number,
){
    let publicTransportEmissions = 0;

    if (selectedTransports.length === 0){
        return publicTransportEmissions;
    }
    if (selectedTransports.includes('bus')){
        publicTransportEmissions += computePublicTransportEmissions(
            TransportEmission.PublicTransport.bus.efPerKm,
            TransportEmission.PublicTransport.bus.aveSpeed,
            busHrsTravelled
        );
    }
    if (selectedTransports.includes('jeep')){
        publicTransportEmissions += computePublicTransportEmissions(
            TransportEmission.PublicTransport.jeepney.efPerKm,
            TransportEmission.PublicTransport.jeepney.aveSpeed,
            jeepHrsTravelled
        );
    }
    if (selectedTransports.includes('trike')){
        publicTransportEmissions += computePublicTransportEmissions(
            TransportEmission.PublicTransport.tricycle.efPerKm,
            TransportEmission.PublicTransport.tricycle.aveSpeed,
            tricycleHrsTravelled
        );
    }

    return converKgToTons(publicTransportEmissions);
}

export function computeBreakfastEmissions(breakfastEf: number){
    let breakfastEmission = 0;

    if (breakfastEf > 0){
        breakfastEmission = breakfastEf * 365; // days in a year
    }

    return converKgToTons(breakfastEmission);
}

export function computeMealEmission(ef: number, frequencyPerWeek: number){
    let mealEmission: number;

    mealEmission = (frequencyPerWeek * 52) * ef;

    return mealEmission;
}

interface MealTypeFrequency {
    'Vegan': number,
    'Vegetarian': number,
    'Beef meat meal': number,
    'Chicken meat meal': number,
    'Pork meat meal': number,
    'Fish meat meal': number;
}

export function computeTotalMealEmissions(frequency: MealTypeFrequency){
    let totalMealEmissions = 0;
    
    if (frequency['Beef meat meal'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.beef, frequency['Beef meat meal']);
    }
    if (frequency['Chicken meat meal'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.chicken, frequency['Chicken meat meal']);
    }
    if (frequency['Fish meat meal'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.fish, frequency['Fish meat meal']);
    }
    if (frequency['Pork meat meal'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.pork, frequency['Pork meat meal']);
    }
    if (frequency['Vegan'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.vegan, frequency['Vegan']);
    }
    if (frequency['Vegetarian'] > 0){
        totalMealEmissions += computeMealEmission(FoodEmission.LunchesDinners.mealTypeEF.vegetarian, frequency['Vegetarian']);
    }

    return converKgToTons(totalMealEmissions);
}

export function computeHotDrinkEmission(ef: number, kgPerCup: number, frequencyPerDay: number){
    let efPerCup = ef * kgPerCup;
    let hotDrinkEmission = (frequencyPerDay * efPerCup) * 365; // days in a year
    
    return hotDrinkEmission;
}

interface DrinkTypeFrequency {
    'Coffee': number,
    'Tea': number,
    'Hot Chocolate': number
}

export function computeTotalHotDrinksEmissions(frequency: DrinkTypeFrequency){
    let totalHotDrinksEmissions = 0;
    
    if (frequency['Coffee'] > 0){
        totalHotDrinksEmissions += computeHotDrinkEmission(FoodEmission.HotDrinks.drinkTypeEF.coffee, FoodEmission.HotDrinks.kgPerCup.coffee, frequency['Coffee']);
    }
    if (frequency['Tea'] > 0){
        totalHotDrinksEmissions += computeHotDrinkEmission(FoodEmission.HotDrinks.drinkTypeEF.tea, FoodEmission.HotDrinks.kgPerCup.tea, frequency['Tea']);
    }
    if (frequency['Hot Chocolate'] > 0){
        totalHotDrinksEmissions += computeHotDrinkEmission(FoodEmission.HotDrinks.drinkTypeEF.hotChoco, FoodEmission.HotDrinks.kgPerCup.hotChoco, frequency['Hot Chocolate']);
    }

    return converKgToTons(totalHotDrinksEmissions);
}

export function computeColdDrinkEmission(frequency: number, litersPerDay: number, ef: number){
    let consumption = (frequency * litersPerDay);

    let coldDrinkEmission = (consumption * 52) * ef;

    return coldDrinkEmission;
}

export function computeTotalColdDrinkEmissions(sweetDrinksFrequency: number, alcoholFrequency: number){
    let totalColdDrinksEmissions = 0;

    if (sweetDrinksFrequency > 0){
        totalColdDrinksEmissions += computeColdDrinkEmission(sweetDrinksFrequency, FoodEmission.ColdDrinks.sweetDrinks.litersPerDay, FoodEmission.ColdDrinks.sweetDrinks.ef);
    }
    if (alcoholFrequency > 0){
        totalColdDrinksEmissions += computeColdDrinkEmission(alcoholFrequency, FoodEmission.ColdDrinks.alcohol.litersPerDay, FoodEmission.ColdDrinks.sweetDrinks.ef);
    }

    return converKgToTons(totalColdDrinksEmissions);
}

export function computeBottledWaterEmissions(buysBottledWater: boolean){
    let bottledWaterEmissions = 0;

    if (buysBottledWater){
        let annualConsumption = FoodEmission.BottledWater.consumption * 365 
        bottledWaterEmissions = annualConsumption * FoodEmission.BottledWater.ef;
    }

    return converKgToTons(bottledWaterEmissions);
}

export function computeGridConsumption(gridMonthlySpend: number){
    let gridConsumption: number;

    gridConsumption = (gridMonthlySpend / ElectricityEmissions.Grid.ratePerKwh) * 12;
    
    return gridConsumption;
}

export function computeSolarProduction(solarProduction: number, solarConsumptionPercent: number){
    let solarConsumption = solarProduction * (solarConsumptionPercent / 100);

    return solarConsumption;
}

export function computeElectricityEmissions(householdSize: number, solarIsUsed: boolean, solarProduction: number, solarConsumptionPercent: number, gridMonthlySpend: number){
    let electricityEmissions = 0;
    let electricityConsumption = 0;
    
    // compute annual consumption
    electricityConsumption += computeGridConsumption(gridMonthlySpend);

    if (solarIsUsed){
        electricityConsumption += computeSolarProduction(solarProduction, solarConsumptionPercent);
    }

    // compute annual emissions
    electricityEmissions = (electricityConsumption * ElectricityEmissions.Grid.ef) / householdSize;

    return converKgToTons(electricityEmissions);
}