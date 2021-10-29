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

interface InstntImageProcessorProps {
    documentType: String;
    documentSide: String;
    captureMode: String;
    autoUpload: boolean;
    captureFrameworkDebug: Boolean;
}

const InstntImageProcessor = ({
    documentType,
    documentSide,
    captureMode = "Auto",
    autoUpload = true,
    captureFrameworkDebug = false,
}: InstntImageProcessorProps) => {
    //onMount
    useEffect(() => {
        console.log("InstntImageProcessor mounted");
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

InstntImageProcessor.propTypes = propTypes;
InstntImageProcessor.DOCUMENT_TYPES = DOCUMENT_TYPES;

export default InstntImageProcessor;