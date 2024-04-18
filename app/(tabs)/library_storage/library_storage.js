import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LibraryStorage = new Storage({
  size: 1000,

  storageBackend: AsyncStorage, // for web: window.localStorage

  defaultExpires: null,

  enableCache: true,
});

export default LibraryStorage;
