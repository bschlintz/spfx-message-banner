import * as React from 'react';
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

class BannerPanel extends React.Component<IBannerPanelProps, IBannerPanelState> {

  public render() {
    return (
      <Panel
        isOpen={this.props.isOpen}
        type={PanelType.smallFixedFar}
        onDismiss={this.props.onCancelOrDismiss}
        headerText={strings.BannerPanelHeaderText}
        onRenderFooterContent={this._onRenderFooterContent}
        isLightDismiss={true}
      >
        <div className={styles.BannerPanelContainer}>
          <TextField
            multiline={true}
            label={strings.BannerPanelFieldMessageLabel}
            defaultValue={this.state.settings.message}
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
          {this.state.errorMessage && (<Label style={{ color: 'darkred' }}>{this.state.errorMessage}</Label>)}
        </div>
      </Panel>
    );
  }

  private _onRenderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={this._onSaveClick} style={{ marginRight: '8px' }}>
          {strings.BannerPanelButtonSaveText}
        </PrimaryButton>
        <DefaultButton onClick={this._onCancelClick}>{strings.BannerPanelButtonCancelText}</DefaultButton>
      </div>
    );
  }

  private _onFieldChange = (settingKey: string, settingValue: any) => {

  }

  private _onSaveClick = (): void => {
    //Validation
    this.props.onSave();
  }

  private _onCancelClick = (): void => {

  }

}

export default BannerPanel;
