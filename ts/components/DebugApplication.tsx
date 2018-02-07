import * as React from "react";
import SetupWidget from "./SetupWidget";
import GameWidget from "./GameWidget";
import HearthstoneJSON, { CardData } from "hearthstonejson-client";
import {InteractiveBackend, MulliganOracle, CardOracle} from "../interfaces";
import GameStateSink from "../state/GameStateSink";
import GameStateScrubber from "../state/GameStateScrubber";
import * as _ from "lodash";

const enum Widget {
	SETUP,
	GAME
}

interface DebugState {
	currentWidget?: Widget;
	cards?: CardData[];
	sink?: GameStateSink;
	scrubber?: GameStateScrubber;
	interaction?: InteractiveBackend;
	cardOracle?: CardOracle;
	mulliganOracle?: MulliganOracle;
	locale?: string;
	replayBlob?: Blob;
	replayFilename?: string;
}


interface DebugProps extends React.ClassAttributes<DebugApplication> {
	replay?: string;
}

export default class DebugApplication extends React.Component<DebugProps, DebugState> {

	private gameWidget: GameWidget;
	private hsjson: HearthstoneJSON;

	constructor(props:DebugProps) {
		super(props);
		this.state = {
			currentWidget: Widget.SETUP,
			cards: null,
			sink: null,
			interaction: null,
			scrubber: null,
			cardOracle: null,
			mulliganOracle: null,
			locale: "enUS",
			replayBlob: null,
			replayFilename: null
		};
	}

	public componentDidMount() {
		this.loadLocale(this.state.locale);
	}

	public render(): JSX.Element {
		let widget: JSX.Element = null;
		const { replay } = this.props
		switch (this.state.currentWidget) {
			case Widget.SETUP:
				widget = <SetupWidget defaultHostname="localhost" defaultPort={9111} autoloadReplay={replay}
									onSetup={this.onSetup.bind(this) } />;
				break;
			case Widget.GAME:
				widget =
					<GameWidget
						sink={this.state.sink}
						startupTime={0}
						interaction={this.state.interaction}
						scrubber={this.state.scrubber}
						exitGame={this.exitGame.bind(this) }
						cardOracle={this.state.cardOracle}
						mulliganOracle={this.state.mulliganOracle}
						assetDirectory={(asset: string) => "./assets/" + asset}
						cardArtDirectory={navigator.onLine || typeof navigator.onLine === "undefined" ? (cardId) => "https://art.hearthstonejson.com/v1/256x/" + cardId + ".jpg" : null}
						enableKeybindings={true}
						ref={this.onMountGameWidget.bind(this)}
						locale={this.state.locale}
						selectLocale={(locale: string, cb: () => void) => {
							this.loadLocale(locale, cb);
						}}
						replayBlob={this.state.replayBlob}
						replayFilename={this.state.replayFilename}
					/>;
				break;
		}

		return (
			<div className="joust">
				{widget}
				<footer>
					<p>
						Not affiliated with Blizzard. Get Hearthstone at <a
						href="battle.net/hearthstone/">Battle.net</a>.
					</p>
				</footer>
			</div>
		);
	}

	public onMountGameWidget(widget: GameWidget) {
		this.gameWidget = widget;
		if (widget && this.state.cards) {
			this.gameWidget.setCards(this.state.cards);
		}
	}

	public componentDidUpdate(prevProps: any, prevState: DebugState): void {
		if (!_.isEqual(prevState.cards, this.state.cards) && this.gameWidget) {
			this.gameWidget.setCards(this.state.cards);
		}
	}

	protected onSetup(sink: GameStateSink, replayBlob: Blob, replayFilename: string, interaction?: InteractiveBackend, scrubber?: GameStateScrubber, cardOracle?: CardOracle, mulliganOracle?: MulliganOracle): void {
		this.setState({
			currentWidget: Widget.GAME,
			sink: sink,
			interaction: interaction,
			scrubber: scrubber,
			cardOracle: cardOracle,
			mulliganOracle: mulliganOracle,
			replayFilename,
			replayBlob
		});
	}

	protected loadLocale(locale: string, cb?: () => void) {
		if (!this.hsjson) {
			this.hsjson = new HearthstoneJSON();
		}
		this.setState({
			locale: locale,
		});
		this.hsjson.getLatest(locale).then((cards: CardData[]) => {
			this.setState({
				cards: cards,
			});
			cb && cb();
		});
	}

	protected exitGame() {
		this.state.sink.end();
		if (this.state.interaction) {
			this.state.interaction.exitGame();
		}
		this.setState({
			currentWidget: Widget.SETUP,
			sink: null,
			interaction: null,
			scrubber: null,
			cardOracle: null,
			mulliganOracle: null,
		});
	}
}
