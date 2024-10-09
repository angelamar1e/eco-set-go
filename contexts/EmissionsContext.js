import React, { createContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { computeCarEmissions } from '@/app/utils/EstimationUtils';
import { TransportEmission } from '@/constants/DefaultValues';

// Create a context
export const EmissionsContext = createContext();

export const EmissionsProvider = ({ children }) => {

  // states for car emissions variables, default values initially set
  const [efPerKm, setEfPerKm] = useState(TransportEmission.Car.efPerKm);
  const [kmTravelled, setKmTravelled] = useState(TransportEmission.Car.kmTravelled);
  const [constructionScale, setConstructionScale] = useState(TransportEmission.Car.constructionScale);
  const [lifeSpanInKm, setLifeSpanInKm] = useState(TransportEmission.Car.lifeSpan);
  const [footprintPerLiter, setFootprintPerLiter] = useState(TransportEmission.Car.footprintPerLiter);
  const [consumptionPerKm, setConsumptionPerKm] = useState(TransportEmission.Car.consumptionPerKm);
  const [numOfPassengers, setNumOfPassengers] = useState(TransportEmission.Car.numOfPassengers);
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

  // recompute car emissions everytime any of the variable changes
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

  return (
    <EmissionsContext.Provider
      value={{
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
        setUser
      }}
    >
      {children}
    </EmissionsContext.Provider>
  );
};

