const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "covid19India.db");

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/states/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

app.get("/states/", async (request, response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      state;`;
  const statesArray = await database.all(getStatesQuery);
  response.send(
    statesArray.map((eachPlayer) => convertDbObjectToResponseObject(eachState))
  );
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateId = `
    SELECT 
      * 
    FROM 
      state 
    WHERE 
      state_id = ${stateId};`;
  const state = await database.get(getStateId);
  response.send(convertDbObjectToResponseObject(state));
});

app.post("/districts/", async (request, response) => {
  const { stateId, cases, cured, active, deaths } = request.body;
  const postStateQuery = `
  INSERT INTO
    districts (state_id, cases, cured, active, deaths)
  VALUES
    ( ${stateId}, ${cases}, ${cured}, ${active}, ${deaths});`;
  const stateIds = await database.run(postStateQuery);
  response.send("District Successfully Added");
});

const convertDbObjectToDistrictObject = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictIdQuery = `SELECT * FROM district;`;
  const district = await db.all(getDistrictIdQuery);
  response.send(district);
});

app.put("/districts/:districtId/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const { districtId } = request.params;
  const updateDistrictQuery = `
  UPDATE
    district
  SET
    district_name = '${districtName}',
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths},
  WHERE
    district_id = ${districtId};`;

  await database.run(updateDistrictQuery);
  response.send("District Details Updated");
});

app.delete("/district/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deleteDistrictQuery = `
  DELETE FROM
    district
  WHERE
    district_id = ${districtId};`;
  await database.run(deleteDistrictQuery);
  response.send("District Removed");
});

app.get("/states/:stateId/stats", async (request, response) => {
  const { stateId } = request.params;
  const getStatsQuery = `SELECT * FROM state;`;
  const stats = await db.all(getStatsQuery);
  response.send(stats);
});

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictDetails = `SELECT * FROM district;`;
  const districtDetails = await db.all(getDistrictDetails);
  response.send(districtDetails);
});

module.exports = app;
