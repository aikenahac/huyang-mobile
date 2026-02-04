import { ScreenContainer } from "@/components/screen-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SmartHomeScreen() {
  const [livingRoomLights, setLivingRoomLights] = useState(true);
  const [bedroomLights, setBedroomLights] = useState(false);
  const [kitchenLights, setKitchenLights] = useState(false);

  const [blindsPosition, setBlindsPosition] = useState<"open" | "half" | "closed">("half");
  const [printerOnline, setPrinterOnline] = useState(true);
  const [printerJobActive] = useState(false);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 gap-4 p-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Smart Home
          </Text>
          <Text className="text-sm text-muted-foreground mb-4">
            Quick controls for lights, blinds and your 3D printer. Later this
            will wire into Home Assistant / your real setup.
          </Text>

          {/* Lights */}
          <Card>
            <CardHeader>
              <CardTitle>Lights</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-foreground">Living room</Text>
                  <Text className="text-xs text-muted-foreground">
                    {livingRoomLights ? "On" : "Off"}
                  </Text>
                </View>
                <Switch
                  checked={livingRoomLights}
                  onCheckedChange={setLivingRoomLights}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-foreground">Bedroom</Text>
                  <Text className="text-xs text-muted-foreground">
                    {bedroomLights ? "On" : "Off"}
                  </Text>
                </View>
                <Switch
                  checked={bedroomLights}
                  onCheckedChange={setBedroomLights}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-foreground">Kitchen</Text>
                  <Text className="text-xs text-muted-foreground">
                    {kitchenLights ? "On" : "Off"}
                  </Text>
                </View>
                <Switch
                  checked={kitchenLights}
                  onCheckedChange={setKitchenLights}
                />
              </View>

              <Button variant="outline" className="mt-2">
                <Text>All off</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Blinds */}
          <Card>
            <CardHeader>
              <CardTitle>Blinds</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <Text className="text-xs text-muted-foreground">
                Choose a preset for all blinds. Later you can hook this into
                individual rooms and scenes.
              </Text>
              <View className="flex-row gap-2">
                <Toggle
                  pressed={blindsPosition === "open"}
                  onPressedChange={() => setBlindsPosition("open")}
                  className="flex-1 justify-center"
                >
                  <Text>Open</Text>
                </Toggle>
                <Toggle
                  pressed={blindsPosition === "half"}
                  onPressedChange={() => setBlindsPosition("half")}
                  className="flex-1 justify-center"
                >
                  <Text>Half</Text>
                </Toggle>
                <Toggle
                  pressed={blindsPosition === "closed"}
                  onPressedChange={() => setBlindsPosition("closed")}
                  className="flex-1 justify-center"
                >
                  <Text>Closed</Text>
                </Toggle>
              </View>
              <Text className="text-xs text-muted-foreground">
                Current preset: <Text className="font-semibold">{blindsPosition}</Text>
              </Text>
            </CardContent>
          </Card>

          {/* 3D printer */}
          <Card>
            <CardHeader>
              <CardTitle>3D Printer</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-foreground">Status</Text>
                  <Text className="text-xs text-muted-foreground">
                    {printerOnline ? "Online" : "Offline"}
                  </Text>
                </View>
                <Switch
                  checked={printerOnline}
                  onCheckedChange={setPrinterOnline}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-foreground">Current job</Text>
                  <Text className="text-xs text-muted-foreground">
                    {printerJobActive ? "Printing" : "Idle"}
                  </Text>
                </View>
                <Button size="sm" variant="outline">
                  <Text>{printerJobActive ? "Pause" : "Start test"}</Text>
                </Button>
              </View>
              <Button className="mt-1" variant="secondary">
                <Text>Open print queue</Text>
              </Button>
            </CardContent>
          </Card>

          <View className="h-6" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
