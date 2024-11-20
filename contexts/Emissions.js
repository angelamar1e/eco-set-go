import React, { createContext, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import {
  computeBottledWaterEmissions,
  computeBreakfastEmissions,
  computeCarEmissions,
  computeElectricityEmissions,
  computeTotalAirplaneEmissions,
  computeTotalColdDrinkEmissions,
  computeTotalEfficientTravelEmissions,
  computeTotalHotDrinksEmissions,
  computeTotalMealEmissions,
  computeTotalPublicTransportEmissions,
  computeTrainEmissions,
  computeTwoWheelersEmissions,
  computeMealEmission,
  getAdditionals,
  computeHotDrinkEmission,
  getCarEFPerKm,
} from "@/app/utils/EstimationUtils";
import {
  Car,
  ElectricityEmissions,
  Beverages,
  TransportEmission,
  Food,
} from "@/constants/DefaultValues";
import { useUserContext } from "./UserContext";

export const EmissionsContext = createContext();

export const EmissionsProvider = ({ children }) => {
  const { userUid, role } = useUserContext();
  const [initialized, setInitialized] = useState(false);
  const [newOverallFootprint, setNewOverallFootprint] = useState(0);

  // Load initial data from Firestore for the logged-in user
  const initializeData = async () => {
    const doc = await firestore()
      .collection("emissions_data")
      .doc(userUid)
      .get();
    const data = doc.exists ? doc.data() : {};

    // Car emissions data
    setKmTravelled(data.carKmTravelled ?? Car.kmTravelled);
    setConstructionScale(data.carConstructionScale ?? Car.constructionScale);
    setLifeSpanInKm(data.carLifeSpanInKm ?? Car.lifeSpan);
    setFootprintPerLiter(data.carFootprintPerLiter ?? Car.footprintPerLiter);
    setConsumptionPerKm(data.carConsumptionPerKm ?? Car.consumptionPerKm);
    setNumOfPassengers(data.carNumOfPassengers ?? Car.numOfPassengers);
    setUser(data.carUser ?? Car.user);
    setCarEFPerKm(
      data.carEFPerKm ?? getCarEFPerKm(footprintPerLiter, consumptionPerKm)
    );
    setCarEmissions(data.carEmissions ?? 0);

    // Air travel emissions data
    setTravelledByPlane(
      data.travelledByPlane ?? TransportEmission.Airplane.travelledByPlane
    );
    setShortHaulDuration(
      data.airTravelShortHaulDuration ??
        TransportEmission.Airplane.shortHaul.duration
    );
    setMediumHaulDuration(
      data.airTravelMediumHaulDuration ??
        TransportEmission.Airplane.mediumHaul.duration
    );
    setLongHaulDuration(
      data.airTravelLongHaulDuration ??
        TransportEmission.Airplane.longHaul.duration
    );

    // Two-wheelers emissions data
    setUsesTwoWheelers(
      data.usesTwoWheelers ?? TransportEmission.TwoWheelers.usesTwoWheelers
    );
    setTwoWheelerEFPerKm(
      data.twoWheelerEFPerKm ?? TransportEmission.TwoWheelers.efPerKm
    );
    setTwoWheelersKmTravelled(
      data.twoWheelersKmTravelled ?? TransportEmission.TwoWheelers.kmTravelled
    );

    // Efficient travel modes emissions data
    setSelectedTransports(
      data.selectedEfficientTransports ??
        TransportEmission.EfficientTransport.selectedTransports
    );
    setEBikeKmTravelled(
      data.eBikeKmTravelled ??
        TransportEmission.EfficientTransport.electricBike.kmTravelled
    );
    setSmallVehKmTravelled(
      data.smallEVehKmTravelled ??
        TransportEmission.EfficientTransport.smallElectricVehicles.kmTravelled
    );

    // Train travel emissions data
    setTrainKmTravelled(
      data.trainKmTravelled ?? TransportEmission.Train.kmTravelled
    );

    // Public transportation emissions data
    setSelectedPublicTransport(
      data.selectedPublicTransport ??
        TransportEmission.PublicTransport.selectedPublicTransport
    );
    setBusHrsTravelled(
      data.busHrsTravelled ?? TransportEmission.PublicTransport.bus.hrsTravelled
    );
    setJeepHrsTravelled(
      data.jeepHrsTravelled ??
        TransportEmission.PublicTransport.jeepney.hrsTravelled
    );
    setTricycleHrsTravelled(
      data.tricycleHrsTravelled ??
        TransportEmission.PublicTransport.tricycle.hrsTravelled
    );

    // Breakfast emissions data
    setBreakfastType(data.breakfastType ?? Food.defaultBreakfastType);
    setAdditionals(data.foodAdditionals ?? getAdditionals(breakfastType));
    setBreakfastEF(
      data.breakfastEF ?? computeMealEmission(breakfastType, additionals)
    );
    setTraditionalBreakfastEF(
      data.traditionalBreakfastEF ??
        computeMealEmission("Traditional Filipino Breakfast", additionals)
    );
    setSimpleBreakfastEF(
      data.simpleBreakfastEF ??
        computeMealEmission("Simple Rice Meal", additionals)
    );
    setCerealsBreakfastEF(
      data.cerealsBreakfastEF ??
        computeMealEmission("Dairy and Cereal", additionals)
    );
    setBreadBreakfastEF(
      data.breadBreakfastEF ?? computeMealEmission("Bread and Jam", additionals)
    );
    setFruitsBreakfastEF(
      data.fruitsBreakfastEF ?? computeMealEmission("Fruits", additionals)
    );

    // Meals emissions data
    setMealTypeFrequency(data.mealTypeFrequency ?? Food.defaultMealFrequency);
    setBeefMealEF(
      data.beefMealEF ?? computeMealEmission("Beef meat meal", additionals)
    );
    setChickenMealEF(
      data.chickenMealEF ??
        computeMealEmission("Chicken meat meal", additionals)
    );
    setPorkMealEF(
      data.porkMealEF ?? computeMealEmission("Pork meat meal", additionals)
    );
    setFishMealEF(
      data.fishMealEF ?? computeMealEmission("Fish meat meal", additionals)
    );
    setVegetarianMealEF(
      data.vegetarianMealEF ?? computeMealEmission("Vegetarian", additionals)
    );
    setVeganMealEF(
      data.veganMealEF ?? computeMealEmission("Vegan", additionals)
    );

    // Drinks emissions data (hot and cold)
    setHotDrinksFrequency(
      data.hotDrinksFrequency ?? Beverages.HotDrinks.drinkTypeFrequency
    );
    setCoffeeEmissions(
      data.coffeeEmissions ?? computeHotDrinkEmission(hotDrinksFrequency.Coffee)
    );

    // Electricity emissions data
    setHouseholdSize(data.householdSize ?? ElectricityEmissions.householdSize);
    setUsesSolarPanels(
      data.usesSolarPanels ?? ElectricityEmissions.Solar.isUsed
    );
    setSolarProduction(
      data.solarProduction ?? ElectricityEmissions.Solar.annualProduction
    );
    setSolarConsumptionPercent(
      data.solarConsumptionPercent ?? ElectricityEmissions.Solar.percentConsumed
    );
    setGridMonthlySpend(
      data.gridMonthlySpend ?? ElectricityEmissions.Grid.monthlySpend
    );

    // Set initialized to true after all states are set
    setInitialized(true);
  };

  useEffect(() => {
    if (role === "user" && userUid) {
      initializeData();
    }
  }, [userUid]);

  // Calculate total emissions after all individual emissions data has been initialized
  useEffect(() => {
    if (initialized) {
      // Calculate each emission category
      const calculatedCarEmissions = computeCarEmissions(
        kmTravelled,
        constructionScale,
        lifeSpanInKm,
        footprintPerLiter,
        consumptionPerKm,
        numOfPassengers,
        user
      );

      const calculatedAirplaneTravelEmissions = computeTotalAirplaneEmissions(
        travelledByPlane,
        shortHaulDuration,
        mediumHaulDuration,
        longHaulDuration
      );

      const calculatedTwoWheelersEmissions = computeTwoWheelersEmissions(
        usesTwoWheelers,
        twoWheelerEFPerKm,
        twoWheelersKmTravelled
      );

      const calculatedEfficientTravelEmissions =
        computeTotalEfficientTravelEmissions(
          selectedTransports,
          eBikeKmTravelled,
          smallVehKmTravelled
        );

      const calculatedTrainEmissions = computeTrainEmissions(trainKmTravelled);

      const calculatedPublicTransportEmissions =
        computeTotalPublicTransportEmissions(
          selectedPublicTransport,
          busHrsTravelled,
          jeepHrsTravelled,
          tricycleHrsTravelled
        );

      const calculatedBreakfastEmissions =
        computeBreakfastEmissions(breakfastEF);

      const calculatedMealEmissions = computeTotalMealEmissions(
        beefMealEF,
        chickenMealEF,
        porkMealEF,
        fishMealEF,
        vegetarianMealEF,
        veganMealEF,
        mealTypeFrequency
      );

      const calculatedHotDrinksEmissions =
        computeTotalHotDrinksEmissions(hotDrinksFrequency);

      const calculatedColdDrinksEmissions = computeTotalColdDrinkEmissions(
        sweetDrinksFrequency,
        alcoholFrequency
      );

      const calculatedElectricityEmissions = computeElectricityEmissions(
        householdSize,
        usesSolarPanels,
        solarProduction,
        solarConsumptionPercent,
        gridMonthlySpend
      );

      // Update each emissions state with calculated values
      setCarEmissions(calculatedCarEmissions);
      setAirplaneTravelEmissions(calculatedAirplaneTravelEmissions);
      setTwoWheelersEmissions(calculatedTwoWheelersEmissions);
      setEfficientTravelEmissions(calculatedEfficientTravelEmissions);
      setTrainEmissions(calculatedTrainEmissions);
      setPublicTransportEmissions(calculatedPublicTransportEmissions);
      setBreakfastEmissions(calculatedBreakfastEmissions);
      setMealEmissions(calculatedMealEmissions);
      setHotDrinksEmissions(calculatedHotDrinksEmissions);
      setColdDrinksEmissions(calculatedColdDrinksEmissions);
      setElectricityEmissions(calculatedElectricityEmissions);

    const newFoodEmissions =
      breakfastEmissions +
      mealEmissions +
      hotDrinksEmissions +
      coldDrinksEmissions +
      bottledWaterEmissions;

    const newTransportEmissions =
      carEmissions +
      airplaneTravelEmissions +
      twoWheelersEmissions +
      efficientTravelEmissions +
      trainEmissions +
      publicTransportEmissions;

    setFoodFootprint(newFoodEmissions);
    setTransportationFootprint(newTransportEmissions);
    setElectricityFootprint(electricityEmissions);
    }
  }, [initialized,
    carEmissions,
    airplaneTravelEmissions,
    twoWheelersEmissions,
    efficientTravelEmissions,
    trainEmissions,
    publicTransportEmissions,
    breakfastEmissions,
    mealEmissions,
    hotDrinksEmissions,
    coldDrinksEmissions,
    bottledWaterEmissions,
    electricityEmissions]);

  // Persist state changes to Firestore for specific emissions data
  const persistState = (field, value) => {
    if (userUid) {
      firestore()
        .collection("emissions_data")
        .doc(userUid)
        .set({ [field]: value }, { merge: true });
    }
  };

  // Define and persist car emissions state
  const [kmTravelled, setKmTravelled] = useState(Car.kmTravelled);
  const [constructionScale, setConstructionScale] = useState(
    TransportEmission.Car.constructionScale
  );
  const [lifeSpanInKm, setLifeSpanInKm] = useState(
    TransportEmission.Car.lifeSpan
  );
  const [footprintPerLiter, setFootprintPerLiter] = useState(
    TransportEmission.Car.footprintPerLiter
  );
  const [consumptionPerKm, setConsumptionPerKm] = useState(
    TransportEmission.Car.consumptionPerKm
  );
  const [numOfPassengers, setNumOfPassengers] = useState(
    TransportEmission.Car.numOfPassengers
  );
  const [user, setUser] = useState(TransportEmission.Car.user);
  const [carEFPerKm, setCarEFPerKm] = useState(
    getCarEFPerKm(footprintPerLiter, consumptionPerKm)
  );
  const [carEmissions, setCarEmissions] = useState(
    computeCarEmissions(
      kmTravelled,
      constructionScale,
      lifeSpanInKm,
      footprintPerLiter,
      consumptionPerKm,
      numOfPassengers,
      user
    )
  );

  // Calculate car-related emissions based on various parameters
  useEffect(() => {
    const newCarEmissions = computeCarEmissions(
      kmTravelled,
      constructionScale,
      lifeSpanInKm,
      footprintPerLiter,
      consumptionPerKm,
      numOfPassengers,
      user
    );

    // Update local state for car emissions
    setCarEmissions(newCarEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("carKmTravelled", kmTravelled);
      persistState("carConstructionScale", constructionScale);
      persistState("carLifeSpanInKm", lifeSpanInKm);
      persistState("carFootprintPerLiter", footprintPerLiter);
      persistState("carConsumptionPerKm", consumptionPerKm);
      persistState("carNumOfPassengers", numOfPassengers);
      persistState("carUser", user);
      persistState("carEFPerKm", carEFPerKm);
      persistState("carEmissions", newCarEmissions); // Persist calculated car emissions
    }
  }, [
    kmTravelled,
    constructionScale,
    lifeSpanInKm,
    footprintPerLiter,
    consumptionPerKm,
    numOfPassengers,
    user,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist airplane emissions state
  const [travelledByPlane, setTravelledByPlane] = useState(
    TransportEmission.Airplane.travelledByPlane
  );
  const [shortHaulDuration, setShortHaulDuration] = useState(
    TransportEmission.Airplane.shortHaul.duration
  );
  const [mediumHaulDuration, setMediumHaulDuration] = useState(
    TransportEmission.Airplane.mediumHaul.duration
  );
  const [longHaulDuration, setLongHaulDuration] = useState(
    TransportEmission.Airplane.longHaul.duration
  );
  const [airplaneTravelEmissions, setAirplaneTravelEmissions] = useState(
    computeTotalAirplaneEmissions(
      travelledByPlane,
      shortHaulDuration,
      mediumHaulDuration,
      longHaulDuration
    )
  );

  useEffect(() => {
    // Calculate the new airplane travel emissions based on various parameters
    const newAirplaneEmissions = computeTotalAirplaneEmissions(
      travelledByPlane,
      shortHaulDuration,
      mediumHaulDuration,
      longHaulDuration
    );

    // Update the local state for airplane travel emissions
    setAirplaneTravelEmissions(newAirplaneEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("travelledByPlane", travelledByPlane);
      persistState("airTravelShortHaulDuration", shortHaulDuration);
      persistState("airTravelMediumHaulDuration", mediumHaulDuration);
      persistState("airTravelLongHaulDuration", longHaulDuration);
      persistState("airTravelEmissions", newAirplaneEmissions); // Persist calculated airplane emissions
    }
  }, [
    travelledByPlane,
    shortHaulDuration,
    mediumHaulDuration,
    longHaulDuration,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist two-wheeler emissions state
  const [usesTwoWheelers, setUsesTwoWheelers] = useState(
    TransportEmission.TwoWheelers.usesTwoWheelers
  );
  const [twoWheelerEFPerKm, setTwoWheelerEFPerKm] = useState(
    TransportEmission.TwoWheelers.efPerKm
  );
  const [twoWheelersKmTravelled, setTwoWheelersKmTravelled] = useState(
    TransportEmission.TwoWheelers.kmTravelled
  );
  const [twoWheelersEmissions, setTwoWheelersEmissions] = useState(
    computeTwoWheelersEmissions(
      usesTwoWheelers,
      twoWheelerEFPerKm,
      twoWheelersKmTravelled
    )
  );

  useEffect(() => {
    // Calculate the new two-wheelers emissions based on various parameters
    const newTwoWheelersEmissions = computeTwoWheelersEmissions(
      usesTwoWheelers,
      twoWheelerEFPerKm,
      twoWheelersKmTravelled
    );

    // Update the local state for two-wheelers emissions
    setTwoWheelersEmissions(newTwoWheelersEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("usesTwoWheelers", usesTwoWheelers);
      persistState("twoWheelerEFPerKm", twoWheelerEFPerKm);
      persistState("twoWheelersKmTravelled", twoWheelersKmTravelled);
      persistState("twoWheelersEmissions", newTwoWheelersEmissions); // Persist calculated two-wheelers emissions
    }
  }, [
    usesTwoWheelers,
    twoWheelerEFPerKm,
    twoWheelersKmTravelled,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist efficient transport emission variables
  const [selectedTransports, setSelectedTransports] = useState(
    TransportEmission.EfficientTransport.selectedTransports
  );
  const [eBikeKmTravelled, setEBikeKmTravelled] = useState(
    TransportEmission.EfficientTransport.electricBike.kmTravelled
  );
  const [smallVehKmTravelled, setSmallVehKmTravelled] = useState(
    TransportEmission.EfficientTransport.smallElectricVehicles.kmTravelled
  );
  const [efficientTravelEmissions, setEfficientTravelEmissions] = useState(
    computeTotalEfficientTravelEmissions(
      selectedTransports,
      eBikeKmTravelled,
      smallVehKmTravelled
    )
  );

  useEffect(() => {
    // Calculate the new efficient travel emissions based on selected parameters
    const newEfficientTravelEmissions = computeTotalEfficientTravelEmissions(
      selectedTransports,
      eBikeKmTravelled,
      smallVehKmTravelled
    );

    // Update the local state for efficient travel emissions
    setEfficientTravelEmissions(newEfficientTravelEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("selectedEfficientTransports", selectedTransports);
      persistState("eBikeKmTravelled", eBikeKmTravelled);
      persistState("smallEVehKmTravelled", smallVehKmTravelled);
      persistState("efficientTravelEmissions", newEfficientTravelEmissions); // Persist calculated efficient travel emissions
    }
  }, [
    selectedTransports,
    eBikeKmTravelled,
    smallVehKmTravelled,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist train emission variables
  const [trainKmTravelled, setTrainKmTravelled] = useState(
    TransportEmission.Train.kmTravelled
  );
  const [trainEmissions, setTrainEmissions] = useState(
    computeTrainEmissions(trainKmTravelled)
  );

  useEffect(() => {
    // Calculate the new train emissions based on kilometers traveled by train
    const newTrainEmissions = computeTrainEmissions(trainKmTravelled);

    // Update the local state for train emissions
    setTrainEmissions(newTrainEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("trainKmTravelled", trainKmTravelled);
      persistState("trainEmissions", newTrainEmissions); // Persist calculated train emissions
    }
  }, [
    trainKmTravelled,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist public transport emissions
  const [selectedPublicTransport, setSelectedPublicTransport] = useState(
    TransportEmission.PublicTransport.selectedPublicTransport
  );
  const [busHrsTravelled, setBusHrsTravelled] = useState(
    TransportEmission.PublicTransport.bus.hrsTravelled
  );
  const [jeepHrsTravelled, setJeepHrsTravelled] = useState(
    TransportEmission.PublicTransport.jeepney.hrsTravelled
  );
  const [tricycleHrsTravelled, setTricycleHrsTravelled] = useState(
    TransportEmission.PublicTransport.tricycle.hrsTravelled
  );
  const [publicTransportEmissions, setPublicTransportEmissions] = useState(
    computeTotalPublicTransportEmissions(
      selectedPublicTransport,
      busHrsTravelled,
      jeepHrsTravelled,
      tricycleHrsTravelled
    )
  );

  useEffect(() => {
    // Calculate the new public transport emissions based on selected parameters
    const newPublicTransportEmissions = computeTotalPublicTransportEmissions(
      selectedPublicTransport,
      busHrsTravelled,
      jeepHrsTravelled,
      tricycleHrsTravelled
    );

    // Update the local state for public transport emissions
    setPublicTransportEmissions(newPublicTransportEmissions);

    // Persist updated state to Firestore if initialized
    if (initialized) {
      persistState("selectedPublicTransport", selectedPublicTransport);
      persistState("busHrsTravelled", busHrsTravelled);
      persistState("jeepHrsTravelled", jeepHrsTravelled);
      persistState("tricycleHrsTravelled", tricycleHrsTravelled);
      persistState("publicTransportEmissions", newPublicTransportEmissions); // Persist calculated public transport emissions
    }
  }, [
    selectedPublicTransport,
    busHrsTravelled,
    jeepHrsTravelled,
    tricycleHrsTravelled,
    initialized, // Include initialized to ensure persistence only happens when context is ready
  ]);

  // Define and persist breakfast emissions state
  const [breakfastType, setBreakfastType] = useState(Food.defaultBreakfastType);
  const [additionals, setAdditionals] = useState(getAdditionals(breakfastType));
  const [breakfastEF, setBreakfastEF] = useState(
    computeMealEmission(breakfastType, additionals)
  );
  const [traditionalBreakfastEF, setTraditionalBreakfastEF] = useState(
    computeMealEmission("Traditional Filipino Breakfast", additionals)
  );
  const [simpleBreakfastEF, setSimpleBreakfastEF] = useState(
    computeMealEmission("Simple Rice Meal", additionals)
  );
  const [cerealsBreakfastEF, setCerealsBreakfastEF] = useState(
    computeMealEmission("Dairy and Cereal", additionals)
  );
  const [breadBreakfastEF, setBreadBreakfastEF] = useState(
    computeMealEmission("Bread and Jam", additionals)
  );
  const [fruitsBreakfastEF, setFruitsBreakfastEF] = useState(
    computeMealEmission("Fruits", additionals)
  );
  const [breakfastEmissions, setBreakfastEmissions] = useState(
    computeBreakfastEmissions(breakfastEF)
  );

  // Calculate breakfast-related emissions when breakfastType changes
  useEffect(() => {
    const updatedAdditionals = getAdditionals(breakfastType);
    setAdditionals(updatedAdditionals);

    const updatedBreakfastEF = computeMealEmission(
      breakfastType,
      updatedAdditionals
    );
    setBreakfastEF(updatedBreakfastEF);

    const traditionalBreakfastEF = computeMealEmission(
      "Traditional Filipino Breakfast",
      updatedAdditionals
    );
    setTraditionalBreakfastEF(traditionalBreakfastEF);

    const simpleBreakfastEF = computeMealEmission(
      "Simple Rice Meal",
      updatedAdditionals
    );
    setSimpleBreakfastEF(simpleBreakfastEF);

    const cerealsBreakfastEF = computeMealEmission(
      "Dairy and Cereal",
      updatedAdditionals
    );
    setCerealsBreakfastEF(cerealsBreakfastEF);

    const breadBreakfastEF = computeMealEmission(
      "Bread and Jam",
      updatedAdditionals
    );
    setBreadBreakfastEF(breadBreakfastEF);

    const fruitsBreakfastEF = computeMealEmission("Fruits", updatedAdditionals);
    setFruitsBreakfastEF(fruitsBreakfastEF);
  }, [breakfastType]);

  // Persist updated state to Firestore after emissions values are updated
  useEffect(() => {
    if (initialized) {
      persistState("breakfastType", breakfastType);
      persistState("foodAdditionals", additionals);
      persistState("breakfastEF", breakfastEF);
      persistState("traditionalBreakfastEF", traditionalBreakfastEF);
      persistState("simpleBreakfastEF", simpleBreakfastEF);
      persistState("cerealsBreakfastEF", cerealsBreakfastEF);
      persistState("breadBreakfastEF", breadBreakfastEF);
      persistState("fruitsBreakfastEF", fruitsBreakfastEF);
      persistState("breakfastEmissions", breakfastEmissions);
    }
  }, [
    initialized,
    breakfastType,
    additionals,
    breakfastEF,
    traditionalBreakfastEF,
    simpleBreakfastEF,
    cerealsBreakfastEF,
    breadBreakfastEF,
    fruitsBreakfastEF,
    breakfastEmissions,
  ]);

  // Define and persist meal emissions state
  const [mealTypeFrequency, setMealTypeFrequency] = useState(
    Food.defaultMealFrequency
  );
  const [beefMealEF, setBeefMealEF] = useState(
    computeMealEmission("Beef meat meal", additionals)
  );
  const [chickenMealEF, setChickenMealEF] = useState(
    computeMealEmission("Chicken meat meal", additionals)
  );
  const [porkMealEF, setPorkMealEF] = useState(
    computeMealEmission("Pork meat meal", additionals)
  );
  const [fishMealEF, setFishMealEF] = useState(
    computeMealEmission("Fish meat meal", additionals)
  );
  const [vegetarianMealEF, setVegetarianMealEF] = useState(
    computeMealEmission("Vegetarian", additionals)
  );
  const [veganMealEF, setVeganMealEF] = useState(
    computeMealEmission("Vegan", additionals)
  );
  const [mealEmissions, setMealEmissions] = useState(
    computeTotalMealEmissions(
      beefMealEF,
      chickenMealEF,
      porkMealEF,
      fishMealEF,
      vegetarianMealEF,
      veganMealEF,
      mealTypeFrequency
    )
  );

  // Calculate meal-related emissions based on additionals and mealTypeFrequency
  useEffect(() => {
    const updatedBeefMealEF = computeMealEmission(
      "Beef meat meal",
      additionals
    );
    const updatedChickenMealEF = computeMealEmission(
      "Chicken meat meal",
      additionals
    );
    const updatedPorkMealEF = computeMealEmission(
      "Pork meat meal",
      additionals
    );
    const updatedFishMealEF = computeMealEmission(
      "Fish meat meal",
      additionals
    );
    const updatedVegetarianMealEF = computeMealEmission(
      "Vegetarian",
      additionals
    );
    const updatedVeganMealEF = computeMealEmission("Vegan", additionals);

    setBeefMealEF(updatedBeefMealEF);
    setChickenMealEF(updatedChickenMealEF);
    setPorkMealEF(updatedPorkMealEF);
    setFishMealEF(updatedFishMealEF);
    setVegetarianMealEF(updatedVegetarianMealEF);
    setVeganMealEF(updatedVeganMealEF);

    setMealEmissions(
      computeTotalMealEmissions(
        updatedBeefMealEF,
        updatedChickenMealEF,
        updatedPorkMealEF,
        updatedFishMealEF,
        updatedVegetarianMealEF,
        updatedVeganMealEF,
        mealTypeFrequency
      )
    );
  }, [additionals, mealTypeFrequency]);

  // Persist updated state to Firestore after all meal-related emissions are updated
  useEffect(() => {
    if (initialized) {
      persistState("mealTypeFrequency", mealTypeFrequency);
      persistState("beefMealEF", beefMealEF);
      persistState("chickenMealEF", chickenMealEF);
      persistState("porkMealEF", porkMealEF);
      persistState("fishMealEF", fishMealEF);
      persistState("vegetarianMealEF", vegetarianMealEF);
      persistState("veganMealEF", veganMealEF);
      persistState("mealEmissions", mealEmissions);
    }
  }, [
    initialized,
    mealTypeFrequency,
    beefMealEF,
    chickenMealEF,
    porkMealEF,
    fishMealEF,
    vegetarianMealEF,
    veganMealEF,
    mealEmissions,
  ]);

  // Define and persist hot drinks emissions state
  const [hotDrinksFrequency, setHotDrinksFrequency] = useState(
    Beverages.HotDrinks.drinkTypeFrequency
  );
  const [coffeeFrequency, setCoffeeFrequency] = useState(
    hotDrinksFrequency.Coffee
  );
  const [coffeeEmissions, setCoffeeEmissions] = useState(
    computeHotDrinkEmission(
      Beverages.HotDrinks.drinkTypeEF.coffee,
      Beverages.HotDrinks.kgPerCup.coffee,
      coffeeFrequency
    )
  );
  const [hotDrinksEmissions, setHotDrinksEmissions] = useState(
    computeTotalHotDrinksEmissions(Beverages.HotDrinks.drinkTypeFrequency)
  );

  // Update coffee and hot drinks emissions when hotDrinksFrequency changes
  useEffect(() => {
    const newCoffeeEmissions = computeHotDrinkEmission(
      Beverages.HotDrinks.drinkTypeEF.coffee,
      Beverages.HotDrinks.kgPerCup.coffee,
      hotDrinksFrequency.Coffee
    );
    setCoffeeEmissions(newCoffeeEmissions);

    const newHotDrinksEmissions =
      computeTotalHotDrinksEmissions(hotDrinksFrequency);
    setHotDrinksEmissions(newHotDrinksEmissions);
  }, [hotDrinksFrequency]);

  // Persist updated state to Firestore once emissions values are updated
  useEffect(() => {
    if (initialized) {
      persistState("hotDrinksFrequency", hotDrinksFrequency);
      persistState("coffeeEmissions", coffeeEmissions);
      persistState("hotDrinksEmissions", hotDrinksEmissions);
    }
  }, [initialized, hotDrinksFrequency, coffeeEmissions, hotDrinksEmissions]);

  // Define and persist cold drinks emissions state
  const [sweetDrinksFrequency, setSweetDrinksFrequency] = useState(
    Beverages.ColdDrinks.sweetDrinks.frequency
  );
  const [alcoholFrequency, setAlcoholFrequency] = useState(
    Beverages.ColdDrinks.alcohol.frequency
  );
  const [coldDrinksEmissions, setColdDrinksEmissions] = useState(
    computeTotalColdDrinkEmissions(sweetDrinksFrequency, alcoholFrequency)
  );

  // Effect to update cold drinks emissions
  useEffect(() => {
    // Calculate and set cold drinks emissions based on frequencies
    const updatedColdDrinksEmissions = computeTotalColdDrinkEmissions(
      sweetDrinksFrequency,
      alcoholFrequency
    );
    setColdDrinksEmissions(updatedColdDrinksEmissions);
  }, [sweetDrinksFrequency, alcoholFrequency]);

  // Effect to persist cold drinks frequency and emissions
  useEffect(() => {
    if (initialized) {
      persistState("sweetDrinksFrequency", sweetDrinksFrequency);
      persistState("alcoholFrequency", alcoholFrequency);
      persistState("coldDrinksEmissions", coldDrinksEmissions); // Persist the most recently calculated emissions
    }
  }, [
    sweetDrinksFrequency,
    alcoholFrequency,
    initialized,
    coldDrinksEmissions,
  ]); // Ensure this runs whenever relevant data changes

  // Define and persist bottled water emissions state
  const [buysBottledWater, setBuysBottledWater] = useState(
    Beverages.BottledWater.boughtRegularly
  );
  const [bottledWaterEmissions, setBottledWaterEmissions] = useState(
    computeBottledWaterEmissions(buysBottledWater)
  );

  // Effect to update bottled water emissions
  useEffect(() => {
    // Calculate and set bottled water emissions based on purchases
    const updatedBottledWaterEmissions =
      computeBottledWaterEmissions(buysBottledWater);
    setBottledWaterEmissions(updatedBottledWaterEmissions);
  }, [buysBottledWater]);

  // Effect to persist bottled water purchases and emissions
  useEffect(() => {
    if (initialized) {
      persistState("buysBottledWater", buysBottledWater);
      persistState("bottledWaterEmissions", bottledWaterEmissions); // Persist the most recently calculated emissions
    }
  }, [buysBottledWater, initialized, bottledWaterEmissions]); // Include relevant dependencies

  // Define and persist electricity consumption emission variables
  const [householdSize, setHouseholdSize] = useState(
    ElectricityEmissions.householdSize
  );
  const [usesSolarPanels, setUsesSolarPanels] = useState(
    ElectricityEmissions.Solar.isUsed
  );
  const [solarProduction, setSolarProduction] = useState(
    ElectricityEmissions.Solar.annualProduction
  );
  const [solarConsumptionPercent, setSolarConsumptionPercent] = useState(
    ElectricityEmissions.Solar.percentConsumed
  );
  const [gridMonthlySpend, setGridMonthlySpend] = useState(
    ElectricityEmissions.Grid.monthlySpend
  );
  const [electricityEmissions, setElectricityEmissions] = useState(
    computeElectricityEmissions(
      householdSize,
      usesSolarPanels,
      solarProduction,
      solarConsumptionPercent,
      gridMonthlySpend
    )
  );

  // Effect to update electricity emissions
  useEffect(() => {
    // Calculate and set electricity emissions based on household parameters
    const updatedElectricityEmissions = computeElectricityEmissions(
      householdSize,
      usesSolarPanels,
      solarProduction,
      solarConsumptionPercent,
      gridMonthlySpend
    );
    setElectricityEmissions(updatedElectricityEmissions);
  }, [
    householdSize,
    usesSolarPanels,
    solarProduction,
    solarConsumptionPercent,
    gridMonthlySpend,
  ]);

  // Effect to persist electricity-related data
  useEffect(() => {
    if (initialized) {
      persistState("householdSize", householdSize);
      persistState("usesSolarPanels", usesSolarPanels);
      persistState("solarProduction", solarProduction);
      persistState("solarConsumptionPercent", solarConsumptionPercent);
      persistState("gridMonthlySpend", gridMonthlySpend);
      persistState("electricityEmissions", electricityEmissions); // Persist the most recently calculated emissions
    }
  }, [
    householdSize,
    usesSolarPanels,
    solarProduction,
    solarConsumptionPercent,
    gridMonthlySpend,
    initialized,
    electricityEmissions,
  ]);

  let emissionsData = {
    foodFootprint,
    transportationFootprint,
    electricityFootprint,
    carEmissions,
    kmTravelled,
    constructionScale,
    lifeSpanInKm,
    footprintPerLiter,
    consumptionPerKm,
    numOfPassengers,
    carEFPerKm,
    user,
    airplaneTravelEmissions,
    travelledByPlane,
    shortHaulDuration,
    mediumHaulDuration,
    longHaulDuration,
    twoWheelersEmissions,
    twoWheelerEFPerKm,
    twoWheelersKmTravelled,
    efficientTravelEmissions,
    selectedTransports,
    eBikeKmTravelled,
    smallVehKmTravelled,
    trainEmissions,
    trainKmTravelled,
    publicTransportEmissions,
    selectedPublicTransport,
    busHrsTravelled,
    jeepHrsTravelled,
    tricycleHrsTravelled,
    breakfastEmissions,
    breakfastType,
    breakfastEF,
    traditionalBreakfastEF,
    simpleBreakfastEF,
    cerealsBreakfastEF,
    breadBreakfastEF,
    fruitsBreakfastEF,
    beefMealEF,
    chickenMealEF,
    porkMealEF,
    fishMealEF,
    vegetarianMealEF,
    veganMealEF,
    mealEmissions,
    mealTypeFrequency,
    hotDrinksEmissions,
    hotDrinksFrequency,
    coffeeFrequency,
    coffeeEmissions,
    coldDrinksEmissions,
    sweetDrinksFrequency,
    alcoholFrequency,
    bottledWaterEmissions,
    buysBottledWater,
    electricityEmissions,
    householdSize,
    usesSolarPanels,
    solarProduction,
    solarConsumptionPercent,
    gridMonthlySpend,
  };

  const [foodFootprint, setFoodFootprint] = useState(
    breakfastEmissions +
      mealEmissions +
      hotDrinksEmissions +
      coldDrinksEmissions +
      bottledWaterEmissions
  );
  const [transportationFootprint, setTransportationFootprint] = useState(
    carEmissions +
      airplaneTravelEmissions +
      twoWheelersEmissions +
      efficientTravelEmissions +
      trainEmissions +
      publicTransportEmissions
  );

  const [electricityFootprint, setElectricityFootprint] = useState(electricityEmissions);

  useEffect(() => {
    const updateFootprint = async () => {
      if (userUid && initialized) {
        const newOverallFootprint =
          carEmissions +
          airplaneTravelEmissions +
          twoWheelersEmissions +
          efficientTravelEmissions +
          trainEmissions +
          publicTransportEmissions +
          breakfastEmissions +
          mealEmissions +
          hotDrinksEmissions +
          coldDrinksEmissions +
          bottledWaterEmissions +
          electricityEmissions;

        const newFoodEmissions =
          breakfastEmissions +
          mealEmissions +
          hotDrinksEmissions +
          coldDrinksEmissions +
          bottledWaterEmissions;

        const newTransportEmissions =
          carEmissions +
          airplaneTravelEmissions +
          twoWheelersEmissions +
          efficientTravelEmissions +
          trainEmissions +
          publicTransportEmissions;

        setNewOverallFootprint(newOverallFootprint);
        setFoodFootprint(newFoodEmissions);
        setTransportationFootprint(newTransportEmissions);
        setElectricityFootprint(electricityEmissions);

        if (role === "user") {
          try {
            await firestore().collection("initial_footprint").doc(userUid).set(
              {
                overall_footprint: newOverallFootprint,
                food_footprint: foodFootprint,
                transportation_footprint: transportationFootprint,
                electricity_footprint: electricityFootprint,
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Error updating footprint:", error);
          }
        }
      }
    };

    updateFootprint();
  }, [initialized, carEmissions, 
    airplaneTravelEmissions,
    twoWheelersEmissions,
    efficientTravelEmissions,
    trainEmissions,
    publicTransportEmissions, 
    breakfastEmissions,
    mealEmissions, 
    hotDrinksEmissions, 
    coldDrinksEmissions, 
    bottledWaterEmissions,
    electricityEmissions]);

  return (
    <EmissionsContext.Provider
      value={{
        initialized,
        initializeData,
        newOverallFootprint,
        emissionsData,
        foodFootprint,
        transportationFootprint,
        electricityFootprint,
        carEmissions,
        setCarEmissions,
        kmTravelled,
        setKmTravelled,
        constructionScale,
        setConstructionScale,
        lifeSpanInKm,
        setLifeSpanInKm,
        footprintPerLiter,
        setFootprintPerLiter,
        consumptionPerKm,
        setConsumptionPerKm,
        numOfPassengers,
        setNumOfPassengers,
        user,
        setUser,
        airplaneTravelEmissions,
        setAirplaneTravelEmissions,
        travelledByPlane,
        setTravelledByPlane,
        shortHaulDuration,
        setShortHaulDuration,
        mediumHaulDuration,
        setMediumHaulDuration,
        longHaulDuration,
        setLongHaulDuration,
        twoWheelersEmissions,
        usesTwoWheelers,
        setUsesTwoWheelers,
        setTwoWheelersEmissions,
        twoWheelerEFPerKm,
        setTwoWheelerEFPerKm,
        twoWheelersKmTravelled,
        setTwoWheelersKmTravelled,
        efficientTravelEmissions,
        setEfficientTravelEmissions,
        selectedTransports,
        setSelectedTransports,
        eBikeKmTravelled,
        setEBikeKmTravelled,
        smallVehKmTravelled,
        setSmallVehKmTravelled,
        trainEmissions,
        setTrainEmissions,
        trainKmTravelled,
        setTrainKmTravelled,
        publicTransportEmissions,
        setPublicTransportEmissions,
        selectedPublicTransport,
        setSelectedPublicTransport,
        busHrsTravelled,
        setBusHrsTravelled,
        jeepHrsTravelled,
        setJeepHrsTravelled,
        tricycleHrsTravelled,
        setTricycleHrsTravelled,
        breakfastEmissions,
        setBreakfastEmissions,
        breakfastType,
        setBreakfastType,
        breakfastEF,
        setBreakfastEF,
        additionals,
        setAdditionals,
        traditionalBreakfastEF,
        setTraditionalBreakfastEF,
        simpleBreakfastEF,
        setSimpleBreakfastEF,
        cerealsBreakfastEF,
        setCerealsBreakfastEF,
        breadBreakfastEF,
        setBreadBreakfastEF,
        fruitsBreakfastEF,
        setFruitsBreakfastEF,
        beefMealEF,
        setBeefMealEF,
        chickenMealEF,
        setChickenMealEF,
        porkMealEF,
        setPorkMealEF,
        fishMealEF,
        setFishMealEF,
        vegetarianMealEF,
        setVegetarianMealEF,
        veganMealEF,
        setVeganMealEF,
        mealEmissions,
        setMealEmissions,
        mealTypeFrequency,
        setMealTypeFrequency,
        hotDrinksEmissions,
        setHotDrinksEmissions,
        hotDrinksFrequency,
        setHotDrinksFrequency,
        coffeeFrequency,
        setCoffeeFrequency,
        coffeeEmissions,
        setCoffeeEmissions,
        coldDrinksEmissions,
        setColdDrinksEmissions,
        sweetDrinksFrequency,
        setSweetDrinksFrequency,
        alcoholFrequency,
        setAlcoholFrequency,
        bottledWaterEmissions,
        setBottledWaterEmissions,
        buysBottledWater,
        setBuysBottledWater,
        electricityEmissions,
        setElectricityEmissions,
        householdSize,
        setHouseholdSize,
        usesSolarPanels,
        setUsesSolarPanels,
        solarProduction,
        setSolarProduction,
        solarConsumptionPercent,
        setSolarConsumptionPercent,
        gridMonthlySpend,
        setGridMonthlySpend,
      }}
    >
      {children}
    </EmissionsContext.Provider>
  );
};
