import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import {
  Text,
  Heading,
  Image as Img,
  Card,
  View,
  VStack,
  Box,
} from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

import { apiHandler } from "../config/apiHandler";

export function Qrcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isError, setError] = useState(false);
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
      if(!data.data) throw new Error()
      setData(data.data);
      setError(false);
    } catch (e) {
      setError(true);
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

  if (isError) {
    return (
      <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3" mt={40}>
      <View>
        <Heading>Error Fetching the Ticket</Heading>
      </View>
      </Card>
    );
  }

  if (dataBody) {
    return (
      <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3" mt={40}>
        <Box flexDirection="row">
          <VStack>
          <Heading>{dataBody.name}</Heading>
            <Text size="sm" fontFamily="$heading" mb="$1">
              Event Date - {new Date(dataBody.eventDate).getDate()}-
                {new Date(dataBody.eventDate).getMonth()}-
                {new Date(dataBody.eventDate).getFullYear()}
            </Text>
            <Text size="sm" fontFamily="$heading" mb="$1">
              {dataBody.location}
            </Text>
          </VStack>
        </Box>

        <Img
          mt={15}
          size="lg"
          width="100%"
          height={400}
          borderRadius="$none"
          alt="Event info image"
          source={{
            uri: dataBody.coverImage,
          }}
        />
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
