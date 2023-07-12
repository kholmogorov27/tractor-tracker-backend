# tractor-tracker-backend

Данный бэкенд строен на express js + mongodb 

## Установки необходимых компонентов (для система Windows)

### 1. MongoDB Community Server через Docker

MongoDB Community Server можно же скачать по ссылке [MongoDB Community Server Dowload](https://www.mongodb.com/try/download/community), но мы выбрали Docker для простоты. 

[Что представляет себя Docker?](https://ru.wikipedia.org/wiki/Docker)

Шаги установки и конфигурации:
1. Скачать Docker Desktop;
2. Найти и скачать офицальный имедж MongoDB Community Server `mongodb/mongodb-community-server`
3. Запускать контейнер, где параметр **host port** является **27017**, имя контенйнера не важен

### 2. MongoDB Compass

MongoDB Compass является интерфейсом СУБД MongoDB. 

Шаги установки и конфигурации:
1. Скачать [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Добавить новое соединение по URI: `mongodb://localhost:27017/tractor-tracker`
3. перейти к БД `tractor-tracker`, потом на вкладку Indexes и нажать Create Indexes и добавить в field name - location и в type - 2dsphere. Гду это применяется будет объяснено позже.


### HTTP-запросы и их обработчики

# эндпоинт /insert 

```nodejs
app.post('/insert', async(req, res) => {
  const result = await insertLand(req.body)
  
  if (result.acknowledged) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})
```

Данный эндпоинт принимает POST-запрос. В тело запроса храниться оъект JSON по следующей схеме 
```JSON
{
    "location": {
        "type":"Polygon",
        "coordinates": [
            [
                [<longitude>, <latitude>],
                [<longitude>, <latitude>],
                ...
                [<longitude>, <latitude>],
            ]
        ]
        "isTilled":false,
        "dateTimeTilled":"<dateTimeString>"
    }
}
```
Обработчик событий передает данный объект в функцию insertLand(). Описание insertLand()
```nodejs
async function insertLand(payload) {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)

    const result = await db.collection('lands').insertOne(payload)

    return result
}
```
В данной строке
`const result = await db.collection('lands').insertOne(payload)`
 используется метод insertOne() из MongoDB, которая берет payload, наш вышеуказанный JSON объект, и сохраняет его в документ (запись) в коллекции (таблицы) "lands". При выполнении метода insertOne() возврашается JSON объект со статуса выполнение метода
```JSON
{
  acknowledged: true,
  insertedId: new ObjectId("<ID документа>")
}
```
В зависимости от статуса выполнения, обработчик будет отправить соответствующие веб статусы (200 - ОК или 500 - есть ошибка)
```
  if (result.acknowledged) {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
```

# эндпоинт /nearest

```nodejs
app.get('/nearest', async(req, res) => {
  const result = await getNearest(req.body)
  res.send(result)
  // for getNearest to work need to createIndex
})
```
Данный эндпоинт принимает GET-запрос. В тело запроса храниться оъект JSON по следующей схеме    

```JSON
{
  "coordinates":{
    
    "long":<longitude>,
    "lat":<latitude>
  },
  "minDistance":<min distance in meters>,
  "maxDistance":<max distance in meters>
}
```
Обработчик берет данный объект и передает в функцию getNearest()

```nodejs
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
```
Данная функция делает запрос в колекции "lands" и ищет ближащие к координатам объекта в payload документы с помощью оператора $near, отсортирует эти документы по возрастанию дистации, собирает всё в список в возврашает этот список.

пример вывода:
```JSON
[
  {
    "_id": "64aea7e4599b9ba37966f8ce",
    "location": {
      "type": "Polygon",
      "coordinates": [
        [
          [10, 0],
          [10.1, 0],
          [10.6, 1],
          [10.4, 1],
          [10, 0]
        ]
      ]
    },
    "isTilled": false,
    "dateTimeTilled": ""
  },
  {
    "_id": "64aeccfe3e7ee36b156d04c9",
    "location": {
      "type": "Polygon",
      "coordinates": [
        [
          [10, 0],
          [10.1, 0],
          [10.6, 1],
          [10.4, 1],
          [10, 0]
        ]
      ]
    },
    "isTilled": false,
    "dateTimeTilled": ""
  },
  {
    "_id": "64aea73578170bf0873d3827",
    "location": {
      "type": "Polygon",
      "coordinates": [
        [
          [100, 0],
          [101, 0],
          [101, 1],
          [100, 1],
          [100, 0]
        ]
      ]
    },
    "isTilled": false,
    "dateTimeTilled": ""
  }
]
```