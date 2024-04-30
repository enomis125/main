import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";

export default NextAuth({
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
                });

                if (credentials?.password === response.password) {
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

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.organization = token.organization;
            session.user.role = token.role;
            session.user.name = token.name;
            session.user.lastname = token.lastname;
            session.user.admin = token.admin;

            return session;
        },
    }
});
