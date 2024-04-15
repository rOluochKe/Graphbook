import Sequelize from "sequelize";
import fs from "fs";
import path from "path";

if (process.env.NODE_ENV === "development") {
  require("babel-plugin-require-context-hook/register")();
}

export default (sequelize) => {
  let db = {};

  const modelsDir = path.join(__dirname, ".");
  const modelFiles = fs.readdirSync(modelsDir);

  modelFiles
    .filter((file) => file !== "index.js" && file.endsWith(".js"))
    .forEach((file) => {
      const model = require(path.join(modelsDir, file))(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
