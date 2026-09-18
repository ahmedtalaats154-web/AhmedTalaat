import { spawn } from "node:child_process";
import { pbkdf2Sync } from "node:crypto";
// Isolated localhost-only test credentials. No production Blob access.
const salt="eu-visual-local-test";
const digest=pbkdf2Sync("eu-visual-test",salt,1000,32,"sha256").toString("hex");
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p","3107","-H","127.0.0.1"],{
  stdio:"inherit",
  env:{...process.env,BLOB_READ_WRITE_TOKEN:"",CONFIG_ENCRYPTION_KEY:"",ADMIN_SESSION_SECRET:"eu-visual-local-test-session",ADMIN_PASSWORD_HASH:`pbkdf2$1000$${Buffer.from(salt).toString("hex")}$${digest}`},
});
for(const signal of ["SIGTERM","SIGINT"])process.on(signal,()=>{child.kill(signal);process.exit(0);});
child.on("exit",code=>process.exit(code ?? 0));

