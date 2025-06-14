import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

const Room = () => {
    const socket=useSocket()
    const [remoteId, setremoteId] = useState()
    const [myStream, setmyStream] = useState()
    
    const handleuserJoined=useCallback(({email,id})=>{
        setremoteId(id)
        console.log("new User joined room:", email, id);
    })

    const handleCallUser=useCallback(async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        const offer=await peer.getOffer()
        socket.emit("user:call",{
            offer,
            to:remoteId
        })
        setmyStream(stream)
    })


    const handleIncomingCall=useCallback(async({from,offer,email})=>{
        console.log("Incoming call from:", email, from,offer);
    })

    useEffect(() => {
    socket.on("user:joined",handleuserJoined)
    socket.on("incoming:call",handleIncomingCall)
    return()=>{
        socket.off("user:joined",handleuserJoined)
        socket.off("incoming:call",handleIncomingCall)
    }
    }, [socket,handleuserJoined])


  return (
    <div>
      <h1>Room page</h1>
      <h4>{remoteId?"Connected":"No one in room"}</h4>
      {remoteId && (
        <button className='bg-black text-white px-3 py-2 rounded-xl' onClick={handleCallUser}>Call</button>
      )}
      {
        myStream && (
            <ReactPlayer 
                url={myStream}
                playing={true}
                controls={true}
                width="200px"
                height="200px"
                className="react-player "
            />
        )
      }
    </div>
  )
}

export default Room
