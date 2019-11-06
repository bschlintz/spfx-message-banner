declare interface IMessageBannerApplicationCustomizerStrings {
  Title: string;
  BannerBadgeNotVisibleToUsersMessage: string;
  BannerBadgeIsVisibleToUsersMessage: string;
  BannerPanelHeaderText: string;
  BannerPanelFieldMessageLabel: string;
  BannerPanelFieldMessageDescription: string;
  BannerPanelFieldBackgroundColorLabel: string;
  BannerPanelFieldTextColorLabel: string;
  BannerPanelFieldTextSizeLabel: string;
  BannerPanelFieldBannerHeightLabel: string;
  BannerPanelFieldVisibleStartDateLabel: string;
  BannerPanelFieldVisibleStartDateEnabledLabel: string;
  BannerPanelFieldVisibleStartDateDisabledLabel: string;
  // BannerPanelFieldVisibleEndDateLabel: string;
  BannerPanelButtonSaveText: string;
  BannerPanelButtonCancelText: string;
}

declare module 'MessageBannerApplicationCustomizerStrings' {
  const strings: IMessageBannerApplicationCustomizerStrings;
  export = strings;
}
