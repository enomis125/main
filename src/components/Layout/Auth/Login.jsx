"use client"
import React from "react";
import { FormEvent } from "react";
import { Image, Link } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter()
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<FaEye size={20} className="text-gray-500"/>);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    })

    console.log(response)

    if (!response?.error) {
      router.push("/properties")
      router.refresh()
    }
  }

  const handleToggle = () => {
    if (type==='password'){
       setIcon(<FaEyeSlash size={20} className="text-gray-500"/>);
       setType('text')
    } else {
       setIcon(<FaEye size={20} className="text-gray-500"/>)
       setType('password')
    }
 }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <div className="w-8/12">
          <Image src="/images/imagem-login.png" alt="management hotel" className="h-dvh"></Image>
        </div>
        <div className="flex flex-col justify-center p-40">
          <div  className="w-full">
            <Image src="/images/Logo-Login.png" alt="Logotipo" width={250} height={250} />
          </div>
          <p className="text-sm text-gray-600">E-mail</p>
          <input type="email" name="email" placeholder="Insira o seu E-Mail" className="outline-none border-b border-gray-400 px-1 py-2 font-medium" />
          <div className="my-5">
            <p className="text-sm text-gray-600">Palavra-passe</p>
            <div className="flex flex-row items-center">
              <input type={type} name="password" placeholder="Insira a palavra-passe" className="outline-none border-b border-gray-400 px-1 py-2 font-medium" />
              <span className="flex justify-around items-center" onClick={handleToggle}>
                {icon}
              </span>
            </div>
          </div>
          <button type="submit" className="bg-primary-600 rounded-md h-9 text-white">Login</button>
        </div>
      </div>
    </form>
  );
}