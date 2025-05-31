import { React, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './useAuth'
import { useProfile } from '../../hooks/useProfile'

function Header() {
    const { user } = useAuth()
    const { profile } = useProfile

    return (
        <header className='bg-white shadow'>
            <div className='flex items-center justify-between p-4'>
                <h1>My App</h1>

                <div className='flex items-center space-x-4'>
                    {profile?.avatar_url && (
                        <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className='w-8 h-8 rounded-full'
                        />
                    )}

                    <span>
                        Hello, {profile?.nickname || user?.email}!
                    </span>

                    <button onClick={() => supabase.auth.signOut()}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}