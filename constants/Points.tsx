import { useState } from "react";

export const Milestones = {
  "The first step 🥇": ["You have added your first Eco Action.", 100],
  "Keep it up! 🎯": ["Completed an Eco Action for the first time.", 100],
  "Emissions reduced by 20kg 😲": ["Reach a total of 20kg reduction impact.", 200],
  "Daily Log completed! 🥳": ["You conquered all your Eco Actions today.", 100],
};

export const Points = {
  100: [
    "CTMvEaC1ujzG2XOEic5w",
    "LBkeCPb327Tdn4soaYd0",
    "MhF0weU4PABd6QwkdUs5",
    "NxgDJjEjArsvCxwAvzta",
    "hESRnkO3mJkjeuwI8VHF",
    "mJ2BgmJXl7r4O4BVQzop",
    "tUaivCXkEmY5PmmIwH2z",
    "xkh2dL7OGjcKSma7qMql"
  ],
  200: [
    "35HSIdTKKYFF48skQbpf",
    "37Vsm7rKwc45iIfvwzrK",
    "GnOkjmokJB3Sr7fctMOU",
    "JCRPDZ5UMi5EvKTiIRm0",
    "RXSoMIoLJIduvkpLahow",
    "TXBv6mA0cUm96nfywBtE",
    "dQgxW0FSzsDr8sWynKTu",
    "hD8Bk612sWHvb1A45Cle",
    "hWzk9PynkschrDjTniB8",
    "hqs0iLkzUvBAsEBWwguR",
    "iNx0iHsHAl9eu7bfQyU3",
    "k9eFGBKPUi9h6veyQ1cT",
    "lnrKGIQ6YbAoh9uaA4YG",
  ]
};


type LevelsType = { [key: string]: number };

function generateLevels(totalLevels: number, increment: number = 500): LevelsType {
  const levels: LevelsType = {};

  for (let i = 1; i <= totalLevels; i++) {
    levels[`Level ${i}`] = i * increment;
  }

  return levels;
}

export const Levels = generateLevels(10);

export const Rewards = [
  {icon: '🌏', title: 'Free Delivery', content: 'Get ₱120 off your delivery fee with Ecomove', terms: ['Minimum of 3 bookings'], points: 500},
  {icon: '💰', title: '₱10 off', content: 'Get ₱10 off your first booking with Ecomove', terms: ['No minimum spend'], points: 500}
]