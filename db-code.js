import { MongoClient } from "mongodb"

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
var db 

const dbName = 'tractor-tracker'

async function insertLand(payload) {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const result = await db.collection('lands').insertOne(payload)
    console.log('inserted doc: ', result)
    return result
}

async function getNearest(payload) {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)

    const result = db.collection('lands').find(
        {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            payload.coordinates.long, 
                            payload.coordinates.lat
                        ]
                    },
                    $maxDistance: payload.maxDistance,
                    $minDistance: payload.minDistance
                }
            }
        }
    ).toArray()
    return result
}

export { insertLand, getNearest }