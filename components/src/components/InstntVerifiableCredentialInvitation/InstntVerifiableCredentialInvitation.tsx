import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { QRCode } from 'react-qrcode-logo';
import Button from '@mui/material/Button';
import { Avatar } from '@mui/material';

const getDeviceType = (userAgent: any) => {
  const ua = userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
};

const CopyLinkToClipboard = ({ url, text }: { url: string; text: string }) => {
  const [copySuccess, setCopySuccess] = useState('(Click to Copy)');
  const linkRef = useRef(null);

  const copyToClipboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(e.currentTarget.href);
    setCopySuccess('- Copied!');
  };

  return (
    <div>
      <a ref={linkRef} href={url} onClick={copyToClipboard}>
        <b>{text}</b>
      </a>
      &nbsp;{copySuccess}
    </div>
  );
};

const InstntVerifiableCredentialInvitation = ({
    invitationType,
    action,
    transactionId,
    customText,
}:any) => {
  const [invitationUrl, setInvitationUrl] = useState('');
  const [showDeepLink, setShowDeepLink] = useState(false);
  const DESKTOP = 'desktop';
  
  useEffect(() => {
    const getNSetInvitationUrl = async () =>{
        try {
            let invitationResponse;
            if (!transactionId) {
                return;
            }
            if(action == 'signup' && invitationType == 'issuer'){
                invitationResponse = await (window as any)?.instnt.getInvitationURLForVC(transactionId);
                setInvitationUrl(invitationResponse);
            }else if(action == 'signup' && invitationType == 'verifier'){
                invitationResponse = await (window as any)?.instnt.getInvitationURLForSignup(transactionId);
                setInvitationUrl(invitationResponse);
            }else if(action == 'authenticate' && invitationType == 'verifier'){
                invitationResponse = await (window as any)?.instnt.getInvitationURLForLogin(transactionId);
                setInvitationUrl(invitationResponse);
            }
        } catch(e) {
            console.log(e);
        }
    }

    getNSetInvitationUrl();
    
  }, [transactionId]);

  useEffect(() => {
    const userAgent = (window as any)?.navigator.userAgent;
    const deviceType = getDeviceType(userAgent);
    if (deviceType !== DESKTOP) {
        setShowDeepLink(true);
    }
  }, [invitationUrl]);
  
  const openVCInvitation = () => {
    if (window && invitationUrl) {
      window.open(invitationUrl, '_blank');
    }
  };

    const downloadVC = showDeepLink ? (
    <>
      <Button
        onClick={openVCInvitation}
        startIcon={<Avatar alt="Instnt Access Logo" src={'https://www.instnt.org/hubfs/Favicon.png'} />}
      >
        {action === 'signup' ? 'Accept Instnt Pass' : 'Use Instnt Pass'}
      </Button>
      {action === 'signup' ? (
        <span className="deep-link-help-text">
          Scan with your wallet to signup with your verifiable credential
        </span>
      ) : (
        <span className="deep-link-help-text">
          SignIn with verifiable credential stored in your wallet
        </span>
      )}
    </>
  ) : invitationUrl ? (
    <div className="lead vc-invitation text-center text-md-left text-muted mb-6 mb-lg-8">
      {customText ? (
        <div>
          <b>{customText}</b>
        </div>
      ) : (
        <CopyLinkToClipboard
          url={invitationUrl}
          text="Download your verifiable credential to your wallet"
        />
      )}
      <br />
      <QRCode
        value={invitationUrl}
        size={256}
        logoImage={'https://www.instnt.org/hubfs/Favicon.png'}
        removeQrCodeBehindLogo={false}
        logoOpacity={0.5}
        logoWidth={100}
        qrStyle={'dots'}
      />
      <br />
      <br />
    </div>
  ) : null;

  return downloadVC;

};

InstntVerifiableCredentialInvitation.propTypes =  {
    invitationType: PropTypes.string.isRequired,
    action: PropTypes.string,
    transactionId: PropTypes.string,
    customText: PropTypes.string,
};

export default InstntVerifiableCredentialInvitation;