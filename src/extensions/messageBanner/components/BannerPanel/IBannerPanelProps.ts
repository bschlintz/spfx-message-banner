import { MessageBannerSettings } from "../../../../models/MessageBannerSettings";

export interface IBannerPanelProps {
  currentSettings: MessageBannerSettings;
  isOpen: boolean;
  onSave: () => Promise<boolean>;
  onCancelOrDismiss: () => void;
  onFieldChange: (settingKey: string, settingValue: any) => void;
}
