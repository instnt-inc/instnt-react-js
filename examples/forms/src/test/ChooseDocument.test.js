/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import ChooseDocument from '../components/ChooseDocument';
import { expect } from '@jest/globals';

describe('should render ChooseDocument component properly when custome setting is false', ()=>{
    const customDocCaptureSettings = false;
    const onToggleDocCaptureSettings = () => {}; 
    const onDocumentTypeChanged = () => {};
    const documentSettingsToApply = {
      documentType: "License",
      documentSide: "Front",
      frontFocusThreshold: 30,
      frontGlareThreshold: 2.5,
      frontCaptureAttempts: 4,
      captureMode: "Manual",
      overlayText: "Align ID and Tap <br/> to Capture.",
      overlayTextAuto: "Align ID within box and Hold.",
      overlayColor: "yellow",
      enableFaceDetection: true,
      setManualTimeout: 8,
      backFocusThreshold: 30,
      backGlareThreshold: 2.5,
      backCaptureAttempts: 4,
      isBarcodeDetectedEnabled: false,
      enableLocationDetection: false,
    };
    const changeDocumentSettings = () => {};
    const captureFrameworkDebug = true;
    const onToggleCaptureFrameworkDebug = () => {};

    it('should render choose document form properly', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const chooseDocumentForm = container.getElementsByClassName('choose-document-container');
        expect(chooseDocumentForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('choose-document-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Choose Document Type');
        const formSubHeading = container.getElementsByClassName('choose-document-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`As an added layer of security, we need to verify your identity before approving your application`);
    })

    it('should render radio button section of choose document form', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const radioButtonGroup = container.getElementsByClassName('radio-buttons-group');
        expect(radioButtonGroup.length).toBe(1);
        const licenseRadio = container.getElementsByClassName('license-radio');
        expect(licenseRadio.length).toBe(1);
        const passportBookRadio = container.getElementsByClassName('passport-book-radio');
        expect(passportBookRadio.length).toBe(1);
        const passportCardRadio = container.getElementsByClassName('passport-card-radio');
        expect(passportCardRadio.length).toBe(1);
    })

     it('should render checkbox section of choose document form', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const enableDebugCheckbox = container.getElementsByClassName('enable-debug-checkbox');
        expect(enableDebugCheckbox.length).toBe(1);
        const useCustomSettingCheckbox = container.getElementsByClassName('use-custom-settings-checkbox ');
        expect(useCustomSettingCheckbox.length).toBe(1);
    })


})

describe('should render ChooseDocument component properly when custome setting is true', ()=>{
    const customDocCaptureSettings = true;
    const onToggleDocCaptureSettings = () => {}; 
    const onDocumentTypeChanged = () => {};
    const documentSettingsToApply = {
      documentType: "License",
      documentSide: "Front",
      frontFocusThreshold: 30,
      frontGlareThreshold: 2.5,
      frontCaptureAttempts: 4,
      captureMode: "Manual",
      overlayText: "Align ID and Tap <br/> to Capture.",
      overlayTextAuto: "Align ID within box and Hold.",
      overlayColor: "yellow",
      enableFaceDetection: true,
      setManualTimeout: 8,
      backFocusThreshold: 30,
      backGlareThreshold: 2.5,
      backCaptureAttempts: 4,
      isBarcodeDetectedEnabled: false,
      enableLocationDetection: false,
    };
    const changeDocumentSettings = () => {};
    const captureFrameworkDebug = true;
    const onToggleCaptureFrameworkDebug = () => {};

    it('should render choose document form properly', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const chooseDocumentForm = container.getElementsByClassName('choose-document-container');
        expect(chooseDocumentForm.length).toBe(1);
        const formHeading = container.getElementsByClassName('choose-document-heading');
        expect(formHeading.length).toBe(1);
        expect(formHeading[0].textContent).toBe('Choose Document Type');
        const formSubHeading = container.getElementsByClassName('choose-document-sub-heading');
        expect(formSubHeading.length).toBe(1);
        expect(formSubHeading[0].textContent).toBe(`As an added layer of security, we need to verify your identity before approving your application`);
    })

    it('should render radio button section of choose document form', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const radioButtonGroup = container.getElementsByClassName('radio-buttons-group');
        expect(radioButtonGroup.length).toBe(1);
        const licenseRadio = container.getElementsByClassName('license-radio');
        expect(licenseRadio.length).toBe(1);
        const passportBookRadio = container.getElementsByClassName('passport-book-radio');
        expect(passportBookRadio.length).toBe(1);
        const passportCardRadio = container.getElementsByClassName('passport-card-radio');
        expect(passportCardRadio.length).toBe(1);
    })

    it('should render checkbox section of choose document form', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const enableDebugCheckbox = container.getElementsByClassName('enable-debug-checkbox');
        expect(enableDebugCheckbox.length).toBe(1);
        const useCustomSettingCheckbox = container.getElementsByClassName('use-custom-settings-checkbox');
        expect(useCustomSettingCheckbox.length).toBe(1);
    })

    it('should render custom setting section of choose document form', ()=>{
        const { container } = render(<ChooseDocument 
            customDocCaptureSettings={customDocCaptureSettings} 
            onToggleDocCaptureSettings={onToggleDocCaptureSettings}
            onDocumentTypeChanged={onDocumentTypeChanged}
            documentSettingsToApply={documentSettingsToApply}
            changeDocumentSettings={changeDocumentSettings}
            captureFrameworkDebug={captureFrameworkDebug}
            onToggleCaptureFrameworkDebug={onToggleCaptureFrameworkDebug}
        />)
        const customSettingContainer = container.getElementsByClassName('custom-setting-container');
        expect(customSettingContainer.length).toBe(1);
        const captureMode = container.getElementsByClassName('custom-setting-capture-mode');
        expect(captureMode.length).toBe(1);
        const captureModeLabel = container.getElementsByClassName('custom-setting-capture-mode-label');
        expect(captureModeLabel.length).toBe(1);
        expect(captureModeLabel[0].textContent).toBe('Capture Mode');
        const enableFaceDetection = container.getElementsByClassName('custom-setting-enable-face-detection');
        expect(enableFaceDetection.length).toBe(1);
        const enableFaceDetectionLabel = container.getElementsByClassName('custom-setting-enable-face-detection-label');
        expect(enableFaceDetectionLabel.length).toBe(1);
        expect(enableFaceDetectionLabel[0].textContent).toBe('enableFaceDetection');
        const barcodeDetected = container.getElementsByClassName('custom-setting-is-barcode-detected-enabled');
        expect(barcodeDetected.length).toBe(1);
        const barcodeDetectedLabel = container.getElementsByClassName('custom-setting-is-barcode-detected-enabled-label');
        expect(barcodeDetectedLabel.length).toBe(1);
        expect(barcodeDetectedLabel[0].textContent).toBe('isBarcodeDetectedEnabled');
        const overlaytextManual = container.getElementsByClassName('custom-setting-overlay-text-manual');
        expect(overlaytextManual.length).toBe(1);
        const overlaytextManualLabel = container.querySelector('#overlay-text-manual-label');
        expect(overlaytextManualLabel).toBeDefined();
        expect(overlaytextManualLabel.textContent).toContain('Overlay Text Manual');
        const overlaytextManualValue = container.querySelector('#overlay-text-manual');
        expect(overlaytextManualValue).toBeDefined();
        expect(overlaytextManualValue.value).toContain('Align ID and Tap <br/> to Capture.');
        const overlaytextAuto = container.getElementsByClassName('custom-setting-overlay-text-auto');
        expect(overlaytextAuto.length).toBe(1);
        const overlaytextAutoLabel = container.querySelector('#overlay-text-auto-label');
        expect(overlaytextAutoLabel).toBeDefined();
        expect(overlaytextAutoLabel.textContent).toContain('Overlay Text Auto');
        const overlaytextAutoValue = container.querySelector('#overlay-text-auto');
        expect(overlaytextAutoValue).toBeDefined();
        expect(overlaytextAutoValue.value).toContain('Align ID within box and Hold.');
        const overlayColor = container.getElementsByClassName('custom-setting-overlay-color');
        expect(overlayColor.length).toBe(1);
        const overlayColorLabel = container.querySelector('#overlay-color-label');
        expect(overlayColorLabel).toBeDefined();
        expect(overlayColorLabel.textContent).toContain('Overlay Color');
        const overlayColorValue = container.querySelector('#overlay-color');
        expect(overlayColorValue).toBeDefined();
        expect(overlayColorValue.value).toContain('yellow');
    })

})
