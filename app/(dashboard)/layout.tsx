import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

const DashBoardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();
    return (
        <div className='h-full relative'>
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
                <div className='text-white'><Sidebar apiLimitCount={apiLimitCount} isPro={isPro} /></div>
            </div>
            <main className='md:pl-72'>
                <NavBar />
                {children}
            </main>
        </div>
    )
}

export default DashBoardLayout