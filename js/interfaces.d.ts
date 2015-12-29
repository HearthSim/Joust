/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

interface TaggedProps<T> extends React.Props<T> {
    tags: Immutable.Map<number, number>;
}

interface EntityListProps {
    entities: Immutable.Seq<number, Joust.Entity>;
}

interface JoustState {
    gameState: Joust.GameState;
}

interface TwoPlayerGameProps extends TaggedProps<any>, EntityListProps {
    player1: Joust.Entity;
    player2: Joust.Entity;
}

interface PlayerProps extends TaggedProps<any>, EntityListProps {

}

interface HeroProps extends TaggedProps<any> {

}

interface HeroPowerProps extends TaggedProps<any> {

}