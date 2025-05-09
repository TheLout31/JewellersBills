import { SafeAreaView, StyleSheet, Text, View , TouchableOpacity} from "react-native";

import React from "react";

export default function Home({navigation}) {

  const Calculatorhandler=()=>{
    navigation.navigate("Calculator")
  }
  const handleLiveRate=()=>{
    navigation.navigate("LiveRate")
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
        <View>
          <View style={{alignItems:'center', marginBottom:20}}>
          <Text style={{ fontSize: 20, fontWeight: "600", color: "#6F5AAA" }}>
            Welcome!
          </Text>
          </View>
          

          <TouchableOpacity
          onPress={Calculatorhandler}
            style={{ height: 100, borderRadius: 16, padding:10 ,alignItems:'center', justifyContent:'center',borderWidth:2, borderColor:'#6F5AAA', marginBottom:20}}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Calculator and Bill generator
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
           onPress={handleLiveRate}
            style={{ height: 100, borderRadius: 16, padding:10 ,alignItems:'center', justifyContent:'center',borderWidth:2, borderColor:'#6F5AAA', }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Live Gold Rate 
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
