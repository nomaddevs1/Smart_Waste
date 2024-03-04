// useBLEConnection.ts
import { useState } from "react";
import { UseToastOptions } from "@chakra-ui/react";

interface BLEConnectionHook {
  connectToBLEDevice: (ssid: string, password: string) => Promise<string | undefined>;
  disconnectBLE: () => void;
  isConnected: boolean;
}

export const useBLEConnection = (
  toast: (options: UseToastOptions) => void
): BLEConnectionHook => {
  //@ts-ignore
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const generateUUID = (): string => {
    return "xxxx-xxxx-xxxx-xxxx".replace(/[x]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const connectToBLEDevice = async (
    ssid: string,
    password: string
  ): Promise<string | undefined> => {
    try {
      //@ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["19b10000-e8f2-537e-4f6c-d104768a1214"] }],
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(
        "19b10000-e8f2-537e-4f6c-d104768a1214"
      );
      const serialCharacteristic = await service.getCharacteristic(
        "19b10002-e8f2-537e-4f6c-d104768a1214"
      );
      const wifiCharacteristic = await service.getCharacteristic(
        "19b10001-e8f2-537e-4f6c-d104768a1214"
      );

      // Serial number
      const value = await serialCharacteristic.readValue();
      const decoder = new TextDecoder("utf-8");
      const serialNumber = await decoder.decode(value);
      if (!serialNumber || serialNumber === "No Serial Number") {
        let newSerialNumber = generateUUID();
        let encoded = new TextEncoder().encode(newSerialNumber);
        await serialCharacteristic.writeValue(encoded);
      }
      // Send SSID and Password
      const encodedCredentials = new TextEncoder().encode(
        `${ssid};${password}`
        );
        await wifiCharacteristic.writeValue(encodedCredentials);
        
        // Set device state
      setDevice(device);
      setIsConnected(true);
      
      toast({
        title: "Connection successful",
        description: "Wifi connected.",
        status: "success",
        isClosable: true,
      });
      return serialNumber
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to BLE device.",
        status: "error",
        isClosable: true,
      });
    }
    
  };

  const disconnectBLE = (): void => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
      setDevice(null);
      setIsConnected(false);
    }
  };

  return { connectToBLEDevice, disconnectBLE, isConnected };
};
