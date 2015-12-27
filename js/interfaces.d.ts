/// <reference path="../typings/react/react-global.d.ts" />


interface GameState {
    entities: Array<joust.Entity>;
    options: Array<joust.Option>;
}

interface TaggedProps<T> extends React.Props<T> {
    tags: Array<joust.Tag>;
}

interface EntityListProps {
    entities: Array<joust.Entity>;
}

interface GameProps extends TaggedProps<any>, EntityListProps {

}

interface PlayerProps extends TaggedProps<any> {

}

interface HeroProps extends TaggedProps<any> {

}

interface HeroPowerProps extends TaggedProps<any> {

}