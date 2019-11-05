import { MessageBannerSettings } from "../../../../models/MessageBannerSettings";

export interface IBannerPanelState {
  errorMessage?: string;
  settings: MessageBannerSettings;
}
