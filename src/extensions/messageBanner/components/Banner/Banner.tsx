import * as React from 'react';
const { useState, useEffect } = React;
import { IBannerProps } from './IBannerProps';
import styles from './Banner.module.scss';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import BannerPanel from '../BannerPanel/BannerPanel';
import * as strings from 'MessageBannerApplicationCustomizerStrings';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import SPPermission from '@microsoft/sp-page-context/lib/SPPermission';
import isPast from 'date-fns/isPast';
import formatDate from 'date-fns/format';
import { Text } from '@microsoft/sp-core-library';

const EXPERIMENTAL_ENABLE_PREALLOCATEDTOPHEIGHT = true;
const BANNER_CONTAINER_ID = 'CustomMessageBannerContainer';

const Banner = (props: IBannerProps) => {
  const [settings, setSettings] = useState(props.settings);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (EXPERIMENTAL_ENABLE_PREALLOCATEDTOPHEIGHT) {
      document.getElementById(BANNER_CONTAINER_ID).parentElement.style.height = `${settings.bannerHeightPx}px`;
    }
  }, [settings.bannerHeightPx])

  const visibleStartDate = settings.visibleStartDate ? new Date(settings.visibleStartDate) : null;
  const isPastVisibleStartDate = settings.visibleStartDate && isPast(visibleStartDate);
  const isCurrentUserAdmin = props.context.pageContext.web.permissions.hasPermission(SPPermission.manageWeb as any);

  const handleOpenClick = (): void => {
    setIsPanelOpen(true);
  };

  const handleCancelOrDismiss = (): void => {
    if (!isSaving) {
      setIsPanelOpen(false);
      setSettings(props.settings); //return to original settings
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true);
      let hostProperties = null;
      if (EXPERIMENTAL_ENABLE_PREALLOCATEDTOPHEIGHT) {
        hostProperties = { "preAllocatedApplicationCustomizerTopHeight": `${settings.bannerHeightPx}`};
      }
      await props.clientSideComponentService.setProperties(settings, hostProperties);
      setIsPanelOpen(false);
      setIsSaving(false);
    }
    catch (error) {
      console.log(`Unable to set custom action properties. ${error.message}`, error);
    }
  };

  const handleFieldChange = (newSetting: {[ key: string ]: any }): void => {
    const newSettings = { ...settings, ...newSetting };
    setSettings(newSettings);
  };

  const parseTokens = (textWithTokens: string, context: BaseComponentContext): string => {
    const tokens = [
      { token: '{siteurl}', value: context.pageContext.site.absoluteUrl },
      { token: '{weburl}', value: context.pageContext.web.absoluteUrl },
    ];

    const outputText = tokens.reduce((text, tokenItem) => {
      return text.replace(tokenItem.token, tokenItem.value);
    }, textWithTokens);

    return outputText;
  };


  //If user isn't an admin and there is a future start date, render nothing
  if (visibleStartDate && !isPastVisibleStartDate && !isCurrentUserAdmin) return null;

  return (
    <div id={BANNER_CONTAINER_ID} style={{ backgroundColor: settings.backgroundColor }}>
      <div className={styles.BannerContainer} style={{ height: settings.bannerHeightPx }}>
        {isCurrentUserAdmin && !!visibleStartDate && (isPastVisibleStartDate
          ? <div className={styles.AdminUserVisibilityBadge}>{strings.BannerBadgeIsVisibleToUsersMessage}</div>
          : <div className={styles.AdminUserVisibilityBadge}>{Text.format(strings.BannerBadgeNotVisibleToUsersMessage, formatDate(visibleStartDate, 'PPPP'))}</div>
        )}
        <div
          dangerouslySetInnerHTML={{__html: parseTokens(settings.message, props.context)}}
          style={{ color: settings.textColor, fontSize: settings.textFontSizePx }}>
        </div>
        {isCurrentUserAdmin && (
          <IconButton
            iconProps={{ iconName: 'Edit', styles: { root: { color: settings.textColor}}}}
            onClick={handleOpenClick}
            className={styles.EditButtonIcon}
          />
        )}
        <BannerPanel
          isOpen={isPanelOpen}
          isSaving={isSaving}
          onCancelOrDismiss={handleCancelOrDismiss}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          settings={settings}
        />
      </div>
    </div>
  );
};

export default Banner;
