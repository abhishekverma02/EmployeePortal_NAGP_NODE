Frontend - ejs template engine
Backend - nodejs, express
DataBase - mongodb

DataBase Design:

We have used 2 collection:
1. User - which stores username, password, isManager (boolean)
2. Opening - which stores projectname, 
                        clientname, 
                        technologies, 
                        role, 
                        jobdescription, 
                        status, 
                        createdby(of type user to track which manager created this opening), 
                        applicatant(of type user to track employs who have applied for this opening), 
                        dateadded, 
                        datemodified 

Used passport for authentication and we return jwt token for every successfull login

All the API are well implemented in this project as required for Employ Portal.





