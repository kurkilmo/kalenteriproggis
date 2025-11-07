import { Redirect } from "expo-router"

/** Ohjaa suoraan kotisivulle.
 * Selitys: (tabs) defaulttaa index.tsx sivulle eli tähän. Tämä puolestaan uudelleenohjaa kotisivulle.
 */
export default function Index() {
    return <Redirect href="/(drawer)/(tabs)/(home)" />
}