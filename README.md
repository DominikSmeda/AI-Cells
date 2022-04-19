# AI-Cells
Implementing Intelligent Agents with Neural Network

UPDATE: Currently working on implementing better solution for learning AI with posibbility to conrol speed (curently it drives to slow). So default code is set to constant speed and learning to drive should take less than 15 generations.

You will need:
- MongoDB Server on your machine listening on default port (27017)
- Node.js 
- Npm

Startup Guide:
- Go to server directory and install depenancies (only first time) with command: npm install 
- Start server with command: node app.js
- Go to root directory and open mapGenerator.html and generate Map (don't forget the name)
- Open index.html in firefox browser or any other with VSCode Extension Live Server due to serving files security issue
- click settings icon to load map or Saved DNAs 
- open browser console and start typing commands or pressing proper keys on keyboard

Browser Console Commands:
    
> setMutationRate(rate) - 1 for 100% probability 0.5 50% etc. You probably shouldn't use value   higher than 0.05, If Agents stuck on the way try to increase rate, but when they are good try to reduce it even to the value 0.00001 or less

> setPopulationQuantity(quantity) - How many agents per generation

> saveBest(name) - saves the best DNAs from current generation so you can load them from the Settings Icon (Refresh Needed?)

Keyboard:
> [ Space ] - Run next generation and stops auto run 

> [ Enter ] - Auto run next Generations in (12s interval)

> [ Backspace ] - Stops Auto run