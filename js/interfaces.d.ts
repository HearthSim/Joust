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

interface GameProps extends TaggedProps<any>, EntityListProps {

}

interface PlayerProps extends TaggedProps<any>, EntityListProps {

}

interface HeroProps extends TaggedProps<any> {

}

interface HeroPowerProps extends TaggedProps<any> {

}