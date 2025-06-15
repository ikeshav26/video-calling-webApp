const {Server}=require('socket.io');


const io=new Server(8000,{
    cors:true
})

const emailToSocketMap=new Map();
const socketToEmailMap=new Map()


io.on("connection",(socket)=>{
    console.log("socket connected",socket.id);
    socket.on("room:join",(data)=>{
        const {email,room}=data
        emailToSocketMap.set(email,socket.id)
        socketToEmailMap.set(socket.id,email)
        io.to(room).emit("user:joined",{
            email,id:socket.id
        })
        socket.join(room)
        io.to(socket.id).emit("room:join",{
            email,
            room,
            message:`${email} has joined the room`
        })
    })


    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incoming:call",{
            offer,
            from:socket.id,
            email:socketToEmailMap.get(socket.id)
        })
    })

    socket.on("call:accepted",({to,ans})=>{
        io.to(to).emit("call:accepted",{
            ans,
            from:socket.id
        })
    })
})