require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');


const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

// Initialize projects with sectors
function initialize() {
  return new Promise((resolve, reject) => {
    projectData.forEach(projectElement => {
      let projectWithSector = {
        ...projectElement,
        sector: sectorData.find(sectorElement => sectorElement.id == projectElement.sector_id).sector_name
      };
      projects.push(projectWithSector);
    });
    resolve();
  });
}

// Get all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    resolve(projects);
  });
}

// Get project by ID
function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    let foundProject = projects.find(p => p.id == projectId);
    if (foundProject) {
      resolve(foundProject);
    } else {
      reject("Unable to find requested project");
    }
  });
}

// Get projects by sector
function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    let foundProjects = projects.filter(p => p.sector.toUpperCase().includes(sector.toUpperCase()));
    if (foundProjects.length > 0) {
      resolve(foundProjects);
    } else {
      reject("Unable to find requested projects");
    }
  });
}

// Get all sectors
function getAllSectors() {
  return new Promise((resolve, reject) => {
    resolve(sectorData);
  });
}

// Add a new project
function addProject(projectData) {
  return new Promise((resolve, reject) => {
    try {
      // Assuming sector_id is included in projectData to link to a sector
      let sector = sectorData.find(s => s.id == projectData.sector_id);
      if (!sector) {
        return reject("Invalid sector ID");
      }

      // Create a new project object
      let newProject = {
        id: projects.length + 1,  // Example ID generation
        ...projectData,
        sector: sector.sector_name
      };
      projects.push(newProject);
      resolve();
    } catch (err) {
      reject("Error adding project: " + err);
    }
  });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector, getAllSectors, addProject };
