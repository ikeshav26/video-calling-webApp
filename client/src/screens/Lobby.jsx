import React, { useState } from 'react'

const Lobby = () => {
  const [email, setemail] = useState("")
  const [room, setroom] = useState("")

  const submitHandler=(e)=>{
    e.preventDefault()
    console.log("Email:", email);
    console.log("Room:", room);
  }
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
