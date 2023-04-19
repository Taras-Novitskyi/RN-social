import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";

export function MapScreen({ route }) {
  const { coords, location } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="standard"
        minZoomLevel={15}
        showsUserLocation={true}
        onMapReady={() => console.log("Map is ready")}
        onRegionChange={() => console.log("Region change")}
      >
        {location && (
          <Marker
            title={location}
            coordinate={{
              latitude: coords.latitude,
              longitude: coords.longitude,
            }}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
  }
});
