/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from '@testing-library/react';
import UploadDocuments from '../components/UploadDocuments';
import { expect } from '@jest/globals';

describe('should render UploadDocuments component properly', ()=>{
    const onChangeStart = () => {}
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
    const backLicenseSettings = {
        ...documentSettingsToApply,
        documentSide: 'back'
    }
    const selfieSettings = {
        enableFarSelfie: true,
        selfieCaptureAttempt: 4,
        captureMode: "Auto",
        compressionType: "JPEG",
        compressionQuality: "50",
        useBackCamera: false,
        overlayText: "Align Face and Tap button</br> to Capture.",
        overlayTextAuto: "Align Face and Hold",
        overlayColor: "#808080",
        orientationErrorText:
        "Landscape orientation is not supported. Kindly rotate your device to Portrait orientation.",
        enableFaceDetection: true,
        setManualTimeout: 8,
        enableLocationDetection: false,
    };
    const captureFrameworkDebug = true;

    it('should render upload documents form properly', ()=>{
        const { container } = render(<UploadDocuments
            frontLicenseSettings={documentSettingsToApply}
            backLicenseSettings={backLicenseSettings}
            selfieSettings={selfieSettings}
            frontCapture={null}
            backCapture={null}
            selfieCapture={null}
            startFront={null}
            startBack={null}
            startSelfie={null}
            onChangeStart={onChangeStart}
            captureFrameworkDebug={captureFrameworkDebug}
        />)
        const uploadDocumentForm = container.getElementsByClassName('upload-documents-container');
        expect(uploadDocumentForm.length).toBe(1);
        expect(uploadDocumentForm[0].textContent).toBe('Upload Document Images and Selfie');
    })

    it('should render upload documents section', ()=>{
        const { container } = render(<UploadDocuments
            frontLicenseSettings={documentSettingsToApply}
            backLicenseSettings={backLicenseSettings}
            selfieSettings={selfieSettings}
            frontCapture={null}
            backCapture={null}
            selfieCapture={null}
            startFront={null}
            startBack={null}
            startSelfie={null}
            onChangeStart={onChangeStart}
            captureFrameworkDebug={captureFrameworkDebug}
        />)
        const frontImageSection = container.getElementsByClassName('front-image-section');
        expect(frontImageSection.length).toBe(1);
        expect(frontImageSection[0].textContent).toBe('Front Image');
        const backImageSection = container.getElementsByClassName('back-image-section');
        expect(backImageSection.length).toBe(1);
        expect(backImageSection[0].textContent).toBe('Back Image');
        const selfieImageSection = container.getElementsByClassName('selfie-image-section');
        expect(selfieImageSection.length).toBe(1);
        expect(selfieImageSection[0].textContent).toBe('Selfie');
    })

})