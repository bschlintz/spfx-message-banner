## Custom Message Banner for Modern SharePoint Sites

```powershell
Add-PnPCustomAction -Title "CustomMessageBanner" -Name "CustomMessageBanner" -Location "ClientSideExtension.ApplicationCustomizer" -ClientSideComponentId "1e2688c4-99d8-4897-8871-a9c151ccfc87" -ClientSideComponentProperties "{`"message`":`"Sample message banner text.`"}"
```
