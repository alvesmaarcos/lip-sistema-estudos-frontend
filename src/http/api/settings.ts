import { api } from "./index";

export interface UserSettings {
  id?: number;
  firstRevisionInterval: number;
  secondRevisionInterval: number;
  thirdRevisionInterval: number;
}

export async function getSettings() {
  return api.get<UserSettings>("/user/settings");
}

export async function updateSettings(settings: UserSettings) {
  return api.put<UserSettings>("/user/settings", settings);
}
