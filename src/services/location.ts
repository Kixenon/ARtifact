import * as Location from 'expo-location';
import { withTimeout } from '../utils/async';

export type MaybeLocation = Location.LocationObject | null;

export async function getForegroundPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function readBestEffortLocation(): Promise<MaybeLocation> {
  try {
    const last = await Location.getLastKnownPositionAsync();
    if (last) return last;
  } catch {}
  try {
    return await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), 7000);
  } catch {
    return null;
  }
}

export async function reverseGeocode(coords: Location.LocationObjectCoords): Promise<string | null> {
  try {
    const [place] = await withTimeout(Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude }), 3000);
    if (!place) return null;
    const parts = [place.name, place.street, place.city, place.region, place.postalCode, place.country].filter(Boolean);
    return parts.join(', ');
  } catch {
    return null;
  }
}


