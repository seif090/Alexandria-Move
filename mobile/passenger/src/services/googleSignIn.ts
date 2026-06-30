import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { config } from '../config'

GoogleSignin.configure({
  webClientId: config.webClientId,
  offlineAccess: true,
})

export async function signInWithGoogle(): Promise<{
  idToken: string | null
  user: { name: string; email: string; photo: string | null } | null
}> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const userInfo = await GoogleSignin.signIn()
    return {
      idToken: userInfo.idToken ?? null,
      user: userInfo.user
        ? { name: userInfo.user.name ?? '', email: userInfo.user.email ?? '', photo: userInfo.user.photo ?? null }
        : null,
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { idToken: null, user: null }
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return { idToken: null, user: null }
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services are not available on this device')
    }
    throw error
  }
}

export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut()
  } catch {
    // Silently fail - user may not be signed in with Google
  }
}

export async function hasPreviousGoogleSignIn(): Promise<boolean> {
  try {
    return await GoogleSignin.isSignedIn()
  } catch {
    return false
  }
}

export async function getCurrentGoogleUser() {
  try {
    return await GoogleSignin.getCurrentUser()
  } catch {
    return null
  }
}
