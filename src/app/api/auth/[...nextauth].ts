import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const parsedCredentials = credentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          return null;
        }
        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user && await compare(password, user.password)) {
          return { 
            id: user.id.toString(), 
            name: user.name ?? undefined, // Asegúrate de que `name` es `string | undefined`
            email: user.email,
            role: user.role 
          };
        }
        return null;
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,  
          name: token.name as string,  
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;  
        token.name = user.name;  
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
