/**
 * Video Chat Module
 * Handles real-time video communication between customers and store owners using Jitsi Meet.
 */

export const initVideoChat = () => {
    const videoChatContainer = document.getElementById('video-chat-container');
    const videoChatClose = document.getElementById('video-chat-close');
    
    if (!videoChatContainer || !videoChatClose) return;

    videoChatClose.addEventListener('click', () => {
        closeVideoChat();
    });
};

export const startVideoChat = async (storeId) => {
    const videoChatContainer = document.getElementById('video-chat-container');
    const videoChatContent = document.getElementById('video-chat-content');
    const videoChatInfo = document.getElementById('video-chat-info');

    if (!videoChatContainer || !videoChatContent || !videoChatInfo) return;

    // Show the container and backdrop
    let backdrop = document.getElementById('video-chat-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'video-chat-backdrop';
        backdrop.className = 'video-chat-backdrop';
        document.body.appendChild(backdrop);
    }
    
    backdrop.classList.add('active');
    videoChatContainer.classList.add('active');
    videoChatInfo.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to store...';


    try {
        // Fetch store details to show name
        const response = await fetch(`/api/stores/${storeId}`);
        const store = await response.json();

        // Create a unique room name
        const roomName = `localcart-store-${storeId}-${Date.now()}`;
        
        // Initialize Jitsi Meet
        if (!window.JitsiMeetExternalAPI) {
            videoChatInfo.innerHTML = 'Video chat API NOT loaded. Please check your connection.';
            return;
        }

        // Clear previous session if any
        if (window.jitsiAPI) {
            window.jitsiAPI.dispose();
        }

        videoChatContent.innerHTML = '';
        videoChatInfo.innerHTML = `<i class="fas fa-video"></i> Calling <strong>${store.name}</strong>...`;

        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: videoChatContent,
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                disableDeepLinking: true,
                prejoinPageEnabled: false
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'chat', 'settings', 
                    'videoquality', 'tileview'
                ],
                SHOW_JITSI_WATERMARK: false,
                DEFAULT_REMOTE_DISPLAY_NAME: 'Store Owner'
            },
            userInfo: {
                displayName: 'Customer'
            }
        };

        window.jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);

        window.jitsiAPI.addEventListeners({
            videoConferenceJoined: () => {
                videoChatInfo.innerHTML = `<i class="fas fa-circle-dot" style="color: #ff4757;"></i> Live with <strong>${store.name}</strong>`;
            },
            videoConferenceLeft: () => {
                closeVideoChat();
            }
        });

    } catch (error) {
        console.error('Error starting video chat:', error);
        videoChatInfo.innerHTML = 'Failed to start video chat.';
    }
};

export const closeVideoChat = () => {
    const videoChatContainer = document.getElementById('video-chat-container');
    const backdrop = document.getElementById('video-chat-backdrop');
    
    if (videoChatContainer) {
        videoChatContainer.classList.remove('active');
    }
    
    if (backdrop) {
        backdrop.classList.remove('active');
    }


    if (window.jitsiAPI) {
        window.jitsiAPI.dispose();
        window.jitsiAPI = null;
    }
};

// Make it globally available for the views
window.startVideoChat = startVideoChat;
