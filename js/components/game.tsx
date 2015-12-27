/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />

namespace joust.components {
    export class Game extends React.Component<GameProps, GameState> {

        constructor(props : GameProps){
            super(props);
            // set initial state
            this.state = { entities: [], options: [] };
        }

        public render() {
            return (
                <div>
                    <Player tags={[]} />
                    <EndTurnButton />
                    <Player tags={[]} />
                </div>
            );
        }
    }
}