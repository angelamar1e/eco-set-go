import React, { createContext, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import {
  computeCarEmissions,
  computeTotalAirplaneEmissions,
  computeTwoWheelersEmissions,
} from "@/app/utils/EstimationUtils";
import { TransportEmission } from "@/constants/DefaultValues";
import { getUserUid } from "@/app/utils/utils";

// Create a context
export const EmissionsContext = createContext();

export const EmissionsProvider = ({ children }) => {

  const [userUid, setUserUid] = useState('');

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };

    fetchUserUid();
  }, []);

  
  // states for car emissions variables, default values initially set
  const [efPerKm, setEfPerKm] = useState(TransportEmission.Car.efPerKm);
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
      efPerKm,
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
        efPerKm,
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
    efPerKm,
    kmTravelled,
    constructionScale,
    lifeSpanInKm,
    footprintPerLiter,
    consumptionPerKm,
    numOfPassengers,
    user,
  ]);
  
  // states for airplane travel emissions, default values initially set
  const [flightEFPerKm, setFlightEFPerKm] = useState(
    TransportEmission.Airplane.efPerKm
  );
  const [travelledByPlane, setTravelledByPlane] = useState(
    TransportEmission.Airplane.travelledByPlane
  );
  
  const [shortHaul, setShortHaul] = useState({
    aveDuration: TransportEmission.Airplane.shortHaul.aveDuration,
    aveDistance: TransportEmission.Airplane.shortHaul?.aveDistance,
    flightDuration: TransportEmission.Airplane.shortHaul?.duration,
  });
  
  const [mediumHaul, setMediumHaul] = useState({
    aveDuration: TransportEmission.Airplane.mediumHaul.aveDuration,
    aveDistance: TransportEmission.Airplane.mediumHaul.aveDistance,
    flightDuration: TransportEmission.Airplane.mediumHaul.duration, // Corrected here
  });
  
  const [longHaul, setLongHaul] = useState({
    aveDuration: TransportEmission.Airplane.longHaul.aveDuration,
    aveDistance: TransportEmission.Airplane.longHaul.aveDistance,
    flightDuration: TransportEmission.Airplane.longHaul.duration, // Corrected here
  });

  const [airplaneTravelEmissions, setAirplaneTravelEmissions] = useState(
    computeTotalAirplaneEmissions(
      shortHaul,
      mediumHaul,
      longHaul,
      travelledByPlane
    )
  );

  // recompute total airplane emissions per variable change
  useEffect(() => {
    setAirplaneTravelEmissions(
      computeTotalAirplaneEmissions(
        shortHaul,
        mediumHaul,
        longHaul,
        travelledByPlane
      )
    );
  }, [shortHaul, mediumHaul, longHaul, travelledByPlane]);
  
  // states for two wheeler emission variables
  const [usesTwoWheelers, setUsesTwoWheelers] = useState(TransportEmission.TwoWheelers.usesTwoWheelers);
  const [twoWheelerEFPerKm, setTwoWheelerEFPerKm] = useState(
    TransportEmission.TwoWheelers.efPerKm
  );
  const [twoWheelersKmTravelled, setTwoWheelersKmTravelled] = useState(
    TransportEmission.TwoWheelers.kmTravelled
  );
  const [twoWheelersEmissions, setTwoWheelersEmissions] = useState(
    computeTwoWheelersEmissions(twoWheelerEFPerKm, twoWheelersKmTravelled, usesTwoWheelers)
  );
  
  useEffect(() => {
    setTwoWheelersEmissions(computeTwoWheelersEmissions(twoWheelerEFPerKm, twoWheelersKmTravelled, usesTwoWheelers))
  }, [twoWheelerEFPerKm, twoWheelersKmTravelled, usesTwoWheelers]);
  
  const [overallFootprint, setOverallFootprint] = useState(
    carEmissions + airplaneTravelEmissions + twoWheelersEmissions
  );

  useEffect(() => {
    const updateOverallFootprint = async () => {
      if (userUid) {
        const newFootprint = carEmissions + airplaneTravelEmissions + twoWheelersEmissions;
        setOverallFootprint(newFootprint);
        
        try {
          await firestore()
          .collection('current_footprint')
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
        setEfPerKm,
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
      }}
    >
      {children}
    </EmissionsContext.Provider>
  );
};
