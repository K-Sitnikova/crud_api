import url from 'url';

const users = [];

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
    const match = pathname.match(/^\/api\/users\/(\d+)$/)

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
                            Object.assign(user, data);
                            response.writeHead(200, {'Content-Type': 'application/json'})
                            response.end(JSON.stringify(user))
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
                        users.push(data)
                        response.writeHead(201, {'Content-Type': 'application/json'})
                        response.end(JSON.stringify(users))
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