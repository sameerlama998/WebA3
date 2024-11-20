require('dotenv').config();
require('pg');
const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '7DYLoaf9jewh', {
  host: 'ep-morning-union-a5iyx2nn.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});


const Sector = sequelize.define(
  'Sector',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sector_name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING
  },
  feature_img_url: {
    type: Sequelize.STRING
  },
  summary_short: {
    type: Sequelize.TEXT
  },
  intro_short: {
    type: Sequelize.TEXT
  },
  impact: {  
    type: Sequelize.TEXT
  },
  original_source_url: {
    type: Sequelize.STRING
  },
  sector_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Sectors',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
});


Project.belongsTo(Sector, {foreignKey: 'sector_id'});


function initialize() {
  return sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch((err) => Promise.reject(`Unable to sync database: ${err}`));
}


// add a new project to database
function addProject(projectData) {
  return new Promise((resolve, reject) => {
    Project.create(projectData)
      .then(() => resolve()) // Resolve with no data on success
      .catch(err => reject(err.errors[0].message)); // Reject with the first error message for better readability
  });
}

//get all sectors
function getAllSectors() {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then(sectors => resolve(sectors)) // Resolve with all sectors
      .catch(err => reject(err.message)); // Reject with a general error message
  });
}

// function getAllProjects() {
//   return new Promise((resolve, reject) => {
//     resolve(projects);
//   });
// }
function getAllProjects() {
  return Project.findAll({ include: [Sector] })
    .then((projects) => projects)
    .catch((err) => Promise.reject(`Unable to retrieve projects: ${err}`));
}



// function getProjectById(projectId) {

//   return new Promise((resolve, reject) => {
//     let foundProject = projects.find(p => p.id == projectId);

//     if (foundProject) {
//       resolve(foundProject)
//     } else {
//       reject("Unable to find requested project");
//     }

//   });

// }


function getProjectById(projectId) {
  return Project.findAll({
    include: [Sector],
    where: {
      id: projectId,
    },
  })
    .then((projects) => {
      if (projects.length > 0) {
        return projects[0]; // Resolve with the first element of the array
      } else {
        return Promise.reject("Unable to find requested project");
      }
    })
    .catch((err) => Promise.reject(`Error retrieving project by ID: ${err}`));
}




// function getProjectsBySector(sector) {

//   return new Promise((resolve, reject) => {
//     let foundProjects = projects.filter(p => p.sector.toUpperCase().includes(sector.toUpperCase()));

//     if (foundProjects) {
//       resolve(foundProjects)
//     } else {
//       reject("Unable to find requested projects");
//     }
//   });

// }



function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`, // Case-insensitive match
      },
    },
  })
    .then((projects) => {
      if (projects.length > 0) {
        return projects;
      } else {
        return Promise.reject("Unable to find requested projects");
      }
    })
    .catch((err) => Promise.reject(`Error retrieving projects by sector: ${err}`));
}

// Edit an existing project
function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
      // Update the project where the id matches
      Project.update(projectData, {
          where: { id: id }
      })
      .then(() => resolve()) // Resolves if successful
      .catch((err) => reject(err.errors[0].message)); // Rejects with error message if any error occurs
  });
}


// Delete a project by its ID
function deleteProject(id) {
  return new Promise((resolve, reject) => {
    // SQL query to delete the project by ID
    const query = 'DELETE FROM projects WHERE id = ?';
    
    // Execute the query
    db.run(query, [id], function(err) {
      if (err) {
        return reject(err); // Reject the promise if there's an error
      }
      // Resolve the promise when the project is successfully deleted
      resolve();
    });
  });
}

module.exports = { initialize, getAllSectors, addProject, editProject, getAllProjects, getProjectById, getProjectsBySector, deleteProject }

