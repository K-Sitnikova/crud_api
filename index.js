import http from 'http'
import { requestHandler as serverHandler } from './server.js';





const server = http.createServer(serverHandler)
server.listen(3000)