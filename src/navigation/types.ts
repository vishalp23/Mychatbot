import { StackNavigationProp } from '@react-navigation/nastack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';

// Stack Navigator routes
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Drawer: undefined; // Wrapper for DrawerNavigator
};

// Drawer Navigator routes
export type DrawerParamList = {
  Home: undefined;
  Chat: { sessionId?: string };
};

// Props for screens in Stack Navigator
export type StackScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// Props for screens in Drawer Navigator
export type DrawerScreenProps<T extends keyof DrawerParamList> = {
  navigation: DrawerNavigationProp<DrawerParamList, T>;
  route: RouteProp<DrawerParamList, T>;
};
