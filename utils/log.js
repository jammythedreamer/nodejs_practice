const fs = require('fs')

const logPath = './connection.log'

function ensureLogFile() {
    const isExists = fs.existsSync(logPath)

    if (!isExists) {
        fs.writeFileSync(logPath, '')
    }
}

function readFromLogFile() {
    ensureLogFile()

    return fs.readFileSync(logPath).toString('utf-8')
}

function writeLogFile(remoteAddress) {
    const beforeLog = readFromLogFile()

    const now = new Date().toGMTString()
    const newLog = `${now}: ${remoteAddress} access`

    fs.writeFileSync(logPath, `${beforeLog}\n${newLog}`)
}

module.exports = { writeLogFile, readFromLogFile }