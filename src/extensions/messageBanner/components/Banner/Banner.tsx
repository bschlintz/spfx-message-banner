import * as React from 'react';
const { useState } = React;
import { IBannerProps } from './IBannerProps';
import styles from './Banner.module.scss';
import { IconButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import BannerPanel from '../BannerPanel/BannerPanel';
import { MessageBannerSettings } from '../../../../models/MessageBannerSettings';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as strings from 'MessageBannerApplicationCustomizerStrings';
import { BaseComponentContext } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IMessageBannerProperties } from '../../MessageBannerApplicationCustomizer';

const Banner = (props: IBannerProps) => {
  const [settings, setSettings] = useState(props.settings);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenClick = (): void => {
    setIsPanelOpen(true);
  }

  const handleCancelOrDismiss = (): void => {
    setIsPanelOpen(false);
    setSettings(props.settings); //return to original settings
  }

  const handleSave = async (): Promise<void> => {
    try {
      await _setCustomActionProperties(props.context.manifest.id, settings);
      location.reload();
    }
    catch (error) {
      console.log(`Unable to set custom action properties. ${error.message}`, error);
    }
  }

  const handleFieldChange = (newSetting: {[ key: string ]: any }): void => {
    const newSettings = { ...settings, ...newSetting };
    setSettings(newSettings);
  }

  return (
    <div style={{ backgroundColor: settings.backgroundColor }}>
      <div className={styles.BannerContainer} style={{ height: settings.bannerHeightPx }}>
        <span style={{ color: settings.textColor, fontSize: settings.textFontSizePx }}>
          {_parseTokens(settings.message, props.context)}
        </span>
        <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleOpenClick} className={styles.EditButtonIcon} />
        <BannerPanel
          isOpen={isPanelOpen}
          onCancelOrDismiss={handleCancelOrDismiss}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          settings={settings}
        />
      </div>
    </div>
  );
}

const _setCustomActionProperties = async (manifestId: string, properties: any): Promise<void> => {
  let customAction = await _getCustomActionByComponentId(manifestId);
  if (!customAction) return;

  try {
    let postCustomActionUri = `${this.context.pageContext.web.absoluteUrl}/_api/web/usercustomactions('${customAction.Id}')`;
    await this.context.spHttpClient.post(postCustomActionUri, SPHttpClient.configurations.v1, {
      headers: {
        "X-HTTP-Method": "MERGE",
        "content-type": "application/json; odata=nometadata"
      },
      body: JSON.stringify({
        "ClientSideComponentProperties": `{${JSON.stringify(properties)}}`
      })
    });
  } catch (error) {
    console.log(`ERROR: Unable to update custom action with id ${customAction.id}`, error);
  }
}

const _getCustomActionByComponentId = async (componentId: string): Promise<any> => {
  try {
    //TODO: Check both SITE and WEB scoped custom actions
    let getCustomActionUri = `${this.context.pageContext.web.absoluteUrl}/_api/web/usercustomactions`;
    getCustomActionUri += `?$filter=ClientSideComponentId eq guid'${componentId}'`;
    const getCustomActionResponse = await this.context.spHttpClient.get(getCustomActionUri, SPHttpClient.configurations.v1);
    const getCustomActionResult = await getCustomActionResponse.json();
    return getCustomActionResult.value && getCustomActionResult.value.length > 0 ? getCustomActionResult.value[0] : null;
  }
  catch (error) {
    console.log(`ERROR: Unable to fetch custom action with ClientSideComponentId ${componentId}`, error);
  }
}


const _parseTokens = (textWithTokens: string, context: BaseComponentContext): string => {
  const tokens = [
    { token: '{siteurl}', value: context.pageContext.site.absoluteUrl },
    { token: '{weburl}', value: context.pageContext.web.absoluteUrl },
  ];

  const outputText = tokens.reduce((text, tokenItem) => {
    return text.replace(tokenItem.token, tokenItem.value);
  }, textWithTokens);

  return outputText;
}

export default Banner;
