migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iq2k9sakv9sosvz")

  // remove
  collection.schema.removeField("tvhln28h")

  // remove
  collection.schema.removeField("vmhulgea")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4dmygtls",
    "name": "likes",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mf6hisxe",
    "name": "dislikes",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iq2k9sakv9sosvz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tvhln28h",
    "name": "likes",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vmhulgea",
    "name": "dislikes",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("4dmygtls")

  // remove
  collection.schema.removeField("mf6hisxe")

  return dao.saveCollection(collection)
})
