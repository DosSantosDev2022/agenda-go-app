// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Estende a interface Session para incluir o accessToken
   */
  interface Session extends DefaultSession {
    accessToken?: string;
    // O objeto user agora terá um 'id'
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Estende a interface User para incluir o id
   */
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Estende a interface JWT para incluir o accessToken e o id
   */
  interface JWT {
    accessToken?: string;
    id: string;
  }
}
