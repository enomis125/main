import NextAuth from "next-auth";

import process from "process";
import CredentialsProvider from "next-auth/providers/credentials";
import { Console } from "console";
import prisma from "@/lib/prisma"
import { strategy } from "sharp";


export const authOptions = {

    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt"
    },

    providers: [
        CredentialsProvider({

            name: 'Credentials',

            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                const response = await prisma.users.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (credentials?.password == response.password) {
                    return {
                        id: response.userID,
                        email: response.email,
                        organization: response.organizationID,
                        role: response.roleID,
                        name: response.name,
                        lastname: response.lastName,
                        admin: response.admin
                    }
                }

                return null
            }
        })
    ],
    // debug: true,
    callbacks: {
        async jwt({ token, user }) {

            return { ...token, ...user };
        },

        async session({ session, token }) {

            session.user.id = token.id
            session.user.organization = token.organization
            session.user.role = token.role
            session.user.name = token.name
            session.user.lastname = token.lastname
            session.user.admin = token.admin

            return session;
        },
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }