import url from 'url';
const users = [];

export const requestHandler = (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    const findUser = (id) => {
        const filtredUsers = users.filter((user) => user.id === id)
        if (filtredUsers.length > 0) {
            return filtredUsers[0]
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
            case 'PUT':
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(user))
            break;
            case 'DELETE':
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(user))
            break;
            default:
                response.writeHead(405, { 'Content-Type': 'text/plain' });
                response.end('Method not allowed');
            break;
        }
        
    } else if (request.url === "/api/users") {
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify(users))
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('page does not exist');
    }   
}