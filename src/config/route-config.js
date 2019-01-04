const logger = require('morgan');
const userRoutes = require("../routes/users");

 module.exports =  {
    init(app){
      const staticRoutes = require("../routes/static");
      app.use(staticRoutes);
      app.use(userRoutes);       
      app.use(logger('dev'));
    }
}