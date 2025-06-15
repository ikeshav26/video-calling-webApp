import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';
import peer from '../service/peer';

const Room = () => {
    const socket = useSocket();
    const [remoteId, setremoteId] = useState();
    const [myStream, setmyStream] = useState();
    const [remoteStream, setremoteStream] = useState();

    const handleuserJoined = useCallback(({ email, id }) => {
        setremoteId(id);
        console.log("New User joined room:", email, id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setmyStream(stream);

        // ✅ Add tracks only ONCE here:
        stream.getTracks().forEach(track => {
            peer.peer.addTrack(track, stream);
        });

        const offer = await peer.getOffer();
        socket.emit("user:call", {
            offer,
            to: remoteId,
        });
    }, [remoteId, socket]);

    const handleIncomingCall = useCallback(async ({ from, offer: incomingOffer, email }) => {
        setremoteId(from);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setmyStream(stream);

        // ✅ Add tracks only ONCE here:
        stream.getTracks().forEach(track => {
            peer.peer.addTrack(track, stream);
        });

        const ans = await peer.getAnswer(incomingOffer);
        socket.emit("call:accepted", { to: from, ans });
    }, [socket]);

    const handleCallAccepted = useCallback(async ({ ans, from }) => {
        await peer.peer.setRemoteDescription(new RTCSessionDescription(ans));
        console.log("Call accepted from:", from, ans);
        // 🚫 Do NOT add tracks again here
    }, []);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteId });
    }, [remoteId, socket]);

    const handleNegoIncoming = useCallback(async ({ offer, from }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { ans, to: from });
    }, [socket]);

    const handleNegoFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    useEffect(() => {
        peer.peer.addEventListener('track', async (event) => {
            const [remoteStream] = event.streams;
            setremoteStream(remoteStream);
            console.log("Remote stream received:", remoteStream);
        });
        return () => {
            peer.peer.removeEventListener('track', (event) => {
                const [remoteStream] = event.streams;
                setremoteStream(remoteStream);
            });
        };
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleuserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoIncoming);
        socket.on("peer:nego:final", handleNegoFinal);

        return () => {
            socket.off("user:joined", handleuserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoIncoming);
            socket.off("peer:nego:final", handleNegoFinal);
        };
    }, [socket, handleuserJoined, handleIncomingCall, handleCallAccepted, handleNegoIncoming, handleNegoFinal]);

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteId ? "Connected" : "No one in room"}</h4>
            {remoteId && (
                <button className='bg-black text-white px-3 py-2 rounded-xl' onClick={handleCallUser}>Call</button>
            )}
            {myStream && (
                <ReactPlayer
                    url={myStream}
                    playing
                    muted
                    controls
                    width="200px"
                    height="200px"
                />
            )}
            {remoteStream && (
                <ReactPlayer
                    url={remoteStream}
                    playing
                    controls
                    width="300px"
                    height="400px"
                />
            )}
        </div>
    );
};

export default Room;
