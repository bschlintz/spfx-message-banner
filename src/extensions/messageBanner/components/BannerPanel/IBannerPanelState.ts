import { IMessageBannerProperties } from "../../../../models/IMessageBannerProperties";

export interface IBannerPanelState {
  errorMessage?: string;
  settings: IMessageBannerProperties;
}
