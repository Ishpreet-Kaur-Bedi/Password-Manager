import fastify from "fastify";
import fs from "fs";
import path from "path";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { CORS_ORIGIN } from "../constants";
import cookie from "@fastify/cookie";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import userRoutes from "../modules/user/user.route";
import vaultRoutes from "../modules/vault/vault.route";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}


// this is the funtion to create the server
function createServer() {
  const app = fastify();

  // now we will add some pluggins
  app.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // read file sync takes only one argument and that is the path to that file
  app.register(jwt, {
    secret: {
      private: fs.readFileSync(
        `${(path.join(process.cwd()), "certs")}/private.key`
      ),
      public: fs.readFileSync(
        `${(path.join(process.cwd()), "certs")}/public.key`
      ),
    },


    sign: { algorithm: "RS256" },
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });
// this is so that we can sign cookies
  app.register(cookie, {
    parseOptions: {},
  });


  // authentication decorator

  app.decorate(
    "authenticate",
    
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await request.jwtVerify<{
          _id: string;
        }>();

        request.user = user;
      } catch (e) {
        return reply.send(e);
      }
    }
  );

  app.register(userRoutes, { prefix: "api/users" });
  app.register(vaultRoutes, { prefix: "api/vault" });

  return app;
}

export default createServer;
