import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { logMessage } from '../../logger';

const InstntSelfieProcessor = ({
    selfieSettings = {},
    autoUpload = true,
    captureFrameworkDebug = undefined,
}: any) => {
    //onMount
    useEffect(() => {
        if ((window as any).instnt) {
            const instnt = (window as any).instnt;

            if (!instnt.captureSelfie) {
                logMessage('error', 'instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
            } else {
                logMessage('log', 'InstntSelfieProcessor mounted');
                logMessage('log', '/*-----InstntSelfieProcessor Props-----*/');
                logMessage('info', 'selfieSettings', selfieSettings);
                logMessage('info', 'auto upload :', autoUpload);
                logMessage('info', 'captureFrameworkDebug :', captureFrameworkDebug);
                logMessage('log', '/*-----InstntSelfieProcessor Props-----*/');
                instnt.captureSelfie(selfieSettings, autoUpload, captureFrameworkDebug);
            }
        }
    }, [(window as any).instnt]);

    return (
        <React.Fragment />
    );
}

InstntSelfieProcessor.propTypes ={
    selfieSettings: PropTypes.object.isRequired,
    autoUpload: PropTypes.bool,
    captureFrameworkDebug: PropTypes.any
};

export default InstntSelfieProcessor;