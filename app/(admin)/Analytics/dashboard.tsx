import { PieChart } from "react-native-chart-kit";
import { useUserbaseContext } from "@/contexts/UserbaseContext";
import { Card, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { Dimensions, View } from "react-native";
import { useContext } from "react";
import { EcoActionsContext } from "@/contexts/EcoActions";
import { myTheme } from "@/constants/custom-theme";
import { styled } from "nativewind";
import { ScrollView } from "react-native-gesture-handler";
import { Transportation } from '../../components/(tabs)/Home/TransportAction';
import { wasteRecycled } from '../../utils/EstimationUtils';

const Dashboard = () => {
  const {
    totalImpact,
    pieChartData,
    impactAverage,
    dailyAverage,
    weeklyAverage,
    monthlyAverage,
    categoryRankings,
    averageCurrentEmissions,
    averageInitialEmissions,
    emissionLoading,
    dailyLogLoading,
    loadingCurrent,
    loadingInitial,
  } = useUserbaseContext();
  const { getEcoActionTitle } = useContext(EcoActionsContext);

  const StyledText = styled(Text);

  return (
    <ScrollView>
      <View className="bg-white pb-2">
        {emissionLoading ? (
          <></>
        ) : (
          <View className="flex-column">
            <View
              className="flex-column p-3"
              style={{ backgroundColor: myTheme["color-success-700"] }}
            >
              <StyledText className="text-lg text-white font-bold">
                Total Carbon Footprint Reduction{" "}
              </StyledText>
              <View className="w-100 flex-row rounded-xl py-2 items-center">
                <View
                  className="w-1/2 rounded-xl p-2 items-center"
                  style={{
                    borderColor: myTheme["color-success-900"],
                    borderWidth: 1,
                    backgroundColor: myTheme["color-success-800"],
                  }}
                >
                  <StyledText className="text-2xl text-white text-center font-bold">
                    {totalImpact.toFixed(2)} kg
                  </StyledText>
                </View>
                <StyledText className="w-1/2 px-2 text-sm text-white italic" style={{lineHeight: 18}}>
                   equivalent to {wasteRecycled(totalImpact).toFixed(2)} kg of waste recycled instead of landfilled 🌏
                </StyledText>
              </View>
            </View>
            <View className="w-full my-2 items-center flex-row">
              <PieChart
                data={pieChartData}
                width={Dimensions.get("window").width / 2}
                height={180}
                chartConfig={{
                  backgroundColor: "#1cc910",
                  backgroundGradientFrom: "#eff3ff",
                  backgroundGradientTo: "#efefef",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="50"
                absolute
                hasLegend={false}
              />
              <View className="w-1/2 h-full">
                {pieChartData.map((item: any, index: any) => (
                  <View key={index} className="flex-column my-2">
                    <View className="flex-row items-center">
                        <View
                        style={{
                            width: 14,
                            height: 14,
                            backgroundColor: item.color,
                            marginRight: 4,
                            borderRadius: 90,
                        }}
                        />
                        <Text
                        className="justify-center "
                        style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 16,
                            color: item.color,
                        }}
                        >
                        {item.name}
                        </Text>
                    </View>
                    <View className="text-gray-500">
                      <StyledText className="ml-5 font-bold text-gray-600">{item.value.toFixed(2)} kg</StyledText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View className="flex-row h-16 p-2 items-center" style={{ backgroundColor: myTheme["color-success-700"] }}>
                    <StyledText className="font-bold text-white w-1/2">
                    Average Per-User Emission Reduction
                    </StyledText>
                    <View className="w-1/2 py-1 border rounded-xl" style={{ backgroundColor: myTheme["color-success-800"], borderColor: myTheme["color-success-900"] }}>
                    <StyledText className="text-lg font-bold text-center text-white">{impactAverage.toFixed(2)} kg</StyledText>
                    </View>
            </View>
            <View className="flex-row space-x-1 p-1 mt-2">
                <View className="flex-column rounded-xl p-2 border" style={{ borderColor: myTheme["color-success-800"]}}>
                    <StyledText className="text-sm" style={{ color: myTheme["color-success-800"]}}>Daily Average</StyledText>
                    <StyledText className="text-center text-lg font-bold" style={{ color: myTheme["color-success-700"]}}>{dailyAverage.toFixed(2)} kg</StyledText>
                </View>
                <View className="flex-column rounded-xl p-2 border" style={{ borderColor: myTheme["color-success-800"]}}>
                    <StyledText className="text-sm" style={{ color: myTheme["color-success-800"]}}>Weekly Average</StyledText>
                    <StyledText className="text-center text-lg font-bold" style={{ color: myTheme["color-success-700"]}}>{weeklyAverage.toFixed(2)} kg</StyledText>
                </View>
                <View className="flex-column rounded-xl p-2 border" style={{ borderColor: myTheme["color-success-800"]}}>
                    <StyledText className="text-sm" style={{ color: myTheme["color-success-800"]}}>Monthly Average</StyledText>
                    <StyledText className="text-center text-lg font-bold" style={{ color: myTheme["color-success-700"]}}>{monthlyAverage.toFixed(2)} kg</StyledText>
                </View>
            </View>
          </View>
        )}
      </View>
      <View className="flex-row my-2">
      <View className="w-1/2 p-2 py-3" style={{ borderColor: myTheme["color-success-800"]}}>
        {loadingInitial ? (
          <></>
        ) : (
          <View>
            <View className="items-center">
                <StyledText className="font-bold text-center" style={{ color: myTheme["color-success-700"]}}>Average Per-User {"\n"}Initial Emissions</StyledText>
                <View className="rounded-xl w-3/4 py-1 my-1" style={{ backgroundColor: myTheme["color-success-700"]}}>
                    <StyledText className="text-center text-lg font-bold text-white">{averageInitialEmissions.overall.toFixed(2)} tons</StyledText>
                </View>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500"><StyledText className="italic text-center text-sm w-full" style={{ color: myTheme["color-success-700"]}}>Food{"\n"}</StyledText>{averageInitialEmissions.food.toFixed(2)} tons</StyledText>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500" ><StyledText className="italic text-center text-sm" style={{ color: myTheme["color-success-700"]}}>Transportation{"\n"}</StyledText>{averageInitialEmissions.transportation.toFixed(2)} tons</StyledText>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500" ><StyledText className="italic text-center text-sm" style={{ color: myTheme["color-success-700"]}}>Electricity{"\n"}</StyledText>{averageInitialEmissions.electricity.toFixed(2)} tons</StyledText>
            </View>
          </View>
        )}
      </View>
      <View className="w-1/2 p-2 py-3">
        {loadingCurrent ? (
          <></>
        ) : (
            <View>
            <View className="items-center">
                <StyledText className="font-bold text-center" style={{ color: myTheme["color-success-700"]}}>Average Per-User {"\n"}Current Emissions</StyledText>
                <View className="rounded-xl w-3/4 py-1 my-1" style={{ backgroundColor: myTheme["color-success-700"]}}>
                    <StyledText className="text-center text-lg font-bold text-white" >{averageCurrentEmissions.overall.toFixed(2)} tons</StyledText>
                </View>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500"><StyledText className="italic text-center text-sm w-full" style={{ color: myTheme["color-success-700"]}}>Food{"\n"}</StyledText>{averageCurrentEmissions.food.toFixed(2)} tons</StyledText>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500"><StyledText className="italic text-center text-sm" style={{ color: myTheme["color-success-700"]}}>Transportation{"\n"}</StyledText>{averageCurrentEmissions.transportation.toFixed(2)} tons</StyledText>
                <StyledText className="text-center mt-2 w-full font-bold text-gray-500"><StyledText className="italic text-center text-sm" style={{ color: myTheme["color-success-700"]}}>Electricity{"\n"}</StyledText>{averageCurrentEmissions.electricity.toFixed(2)} tons</StyledText>
            </View>
          </View>
        )}
      </View>
      </View>
      <Layout style={{ flex: 1, padding: 13 }}>
        {dailyLogLoading ? (
          <></>
        ) : (
          <View>
            <StyledText category="h6" style={{ color: myTheme["color-success-800"]}} className="mb-2">Eco Actions Ranking</StyledText>
            <View>
                {categoryRankings.map((item: any, index: any) => (
                    <View key={index} className="flex-row my-1">
                        <View className="w-1/3 py-2 items-center align-center">
                            <StyledText className="font-bold mb-1" style={{ color: myTheme["color-success-800"]}}>{item.category}</StyledText>
                            <StyledText className="text-xs leading-tight text-gray-500">Added <StyledText className="font-bold text-xs text-gray-600">{item.totalActions}</StyledText> times</StyledText>
                        </View>
                        <View className="w-2/3 rounded p-2" style={{ backgroundColor: myTheme["color-success-700"]}}>
                            <StyledText className="text-sm font-bold text-white">🥇 {getEcoActionTitle(item.mostPreferredAction.id)}</StyledText>
                            <StyledText className="text-xs text-neutral-200 text-right pt-3">Present in {item.mostPreferredAction.count} users' daily logs</StyledText>
                        </View>
                    </View>
                ))}
            </View>
          </View>
        )}
      </Layout>
    </ScrollView>
  );
};

export default Dashboard;
