import NextAuth from "next-auth/next";

import process from "process";
import CredentialsProvider from "next-auth/providers/credentials";
import { Console } from "console";


export const authOptions = {

    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({

            name: 'Credentials',

            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                

                return { id: 0, name: "Diogo" }
            }
        })
    ],
    debug: true,
    callbacks: {
        async jwt({ token, user }) {

            return { ...token, ...user };
        },

        async session({ session, token }) {

            session.user.id = token.id
            session.user.name = token.name;
            return session;
        },

    },
    session: { strategy: "jwt" }//, maxAge: 10*60*60
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
