import { ScreenContainer } from "@/components/screen-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function ServerScreen() {
  const [coreOnline, setCoreOnline] = useState(true);
  const [dbOnline, setDbOnline] = useState(true);
  const [aiNodeOnline, setAiNodeOnline] = useState(true);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 gap-4 p-6">
          <Text className="mb-2 text-3xl font-bold text-foreground">
            Servers
          </Text>
          <Text className="mb-4 text-sm text-muted-foreground">
            High-level view of your core services. Later this can connect to
            Dokploy / Portainer / custom APIs for real control.
          </Text>

          <Card>
            <CardHeader>
              <CardTitle>Core stack</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="gap-0.5">
                  <Text className="font-medium text-foreground">Gateway</Text>
                  <Text className="text-xs text-muted-foreground">
                    Reverse proxy, certificates, edge routing
                  </Text>
                </View>
                <Switch checked={coreOnline} onCheckedChange={setCoreOnline} />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="gap-0.5">
                  <Text className="font-medium text-foreground">Database</Text>
                  <Text className="text-xs text-muted-foreground">
                    Postgres cluster, prod region
                  </Text>
                </View>
                <Switch checked={dbOnline} onCheckedChange={setDbOnline} />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="gap-0.5">
                  <Text className="font-medium text-foreground">AI node</Text>
                  <Text className="text-xs text-muted-foreground">
                    Local inference / GPU worker
                  </Text>
                </View>
                <Switch
                  checked={aiNodeOnline}
                  onCheckedChange={setAiNodeOnline}
                />
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <Button variant="outline">
                <Text>Open logs dashboard</Text>
              </Button>
              <Button variant="outline">
                <Text>Deploy latest tagged release</Text>
              </Button>
              <Button variant="destructive">
                <Text>Restart everything</Text>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted-foreground">
                  Overall status
                </Text>
                <Text className="text-xs font-semibold text-foreground">
                  {coreOnline && dbOnline && aiNodeOnline
                    ? "All green"
                    : "Attention needed"}
                </Text>
              </View>
              <Separator />
              <Text className="text-xs text-muted-foreground">
                This is just UI for now. Later, we can wire each toggle and
                action to real health checks and control APIs.
              </Text>
            </CardContent>
          </Card>

          <View className="h-6" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
