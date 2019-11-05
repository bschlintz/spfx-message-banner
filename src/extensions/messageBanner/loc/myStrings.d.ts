declare interface IMessageBannerApplicationCustomizerStrings {
  Title: string;
  BannerPanelHeaderText: string;
  BannerPanelFieldMessageLabel: string;
  BannerPanelFieldBackgroundColorLabel: string;
  BannerPanelFieldTextColorLabel: string;
  BannerPanelFieldTextSizeLabel: string;
  BannerPanelFieldBannerHeightLabel: string;
  BannerPanelButtonSaveText: string;
  BannerPanelButtonCancelText: string;
}

declare module 'MessageBannerApplicationCustomizerStrings' {
  const strings: IMessageBannerApplicationCustomizerStrings;
  export = strings;
}
