/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  Login: undefined;
  Admin: undefined;
  Language: undefined;
  NotFound: undefined;
  Configuration: undefined;
};

export type BottomTabParamList = {
  Chat: undefined;
  Capsulas: undefined;
  Estadistica: undefined;
};

export type LoginParamList = {
  LoginScreen: undefined;
};

export type AdminParamList = {
  AdminScreen: undefined;
}

export type LanguageParamList = {
  LanguageScreen: undefined;
};

export type ConfigurationParamList = {
  ConfigurationScreen: undefined;
};

export type ChatParamList = {
  ChatScreen: undefined;
  CreateTag: undefined;
};

export type CapsulasParamList = {
  CapsulasScreen: undefined;
};

export type EstadisticaParamList = {
  EstadisticaScreen: undefined;
};
