import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Heading, Image, Card } from "react-native";

import { apiHandler } from "../config/apiHandler";

export function Qrcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dataBody, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data: id }) => {
    try {
      const { data } = await apiHandler.get(`/events/ticket/${id}`);
      console.log(data);
      setData(data);
      alert(
        `Bar code with type ${type} and data ${data.data} has been scanned!`,
      );
    } catch {
      console.log("ERROR");
    } finally {
      setScanned(true);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  if (dataBody) {
    return (
      <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3">
        <Text
          fontSize="$sm"
          fontStyle="normal"
          fontFamily="$heading"
          fontWeight="$normal"
          lineHeight="$sm"
          mb="$2"
          sx={{
            color: "$textLight700",
            _dark: {
              color: "$textDark200",
            },
          }}
        >
          May 15, 2023
        </Text>
        <Heading size="md" fontFamily="$heading" mb="$4">
          The Power of Positive Thinking
        </Heading>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "70%",
    borderColor: "red",
    borderEndWidth: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
