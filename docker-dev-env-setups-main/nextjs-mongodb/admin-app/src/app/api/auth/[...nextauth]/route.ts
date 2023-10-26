import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signIn } from "@/utils/auth/auth";

export const authOptions = {
    secret: "secret",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const token = await signIn(credentials?.username as string, credentials?.password as string);

                console.log("#####  TOKEN: ", token);

                if (token) {
                    return {
                        id: "user_id", // Add a dummy value for the 'id' field
                        username: credentials?.username as string,
                        name: "name",
                        email: "email@email.com",
                        token: token,
                    };
                }
                return null
            }
        })
    ],
    pages: {
        signIn: "/signin",
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }