import React, { createContext, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import {
  computeCarEmissions,
  computeTotalAirplaneEmissions,
  computeTotalEfficientTravelEmissions as computeTotalEfficientTravelEmissions,
  computeTwoWheelersEmissions,
} from "@/app/utils/EstimationUtils";
import { TransportEmission } from "@/constants/DefaultValues";
import { getUserUid } from "@/app/utils/utils";

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

  const [carEmissions, setCarEmissions] = useState(computeCarEmissions());

  // recompute car emissions per variable change
  useEffect(() => {
    setCarEmissions(computeCarEmissions( 
      kmTravelled,
      constructionScale,
      lifeSpanInKm,
      footprintPerLiter,
      consumptionPerKm,
      numOfPassengers,
      user,));
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

  const [shortHaulDuration, setShortHaulDuration] = useState({
    flightDuration: TransportEmission.Airplane.shortHaul.duration,
  });

  const [mediumHaulDuration, setMediumHaulDuration] = useState({
    flightDuration: TransportEmission.Airplane.mediumHaul.duration,
  });

  const [longHaulDuration, setLongHaulDuration] = useState({
    flightDuration: TransportEmission.Airplane.longHaul.duration,
  });

  const [airplaneTravelEmissions, setAirplaneTravelEmissions] = useState(
    computeTotalAirplaneEmissions(
      travelledByPlane,
      shortHaulDuration,
      mediumHaulDuration,
      longHaulDuration,
    )
  );

  // recompute total airplane emissions per variable change
  useEffect(() => {
    setAirplaneTravelEmissions(
      computeTotalAirplaneEmissions(
        travelledByPlane,
        shortHaulDuration,
        mediumHaulDuration,
        longHaulDuration,
      )
    );
  }, [travelledByPlane, shortHaulDuration, mediumHaulDuration, longHaulDuration]);

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
      twoWheelersKmTravelled,
    )
  );

  useEffect(() => {
    setTwoWheelersEmissions(
      computeTwoWheelersEmissions(
        usesTwoWheelers,
        twoWheelerEFPerKm,
        twoWheelersKmTravelled,
      )
    );
  }, [usesTwoWheelers, twoWheelerEFPerKm, twoWheelersKmTravelled]);

  // states for efficient transport emission variables
  const [usesBike, setUsesBike] = useState(
    TransportEmission.EfficientTransport.bicycle.isUsed
  );
  const [usesEBike, setUsesEBike] = useState(
    TransportEmission.EfficientTransport.electricBike.isUsed
  );
  const [usesSmallVehicles, setUsesSmallVehicles] = useState(
    TransportEmission.EfficientTransport.smallElectricVehicles.isUsed
  );
  const [eBikeKmTravelled, setEBikeKmTravelled] = useState(
    TransportEmission.EfficientTransport.electricBike.kmTravelled
  );
  const [smallVehKmTravelled, setSmallVehKmTravelled] = useState(
    TransportEmission.EfficientTransport.smallElectricVehicles.kmTravelled
  );
  const [efficientTravelEmissions, setEfficientTravelEmissions] = useState(
    computeTotalEfficientTravelEmissions
  );

  useEffect(() => {
    setEfficientTravelEmissions(computeTotalEfficientTravelEmissions());
  }, [
    usesBike,
    usesEBike,
    usesSmallVehicles,
    eBikeKmTravelled,
    smallVehKmTravelled,
  ]);

  const [overallFootprint, setOverallFootprint] = useState(
    carEmissions +
    airplaneTravelEmissions +
    twoWheelersEmissions +
    efficientTravelEmissions
  );

  useEffect(() => {
    const updateOverallFootprint = async () => {
      if (userUid) {
        const newFootprint =
          carEmissions + airplaneTravelEmissions + twoWheelersEmissions;
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
  }, [carEmissions, airplaneTravelEmissions, twoWheelersEmissions]);

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
        flightEFPerKm,
        shortHaul,
        mediumHaul,
        longHaul,
        setAirplaneTravelEmissions,
        setTravelledByPlane,
        setFlightEFPerKm,
        setShortHaul,
        setMediumHaul,
        setLongHaul,
        twoWheelersEmissions,
        twoWheelerEFPerKm,
        twoWheelersKmTravelled,
        setTwoWheelersEmissions,
        setUsesTwoWheelers,
        setTwoWheelerEFPerKm,
        setTwoWheelersKmTravelled,
        efficientTravelEmissions,
        usesBike,
        usesEBike,
        usesSmallVehicles,
        eBikeKmTravelled,
        smallVehKmTravelled,
        setEfficientTravelEmissions,
        setUsesBike,
        setUsesEBike,
        setUsesSmallVehicles,
        setEBikeKmTravelled,
        setSmallVehKmTravelled,
      }}
    >
      {children}
    </EmissionsContext.Provider>
  );
};
