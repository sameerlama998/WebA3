const projectData = require("./modules/projects");

const express = require('express');
const app = express();
// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/solutions/projects", async (req,res)=>{

  try{
    if(req.query.sector){
      let projects = await projectData.getProjectsBySector(req.query.sector);
      (projects.length > 0) ? res.render("projects", {projects: projects}) : res.status(404).render("404", {message: `No projects found for sector: ${req.query.sector}`});
  
    }else{
      let projects = await projectData.getAllProjects();
      res.render("projects", {projects: projects});
    }
  }catch(err){
    res.status(404).render("404", {message: err});
  }

});

app.get("/solutions/projects/:id", async (req,res)=>{
  try{
    let project = await projectData.getProjectById(req.params.id);
    res.render("project", {project: project})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});


// Serve Add Project Page
app.get("/solutions/addProject", async (req, res) => {
  try {
    let sectorData = await projectData.getAllSectors();
    res.render("addProject", { sectors: sectorData });
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

// Get Edit Project Page
app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    const sectors = await projectData.getAllSectors();
    res.render("editProject", { project: project, sectors: sectors });
  } catch (err) {
    res.status(500).render("500", { message: `Error fetching project: ${err.message}` });
  }
});

app.post('/solutions/editProject/:id', (req, res) => {
  const projectId = req.params.id;
  const updatedProjectData = req.body; // Assuming the updated project data comes from the form submission
  
  editProject(projectId, updatedProjectData)
      .then(() => {
          res.redirect(`/solutions/projects/${projectId}`); // Redirect to the updated project page (or wherever)
      })
      .catch((error) => {
          res.status(500).send(`Error updating project: ${error}`); // Send an error message if the update fails
      });
});

// Handle Form Submission for Adding a Project
app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectData.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});


// Delete Project Route
app.get('/solutions/deleteProject/:id', (req, res) => {
  const projectId = req.params.id;
  
  projectData.deleteProject(projectId)
    .then(() => {
      // Redirect to the projects page if successful
      res.redirect('/solutions/projects');
    })
    .catch((err) => {
      // Render the error page if deletion fails
      res.status(500).render('500', { message: `Error deleting project: ${err.message}` });
    });
});

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});