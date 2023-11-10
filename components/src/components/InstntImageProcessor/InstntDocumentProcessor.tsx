import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { logMessage } from '../../logger';

const InstntDocumentProcessor = ({
    documentSettings = {},
    autoUpload = true,
    captureFrameworkDebug = undefined,
}: any) => {
    //onMount
    useEffect(() => {
        if ((window as any).instnt) {
            const instnt = (window as any).instnt;
            if (!instnt.captureDocument) {
                logMessage('error', 'instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
            } else {
                logMessage('log', 'InstntDocumentProcessor mounted'); 
                logMessage('log', '/*-----InstntDocumentProcessor Props-----*/');
                logMessage('info', 'document setting : ', documentSettings);
                logMessage('info', 'auto upload : ', autoUpload);
                logMessage('info', 'captureFrameworkDebug : ', captureFrameworkDebug);
                logMessage('log', '/*-----InstntDocumentProcessor Props-----*/');      
                instnt.captureDocument(documentSettings, autoUpload, captureFrameworkDebug);
            }
        }
    }, [(window as any).instnt]);

    return (
        <React.Fragment />
    );
}

InstntDocumentProcessor.propTypes = {
    documentSettings: PropTypes.object.isRequired,
    autoUpload: PropTypes.bool,
    captureFrameworkDebug: PropTypes.any
};
InstntDocumentProcessor.DOCUMENT_TYPES = {
    license: "License",
    passportBook: "PassportBook",
    passportCard: "PassportCard"
};

export default InstntDocumentProcessor;