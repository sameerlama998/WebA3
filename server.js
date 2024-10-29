const express = require('express');
const projectData = require("./modules/projects");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));


projectData.initialize()
    .then(() => {
        // Routes
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'home.html'));
        });

        app.get('/about', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'about.html'));
        });

        app.get('/solutions/projects', (req, res) => {
            const sector = req.query.sector;
            if (sector) {
                projectData.getProjectsBySector(sector)
                    .then(projects => res.json(projects))
                    .catch(err => res.status(404).send(err));
            } else {
                projectData.getAllProjects()
                    .then(projects => res.json(projects))
                    .catch(err => res.status(500).send(err));
            }
        });


        app.get('/solutions/projects/:id', (req, res) => {
          
            const projectId = parseInt(req.params.id, 10); // Convert the ID parameter to an integer
            projectData.getProjectById(projectId) // Fetch the project data by ID
                .then(project => {
                    if (project) {
                        res.json(project); // Send the project data as JSON if found
                    } else {
                        res.status(404).send('Project not found'); // Send a 404 error if the project does not exist
                    }
                })
                .catch(err => res.status(404).send(err)); // Send a 500 error if there is an issue with the server
        });
        
        
        app.get('/solutions/projectsBySector/:name', (req, res) => {
            projectData.getProjectsBySector(req.params.name) // Use the project ID to fetch the project data
                .then(project => {
                    if (project) {
                        res.json(project); // Return the project data as JSON
                    } else {
                        res.status(404).send('Project not found'); // Handle case where project doesn't exist
                    }
                })
                .catch(err => res.status(404).send(err)); // Catch any errors and send a 404 status
        });

   

        // Custom 404 page handler
        app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize project data:", err);
    });
