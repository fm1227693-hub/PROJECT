import React, { useEffect } from 'react'
import Comments from './Comments'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AdminORG() {
    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

    return (
        <div
            data-aos="fade-in"
            data-aos-duration="600"
            className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-gray-950 font-sans text-left flex flex-col min-h-screen transition-colors duration-200"
        >
            <Comments />
        </div>
    )
}