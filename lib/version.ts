import Constants from 'expo-constants';

/**
 * Get the app version from app.json
 * Returns version in format: "X.Y.Z (Build XXX)"
 */
export const getAppVersion = (): string => {
  try {
    const version = Constants.expoConfig?.version || '1.0.0';
    const buildNumber =
      Constants.expoConfig?.android?.buildNumber ||
      Constants.expoConfig?.ios?.buildNumber ||
      Constants.nativeAppVersion ||
      '0';

    return `${version} (Build ${buildNumber})`;
  } catch (error) {
    return '1.0.0 (Build 0)';
  }
};

/**
 * Get just the version number
 */
export const getVersionNumber = (): string => {
  try {
    return Constants.expoConfig?.version || '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
};

/**
 * Get just the build number
 */
export const getBuildNumber = (): string => {
  try {
    return (
      Constants.expoConfig?.android?.buildNumber ||
      Constants.expoConfig?.ios?.buildNumber ||
      Constants.nativeAppVersion ||
      '0'
    );
  } catch (error) {
    return '0';
  }
};
