import * as React from 'react';
import { IBannerProps } from './IBannerProps';
import { IBannerState } from './IBannerState';
import styles from './Banner.module.scss';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import BannerPanel from '../BannerPanel/BannerPanel';
import { MessageBannerSettings } from '../../../../models/MessageBannerSettings';

class Banner extends React.Component<IBannerProps, IBannerState> {
  public render() {
    const { settings: { message, backgroundColor, bannerHeightPx, textColor, textFontSizePx } } = this.props;

    return (
      <div style={{ backgroundColor: backgroundColor }}>
        <div className={styles.BannerContainer} style={{ height: bannerHeightPx }}>
          <span style={{ color: textColor, fontSize: textFontSizePx }}>
            {this._parseTokens(message)}
          </span>
          <IconButton iconProps={{iconName: 'Edit'}} onClick={this._openBannerPanel} />
          <BannerPanel
            isOpen={this.state.isBannerPanelOpen}
            currentSettings={this.props.settings}
            onSave={this._onBannerPanelSave}
            onCancelOrDismiss={this._onBannerPanelCancelOrDismiss}
            onFieldChange={this._onBannerPanelFieldChange}
          />
        </div>
      </div>
    );
  }

  private _openBannerPanel = () => {
    this.setState({ isBannerPanelOpen: true });
  }

  private _onBannerPanelCancelOrDismiss = (): void => {
    this.setState({ isBannerPanelOpen: false });
  }

  private _onBannerPanelSave = async (): Promise<boolean> => {
    return true;
  }

  private _onBannerPanelFieldChange = (settingKey: string, settingValue: any): void => {

  }

  private _parseTokens = (textWithTokens: string): string => {
    const { pageContext } = this.props.context;
    const tokens = [
      { token: '{siteurl}', value: pageContext.site.absoluteUrl },
      { token: '{weburl}', value: pageContext.web.absoluteUrl },
    ];

    const outputText = tokens.reduce((text, tokenItem) => {
      return text.replace(tokenItem.token, tokenItem.value);
    }, textWithTokens);

    return outputText;
  }
}

export default Banner;
