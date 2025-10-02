import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { AuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import db from "./prisma";

/**
 * Configurações de autenticação para o NextAuth.js.
 *
 * Este objeto de configuração define como o NextAuth.js irá lidar com a autenticação
 * de usuários na aplicação. Ele inclui as configurações para provedores de autenticação,
 * como login com e-mail/senha (Credentials) e Google, o adaptador para o banco de dados
 * usando Prisma, e callbacks para gerenciar o token JWT e o objeto de sessão.
 *
 * @constant {AuthOptions} authOptions - O objeto de configuração para o NextAuth.js.
 *
 * @property {Adapter} adapter - O adaptador do Prisma, que permite que o NextAuth.js interaja
 * com o banco de dados para persistir dados de sessão e usuário.
 *
 * @property {Array} providers - Um array de provedores de autenticação.
 * @property {object} providers.CredentialsProvider - Permite que os usuários façam login com
 * e-mail e senha, verificando as credenciais contra o banco de dados.
 * @property {object} providers.GoogleProvider - Permite o login via OAuth com o Google,
 * usando as credenciais de cliente definidas em variáveis de ambiente.
 *
 * @property {object} callbacks - Funções assíncronas que são executadas em momentos específicos
 * do ciclo de autenticação.
 * @property {Function} callbacks.jwt - Adiciona o ID do usuário (e outros campos se necessário)
 * ao token JWT após o login.
 * @property {Function} callbacks.session - Adiciona o ID do usuário (e outros campos se necessário)
 * ao objeto de sessão, tornando-o acessível para a aplicação.
 *
 * @property {string} secret - A chave secreta usada para assinar o token JWT.
 *
 * @property {object} session - Configurações da sessão.
 * @property {string} session.strategy - Define a estratégia de sessão como "jwt"
 * para usar JSON Web Tokens.
 */
export const authOptions: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // Login com e-mail e senha
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Usuário não encontrado ou senha não configurada.");
        }

        // Verifica se o e-mail foi verificado
        /* if (!user.emailVerified) {
          throw new Error(
            "Você precisa verificar seu e-mail antes de fazer login.",
          );
        } */

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),

    // Login com Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Se o usuário já existir no token, adicione o ID
      if (user) {
        token.id = user.id;
      }

      // Se a sessão foi atualizada no cliente (com update()),
      // atualize o token com os novos dados
      if (trigger === "update" && session) {
        // O Next-Auth passa os dados da atualização na `session` quando o trigger é `update`
        // Você pode processar esses dados aqui, se necessário, ou
        // simplesmente forçar uma busca no banco para garantir consistência.
      }

      // Busca o usuário mais recente no banco de dados para garantir que os dados do token estão sincronizados
      if (token?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        // Adiciona o ID do token à sessão do usuário
        session.user.id = token.id as string;

        // Adiciona os campos atualizados do token à sessão
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
