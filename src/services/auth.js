// ================================================================
// PROFESSIONAL AUTHENTICATION SERVICE
// ================================================================
// This service provides secure, well-documented functions for managing
// user authentication with enterprise-level error handling
//
// File: lib/authService.js
//
// Features:
// - Complete user registration and login flow
// - Password reset and email verification
// - Profile management with validation
// - Social authentication support
// - Session management and monitoring
// - Comprehensive security validation
// - Professional error handling with detailed messages
// ================================================================

import { supabase } from '../lib/supabase.js';

// ================================================================
// TYPE DOCUMENTATION (JavaScript Object Shapes)
// ================================================================
/**
 * @typedef {Object} UserCredentials
 * @property {string} email - Valid email address
 * @property {string} password - Password (minimum 8 characters)
 */

/**
 * @typedef {Object} SignUpData
 * @property {string} email - Valid email address
 * @property {string} password - Password (minimum 8 characters)
 * @property {string} [firstName] - Optional: User's first name
 * @property {string} [lastName] - Optional: User's last name
 * @property {Object} [metadata] - Optional: Additional user data
 */

/**
 * @typedef {Object} ResetPasswordData
 * @property {string} email - Email address to send reset link to
 * @property {string} [redirectTo] - Optional: URL to redirect after reset
 */

/**
 * @typedef {Object} UpdatePasswordData
 * @property {string} newPassword - New password (minimum 8 characters)
 * @property {string} [currentPassword] - Current password for verification
 */

/**
 * @typedef {Object} UpdateProfileData
 * @property {string} [email] - New email address
 * @property {string} [firstName] - New first name
 * @property {string} [lastName] - New last name
 * @property {Object} [metadata] - Additional profile data
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} [firstName] - User's first name
 * @property {string} [lastName] - User's last name
 * @property {boolean} emailConfirmed - Whether email is verified
 * @property {string} createdAt - Account creation timestamp
 * @property {string} lastSignInAt - Last login timestamp
 * @property {Object} [metadata] - Additional user data
 */

// ================================================================
// INTERNAL UTILITY FUNCTIONS
// ================================================================

/**
 * Validates email format using industry-standard regex
 *
 * @param {string} email - Email to validate
 * @throws {Error} If email format is invalid
 * @private
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }

  // Professional email validation regex (RFC 5322 compliant)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) {
    throw new Error('Please enter a valid email address');
  }
}

/**
 * Validates password strength with comprehensive requirements
 *
 * @param {string} password - Password to validate
 * @param {Object} [options] - Validation options
 * @param {number} [options.minLength=8] - Minimum password length
 * @param {boolean} [options.requireNumbers=true] - Require numbers
 * @param {boolean} [options.requireSpecialChars=true] - Require special characters
 * @param {boolean} [options.requireUppercase=true] - Require uppercase letters
 * @throws {Error} If password doesn't meet requirements
 * @private
 */
function validatePassword(password, options = {}) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  const {
    minLength = 8,
    requireNumbers = true,
    requireSpecialChars = true,
    requireUppercase = true
  } = options;

  const issues = [];

  if (password.length < minLength) {
    issues.push(`at least ${minLength} characters`);
  }

  if (requireNumbers && !/\d/.test(password)) {
    issues.push('at least one number');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('at least one special character (!@#$%^&*...)');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('at least one lowercase letter');
  }

  if (issues.length > 0) {
    throw new Error(`Password must contain ${issues.join(', ')}`);
  }
}

/**
 * Validates and cleans name fields
 *
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {string} Cleaned name
 * @throws {Error} If name contains invalid characters
 * @private
 */
function validateName(name, fieldName) {
  if (!name) return '';

  if (typeof name !== 'string') {
    throw new Error(`${fieldName} must be a text value`);
  }

  const cleaned = name.trim();

  // Allow letters, spaces, hyphens, and apostrophes (for names like O'Connor)
  if (!/^[a-zA-Z\s\-']+$/.test(cleaned)) {
    throw new Error(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }

  if (cleaned.length > 50) {
    throw new Error(`${fieldName} cannot be longer than 50 characters`);
  }

  return cleaned;
}

/**
 * Transforms Supabase user object into our standardized format
 *
 * @param {Object} supabaseUser - Raw user object from Supabase
 * @returns {AuthUser} Standardized user object
 * @private
 */
function transformUser(supabaseUser) {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    firstName: supabaseUser.user_metadata?.firstName || '',
    lastName: supabaseUser.user_metadata?.lastName || '',
    emailConfirmed: supabaseUser.email_confirmed_at !== null,
    createdAt: supabaseUser.created_at,
    lastSignInAt: supabaseUser.last_sign_in_at,
    metadata: supabaseUser.user_metadata || {}
  };
}

// ================================================================
// CORE AUTHENTICATION FUNCTIONS
// ================================================================

/**
 * Gets the currently authenticated user with complete profile information
 * This is the most commonly used function - call it to check login status
 *
 * @returns {Promise<AuthUser|null>} Current user object or null if not logged in
 * @throws {Error} If there's an authentication system error
 *
 * @example
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(`Welcome back, ${user.firstName}!`);
 *   console.log(`Email verified: ${user.emailConfirmed}`);
 * } else {
 *   console.log("Please log in to continue");
 * }
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error);
      throw new Error(`Authentication error: ${error.message}`);
    }

    return transformUser(user);

  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
}

/**
 * Registers a new user account with comprehensive validation
 * Sends email verification automatically (if enabled in Supabase)
 *
 * @param {SignUpData} signUpData - User registration data
 * @returns {Promise<{user: AuthUser, session: Object}>} New user and session
 * @throws {Error} If validation fails, email already exists, or registration fails
 *
 * @example
 * const { user, session } = await signUp({
 *   email: "john@example.com",
 *   password: "SecurePass123!",
 *   firstName: "John",
 *   lastName: "Doe"
 * });
 * console.log(`Account created for ${user.email}`);
 * if (!user.emailConfirmed) {
 *   console.log("Please check your email to verify your account");
 * }
 */
export async function signUp(signUpData) {
  try {
    // Input validation
    if (!signUpData || typeof signUpData !== 'object') {
      throw new Error('Sign up data is required');
    }

    const { email, password, firstName, lastName, metadata = {} } = signUpData;

    // Validate required fields
    validateEmail(email);
    validatePassword(password);

    // Validate optional fields
    const cleanFirstName = validateName(firstName, 'First name');
    const cleanLastName = validateName(lastName, 'Last name');

    // Prepare user metadata
    const userMetadata = {
      ...metadata,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      fullName: `${cleanFirstName} ${cleanLastName}`.trim()
    };

    // Attempt registration
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: userMetadata
      }
    });

    if (error) {
      console.error('Supabase sign up error:', error);

      // Provide user-friendly error messages
      if (error.message.includes('already registered')) {
        throw new Error('An account with this email address already exists. Please try signing in instead.');
      } else if (error.message.includes('weak password')) {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.message.includes('invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else {
        throw new Error(`Registration failed: ${error.message}`);
      }
    }

    if (!data.user) {
      throw new Error('Registration failed: No user data returned');
    }

    const transformedUser = transformUser(data.user);

    console.log(`Successfully registered user: ${transformedUser.email}`);

    return {
      user: transformedUser,
      session: data.session
    };

  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
}

/**
 * Signs in an existing user with email and password
 *
 * @param {UserCredentials} credentials - User login credentials
 * @returns {Promise<{user: AuthUser, session: Object}>} User and session data
 * @throws {Error} If credentials invalid or sign in fails
 *
 * @example
 * try {
 *   const { user, session } = await signIn({
 *     email: "john@example.com",
 *     password: "SecurePass123!"
 *   });
 *   console.log(`Welcome back, ${user.firstName}!`);
 * } catch (error) {
 *   console.error("Login failed:", error.message);
 * }
 */
export async function signIn(credentials) {
  try {
    // Input validation
    if (!credentials || typeof credentials !== 'object') {
      throw new Error('Login credentials are required');
    }

    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Both email and password are required');
    }

    validateEmail(email);

    if (!password.trim()) {
      throw new Error('Password cannot be empty');
    }

    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      console.error('Supabase sign in error:', error);

      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('email not confirmed')) {
        throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
      } else if (error.message.includes('too many requests')) {
        throw new Error('Too many login attempts. Please wait a few minutes and try again.');
      } else {
        throw new Error(`Sign in failed: ${error.message}`);
      }
    }

    if (!data.user) {
      throw new Error('Sign in failed: No user data returned');
    }

    const transformedUser = transformUser(data.user);

    console.log(`Successfully signed in user: ${transformedUser.email}`);

    return {
      user: transformedUser,
      session: data.session
    };

  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
}

/**
 * Signs out the current user from all devices
 * Clears all session data and tokens
 *
 * @returns {Promise<void>} Nothing on successful sign out
 * @throws {Error} If sign out fails
 *
 * @example
 * await signOut();
 * console.log("Successfully signed out");
 * // Redirect to login page
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase sign out error:', error);
      throw new Error(`Sign out failed: ${error.message}`);
    }

    console.log('User successfully signed out');

  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
}

// ================================================================
// PASSWORD MANAGEMENT FUNCTIONS
// ================================================================

/**
 * Sends a password reset email to the user
 *
 * @param {ResetPasswordData} resetData - Password reset information
 * @returns {Promise<void>} Nothing on successful email send
 * @throws {Error} If email invalid or reset fails
 *
 * @example
 * await sendPasswordResetEmail({
 *   email: "john@example.com",
 *   redirectTo: "https://myapp.com/reset-password"
 * });
 * console.log("Password reset email sent! Check your inbox.");
 */
export async function sendPasswordResetEmail(resetData) {
  try {
    if (!resetData || typeof resetData !== 'object') {
      throw new Error('Reset data is required');
    }

    const { email, redirectTo } = resetData;

    validateEmail(email);

    const options = {};
    if (redirectTo) {
      options.redirectTo = redirectTo;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      options
    );

    if (error) {
      console.error('Password reset error:', error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    console.log(`Password reset email sent to: ${email}`);

  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
}

/**
 * Updates the user's password (requires current session)
 *
 * @param {UpdatePasswordData} passwordData - New password information
 * @returns {Promise<AuthUser>} Updated user object
 * @throws {Error} If not authenticated, validation fails, or update fails
 *
 * @example
 * await updatePassword({
 *   newPassword: "NewSecurePass456!",
 *   currentPassword: "OldPassword123!" // Optional but recommended
 * });
 * console.log("Password updated successfully");
 */
export async function updatePassword(passwordData) {
  try {
    if (!passwordData || typeof passwordData !== 'object') {
      throw new Error('Password data is required');
    }

    const { newPassword, currentPassword } = passwordData;

    // Validate new password
    validatePassword(newPassword);

    // Verify user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be signed in to update your password');
    }

    // If current password provided, verify it first (recommended for security)
    if (currentPassword) {
      try {
        await signIn({ email: currentUser.email, password: currentPassword });
      } catch (error) {
        throw new Error('Current password is incorrect');
      }
    }

    // Update password
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Password update error:', error);
      throw new Error(`Failed to update password: ${error.message}`);
    }

    const updatedUser = transformUser(data.user);

    console.log('Password updated successfully');
    return updatedUser;

  } catch (error) {
    console.error('Error in updatePassword:', error);
    throw error;
  }
}

// ================================================================
// PROFILE MANAGEMENT FUNCTIONS
// ================================================================

/**
 * Updates the user's profile information
 *
 * @param {UpdateProfileData} profileData - Profile information to update
 * @returns {Promise<AuthUser>} Updated user object
 * @throws {Error} If not authenticated, validation fails, or update fails
 *
 * @example
 * const updatedUser = await updateProfile({
 *   firstName: "Jane",
 *   lastName: "Smith",
 *   email: "jane.smith@example.com"
 * });
 * console.log(`Profile updated for ${updatedUser.email}`);
 */
export async function updateProfile(profileData) {
  try {
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Profile data is required');
    }

    // Verify user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be signed in to update your profile');
    }

    const updateData = {};

    // Handle email update
    if (profileData.email !== undefined) {
      validateEmail(profileData.email);
      updateData.email = profileData.email.trim().toLowerCase();
    }

    // Handle metadata updates
    if (profileData.firstName !== undefined || profileData.lastName !== undefined || profileData.metadata !== undefined) {
      const currentMetadata = currentUser.metadata || {};

      const updatedMetadata = {
        ...currentMetadata,
        ...profileData.metadata
      };

      if (profileData.firstName !== undefined) {
        updatedMetadata.firstName = validateName(profileData.firstName, 'First name');
      }

      if (profileData.lastName !== undefined) {
        updatedMetadata.lastName = validateName(profileData.lastName, 'Last name');
      }

      // Update full name
      updatedMetadata.fullName = `${updatedMetadata.firstName || ''} ${updatedMetadata.lastName || ''}`.trim();

      updateData.data = updatedMetadata;
    }

    // Perform update
    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
      console.error('Profile update error:', error);

      if (error.message.includes('email already registered')) {
        throw new Error('This email address is already in use by another account');
      } else {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    }

    const updatedUser = transformUser(data.user);

    console.log(`Profile updated successfully for user: ${updatedUser.email}`);
    return updatedUser;

  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
}

/**
 * Deletes the current user's account permanently
 * This action cannot be undone!
 *
 * @param {string} confirmationEmail - User's email for confirmation
 * @returns {Promise<void>} Nothing on successful deletion
 * @throws {Error} If not authenticated, confirmation fails, or deletion fails
 *
 * @example
 * await deleteAccount("john@example.com");
 * console.log("Account deleted successfully");
 */
export async function deleteAccount(confirmationEmail) {
  try {
    // Verify user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be signed in to delete your account');
    }

    // Require email confirmation for safety
    if (!confirmationEmail || confirmationEmail.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      throw new Error('Please enter your email address to confirm account deletion');
    }

    // Note: Supabase doesn't have a direct user deletion API for security reasons
    // In a real app, you'd typically:
    // 1. Mark the user as deleted in your database
    // 2. Use a server-side function to actually delete the auth user
    // 3. Or use Supabase admin functions

    // For now, we'll sign out the user and recommend manual deletion
    await signOut();

    console.log('User signed out for account deletion process');

    throw new Error('Account deletion requires admin intervention. Please contact support to delete your account.');

  } catch (error) {
    console.error('Error in deleteAccount:', error);
    throw error;
  }
}

// ================================================================
// EMAIL VERIFICATION FUNCTIONS
// ================================================================

/**
 * Sends a new email verification link to the user
 *
 * @param {string} [email] - Email to send verification to (defaults to current user)
 * @returns {Promise<void>} Nothing on successful send
 * @throws {Error} If user not found or send fails
 *
 * @example
 * await resendEmailVerification();
 * console.log("Verification email sent! Check your inbox.");
 */
export async function resendEmailVerification(email) {
  try {
    let targetEmail = email;

    // If no email provided, use current user's email
    if (!targetEmail) {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be signed in or provide an email address');
      }
      targetEmail = currentUser.email;
    }

    validateEmail(targetEmail);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: targetEmail.trim().toLowerCase()
    });

    if (error) {
      console.error('Email verification resend error:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }

    console.log(`Verification email sent to: ${targetEmail}`);

  } catch (error) {
    console.error('Error in resendEmailVerification:', error);
    throw error;
  }
}

// ================================================================
// SOCIAL AUTHENTICATION FUNCTIONS
// ================================================================

/**
 * Signs in with a social provider (Google, GitHub, etc.)
 *
 * @param {string} provider - Social provider name ('google', 'github', 'discord', etc.)
 * @param {Object} [options] - Additional options
 * @param {string} [options.redirectTo] - URL to redirect after sign in
 * @returns {Promise<void>} Redirects to provider, no return value
 * @throws {Error} If provider invalid or sign in fails
 *
 * @example
 * await signInWithSocial('google', {
 *   redirectTo: 'https://myapp.com/dashboard'
 * });
 * // User will be redirected to Google for authentication
 */
export async function signInWithSocial(provider, options = {}) {
  try {
    if (!provider || typeof provider !== 'string') {
      throw new Error('Provider is required and must be a string');
    }

    const validProviders = ['google', 'github', 'discord', 'facebook', 'twitter', 'linkedin'];
    if (!validProviders.includes(provider.toLowerCase())) {
      throw new Error(`Invalid provider. Supported providers: ${validProviders.join(', ')}`);
    }

    const { redirectTo } = options;

    const signInOptions = {};
    if (redirectTo) {
      signInOptions.redirectTo = redirectTo;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: signInOptions
    });

    if (error) {
      console.error('Social sign in error:', error);
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`);
    }

    console.log(`Redirecting to ${provider} for authentication`);

  } catch (error) {
    console.error('Error in signInWithSocial:', error);
    throw error;
  }
}

// ================================================================
// SESSION MANAGEMENT FUNCTIONS
// ================================================================

/**
 * Gets the current session information
 *
 * @returns {Promise<Object|null>} Current session or null if not signed in
 * @throws {Error} If there's a session system error
 *
 * @example
 * const session = await getCurrentSession();
 * if (session) {
 *   console.log(`Session expires: ${new Date(session.expires_at * 1000)}`);
 * }
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      throw new Error(`Session error: ${error.message}`);
    }

    return session;

  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    throw error;
  }
}

/**
 * Refreshes the current session (extends expiration)
 *
 * @returns {Promise<Object>} New session object
 * @throws {Error} If refresh fails or user not signed in
 *
 * @example
 * const newSession = await refreshSession();
 * console.log("Session refreshed successfully");
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Session refresh error:', error);
      throw new Error(`Failed to refresh session: ${error.message}`);
    }

    if (!data.session) {
      throw new Error('No active session to refresh');
    }

    console.log('Session refreshed successfully');
    return data.session;

  } catch (error) {
    console.error('Error in refreshSession:', error);
    throw error;
  }
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Checks if user is currently authenticated
 * Simple boolean check - faster than getCurrentUser() when you only need to know login status
 *
 * @returns {Promise<boolean>} True if user is signed in, false otherwise
 *
 * @example
 * if (await isAuthenticated()) {
 *   console.log("User is logged in");
 * } else {
 *   console.log("User needs to log in");
 * }
 */
export async function isAuthenticated() {
  try {
    const session = await getCurrentSession();
    return session !== null;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

/**
 * Validates if an email is already registered
 * Useful for registration forms to provide immediate feedback
 *
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email is available, false if taken
 * @throws {Error} If email format invalid
 *
 * @example
 * const isAvailable = await isEmailAvailable("john@example.com");
 * if (!isAvailable) {
 *   console.log("This email is already registered");
 * }
 */
export async function isEmailAvailable(email) {
  try {
    validateEmail(email);

    // Try to sign in with a dummy password
    // If email exists, we'll get an invalid credentials error
    // If email doesn't exist, we'll get a different error
    try {
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: 'dummy-password-that-should-never-work-12345'
      });

      // If we somehow succeed (shouldn't happen), email exists
      return false;

    } catch (signInError) {
      // Check the specific error to determine if email exists
      if (signInError.message.includes('Invalid login credentials')) {
        // Email exists but password is wrong
        return false;
      } else {
        // Other error likely means email doesn't exist
        return true;
      }
    }

  } catch (error) {
    console.error('Error checking email availability:', error);
    throw error;
  }
}