import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ItemDetail(index, itemname , Value1,Value2 ,makingCharge , Total )

{
  let total = parseFloat(Value1 * Value2)
  return (
    <View key={index} style={{padding:15}}>
              <View
                style={[styles.container]}
              >
                <View>
                  <Text style={styles.totalTitle}>Item {index + 1}</Text>
                </View>

                <View>
                  <Text style={styles.value}>
                    {itemname}
                  </Text>
                </View>
              </View>
              <View
                style={styles.container}
              >
                <View>
                  <Text style={styles.totalTitle}>Value</Text>
                </View>

                <View>
                  <Text style={styles.value}>
                    {total}
                  </Text>
                </View>
              </View>
              <View
                style={styles.container}
              >
                <View>
                  <Text style={styles.totalTitle}>Making Charges</Text>
                </View>

                <View>
                  <Text style={styles.value}>
                    {makingCharge.toFixed(1)}
                  </Text>
                </View>
              </View>
              
              <View
                style={styles.container}
              >
                <View>
                  <Text style={styles.totalTitle}>Total:</Text>
                </View>

                <View>
                  <Text style={styles.value}>
                   {Total.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SpaceMono-Regular",
  },
  value: {
    color: "black",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "SpaceMono-Regular",
  },
})