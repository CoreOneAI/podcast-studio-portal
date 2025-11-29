// src/components/VideoRoom.jsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { auth } from '../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Video from 'twilio-video';
import './VideoRoom.css'; // Don't forget to create this file!

// Initialize Cloud Functions instance (should ideally be done once at a higher level)
const functions = getFunctions();
const generateTwilioTokenCallable = httpsCallable(functions, 'generateTwilioToken');

const VideoRoom = ({ roomName }) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true); // New: Track local audio state
    const [isVideoEnabled, setIsVideoEnabled] = useState(true); // New: Track local video state

    const localVideoRef = useRef();
    const participantRefs = useRef({});

    // Function to attach tracks to the DOM (no change)
    const attachTracks = useCallback((tracks, container) => {
        tracks.forEach(track => {
            // Ensure track.attach() returns a DOM element before appending
            const attachedElement = track.attach();
            if (attachedElement) {
                container.appendChild(attachedElement);
            }
        });
    }, []);

    // Function to remove tracks from the DOM (no change)
    const detachTracks = useCallback((tracks) => {
        tracks.forEach(track => {
            track.detach().forEach(element => element.remove());
        });
    }, []);

    // New: Handle toggling local audio
    const handleToggleAudio = useCallback(() => {
        if (room && room.localParticipant) {
            room.localParticipant.audioTracks.forEach(publication => {
                if (publication.track) {
                    const newAudioState = !publication.track.isEnabled;
                    publication.track.enable(newAudioState);
                    setIsAudioEnabled(newAudioState);
                    console.log(`Local audio ${newAudioState ? 'enabled' : 'disabled'}`);
                }
            });
        }
    }, [room]);

    // New: Handle toggling local video
    const handleToggleVideo = useCallback(() => {
        if (room && room.localParticipant) {
            room.localParticipant.videoTracks.forEach(publication => {
                if (publication.track) {
                    const newVideoState = !publication.track.isEnabled;
                    publication.track.enable(newVideoState);
                    setIsVideoEnabled(newVideoState);
                    console.log(`Local video ${newVideoState ? 'enabled' : 'disabled'}`);
                }
            });
        }
    }, [room]);


    useEffect(() => {
        const connectToRoom = async () => {
            const user = auth.currentUser;
            if (!user) {
                setError("You must be logged in to join a video room.");
                console.error("No authenticated user found. Please log in.");
                return;
            }

            try {
                console.log("Requesting Twilio token for room:", roomName, "by user:", user.uid);
                const response = await generateTwilioTokenCallable({ roomName: roomName });
                const twilioToken = response.data.token;
                console.log("Received Twilio token successfully.");

                const newRoom = await Video.connect(twilioToken, {
                    name: roomName,
                    audio: true, // Start with audio enabled
                    video: { width: 640 }, // Start with video enabled
                });
                setRoom(newRoom);
                console.log(`Successfully joined Twilio Room: ${newRoom.name}`);

                // Attach local participant's tracks
                // Only attach if localVideoRef.current exists
                if (localVideoRef.current) {
                    attachTracks(Array.from(newRoom.localParticipant.tracks.values()).map(publication => publication.track), localVideoRef.current);
                }

                newRoom.participants.forEach(participant => {
                    setParticipants(prevParticipants => [...prevParticipants, participant]);
                });

                newRoom.on('participantConnected', participant => {
                    console.log(`Participant '${participant.identity}' connected`);
                    setParticipants(prevParticipants => [...prevParticipants, participant]);
                });

                newRoom.on('participantDisconnected', participant => {
                    console.log(`Participant '${participant.identity}' disconnected`);
                    detachTracks(Array.from(participant.tracks.values()).map(publication => publication.track));
                    setParticipants(prevParticipants => prevParticipants.filter(p => p.identity !== participant.identity));
                });

                // Clean up on unmount
                return () => {
                    if (newRoom) {
                        newRoom.disconnect();
                        console.log(`Disconnected from Twilio Room: ${newRoom.name}`);
                        // Detach all tracks to clean up the DOM
                        detachTracks(Array.from(newRoom.localParticipant.tracks.values()).map(publication => publication.track));
                        newRoom.participants.forEach(participant => {
                            detachTracks(Array.from(participant.tracks.values()).map(publication => publication.track));
                        });
                    }
                };

            } catch (err) {
                console.error("Failed to connect to Twilio Room:", err);
                setError(`Failed to join the room: ${err.message || "Unknown error"}`);
            }
        };

        if (roomName && !room) {
            connectToRoom();
        }

    }, [roomName, room, attachTracks, detachTracks]);


    useEffect(() => {
        participants.forEach(participant => {
            const participantContainer = participantRefs.current[participant.identity];
            if (participantContainer) { // Ensure container exists before attaching
                // Clear existing tracks to prevent duplicates on re-render
                while (participantContainer.firstChild) {
                    participantContainer.removeChild(participantContainer.firstChild);
                }

                // Initial attachment for new participants
                participant.on('trackSubscribed', track => attachTracks([track], participantContainer));
                participant.on('trackUnsubscribed', track => detachTracks([track]));

                // Attach any existing tracks
                attachTracks(Array.from(participant.tracks.values()).map(pub => pub.track), participantContainer);
            }
        });
    }, [participants, attachTracks, detachTracks]);


    const handleEndCall = () => {
        if (room) {
            room.disconnect();
            setRoom(null);
            setParticipants([]);
        }
        // Potentially navigate away or show a "call ended" screen
    };

    if (error) {
        return <div className="video-room-error">Error: {error}</div>;
    }

    return (
        <div className="video-room-container">
            {/* Main Video Area (Active Speaker / Screen Share) */}
            <div className="main-video-pane">
                <h3>Local Participant: {auth.currentUser?.displayName || auth.currentUser?.uid}</h3>
                <div ref={localVideoRef} className="local-video-feed"></div>
            </div>

            {/* Smaller, horizontally scrolling participant videos */}
            <div className="participant-gallery">
                {participants.length > 0 ? (
                    participants.map(participant => (
                        <div key={participant.identity} className="remote-participant-feed">
                            <h4>{participant.identity}</h4>
                            <div ref={el => participantRefs.current[participant.identity] = el}></div>
                        </div>
                    ))
                ) : (
                    <p>Waiting for participants...</p>
                )}
            </div>

            {/* Intuitive Control Bar */}
            <div className="control-bar">
                <button onClick={handleToggleAudio}>
                    {isAudioEnabled ? '🎙️ Mute' : '🔇 Unmute'}
                </button>
                <button onClick={handleToggleVideo}>
                    {isVideoEnabled ? '📹 Stop Video' : '📷 Start Video'}
                </button>
                <button onClick={() => console.log("Screen Share toggle")}>🖥️ Screen Share</button>
                <button className="end-call-button" onClick={handleEndCall}>📞 End Call</button>
            </div>

            {/* Integrated Sidebar (Placeholder for now) */}
            <div className="sidebar">
                <h4>Chat & Details</h4>
                <p>Chat messages will go here (powered by Firestore)</p>
                <p>Meeting details here (title, requester, priority)</p>
            </div>
        </div>
    );
};

export default VideoRoom;
