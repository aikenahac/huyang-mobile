import { QueryProvider } from "@/lib/query";
import HomeScreen from "./home";

export default function AppIndex() {
  return (
    <QueryProvider>
      <HomeScreen />
    </QueryProvider>
  );
}
