import Game from './Game/Game';

class App {
    constructor() {
        console.log('🏗 App constructor');

        this.game = new Game(false);
    }

    init() {

    }
}

export default App;
