import { React, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useProfile } from '../../hooks/useProfile'

function HomePage() {
  const { profile } = useProfile()

  return (
    <div>
      <h2>Welcome back, {profile?.nickname}!</h2>
      <p>Your favorite color is {profile?.favorite_color}</p>

      {/* Personalized content based on user data */}
      <div style={{ backgroundColor: profile?.favorite_color }}>
        Your personalized section
      </div>
    </div>
  )
}