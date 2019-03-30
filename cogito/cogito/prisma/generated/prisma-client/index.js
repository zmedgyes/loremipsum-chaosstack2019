"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Answer",
    embedded: false
  },
  {
    name: "Question",
    embedded: false
  },
  {
    name: "Test",
    embedded: false
  },
  {
    name: "CompletedTest",
    embedded: false
  },
  {
    name: "Score",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/zsolt-medgyesi-7151cb/cogito/pruduction`
});
exports.prisma = new exports.Prisma();
