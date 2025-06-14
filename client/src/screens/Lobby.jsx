import React, { use, useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'

const Lobby = () => {
  const [email, setemail] = useState("")
  const [room, setroom] = useState("")
  const socket=useSocket()

  const navigate=useNavigate()

const handleJoinRoom=useCallback((data)=>{
  const {email,room}=data
  navigate(`/room/${room}`)
    console.log("User joined room:", email,room);
})

  useEffect(() => {
  socket.on("room:join",handleJoinRoom )
  return()=>{
    socket.off("room:join",handleJoinRoom)}
  }, [socket])


  const submitHandler=useCallback((e)=>{
    e.preventDefault()
    socket.emit("room:join",{email,room})
  },[email,room,socket])


  return (
    <div className='flex flex-col  items-center min-h-screen w-full bg-zinc-900 gap-6 py-2'>
      <div>
        <h1 className='font-bold text-3xl text-white'>Lobby</h1>
      </div>
      <div>
        <form onSubmit={submitHandler} className='text-white '>
          <label >Email Id</label>
          <input value={email} onChange={(e)=>setemail(e.target.value)} className='border-2 ml-6 border-white rounded-xl py-1 px-2' type="email" id="email"/>
          <br/>
          <label >Room Id</label>
          <input value={room} onChange={(e)=>setroom(e.target.value)} className='border-2 ml-6 mt-2 border-white rounded-xl py-1 px-2' type="text" id="room"/>
          <br/>
          <button className='bg-white text-black px-5 ml-30 mt-6 font-semibold py-2 rounded-xl'>Join</button>
        </form>
      </div>
    </div>
  )
}

export default Lobby
