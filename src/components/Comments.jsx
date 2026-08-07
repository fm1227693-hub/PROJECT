import React from 'react'
import TikTokComments from './TikTokComments'

export default function Comments() {
    return (
        <div className="w-full py-4">
            <TikTokComments isAdmin={true} />
        </div>
    )
}