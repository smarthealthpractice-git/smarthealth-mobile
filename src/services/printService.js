import { NativeModules, Platform } from 'react-native';
// platform --to detect type of app, Nativemodules -- talk to native android or ios code
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

/* Uses a native Android module for printing
Medium
Review the native PrintHtmlModule implementation because sensitive health data is passed to it.*/

/**HTML content can contain patient medical information
High
Ensure the native module does not save, expose, transmit or log the HTML unnecessarily. */

/** jobName may contain patient ID
Medium
Avoid putting internal patient identifiers into print job names where possible.*/

