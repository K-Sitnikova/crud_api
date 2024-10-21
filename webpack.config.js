import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry: './src/index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.cjs',
        clean: true,
    },
    resolve: {
        fallback: {
            "path": false,
            "os": false,
            "crypto": false,
            "http": false,
            "url": false
        },
        extensions: ['.js'],
    },
    mode: "production"
}