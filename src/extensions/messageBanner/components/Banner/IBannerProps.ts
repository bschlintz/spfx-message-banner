import { MessageBannerSettings } from "../../../../models/MessageBannerSettings";
import { BaseComponentContext } from "@microsoft/sp-component-base";

export interface IBannerProps {
  context: BaseComponentContext;
  settings: MessageBannerSettings;
}
