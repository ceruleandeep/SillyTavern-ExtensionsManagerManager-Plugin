// noinspection DuplicatedCode

/*
Starter code for a SillyTavern extension. This code will be executed in the context of
the SillyTavern page. You can access the SillyTavern API via SillyTavern.getContext().

This sample extension adds a settings drawer to the extensions settings page, allowing
the user to enable/disable the extension. It also listens for chat change events and
shows a notification ("toast") when the chat changes, if the extension is enabled.

This code is adapted from the Inject Manager extension. See the full extension here:
https://github.com/SillyTavern/Extension-InjectManager
*/

const settingsKey = 'MyExtension';
const EXTENSION_NAME = 'My Extension';


/**
 * @type {MyExtensionSettings}
 * @typedef {Object} MyExtensionSettings
 * @property {boolean} enabled Whether the extension is enabled
 */
const defaultSettings = Object.freeze({
    enabled: true,
});

function renderExtensionSettings() {
    const context = SillyTavern.getContext();
    const settingsContainer = document.getElementById(`${settingsKey}-container`) ?? document.getElementById('extensions_settings2');
    if (!settingsContainer) {
        return;
    }

    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const extensionName = document.createElement('b');
    extensionName.textContent = context.t`${EXTENSION_NAME}`;

    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

    inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');

    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

    /** @type {MyExtensionSettings} */
    const settings = context.extensionSettings[settingsKey];

    // Enabled
    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.classList.add('checkbox_label');
    enabledCheckboxLabel.htmlFor = `${settingsKey}-enabled`;
    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.id = `${settingsKey}-enabled`;
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    enabledCheckbox.addEventListener('change', () => {
        settings.enabled = enabledCheckbox.checked;
        context.saveSettingsDebounced();
    });
    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = context.t`Enabled`;
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);

}

(function initExtension() {
    console.debug(`[${EXTENSION_NAME}]`, 'Initializing extension');
    const context = SillyTavern.getContext();

    if (!context.extensionSettings[settingsKey]) {
        context.extensionSettings[settingsKey] = structuredClone(defaultSettings);
    }

    for (const key of Object.keys(defaultSettings)) {
        if (context.extensionSettings[settingsKey][key] === undefined) {
            context.extensionSettings[settingsKey][key] = defaultSettings[key];
        }
    }

    context.eventSource.on(context.eventTypes.CHAT_CHANGED, () => {
        if (!context.extensionSettings[settingsKey].enabled) {
            return;
        }
        toastr.info(context.t`Chat changed`, EXTENSION_NAME);
    });

    context.saveSettingsDebounced();

    renderExtensionSettings();

    console.debug(`[${EXTENSION_NAME}]`, 'Extension initialized');
})();
