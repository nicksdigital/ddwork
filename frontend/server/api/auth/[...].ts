import GithubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'
import TwitterProvider from 'next-auth/providers/twitter'
import GooglePrivider from "next-auth/providers/google";
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    secret: 'your-secret-here',
    providers: [
        // @ts-expect-error Use .default here for it to work during SSR.
        GithubProvider.default({
            clientId: 'your-client-id',
            clientSecret: 'your-client-secret'
        })
    ],
    callbacks: {
        /* on before signin */
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        /* on redirect to another url */
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        /* on session retrival */
        async session({ session, user, token }) {
            return session
        },
        /* on JWT token creation or mutation */
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    },
    events: {
        async signIn(message) { /* on successful sign in */ },
        async signOut(message) { /* on signout */ },
        async createUser(message) { /* user created */ },
        async updateUser(message) { /* user updated - e.g. their email was verified */ },
        async linkAccount(message) { /* account (e.g. GitHub) linked to a user */ },
        async session(message) { /* session is active */ },
    },
    pages: {
        signIn: '/auth/signIn',
        signOut: '/auth/signOut',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: '/auth/new-user'
    }
})