import url from 'url';
import { v4 as uuidv4 } from 'uuid';


const users = [];

const validateUser = (data) => {
    const requiredFields = ['username', 'age', 'hobbies']
    return requiredFields.every((field) => data.hasOwnProperty(field) 
    && data[field] 
    && typeof data['username'] === "string" 
    && typeof data['age'] === 'number' 
    && Array.isArray(data['hobbies']))
}

export const requestHandler = (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    const findUser = (id) => {
        const currentUser = users.find((user) => user.id == id)
        if (currentUser) {
            return currentUser
        }
        return false;
    }
    const match = pathname.match(/^\/api\/users\/([A-Za-z0-9-]+)$/)

    if (match) {
        const id = match[1];
        
        const user = findUser(id)

        switch(request.method) {
            case 'GET': 
            if (user) {
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(user))
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'})
                response.end('User doesn\'t exist')
            }
            break;
            case 'PUT':
                if(user) {
                    let updatedBody = ''
                    request.on('data', chunk => {
                        updatedBody += chunk.toString()
                    })
                    request.on('end', () => {
                        try {
                            const data = JSON.parse(updatedBody)
                            if (validateUser(data)) {
                                Object.assign(user, data);
                                response.writeHead(200, {'Content-Type': 'application/json'})
                                response.end(JSON.stringify(user))
                            } else {
                                response.writeHead(400, {'Content-Type': 'text/plain'})
                                response.end('Missing required fields or invalid data')
                            }
                        } catch (error) {
                            response.writeHead(400, {'Content-Type': 'text/plain'})
                            response.end('invalid JSON')
                        }
                    })
                } else {
                    response.writeHead(404, {'Content-Type': 'text/plain'})
                    response.end('User doesn\'t exist')
                }
            break;
            case 'DELETE':
                if (user) {
                    const index = users.indexOf(user);
                    users.splice(index, 1);
                    response.writeHead(200, {'Content-Type': 'application/json'})
                    response.end('user deleted')
                } else {
                    response.writeHead(404, {'Content-Type': 'text/plain'})
                    response.end('User doesn\'t exist')
                }
            break;
            default:
                response.writeHead(405, { 'Content-Type': 'text/plain' });
                response.end('Method not allowed');
            break;
        }
        
    } else if (request.url === "/api/users") {
        switch(request.method) {
            case "GET":
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(users))
            break;
            case 'POST':
                let body = ''
                request.on('data', chunk => {
                    body += chunk.toString()
                })
                request.on('end', () => {
                    try {
                        const data = JSON.parse(body)
                        if (validateUser(data)) {
                            const curerentId = uuidv4();
                            const newUser = {id: curerentId, ...data };
                            users.push(newUser)
                            response.writeHead(201, {'Content-Type': 'application/json'})
                            response.end(JSON.stringify(users))
                        } else {
                            response.writeHead(400, {'Content-Type': 'text/plain'})
                            response.end('Missing required fields')
                        }
                        
                    } catch (error) {
                        response.writeHead(400, {'Content-Type': 'text/plain'})
                        response.end('invalid JSON')
                    }
                })
            break;
            default:
                response.writeHead(405, { 'Content-Type': 'text/plain' });
                response.end('Method not allowed');
            break;
        }
        
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('page does not exist');
    }   
}