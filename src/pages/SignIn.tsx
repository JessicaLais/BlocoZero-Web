import { useState } from 'react';
import { Button } from '../features/auth/components/Button';
import { InputAuth } from '../features/auth/components/InputAuth';
import { LogoAuth } from '../features/auth/components/LogoAuth';
import { useNavigate } from "react-router"

export function SignIn(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsloading] = useState(false)
    const navigate = useNavigate()
   async function onSubmit(e: React.FormEvent){
       e.preventDefault()
    const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'},
        body: JSON.stringify({
             email,  
            password,
        })
    })
    const data = await response.json()
    if(data.error){
        alert(data.error)
        return
    }
    navigate("/work")
}
    return(
        <div className="w-screen h-screen flex ">
            <div className="w-1/2 h-screen bg-blue-400 flex items-center justify-center">
                <form onSubmit={onSubmit} className='flex flex-col items-center justify-center gap-5 w-105 h-105 border-2 border-blue-400 bg-blue-400 drop-shadow-lg rounded-2xl  p-8 '>
                    <h1 className='text-white text-4xl font-semibold'>Conecte-se</h1>
                    <InputAuth required legend="E-mail" type="email" placeholder="Seu@email.com" onChange={(e) => setEmail(e.target.value)}/>
                    <InputAuth required legend="Senha" type="password" placeholder="Sua senha" onChange={(e) => setPassword(e.target.value)}/>
                    <Button type='submit' isLoading={isLoading}>Entrar</Button>
                    <a href="/signup" className='text-gray-300 cursor-pointer '>Criar conta</a>
                </form>
            </div>
            <LogoAuth />
        </div>
    )
}