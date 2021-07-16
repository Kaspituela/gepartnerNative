/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Mensajes: undefined;
  Chat: undefined;
  Idiomas: undefined;
};

export type ChatTabParamList = {
  MessageScreen: undefined;
  Chat: {userName: string};
};


export type LanguageTabParamList = {
  LanguageScreen: undefined;
};
