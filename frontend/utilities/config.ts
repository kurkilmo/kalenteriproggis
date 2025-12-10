import Constants from 'expo-constants';
const ip = Constants.manifest2?.extra?.expoGo?.debuggerHost
let host = "localhost"
if (ip) {
    host = ip.split(':')[0]
}

const API_URL = Constants?.expoConfig?.extra?.DIST
    ? ""
    :`http://${host}:3001`;

export { API_URL };

