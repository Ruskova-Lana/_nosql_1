use("spotify");

print("\nЗавдання 1. Explain без індексу");

// Видаляємо індекс, якщо він вже був створений раніше
try {
  db.tracks.dropIndex("genre_danceability_popularity_idx");
} catch (e) {
  print("Індекс genre_danceability_popularity_idx ще не існує");
}

const query1 = {
  track_genre: "pop",
  "audio_features.danceability": { $gte: 0.7 },
};

const sort1 = {
  popularity: -1,
};

printjson(
  db.tracks
    .find(query1)
    .sort(sort1)
    .explain("executionStats")
);

print("\nСтворюємо індекс для genre + danceability + popularity");

db.tracks.createIndex(
  {
    track_genre: 1,
    "audio_features.danceability": 1,
    popularity: -1,
  },
  {
    name: "genre_danceability_popularity_idx",
  }
);

print("\nExplain після створення індексу");

printjson(
  db.tracks
    .find(query1)
    .sort(sort1)
    .explain("executionStats")
);

print("\nЗавдання 2. Індекс для музики для роботи");

db.tracks.createIndex(
  {
    "audio_features.instrumentalness": 1,
    "audio_features.speechiness": 1,
    explicit: 1,
  },
  {
    name: "work_music_idx",
  }
);

const workQuery = {
  "audio_features.instrumentalness": { $gt: 0.5 },
  "audio_features.speechiness": { $lt: 0.1 },
  explicit: false,
};

printjson(
  db.tracks
    .find(workQuery)
    .explain("executionStats")
);

print("\nЗавдання 3. Перевірка запиту з popularity >= 70");

const coveredQuery = {
  track_genre: "pop",
  popularity: { $gte: 70 },
};

printjson(
  db.tracks
    .find(coveredQuery)
    .explain("executionStats")
);