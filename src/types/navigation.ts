/**
 * Navigation type definitions for the root stack.
 */
export type RootStackParamList = {
  Home: undefined;
  PdfViewer: {
    uri: string;
    fileName?: string;
  };
};
