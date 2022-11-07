const express = require("express");
const { open } = require("sqlite")
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "covid19India.db")''
const app = express();
app.use(express.json());

let database = null;

const initalizeDbAndServer = async () => {
    try {
        database: open({
            fileName: databasePath,
            driver: sqlite3.Database,
        })
        app.listen(3000, () => {
            console.log("Server is running at http://localhost:3000")
        })
    }
        catch(error) {
            console.log(`DB Error : ${error.message}`)
        
    }
    
}
initalizeDbAndServer();

constDbObjectToResponseObject = (dbObject) => {
    return {
        stateId: dbObject.state_id,
        stateName: dbObject.state_name,
        statePopulation:dbObject.population,
    }
}

app.get("/states/", async (request, response) => {
    const getStateQuery = `SELECT * FROM state;`; 

    const stateArray = await db.all(getStateQuery);
    response.send(stateArray.map(eachstate) => constDbObjectToResponseObject(eachstate));
});

app.get("/states/:stateId", async (request, response) => {
    const {stateId} = request.params;
    const getStateIdQuery = `SELECT * FROM state WHERE state_id = ${stateId};`;

    const stateId = await db.get(getStateIdQuery);
    response.send(constDbObjectToResponseObject(stateId));
})

app.post("/districts/", async (request, response) => {
    const {districtName, stateId, cases, cured, active, deaths} = request.body;
    const getDistrictQuery = `INSERT INTO district (district_name, state_id, cases, cured, active, deaths)
    VALUES ('${districtName}', ${stateId}, ${cases}, ${curved}, ${active}, ${deaths};)`;
    const districts = await db.run(getDistrictQuery);
    response.send("District Successfully Added");
})

app.get("/districts/:districtId/", async (request, response) => {
    const {districtId, districtName, stateId, cases, curved, active, deaths} = request.params;
    const getDistrictDetails = `SELECT * FROM district;`;
    const districtQuery = await db.all(getDistrictDetails);
    response.send(districtQuery);
})

app.delete("/districts/:districtId/", async (request, response) => {
    const deleteDistrictId = `DELETE FROM district WHERE district_id = ${districtId};`;
    await db.run(deleteDistrictId);
    response.send("District Removed");
})

app.put("/districts/:districtId/", async (request, response) => {
    const {districtName, stateId, cases, curved, active, deaths} = request.body;
    const {districtId} = request.params;

    const updateDistrictQuery = `UPDATE district SET district_name = '${districtName}',
    ${stateId}, ${cases}, ${curved}, ${active}, ${deaths} WHERE district_id = ${district_id};`;

    await db.run(updateDistrictQuery);
    response.send("District Details Updated");

})

app.get("/states/:stateId/stats/", async (request, response) => {
    const stateStatsQuery = `SELECT * FROM state WHERE state_id = ${stateId};`;
    const stateStats = await db.all(stateStatsQuery);
    response.send(stateStats);
})

app.get("/districts/:districtId/details/", async (request, response) => {
    const stateName = `SELECT * FROM state WHERE state_name = '${stateName};`;
    const stateDetails = await db.get(stateName);
    response.send(stateDetails);
}

module.exports = app;