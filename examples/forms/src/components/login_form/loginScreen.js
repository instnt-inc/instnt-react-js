import  React, { useState,useEffect}  from "react";
import {InstntVerifiableCredentialInvitation} from '@instnt/instnt-react-js'
import ProfileScreen from "./profileScreen";

const LoginScreen = ({formKey, serviceURL}) =>{
    const [loginSessionId, setLoginSessionId] = useState('');
    const [invitationURL, setInvitationURL] = useState('');
    const [isMultipassEnabled, setIsMultipassEnable] = useState(false);
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState({});

    let loginPollEventsInterval;

    const onLoginEventHandler = (event) => {
        switch (event.event_type || event.type) {
            case 'LOGIN_INITIATED':
                setLoginSessionId(event.data?.login_session_id);
                if (event.data?.invitation_url) {
                    setInvitationURL(event.data?.invitation_url);
                    setIsMultipassEnable(true);
                }
                break;

            case 'LOGIN_FAILED':
                setIsError(true)
                setError(event.data.message);
                break;

            case 'authentication.success':
                setLoggedIn(true);
                setUserProfile(event.event_data || event.data);
                break;

            case 'authentication.failed':
                setLoggedIn(false);
                setIsError(true);
                setError('Authentication Failed. Try again');
                break;

            default:
                console.log(`Unhandled Event: ${JSON.stringify(event)} `);
        }
    };

    const stopPollLoginEvents = () => {
        if (loginPollEventsInterval) {
            clearInterval(loginPollEventsInterval);
        }
    };
     
    /** Initiate Login */

    useEffect(() => {
        (async () => {
            let url = serviceURL + '/public/initiate_login';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                    form_key: formKey
                    })
                });
                const data = await response.json();
                if (data.status === 200) {
                    onLoginEventHandler({
                        type: 'LOGIN_INITIATED',
                        data: data
                    });
                } else {
                    console.error('Error processing :', url);
                    onLoginEventHandler({
                        type: 'LOGIN_FAILED',
                        data: {
                            message: data?.detail[0]?.issue || 'Login Failed. Try with correct data',
                            type: 'error'
                        }
                    });
                }
            } catch (error) {
                console.error('Error while initiating login process');
                onLoginEventHandler({
                    type: 'LOGIN_FAILED',
                    data: {
                    message:
                    'Received error: ' + error + ' while while initiating login',
                    type: 'error'
                }
            });
          }
        })();
    }, [formKey]);

    useEffect(() => {
        if (isMultipassEnabled) {
            let pollEventlastTimestamp ;
            
        const pollLoginEvents = async () => {
            let stopPolling = false;
            const terminalEventTypes = [
                'authentication.success',
                'authentication.failed'
            ];
            if (loginSessionId) {
                const url = `${serviceURL}/public/transactions/${loginSessionId}/events?context=${encodeURIComponent('login')}&from=${pollEventlastTimestamp || 0}`;
                try {
                    const response = await fetch(url, {
                         method: 'GET',
                         headers: {
                            Accept: 'application/json'
                        }
                    });
                    const data = await response.json();
                    pollEventlastTimestamp = data.to;
                    const events = data.events;

                    for (const event of events) {
                        if (event.event_type && terminalEventTypes.includes(event.event_type)) {
                            onLoginEventHandler(event);
                            stopPolling = true;
                        }
                    }
                    stopPolling && stopPollLoginEvents();
                } catch (error) {
                    console.error('Instnt : Error receiving events', error);
                    stopPollLoginEvents();
                }
            }
        };

        loginPollEventsInterval = setInterval(pollLoginEvents, 3000);

    }

    return () => {
      stopPollLoginEvents();
    };
    }, [isMultipassEnabled]);
  
  
    useEffect(() => {
         //
         return () => {
            stopPollLoginEvents();
        }
    },[])

    return (
        <div>
            { formKey && !loggedIn && loginSessionId ? 
            ( isMultipassEnabled ?
                (<InstntVerifiableCredentialInvitation
                    invitationType="verifier"
                    action="authenticate"
                    customText={'Scan with your wallet to login with your verifiable credential'}
                    invitation_url={invitationURL}
                />) 
            : <b> Multipass Disabled , No VC available to scan</b>

            ) : loggedIn ? (<></>) : (<b>Logging Please Wait.....</b>)
            }
            {formKey && loggedIn && <ProfileScreen userProfile={userProfile}/>}
            {formKey && isError && (<div className={'alert alert-danger'}>    
                  <span className="messageSpan">{error}</span>
                </div>)}

        </div>
    )

} 

export default LoginScreen;