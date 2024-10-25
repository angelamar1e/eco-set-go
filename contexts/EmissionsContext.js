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
  convertKgToTons,
  computeAdditionals,
} from "@/app/utils/EstimationUtils";
import {
  ElectricityEmissions,
  FoodEmission,
  FoodItemEF,
  TransportEmission,
  weightDistribution,
  weightDistributionPerBreakfastType,
} from "@/constants/DefaultValues";
import { getUserUid } from "@/app/utils/utils";
import { Easing } from "react-native";

// Create a context
export const EmissionsContext = createContext();

export const EmissionsProvider = ({ children }) => {
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };

    fetchUserUid();
  }, []);

  // states for car emissions variables, default values initially set
  const [kmTravelled, setKmTravelled] = useState(
    TransportEmission.Car.kmTravelled
  );
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

  // recompute car emissions per variable change
  useEffect(() => {
    setCarEmissions(
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
  }, [
    kmTravelled,
    constructionScale,
    lifeSpanInKm,
    footprintPerLiter,
    consumptionPerKm,
    numOfPassengers,
    user,
  ]);

  // states for airplane travel emissions, default values initially set
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

  // recompute total airplane emissions per variable change
  useEffect(() => {
    setAirplaneTravelEmissions(
      computeTotalAirplaneEmissions(
        travelledByPlane,
        shortHaulDuration,
        mediumHaulDuration,
        longHaulDuration
      )
    );
  }, [
    travelledByPlane,
    shortHaulDuration,
    mediumHaulDuration,
    longHaulDuration,
  ]);

  // states for two wheeler emission variables
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
    setTwoWheelersEmissions(
      computeTwoWheelersEmissions(
        usesTwoWheelers,
        twoWheelerEFPerKm,
        twoWheelersKmTravelled
      )
    );
  }, [usesTwoWheelers, twoWheelerEFPerKm, twoWheelersKmTravelled]);

  // states for efficient transport emission variables
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
    setEfficientTravelEmissions(
      computeTotalEfficientTravelEmissions(
        selectedTransports,
        eBikeKmTravelled,
        smallVehKmTravelled
      )
    );
  }, [selectedTransports, eBikeKmTravelled, smallVehKmTravelled]);

  // states for train emission variables
  const [trainKmTravelled, setTrainKmTravelled] = useState(
    TransportEmission.Train.kmTravelled
  );
  const [trainEmissions, setTrainEmissions] = useState(
    computeTrainEmissions(trainKmTravelled)
  );

  useEffect(() => {
    setTrainEmissions(computeTrainEmissions(trainKmTravelled));
  }, [trainKmTravelled]);

  // states for public transport emissions
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
    setPublicTransportEmissions(
      computeTotalPublicTransportEmissions(
        selectedPublicTransport,
        busHrsTravelled,
        jeepHrsTravelled,
        tricycleHrsTravelled
      )
    );
  }, [
    selectedPublicTransport,
    busHrsTravelled,
    jeepHrsTravelled,
    tricycleHrsTravelled,
  ]);

  // states for breakfast emission variables
  const [breakfastType, setBreakfastType] = useState(
    FoodEmission.Breakfast.type
  );

  const [breakfastEF, setBreakfastEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Breakfast`])
  );

  const [breakfastEmissions, setBreakfastEmissions] = useState(
    computeBreakfastEmissions(breakfastEF)
  );

  useEffect(() => {
    setBreakfastEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Breakfast`])
    );
    setBreakfastEmissions(computeBreakfastEmissions(breakfastEF));
  }, [breakfastType, breakfastEF]);

  // states for meals emission variables
  const [mealTypeFrequency, setMealTypeFrequency] = useState(
    FoodEmission.LunchesDinners.mealTypeFrequency
  );

  const [beefMealEF, setBeefMealEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Beef meat meal`])
  );

  const [chickenMealEF, setChickenMealEF] = useState(
    computeMealEmission(
      weightDistribution[`${breakfastType}:Chicken meat meal`]
    )
  );

  const [porkMealEF, setPorkMealEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Pork meat meal`])
  );

  const [fishMealEF, setFishMealEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Fish meat meal`])
  );

  const [vegetarianMealEF, setVegetarianMealEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Vegetarian meal`])
  );

  const [veganMealEF, setVeganMealEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Vegan meal`])
  );

  const [addedFoodEF, setAddedFoodEF] = useState(
    computeMealEmission(weightDistribution[`${breakfastType}:Additionals`])
  );

  const [addedFoodEmissions, setAddedFoodEmissions] = useState(
    computeAdditionals(addedFoodEF)
  );

  useEffect(() => {
    setBeefMealEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Beef meat meal`])
    );

    setChickenMealEF(
      computeMealEmission(
        weightDistribution[`${breakfastType}:Chicken meat meal`]
      )
    );

    setPorkMealEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Pork meat meal`])
    );
    setFishMealEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Fish meat meal`])
    );
    setVegetarianMealEF(
      computeMealEmission(
        weightDistribution[`${breakfastType}:Vegetarian meal`]
      )
    );
    setVeganMealEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Vegan meal`])
    );
    setAddedFoodEF(
      computeMealEmission(weightDistribution[`${breakfastType}:Additionals`])
    );
    setAddedFoodEmissions(
      computeAdditionals(addedFoodEF)
    );
  }, [breakfastType]);

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

  useEffect(() => {
    setMealEmissions(
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
  }, [
    beefMealEF,
    chickenMealEF,
    porkMealEF,
    fishMealEF,
    vegetarianMealEF,
    veganMealEF,
    mealTypeFrequency,
  ]);

  // states for hot drinks emissions
  const [hotDrinksFrequency, setHotDrinksFrequency] = useState(
    FoodEmission.HotDrinks.drinkTypeFrequency
  );
  const [hotDrinksEmissions, setHotDrinksEmissions] = useState(
    computeTotalHotDrinksEmissions(FoodEmission.HotDrinks.drinkTypeFrequency)
  );

  useEffect(() => {
    setHotDrinksEmissions(computeTotalHotDrinksEmissions(hotDrinksFrequency));
  }, [hotDrinksFrequency]);

  // states for cold drinks emissions
  const [sweetDrinksFrequency, setSweetDrinksFrequency] = useState(
    FoodEmission.ColdDrinks.sweetDrinks.frequency
  );
  const [alcoholFrequency, setAlcoholFrequency] = useState(
    FoodEmission.ColdDrinks.alcohol.frequency
  );
  const [coldDrinksEmissions, setColdDrinksEmissions] = useState(
    computeTotalColdDrinkEmissions(sweetDrinksFrequency, alcoholFrequency)
  );

  useEffect(() => {
    setColdDrinksEmissions(
      computeTotalColdDrinkEmissions(sweetDrinksFrequency, alcoholFrequency)
    );
  }, [sweetDrinksFrequency, alcoholFrequency]);

  // states for bottled water emissions
  const [buysBottledWater, setBuysBottledWater] = useState(
    FoodEmission.BottledWater.boughtRegularly
  );
  const [bottledWaterEmissions, setBottledWaterEmissions] = useState(
    computeBottledWaterEmissions(buysBottledWater)
  );

  useEffect(() => {
    setBottledWaterEmissions(computeBottledWaterEmissions(buysBottledWater));
  }, [buysBottledWater]);

  // states for electricity consumption emission variables
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

  useEffect(() => {
    setElectricityEmissions(
      computeElectricityEmissions(
        householdSize,
        usesSolarPanels,
        solarProduction,
        solarConsumptionPercent,
        gridMonthlySpend
      )
    );
  }, [
    householdSize,
    usesSolarPanels,
    solarProduction,
    solarConsumptionPercent,
    gridMonthlySpend,
  ]);

  // states for over all footprint
  const [overallFootprint, setOverallFootprint] = useState(
    carEmissions +
      airplaneTravelEmissions +
      twoWheelersEmissions +
      efficientTravelEmissions +
      trainEmissions +
      publicTransportEmissions +
      breakfastEmissions +
      mealEmissions +
      addedFoodEmissions +
      hotDrinksEmissions +
      coldDrinksEmissions +
      bottledWaterEmissions +
      electricityEmissions
  );

  useEffect(() => {
    const updateOverallFootprint = async () => {
      if (userUid) {
        const newFootprint =
          carEmissions +
          airplaneTravelEmissions +
          twoWheelersEmissions +
          efficientTravelEmissions +
          trainEmissions +
          publicTransportEmissions +
          breakfastEmissions +
          mealEmissions +
          addedFoodEmissions +
          hotDrinksEmissions +
          coldDrinksEmissions +
          bottledWaterEmissions +
          electricityEmissions;
        setOverallFootprint(newFootprint);

        try {
          await firestore()
            .collection("current_footprint")
            .doc(userUid)
            .set({ overall_footprint: newFootprint }, { merge: true });
        } catch (error) {
          console.error("Error updating footprint:", error);
        }
      }
    };

    updateOverallFootprint();
  }, [
    carEmissions,
    airplaneTravelEmissions,
    twoWheelersEmissions,
    efficientTravelEmissions,
    trainEmissions,
    publicTransportEmissions,
    breakfastEmissions,
    mealEmissions,
    addedFoodEmissions,
    hotDrinksEmissions,
    coldDrinksEmissions,
    bottledWaterEmissions,
    electricityEmissions,
  ]);

  return (
    <EmissionsContext.Provider
      value={{
        overallFootprint,
        setOverallFootprint,
        carEmissions,
        kmTravelled,
        constructionScale,
        lifeSpanInKm,
        footprintPerLiter,
        consumptionPerKm,
        numOfPassengers,
        user,
        setCarEmissions,
        setKmTravelled,
        setConstructionScale,
        setLifeSpanInKm,
        setFootprintPerLiter,
        setConsumptionPerKm,
        setNumOfPassengers,
        setUser,
        airplaneTravelEmissions,
        travelledByPlane,
        shortHaulDuration,
        mediumHaulDuration,
        longHaulDuration,
        setAirplaneTravelEmissions,
        setTravelledByPlane,
        setShortHaulDuration,
        setMediumHaulDuration,
        setLongHaulDuration,
        twoWheelersEmissions,
        twoWheelerEFPerKm,
        twoWheelersKmTravelled,
        setTwoWheelersEmissions,
        setUsesTwoWheelers,
        setTwoWheelerEFPerKm,
        setTwoWheelersKmTravelled,
        efficientTravelEmissions,
        selectedTransports,
        eBikeKmTravelled,
        smallVehKmTravelled,
        setEfficientTravelEmissions,
        setSelectedTransports,
        setEBikeKmTravelled,
        setSmallVehKmTravelled,
        trainEmissions,
        trainKmTravelled,
        setTrainEmissions,
        setTrainKmTravelled,
        publicTransportEmissions,
        selectedPublicTransport,
        busHrsTravelled,
        jeepHrsTravelled,
        tricycleHrsTravelled,
        setPublicTransportEmissions,
        setSelectedPublicTransport,
        setBusHrsTravelled,
        setJeepHrsTravelled,
        setTricycleHrsTravelled,
        breakfastEmissions,
        breakfastType,
        breakfastEF,
        setBreakfastEmissions,
        setBreakfastType,
        setBreakfastEF,
        beefMealEF,
        chickenMealEF,
        porkMealEF,
        fishMealEF,
        vegetarianMealEF,
        veganMealEF,
        setMealEmissions,
        setMealTypeFrequency,
        setBeefMealEF,
        setChickenMealEF,
        setPorkMealEF,
        setFishMealEF,
        setVegetarianMealEF,
        setVeganMealEF,
        mealEmissions,
        mealTypeFrequency,
        hotDrinksEmissions,
        hotDrinksFrequency,
        setHotDrinksEmissions,
        setHotDrinksFrequency,
        coldDrinksEmissions,
        sweetDrinksFrequency,
        alcoholFrequency,
        setColdDrinksEmissions,
        setSweetDrinksFrequency,
        setAlcoholFrequency,
        bottledWaterEmissions,
        buysBottledWater,
        setBottledWaterEmissions,
        setBuysBottledWater,
        setElectricityEmissions,
        electricityEmissions,
        householdSize,
        usesSolarPanels,
        solarProduction,
        solarConsumptionPercent,
        gridMonthlySpend,
        setUsesSolarPanels,
        setHouseholdSize,
        setSolarProduction,
        setSolarConsumptionPercent,
        setGridMonthlySpend,
      }}
    >
      {children}
    </EmissionsContext.Provider>
  );
};
