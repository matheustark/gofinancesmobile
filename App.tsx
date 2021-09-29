import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { StatusBar } from 'react-native';
import { Routes } from './src/routes';
import { ThemeProvider } from 'styled-components';

import theme from './src/global/styles/theme';

import { AuthProvider, useAuth } from './src/hooks/auth';

import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import AppLoading from 'expo-app-loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userSorageloading } = useAuth();

  if(!fontsLoaded || userSorageloading) {
    return <AppLoading />
  }

  return (
  <ThemeProvider theme={theme} >
      <StatusBar barStyle="light-content" />
      <AuthProvider>
       <Routes />
      </AuthProvider>
  </ThemeProvider>  
  );
}

