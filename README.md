
# Gobelins M1 Webgl Project 
Based on [our Threejs webpack starter](https://github.com/BoomPowbep/three-starter).
School project
  
## Setting up  
First, install dependencies.  
  
    npm i  

## Run  
#### Watch for development  

    npm run dev  

#### Build for production  

    npm run prod  

## Structure
 - **public** - This is the content to push on the production server.
	 - **build**	-  Content inside is generated by the compiler (js & css).
	 - *index.html* - This is the one to edit. Canvas for 3D is automatically appended by js.
	 - *favicon.ico* - Yes.
 - **src** - Logic & style.
	 - **js** - Javascript (you bet).
		 - **Game** - Contains the game logic and engine-specific components managers.
		 - *App.js* - Instantiates Game.
		 - *main.js* - Application entry point. Instantiates App.
	 - **scss** - SCSS (no way :o).
		 - **main** - Our styling.
		 - **resources** - Fonts, breakpoints, mixins, ...
		 - *style.scss* - Style entry point.
