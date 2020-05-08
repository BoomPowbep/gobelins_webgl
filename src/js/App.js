import Game from './Game/Game';

class App {
    constructor() {
        console.log('🏗 App constructor');

        this.game = new Game(true);
    }

    init() {

    }
}

export default App;
