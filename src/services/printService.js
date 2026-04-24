import { NativeModules, Platform } from 'react-native';

const { PrintHtmlModule } = NativeModules;

export const printHtml = async (jobName, html) => {
  if (Platform.OS !== 'android') {
    throw new Error('Print is currently implemented only for Android.');
  }

  if (!PrintHtmlModule) {
    throw new Error('PrintHtmlModule is not available. Rebuild the Android app.');
  }

  return PrintHtmlModule.printHtml(jobName, html);
};