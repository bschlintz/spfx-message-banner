import { IMessageBannerProperties } from "../../../../models/IMessageBannerProperties";

export interface IBannerState {
  defaultSettings: IMessageBannerProperties;
  settings: IMessageBannerProperties;
  isPanelOpen: boolean;
  isSaving: boolean;
}
