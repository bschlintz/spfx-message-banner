import * as React from 'react';
// const { useEffect, useState } = React;
import { IBannerPanelProps } from './IBannerPanelProps';
import { IBannerPanelState } from './IBannerPanelState';
import styles from './BannerPanel.module.scss';
import { PanelType, Panel } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as strings from 'MessageBannerApplicationCustomizerStrings';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { MessageBannerSettings } from '../../../../models/MessageBannerSettings';

const BannerPanel = (props: IBannerPanelProps) => {
  return (
    <Panel
    isOpen={props.isOpen}
    isBlocking={false}
    isLightDismiss={true}
    type={PanelType.smallFixedFar}
    onDismiss={props.onCancelOrDismiss}
    headerText={strings.BannerPanelHeaderText}
    onRenderFooterContent={() => (<>
      <PrimaryButton onClick={props.onSave} style={{ marginRight: '8px' }}>{strings.BannerPanelButtonSaveText}</PrimaryButton>
      <DefaultButton onClick={props.onCancelOrDismiss}>{strings.BannerPanelButtonCancelText}</DefaultButton>
    </>)}
  >
    <div>
      <TextField
        multiline={true}
        label={strings.BannerPanelFieldMessageLabel}
        defaultValue={props.settings.message}
        onChange={(e, value) => props.onFieldChange({ message: value })}
      />
      {/* <ColorPicker
          label={strings.BannerPanelFieldTextColorLabel}
          defaultValue={this.state.settings.textColor}
        /> */}
      {/* <TextField
          multiline={true}
          label={strings.BannerPanelFieldTextSizeLabel}
          defaultValue={this.state.settings.textFontSizePx}
        /> */}
      {/* {this.state.errorMessage && (<Label style={{ color: 'darkred' }}>{this.state.errorMessage}</Label>)} */}
    </div>
  </Panel>
  );
}

export default BannerPanel;
