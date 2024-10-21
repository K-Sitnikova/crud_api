import http from 'http'
import 'dotenv/config'
import { requestHandler as serverHandler } from './server.js';

console.log('Executing index.js');

const server = http.createServer(serverHandler)

server.listen(process.env.PORT)