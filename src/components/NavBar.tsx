"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const NavBar = () => {

    const session = useSession()
    const router = useRouter()
    
    return (
        <nav className='p-3 md:p-5 shadow-md bg-gray-600 text-white' >
            <div className=' container mx-auto flex flex-col md:flex-row  justify-between items-center'>
                <p>Soul FeedBack</p>
                {session.data?.user ?
                    <>
                        <span>
                            Welcome,to {session.data.user.username}
                        </span>
                        <Button onClick={() => signOut({ redirect: true, callbackUrl: "/" })} variant="outline" className='w-full md:w-auto bg-slate-100 text-black'>Logout</Button>
                    </>
                    :
                    <Button onClick={() => router.replace("/sign-in")} variant="outline" className='w-full md:w-auto bg-slate-100 text-black'>Login</Button>
                }
            </div>
        </nav>
    )
}

export default NavBar