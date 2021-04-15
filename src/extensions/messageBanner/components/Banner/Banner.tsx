import * as React from 'react';
import { IBannerProps } from './IBannerProps';
import { IBannerState } from './IBannerState';
import styles from './Banner.module.scss';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import BannerPanel from '../BannerPanel/BannerPanel';
import * as strings from 'MessageBannerApplicationCustomizerStrings';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import SPPermission from '@microsoft/sp-page-context/lib/SPPermission';
import isPast from 'date-fns/isPast';
import formatDate from 'date-fns/format';
import { Text } from '@microsoft/sp-core-library';
import { DEFAULT_PROPERTIES } from '../../../../models/IMessageBannerProperties';

const BANNER_CONTAINER_ID = 'CustomMessageBannerContainer';

class Banner extends React.Component<IBannerProps, IBannerState> {

  constructor(props: IBannerProps) {
    super(props);
    this.state = {
      defaultSettings: props.settings,
      settings: props.settings,
      isPanelOpen: false,
      isSaving: false
    };
  }

  componentDidUpdate(prevProps: IBannerProps, prevState: IBannerState) {
    const enablePreAlloc = this.props.settings.enableSetPreAllocatedTopHeight;
    const oldBannerHeightPx = prevProps.settings.bannerHeightPx;
    const newBannerHeightPx = this.props.settings.bannerHeightPx;

    if (enablePreAlloc && oldBannerHeightPx !== newBannerHeightPx) {
      document.getElementById(BANNER_CONTAINER_ID).parentElement.style.height = `${newBannerHeightPx}px`;
    }
  }

  private handleOpenClick = (): void => {
    this.setState({
      ...this.state,
      isPanelOpen: true
    });
  };

  private handleCancelOrDismiss = (): void => {
    const { isSaving, defaultSettings } = this.state;
    if (!isSaving) {
      this.setState({
        ...this.state,
        isPanelOpen: false,
        settings: {
          ...defaultSettings //return to original settings
        }
      });
    }
  };

  private handleSave = async (): Promise<void> => {
    const { settings } = this.state;
    try {
      this.setState({
        ...this.state,
        isSaving: true
      });
      let hostProperties = null;
      // Set host property 'preAllocatedApplicationCustomizerTopHeight' when saving custom action properties
      if (this.props.settings.enableSetPreAllocatedTopHeight) {
        hostProperties = { "preAllocatedApplicationCustomizerTopHeight": `${settings.bannerHeightPx}`};
      }
      await this.props.clientSideComponentService.setProperties(settings, hostProperties);
      this.setState({
        ...this.state,
        isPanelOpen: false,
        isSaving: false,
        defaultSettings: {
          ...this.state.settings
        }
      });
    }
    catch (error) {
      console.log(`Unable to set custom action properties. ${error.message}`, error);
    }
  };

  private handleFieldChange = (newSetting: {[ key: string ]: any }): void => {
    this.setState({
      settings: {
        ...this.state.settings,
        ...newSetting
      }
    });
  };

  private resetToDefaults = (): void => {
    this.setState({
      settings: {
        ...this.state.settings,
        ...DEFAULT_PROPERTIES
      }
    });
  };

  private parseTokens = (textWithTokens: string, context: BaseComponentContext): string => {
    const tokens = [
      { token: '{siteUrl}', value: context.pageContext.site.absoluteUrl },
      { token: '{webUrl}', value: context.pageContext.web.absoluteUrl },
    ];

    const outputText = tokens.reduce((text, tokenItem) => {
      return text.replace(tokenItem.token, tokenItem.value);
    }, textWithTokens);

    return outputText;
  };


  public render() {
    const { settings, isPanelOpen, isSaving } = this.state;
    const visibleStartDate = settings.visibleStartDate ? new Date(settings.visibleStartDate) : null;
    const isPastVisibleStartDate = settings.visibleStartDate && isPast(visibleStartDate);
    const isCurrentUserAdmin = this.props.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb as any);

    //If there is a future start date and it hasn't yet occurred,
    // and either the current user isn't an admin or the user is an admin but the disableSiteAdminUI flag is set,
    // then render nothing
    if (visibleStartDate && !isPastVisibleStartDate && (!isCurrentUserAdmin || settings.disableSiteAdminUI)) return null;

    return (
      <div id={BANNER_CONTAINER_ID} style={{ backgroundColor: settings.backgroundColor }}>
        <div className={styles.BannerContainer} style={{ height: settings.bannerHeightPx }}>
          {!settings.disableSiteAdminUI && isCurrentUserAdmin && !!visibleStartDate && (isPastVisibleStartDate
            ? <div className={styles.AdminUserVisibilityBadge}>{strings.BannerBadgeIsVisibleToUsersMessage}</div>
            : <div className={styles.AdminUserVisibilityBadge}>{Text.format(strings.BannerBadgeNotVisibleToUsersMessage, formatDate(visibleStartDate, 'PPPP'))}</div>
          )}
          <div
            dangerouslySetInnerHTML={{__html: this.parseTokens(settings.message, this.props.context)}}
            style={{ color: settings.textColor, fontSize: settings.textFontSizePx }}>
          </div>
          {!settings.disableSiteAdminUI && isCurrentUserAdmin && (
            <IconButton
              iconProps={{ iconName: 'Edit', styles: { root: { color: settings.textColor}}}}
              onClick={this.handleOpenClick}
              className={styles.EditButtonIcon}
            />
          )}
          {!settings.disableSiteAdminUI && (<BannerPanel
              isOpen={isPanelOpen}
              isSaving={isSaving}
              onCancelOrDismiss={this.handleCancelOrDismiss}
              onFieldChange={this.handleFieldChange}
              onSave={this.handleSave}
              resetToDefaults={this.resetToDefaults}
              settings={settings}
            />
          )}
        </div>
      </div>
    );
  }
};

export default Banner;
