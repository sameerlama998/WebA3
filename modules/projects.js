require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

// Set up Sequelize to connect to the database
const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '7DYLoaf9jewh', {
  host: 'ep-morning-union-a5iyx2nn.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Define the Sector model
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

// Define the Project model
const Project = sequelize.define(
  'Project',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    Impact: Sequelize.TEXT, // Fix field name
    original_source_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize the database
function initialize() {
  return sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch((err) => Promise.reject(`Unable to sync database: ${err}`));
}

// Get all projects
function getAllProjects() {
  return Project.findAll({ include: [Sector] })
    .then((projects) => projects)
    .catch(() => Promise.reject("Unable to retrieve projects"));
}

// Get project by ID
function getProjectById(projectId) {
  return Project.findAll({
    where: { id: projectId },
    include: [Sector],
  })
    .then((projects) => {
      if (projects.length > 0) return projects[0]; // Return the first project
      return Promise.reject("Unable to find requested project");
    })
    .catch(() => Promise.reject("Unable to find requested project"));
}

// Get projects by sector
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`,
      },
    },
  })
    .then((projects) => {
      if (projects.length > 0) return projects;
      return Promise.reject("Unable to find requested projects");
    })
    .catch(() => Promise.reject("Unable to find requested projects"));
}

// Get all sectors
function getAllSectors() {
  return Sector.findAll()
    .then((sectors) => sectors)
    .catch(() => Promise.reject("Unable to retrieve sectors"));
}

// Add a new project
function addProject(projectData) {
  return Project.create(projectData)
    .then(() => Promise.resolve())
    .catch((err) => Promise.reject(`Error adding project: ${err}`));
}

// Edit an existing project
function editProject(projectId, projectData) {
  return Project.update(projectData, {
    where: { id: projectId },
  })
    .then(([affectedRows]) => {
      if (affectedRows > 0) {
        return Promise.resolve();
      } else {
        return Promise.reject("No project found to update");
      }
    })
    .catch((err) => Promise.reject(`Error updating project: ${err}`));
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject, // Export the editProject function
};
