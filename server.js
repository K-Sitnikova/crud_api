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
    response.setHeader('Content-Type', 'application/json')
    if (match) {
        const id = match[1];
        const user = findUser(id)

        switch(request.method) {
            case 'GET': 
            if (user) {
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(user))
            } else {
                response.writeHead(404, {'Content-Type': 'text/html'})
                response.end(`<h1>User doesn't exist</h1>`)
            }
            break;
            case 'POST':
                response.writeHead(201, {'Content-Type': 'application/json'})
                response.end(JSON.stringify(user))
            break;
            case 'PUT':
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(user))
            break;
            case 'DELETE':
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(user))
            break;
        }
        
    } else if (request.url === "/api/users") {
        response.writeHead(200)
        response.end(JSON.stringify(users))
    }    
}