
const projectData = require("./modules/projects");
const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// About route
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /solutions/projects
app.get("/solutions/projects", async (req, res) => {
  try {
    if (req.query.sector) {
      const projects = await projectData.getProjectsBySector(req.query.sector);
      res.render("projects", { projects });
    } else {
      const projects = await projectData.getAllProjects();
      res.render("projects", { projects });
    }
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// GET /solutions/projects/:id - Display a single project by ID
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id);
    res.render("project", { project });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// Route to display the Add Project form
app.get("/solutions/addProject", async (req, res) => {
  try {
    const sectors = await projectData.getAllSectors();
    res.render("addProject", { sectors });
  } catch (err) {
    res.status(500).render("500", { message: `Error: ${err}` });
  }
});


app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectData.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.status(500).render("500", { message: `Error: ${err}` });
  }
});


app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const project = await projectData.getProjectById(req.params.id); // Fetch the project by ID
    const sectors = await projectData.getAllSectors(); // Fetch all sectors
    res.render("editProject", { project, sectors }); // Pass data to the EJS template
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

app.post("/solutions/editProject", async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      intro_short: req.body.intro_short,
      impact: req.body.impact,
      original_source_url: req.body.original_source_url,
      feature_img_url: req.body.feature_img_url,
      sector_id: req.body.sector_id
    };
    await projectData.editProject(req.body.id, projectData); 
    res.redirect("/solutions/projects");
  } catch (err) {
    res.status(500).render("500", { message: `Error: ${err}` });
  }
});


app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

// Initialize project data and start server
projectData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error initializing database: ${err}`);
  });
