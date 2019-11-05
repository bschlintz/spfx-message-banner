import { MessageBannerSettings } from "../../../../models/MessageBannerSettings";

export interface IBannerPanelProps {
  settings: MessageBannerSettings;
  isOpen: boolean;
  onSave: () => Promise<void>;
  onCancelOrDismiss: () => void;
  onFieldChange: (newSetting: {[ key: string ]: any }) => void;
}
