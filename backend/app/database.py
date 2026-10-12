import os
import logging

class InMemoryMongoDB:
    """
    In-memory fallback document store mimicking PyMongo interface
    if live MongoDB service is not running locally.
    """
    def __init__(self):
        self._collections = {
            "traffic_records": [],
            "roads": [],
            "incidents": []
        }

    def insert_many(self, collection_name, documents):
        self._collections[collection_name] = documents

    def find_all(self, collection_name):
        return self._collections.get(collection_name, [])


class MongoManager:
    def __init__(self):
        self.connected = False
        self.client = None
        self.db = None
        self.memory_db = InMemoryMongoDB()
        self.mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("MONGO_DB_NAME", "mumbai_traffic_db")

    def connect(self):
        try:
            from pymongo import MongoClient
            self.client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=1500)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.connected = True
            logging.info("Connected to MongoDB successfully!")
        except Exception as e:
            self.connected = False
            logging.warning(f"MongoDB connection unavailable ({e}). Using In-Memory fallback store.")

    def store_snapshot(self, records, roads, incidents):
        if self.connected and self.db is not None:
            try:
                self.db.traffic_records.drop()
                self.db.traffic_records.insert_many(records)
                self.db.roads.drop()
                self.db.roads.insert_many(roads)
                self.db.incidents.drop()
                self.db.incidents.insert_many(incidents)
            except Exception as e:
                logging.error(f"MongoDB insert error: {e}")
                self.memory_db.insert_many("traffic_records", records)
                self.memory_db.insert_many("roads", roads)
                self.memory_db.insert_many("incidents", incidents)
        else:
            self.memory_db.insert_many("traffic_records", records)
            self.memory_db.insert_many("roads", roads)
            self.memory_db.insert_many("incidents", incidents)

    def get_records(self):
        if self.connected and self.db is not None:
            try:
                return list(self.db.traffic_records.find({}, {"_id": 0}))
            except Exception:
                pass
        return self.memory_db.find_all("traffic_records")

    def get_roads(self):
        if self.connected and self.db is not None:
            try:
                return list(self.db.roads.find({}, {"_id": 0}))
            except Exception:
                pass
        return self.memory_db.find_all("roads")

    def get_incidents(self):
        if self.connected and self.db is not None:
            try:
                return list(self.db.incidents.find({}, {"_id": 0}))
            except Exception:
                pass
        return self.memory_db.find_all("incidents")

db_manager = MongoManager()
