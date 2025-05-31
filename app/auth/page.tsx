"use client"
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
const Cookies = require('js-cookie');


function Page() {
  const searchParams = useSearchParams();
  const router = useRouter()

  function isJWT(token: string){
    return token.split('.').length == 3;
  }

  useEffect(() => {
    const token = searchParams.get('token');
    if (token && isJWT(token)) {
      Cookies.set('access_token', token);
      router.push('/admin')
    }
    if (Cookies.get('access_token')){
      return router.push('/admin')
    }
    setTimeout(function () {
      router.replace('/auth/login')
    }, 8000)
  }, [searchParams]);

  return (
    <div className='w-full h-[100vh] text-center items-center text-xl font-sans my-6'>Olá, esta pagina é a página de autenticação, por favor autentique-se. Redirecionando automaticamente...</div>
  )
}

export default Page