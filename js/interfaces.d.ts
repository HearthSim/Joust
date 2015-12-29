/// <reference path="../typings/react/react-global.d.ts"/>
/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

interface EntityListProps {
	entities: Immutable.Map<number, Joust.Entity>;
}

interface EntityProps {
	entity: Joust.Entity;
}

interface JoustState {
	gameState: Joust.GameState;
}

interface TwoPlayerGameProps extends EntityProps, React.Props<any> {
	player1: Joust.Entity;
	player2: Joust.Entity;
	entities: Immutable.Map<number, Immutable.Map<number, Immutable.Map<number, Joust.Entity>>>;
}

interface PlayerProps extends EntityProps, React.Props<any> {
	entities: Immutable.Map<number, Immutable.Map<number, Joust.Entity>>;
}

interface HeroProps extends EntityProps, React.Props<any> {

}

interface HeroPowerProps extends EntityProps, React.Props<any> {

}