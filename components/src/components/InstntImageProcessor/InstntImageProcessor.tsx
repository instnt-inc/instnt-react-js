import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from "react-device-detect";


const DOCUMENT_TYPES = {
    license: "License",
    passportBook: "PassportBook",
    passportCard: "PassportCard"
}

const propTypes = {
    documentType: PropTypes.string.isRequired,
    documentSide: PropTypes.string,
    captureFrameworkDebug: PropTypes.bool
};

interface DocumentUploaderProps {
    documentType: String;
    documentSide: String;
    captureMode: String;
    autoUpload: boolean;
    captureFrameworkDebug: Boolean;
}

const DocumentUploader = ({
    documentType,
    documentSide,
    captureMode = "Auto",
    autoUpload = true,
    captureFrameworkDebug = false,
}: DocumentUploaderProps) => {
    console.log("DocumentType:", documentType);
    console.log("documentSide:", documentSide);
    console.log("captureMode:", captureMode);
    console.log("autoUpload:", autoUpload);
    //onMount
    useEffect(() => {
        console.log("DocumentUploader mounted");
        console.log("isMobile: " + isMobile);
        (window as any).instnt.initImageProcessor();
        if (isMobile) {
            if (documentSide) {
                (window as any).documentCapture(
                    documentType,
                    documentSide,
                    captureMode,
                    autoUpload,
                    captureFrameworkDebug
                );
            } else {
                (window as any).selfieCapture(
                    captureMode,
                    autoUpload,
                    captureFrameworkDebug
                );
            }
        }
    }, []);

    return (
        <React.Fragment />
    );
}

DocumentUploader.propTypes = propTypes;
DocumentUploader.DOCUMENT_TYPES = DOCUMENT_TYPES;

export default DocumentUploader;