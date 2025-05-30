import morgan from 'morgan'
morgan.token('postcontent', function (req) { return JSON.stringify(req.body) })
const tinylogger = morgan('tiny', { skip: (req) => req.method === 'POST' })
const postlogger = morgan(':method :url :status :res[content-length] - :response-time ms :postcontent')

export default { tinylogger, postlogger }