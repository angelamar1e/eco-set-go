import {
  Beverages,
  FoodItem,
  mealBase,
  Meals,
  MeanOneDayConsumption,
  Multipliers,
  TransportEmission,
} from "@/constants/DefaultValues";
import { FlightData } from "@/types/FlightData";
import { ElectricityEmissions } from "../../constants/DefaultValues";

export function convertKgToGrams(inKg: number){
  let inGrams = inKg * 1000;

  return inGrams;
}

export function convertKgToTons(inKg: number) {
  // metric tons
  let inTons = inKg / 1000;

  return inTons;
}

export function convertGramsToKg(inGrams: number) {
  return inGrams / 1000; // Return the value in kilograms
}

export function convertGramsToTons(inGrams: number) {
  return inGrams / 1000000; // Return the value in tons
}

export function convertTonsToGrams(inTons: number) {
  return inTons * 1000000; // Return the value in tons
}

export function formatNumber(value: number) {
  // Check if the value is a whole number or has no effective decimal part
  if (Number.isInteger(value) || value.toFixed(2) === value.toString()) {
    return value.toFixed(0); // No decimals for whole numbers
  } else {
    return value.toFixed(2); // Two decimals for non-whole numbers
  }
}

// Function to convert grams to kg or display grams
export function conditionalConvertGramsToKg(inGrams: number) {
  // return as string to label as grams or kg
  if (inGrams >= 1000) {
    return formatNumber(inGrams / 1000) + " kg";
  } else {
    return formatNumber(inGrams) + " g"; // Return the value in grams
  }
}

export function computeImpact(higherEF: number, lessEF: number) {
  const impact = higherEF - lessEF;

  return impact;
}

export function frequencyMultiplier(value: number, multiplier: number) {
  let result = value * multiplier;

  return result;
}

export function getCarEFPerKm(footprintPerLiter: number, consumptionPerKm: number){
  return (consumptionPerKm / 100) * footprintPerLiter;
}

export function computeCarEmissions(
  kmTravelled: number,
  constructionScale: number,
  lifeSpanInKm: number,
  footprintPerLiter: number,
  consumptionPerKm: number,
  numOfPassengers: number,
  user: string
) {
  let carEmission: number;

  if (kmTravelled == 0) {
    return (carEmission = 0);
  }

  let efPerKm = getCarEFPerKm(footprintPerLiter, consumptionPerKm);
  let amortization = 1 / lifeSpanInKm;
  let constructionPerKm = constructionScale * amortization;
  let thresholdKm = lifeSpanInKm / 20;
  let manufacture: number;

  switch (user) {
    case "owner":
      manufacture = constructionPerKm * thresholdKm;
      break;
    case "non-owner":
      manufacture = constructionPerKm * kmTravelled;
      break;
    case "car-sharer":
      manufacture = 0;
      efPerKm = TransportEmission.Car.efPerKm;
      break;
    default:
      manufacture = constructionPerKm * thresholdKm;
      break;
  }

  let useOfCar: number = efPerKm * kmTravelled;
  carEmission = (useOfCar + manufacture) / numOfPassengers;

  return convertKgToTons(carEmission);
}

export function computeAirplaneEmission(data: FlightData): number {
  let aveSpeed: number = data["aveDistance"] / data["aveDuration"];
  let airplaneEmission: number =
    data["flightDuration"] * aveSpeed * TransportEmission.Airplane.efPerKm;

  return airplaneEmission;
}

export function computeTotalAirplaneEmissions(
  travelledbyPlane: boolean,
  shortHaulDuration: number,
  mediumHaulDuration: number,
  longHaulDuration: number
) {
  let airplaneEmission: number = 0;

  if (travelledbyPlane == false) {
    return airplaneEmission;
  } else {
    airplaneEmission += computeAirplaneEmission({
      aveDistance: TransportEmission.Airplane.shortHaul.aveDistance,
      aveDuration: TransportEmission.Airplane.shortHaul.aveDuration,
      flightDuration: shortHaulDuration,
    });
    airplaneEmission += computeAirplaneEmission({
      aveDistance: TransportEmission.Airplane.mediumHaul.aveDistance,
      aveDuration: TransportEmission.Airplane.mediumHaul.aveDuration,
      flightDuration: mediumHaulDuration,
    });
    airplaneEmission += computeAirplaneEmission({
      aveDistance: TransportEmission.Airplane.longHaul.aveDistance,
      aveDuration: TransportEmission.Airplane.longHaul.aveDuration,
      flightDuration: longHaulDuration,
    });
  }

  return convertKgToTons(airplaneEmission); // results in kg, converted to tons by dividing by 1000
}

export function computeTwoWheelersEmissions(
  usesTwoWheelers: boolean,
  efPerKm: number,
  kmTravelled: number
) {
  let twoWheelersEmissions = 0;

  if (usesTwoWheelers) {
    twoWheelersEmissions = kmTravelled * efPerKm;
    return convertKgToTons(twoWheelersEmissions);
  }

  return twoWheelersEmissions;
}

export function computeEfficientTravelEmissions(
  efPerKm: number,
  kmTravelled: number,
  construction: number,
  lifespan: number
) {
  const emissions = efPerKm * kmTravelled + construction / lifespan;

  return emissions;
}

export function computeBicycleEmissions() {
  let bicycleEmissions: number;

  const bicycleConstruction =
    TransportEmission.EfficientTransport.bicycle.construction;
  const bicycleLifespan = TransportEmission.EfficientTransport.bicycle.lifespan;

  return (bicycleEmissions = bicycleConstruction / bicycleLifespan);
}

export function computeTotalEfficientTravelEmissions(
  selectedTransports: string[],
  eBikeKmTravelled: number,
  smallVehKmTravelled: number
) {
  let efficientTravelEmissions = 0;

  if (selectedTransports.length === 0) {
    return efficientTravelEmissions;
  }
  if (selectedTransports.includes("bike")) {
    efficientTravelEmissions += computeBicycleEmissions();
  }
  if (selectedTransports.includes("eBike")) {
    efficientTravelEmissions += computeEfficientTravelEmissions(
      TransportEmission.EfficientTransport.electricBike.efPerKm,
      eBikeKmTravelled,
      TransportEmission.EfficientTransport.electricBike.construction,
      TransportEmission.EfficientTransport.electricBike.lifespan
    );
  }
  if (selectedTransports.includes("smallVh")) {
    efficientTravelEmissions += computeEfficientTravelEmissions(
      TransportEmission.EfficientTransport.smallElectricVehicles.efPerKm,
      smallVehKmTravelled,
      TransportEmission.EfficientTransport.smallElectricVehicles.construction,
      TransportEmission.EfficientTransport.smallElectricVehicles.lifespan
    );
  }

  return convertKgToTons(efficientTravelEmissions);
}

export function computeTrainEmissions(kmTravelled: number) {
  let trainEmissions = 0;

  trainEmissions = kmTravelled * TransportEmission.Train.efPerKm;

  return convertKgToTons(trainEmissions);
}

export function computePublicTransportEmissions(
  efPerKm: number,
  aveSpeed: number,
  hrsTravelled: number
) {
  let efPerHr: number;
  efPerHr = efPerKm * aveSpeed;
  const emissions = efPerHr * hrsTravelled * Multipliers["Weeks in a year"];

  return emissions;
}

export function computeTotalPublicTransportEmissions(
  selectedTransports: string[],
  busHrsTravelled: number,
  jeepHrsTravelled: number,
  tricycleHrsTravelled: number
) {
  let publicTransportEmissions = 0;

  if (selectedTransports.length === 0) {
    return publicTransportEmissions;
  }
  if (selectedTransports.includes("bus")) {
    publicTransportEmissions += computePublicTransportEmissions(
      TransportEmission.PublicTransport.bus.efPerKm,
      TransportEmission.PublicTransport.bus.aveSpeed,
      busHrsTravelled
    );
  }
  if (selectedTransports.includes("jeep")) {
    publicTransportEmissions += computePublicTransportEmissions(
      TransportEmission.PublicTransport.jeepney.efPerKm,
      TransportEmission.PublicTransport.jeepney.aveSpeed,
      jeepHrsTravelled
    );
  }
  if (selectedTransports.includes("trike")) {
    publicTransportEmissions += computePublicTransportEmissions(
      TransportEmission.PublicTransport.tricycle.efPerKm,
      TransportEmission.PublicTransport.tricycle.aveSpeed,
      tricycleHrsTravelled
    );
  }

  return convertKgToTons(publicTransportEmissions);
}

// Update the function to calculate breakfast emissions
export function computeBreakfastEmissions(breakfastEF: number): number {
  let breakfastEmission = 0;

  // Get the selected breakfast meal and corresponding weights
  breakfastEmission = breakfastEF * 365; // days in a year

  return convertKgToTons(breakfastEmission);
}

interface MealTypeFrequency {
  "Vegan": number;
  "Vegetarian": number;
  "Beef meat meal": number;
  "Chicken meat meal": number;
  "Pork meat meal": number;
  "Fish meat meal": number;
}

export function getAdditionals(breakfastType: string): FoodItem[] {
  let additionals: FoodItem[] = [];
  const breakfast = Meals[breakfastType];

  // Add item keys from MeanOneDayConsumption that are not in breakfast
  for (const item in MeanOneDayConsumption) {
    if (!(breakfast.includes(item)) && !(mealBase.includes(item))) {
      additionals.push(item); // Add the item key to additionals if not in breakfast
    }
  }

  return additionals;
}

// Type definition to include optional custom weights for each food item
export type CustomWeights = Record<FoodItem, number>;

export function computeMealEmission(
  mealType: string,
  additionals: FoodItem[],
  customWeights?: CustomWeights
): number {

  let baseMealEmission = 0;
  const mealComposition = Meals[mealType];

  // Use custom-weight emissions if provided
  if (customWeights) {
    baseMealEmission = calculateEmission(customWeights);
  }
  else {
    baseMealEmission = calculateEmission(mealComposition);
  }

  // Filter out "Egg" and "Milk" if the meal type is vegan
  if (mealType === "Vegan") {
    additionals = additionals.filter(item => item !== "Egg" && item !== "Milk");
  }

  // Calculate the additional emissions and add to base meal emission, adjusting by factor
  let mealEmission = baseMealEmission + (calculateEmission(additionals) / 3);

  return mealEmission;
}

// Helper function to calculate emissions from either an array or an object of custom weights
export function calculateEmission(items: FoodItem[] | CustomWeights): number {
  if (Array.isArray(items)) {
    // Process array of FoodItem strings
    return items.reduce((total, item) => {
      const data = MeanOneDayConsumption[item];
      if (!data) return total;  // Skip items not found in MeanOneDayConsumption
      const { efPerKg, weightInKg } = data;
      return total + efPerKg * weightInKg;
    }, 0);
  } else {
    // Process object with custom weights
    return Object.entries(items).reduce((total, [item, customWeight]) => {
      const data = MeanOneDayConsumption[item];
      if (!data) return total;  // Skip items not found in MeanOneDayConsumption
      const { efPerKg } = data;
      return total + efPerKg * customWeight;
    }, 0);
  }
}

export function computeTotalMealEmissions(
  beefMealEF: number,
  chickenMealEF: number,
  porkMealEF: number,
  fishMealEF: number,
  vegetarianMealEF: number,
  veganMealEF: number,
  frequency: MealTypeFrequency
) {
  let totalMealEmissions = 0;

  if (frequency["Beef meat meal"] > 0) {
    totalMealEmissions += beefMealEF * frequency["Beef meat meal"];
  }
  if (frequency["Pork meat meal"] > 0) {
    totalMealEmissions += porkMealEF * frequency["Pork meat meal"];
  }
  if (frequency["Chicken meat meal"] > 0) {
    totalMealEmissions += chickenMealEF * frequency["Chicken meat meal"];
  }
  if (frequency["Fish meat meal"] > 0) {
    totalMealEmissions += fishMealEF * frequency["Fish meat meal"];
  }
  if (frequency["Vegetarian"] > 0) {
    totalMealEmissions += vegetarianMealEF * frequency["Vegetarian"];
  }
  if (frequency["Vegan"] > 0) {
    totalMealEmissions += veganMealEF * frequency["Vegan"];
  }

  totalMealEmissions *= 52 // weeks in a year

  return convertKgToTons(totalMealEmissions);
}

export function computeAdditionals(addedFoodEF: number){
  let addedFoodEmissions = 0;
  
  addedFoodEmissions = addedFoodEF * Multipliers['Days in a year'];

  return convertKgToTons(addedFoodEmissions);
}

export function computeHotDrinkEmission(
  ef: number,
  kgPerCup: number,
  frequencyPerDay: number
) {
  let efPerCup = ef * kgPerCup;
  let hotDrinkEmission = frequencyPerDay * efPerCup

  return hotDrinkEmission;
}

interface DrinkTypeFrequency {
  Coffee: number;
  Tea: number;
  "Hot Chocolate": number;
}

export function computeTotalHotDrinksEmissions(frequency: DrinkTypeFrequency) {
  let totalHotDrinksEmissions = 0;

  if (frequency["Coffee"] > 0) {
    totalHotDrinksEmissions += computeHotDrinkEmission(
      Beverages.HotDrinks.drinkTypeEF.coffee,
      Beverages.HotDrinks.kgPerCup.coffee,
      frequency["Coffee"]
    ) * 365;
  }
  if (frequency["Tea"] > 0) {
    totalHotDrinksEmissions += computeHotDrinkEmission(
      Beverages.HotDrinks.drinkTypeEF.tea,
      Beverages.HotDrinks.kgPerCup.tea,
      frequency["Tea"]
    ) * 365;
  }
  if (frequency["Hot Chocolate"] > 0) {
    totalHotDrinksEmissions += computeHotDrinkEmission(
      Beverages.HotDrinks.drinkTypeEF.hotChoco,
      Beverages.HotDrinks.kgPerCup.hotChoco,
      frequency["Hot Chocolate"]
    ) * 365;
  }

  return convertKgToTons(totalHotDrinksEmissions);
}

export function computeColdDrinkEmission(
  frequency: number,
  litersPerDay: number,
  ef: number
) {
  let consumption = frequency * litersPerDay;

  let coldDrinkEmission = consumption * 52 * ef;

  return coldDrinkEmission;
}

export function computeTotalColdDrinkEmissions(
  sweetDrinksFrequency: number,
  alcoholFrequency: number
) {
  let totalColdDrinksEmissions = 0;

  if (sweetDrinksFrequency > 0) {
    totalColdDrinksEmissions += computeColdDrinkEmission(
      sweetDrinksFrequency,
      Beverages.ColdDrinks.sweetDrinks.litersPerDay,
      Beverages.ColdDrinks.sweetDrinks.ef
    );
  }
  if (alcoholFrequency > 0) {
    totalColdDrinksEmissions += computeColdDrinkEmission(
      alcoholFrequency,
      Beverages.ColdDrinks.alcohol.litersPerDay,
      Beverages.ColdDrinks.sweetDrinks.ef
    );
  }

  return convertKgToTons(totalColdDrinksEmissions);
}

export function computeBottledWaterEmissions(buysBottledWater: boolean) {
  let bottledWaterEmissions = 0;

  if (buysBottledWater) {
    let annualConsumption = Beverages.BottledWater.consumption * 365;
    bottledWaterEmissions = annualConsumption * Beverages.BottledWater.ef;
  }

  return convertKgToTons(bottledWaterEmissions);
}

export function computeGridConsumption(gridMonthlySpend: number) {
  let gridConsumption: number;

  gridConsumption =
    (gridMonthlySpend / ElectricityEmissions.Grid.ratePerKwh) * 12;

  return gridConsumption;
}

export function computeSolarProduction(
  solarProduction: number,
  solarConsumptionPercent: number
) {
  let solarConsumption = solarProduction * (solarConsumptionPercent / 100);

  return solarConsumption;
}

export function computeElectricityEmissions(
  householdSize: number,
  solarIsUsed: boolean,
  solarProduction: number,
  solarConsumptionPercent: number,
  gridMonthlySpend: number
) {
  let electricityEmissions = 0;
  let electricityConsumption = 0;

  // compute annual consumption
  electricityConsumption += computeGridConsumption(gridMonthlySpend);

  if (solarIsUsed) {
    electricityConsumption += computeSolarProduction(
      solarProduction,
      solarConsumptionPercent
    );
  }

  // compute annual emissions
  electricityEmissions =
    (electricityConsumption * ElectricityEmissions.Grid.efPerKwh) /
    householdSize;

  return convertKgToTons(electricityEmissions);
}
