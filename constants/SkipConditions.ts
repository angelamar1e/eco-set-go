export const skipConditions = [
    {
      condition: (kmTravelled: number) => kmTravelled === 0,
      skipSteps: 6,  // Skip next 6 questions if kmTravelled is 0
    },
    // Add more conditions as needed
  ];
  