import { StatusBar,SafeAreaView,StyleSheet,BackHandler,Alert } from 'react-native';
import React, {useEffect} from 'react';
import Providers from './src/utils';
import { LogBox } from "react-native";
import store from './store';
import {Provider} from "react-redux";
import { theme } from './src/Chat/ChatTheme';
import Toast from 'react-native-toast-message';
const App = () => {
  
  LogBox.ignoreLogs([
    'Animated: `useNativeDriver` was not specified.',
  ]);

  LogBox.ignoreLogs(["EventEmitter.removeListener"]);  
  
  
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "앱을 종료하시겠습니까?", [
        {
          text: "취소",
          onPress: () => null,
        },
        { text: "확인", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
    
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(['Warning: ...']);
  return (
    
    <SafeAreaView style={styles.container}>
  <StatusBar style="light" backgroundColor='orange' />
  <Provider store ={store}><Providers /></Provider>
      <Toast />
  </SafeAreaView>
  
  );





}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});