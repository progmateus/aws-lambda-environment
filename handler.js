const settings = require("./config/settings.js")
const axios = require("axios");
const cheerio = require("cheerio");
const AWS = require("aws-sdk");
const uuid = require("uuid")
const dynamoDB = new AWS.DynamoDB.DocumentClient();

class Handler {

    static async main(event) {
        const { data } = await axios.get(settings.commitMessageUrl())
        const s = cheerio.load(data)
        const [commitMessage] = await s("#content").text().trim().split("\n")
        const params = {
            TableName: settings.dbTableName,
            Item: {
                commitMessage,
                id: uuid.v1(),
                createdAt: new Date().toISOString()
            }
        }
        await dynamoDB.put(params).promise()
        return {
            statusCode: 200
        }
    }
}

module.exports = {
    scheduler: Handler.main
}