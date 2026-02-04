import { LanguageSwitcher } from "@/components/language-switcher";
import { ScreenContainer } from "@/components/screen-container";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { VoiceChat } from "@/components/assistant/voice-chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [switchValue, setSwitchValue] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);
  const [outlineTogglePressed, setOutlineTogglePressed] = useState(false);
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 gap-6 p-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              {t("home.title")}
            </Text>
            <Text className="text-base text-muted-foreground">
              {t("home.description")}
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              {t("home.changeLanguage")}
            </Text>
            <LanguageSwitcher />
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              {t("home.changeTheme")}
            </Text>
            <ThemeSwitcher />
          </View>

          <Separator />

          {/* Assistant section */}
          <VoiceChat />

          <Separator />

          {/* Navigation to future screens */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Control center
            </Text>
            <View className="flex-row gap-3">
              <Card className="flex-1" onTouchEnd={() => router.push("/smart-home") }>
                <CardHeader>
                  <CardTitle>Smart home</CardTitle>
                  <CardDescription>
                    Lights, blinds, printers and more.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="flex-1" onTouchEnd={() => router.push("/server") }>
                <CardHeader>
                  <CardTitle>Servers</CardTitle>
                  <CardDescription>
                    Status and actions for your stack.
                  </CardDescription>
                </CardHeader>
              </Card>
            </View>
          </View>

          <Separator />

          {/* Buttons Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">Buttons</Text>
            <View className="flex-row flex-wrap gap-3">
              <Button>
                <Text>Default</Text>
              </Button>
              <Button variant="secondary">
                <Text>Secondary</Text>
              </Button>
              <Button variant="destructive">
                <Text>Destructive</Text>
              </Button>
              <Button variant="outline">
                <Text>Outline</Text>
              </Button>
              <Button variant="ghost">
                <Text>Ghost</Text>
              </Button>
              <Button variant="link">
                <Text>Link</Text>
              </Button>
            </View>
            <View className="flex-row flex-wrap gap-3">
              <Button size="sm">
                <Text>Small</Text>
              </Button>
              <Button size="default">
                <Text>Default</Text>
              </Button>
              <Button size="lg">
                <Text>Large</Text>
              </Button>
            </View>
          </View>

          <Separator />

          {/* Badges Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">Badges</Text>
            <View className="flex-row flex-wrap gap-3">
              <Badge>
                <Text>Default</Text>
              </Badge>
              <Badge variant="secondary">
                <Text>Secondary</Text>
              </Badge>
              <Badge variant="destructive">
                <Text>Destructive</Text>
              </Badge>
              <Badge variant="outline">
                <Text>Outline</Text>
              </Badge>
            </View>
          </View>

          <Separator />

          {/* Card Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">Cards</Text>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>
                  This is a description of the card component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Text>Card content goes here with more details.</Text>
              </CardContent>
              <CardFooter className="flex-row gap-2">
                <Button variant="outline" size="sm">
                  <Text>Cancel</Text>
                </Button>
                <Button size="sm">
                  <Text>Confirm</Text>
                </Button>
              </CardFooter>
            </Card>
          </View>

          <Separator />

          {/* Switch Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">Switch</Text>
            <View className="flex-row items-center gap-4">
              <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
              <Text>Switch is {switchValue ? "ON" : "OFF"}</Text>
            </View>
          </View>

          <Separator />

          {/* Toggle Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">Toggle</Text>
            <View className="flex-row gap-3">
              <Toggle
                pressed={togglePressed}
                onPressedChange={setTogglePressed}
              >
                <Text>Toggle Me</Text>
              </Toggle>
              <Toggle
                variant="outline"
                pressed={outlineTogglePressed}
                onPressedChange={setOutlineTogglePressed}
              >
                <Text>Outline</Text>
              </Toggle>
            </View>
          </View>

          <Separator />

          {/* Dropdown Menu Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">
              Dropdown Menu
            </Text>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Text>Open Menu</Text>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>Profile</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Settings</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Logout</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>

          <Separator />

          {/* Alert Dialog Section */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-foreground">
              Alert Dialog
            </Text>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Text>Show Alert</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction>
                    <Text>Continue</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>

          <View className="h-8" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
