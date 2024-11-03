const projectData = require("./modules/projects");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

//route home page
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home", { page: "/" });
});

//route about page
app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about", { page: "/about" });
});


app.get("/solutions/projects", async (req, res) => {
  try {
    let projects;
    if (req.query.sector) {
      projects = await projectData.getProjectsBySector(req.query.sector);
    } else {
      projects = await projectData.getAllProjects();
    }
    // Pass the page variable along with the projects data
    res.render("projects", { projects: projects, page: "/solutions/projects" });
  } catch (err) {
    res.status(404).send(err);
  }
});


app.get("/solutions/projects/:id", async (req,res)=>{
  try{
    let project = await projectData.getProjectById(req.params.id);
    res.render("project", { project: project, page: `/solutions/projects/${req.params.id}` });  }catch(err){
    res.status(404).send(err);
  }
});

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
  res.status(404).render("404", { page: "" });

});


projectData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});