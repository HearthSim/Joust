/// <reference path="../../typings/react/react-global.d.ts" />
/// <reference path="../interfaces.d.ts" />

namespace joust.components {
    export class Player extends React.Component<PlayerProps, {}> {
        public render() {
            return (
                <div>
                    <h1>Player</h1>
                    <Hero tags={[]} />
                    <HeroPower tags={[]} />
                </div>
            );
        }
    }
}