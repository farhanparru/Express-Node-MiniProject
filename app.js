const express = require('express')
const app= express()
const fs = require('fs')
const cookieParser = require('cookie-parser')
//Middlare
app.use(express.urlencoded({extended:true}))
// cookie parser express
app.use(cookieParser())

app.get('/',(req,res)=>{
    //get Cookies
    const sessionId = req.cookies.session
    console.log(sessionId); 
    if(!sessionId){
        res.redirect('/login')
        return;
    }
    const sessions = JSON.parse(fs.readFileSync('./sessions.json'))
    console.log(sessions);
    const session = sessions.find((session)=> session.id.toString() === sessionId)
    console.log(session);
    if(!session){
        res.redirect("/login")
        return;
    }
    res.sendFile(__dirname + '/Home.html')
})

app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html')
})

app.get('/Signup',(req,res)=>{
    res.sendFile(__dirname + '/Signup.html')
})


// login data
app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password
    const  users = JSON.parse(fs.readFileSync('./users.json'))
    const user = users.find((user)=> user.username === username)
    if(!user){
        res.send('User Note Found')
        return;
    }
    if(password !== password){
        res.send('Password incorrect')
        return;
    }
//Session-Cookies
    const sessions = JSON.parse(fs.readFileSync('./sessions.json'))
    const sessionId = Math.floor(Math.random()*900000)
    sessions.push({
        id: sessionId,
        username:username,
    })
    fs.writeFileSync('./sessions.json',JSON.stringify(sessions))
    res.writeHead(302,{
        'Set-Cookie':`session=${sessionId}; HttpOnly`,
        Location:"/",
    })
  res.end()
})
//Signup data
app.post('/Signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const confirmPassword = req.body.confirmPassword; 
    const users = JSON.parse(fs.readFileSync('./users.json'))
    const user = users.find((user)=> user.username === username)
    if(user){
        res.send('User Already exists')
        return;
    }

    //Check Password
  if(password !== confirmPassword){
    res.send('Password and Confirm Password do not match')
    return;
  }

    users.push({id:Math.floor( Math.random()*90000), username:username,password:password,email:email,confirmPassword:confirmPassword})

    fs.writeFileSync('./users.json',JSON.stringify(users))
    res.redirect("/")
});
    

app.listen(3000,()=>{
    console.log('Server is Runing Port 3000');
})