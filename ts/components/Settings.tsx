import * as React from "react";
import LocaleSelector from "./LocaleSelector";

interface SettingsProps extends React.ClassAttributes<Settings> {
	locale: string;
	onSelectLocale?: (locale: string, loaded?: () => void) => void;
	isLogVisible: boolean;
	replayBlob?: Blob;
	replayFilename?: string;
	onToggleLog: () => void;
	onClose?: () => void;
}

export default class Settings extends React.Component<SettingsProps> {

	protected downloadXML() {
		const { replayBlob, replayFilename } = this.props
		const blobURL = window.URL.createObjectURL(replayBlob);
		const tempLink = document.createElement('a');
		tempLink.style.display = 'none';
		tempLink.href = blobURL;
		tempLink.setAttribute('download', replayFilename);
		if (typeof tempLink.download === 'undefined') {
			tempLink.setAttribute('target', '_blank');
		}
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(blobURL);
	}

	public render(): JSX.Element {
		const release = JOUST_RELEASE;

		return (
			<div className="joust-scrubber-settings">
				{this.props.onClose &&
				<header>
					<span>Settings</span>
					<a title="Close" onClick={() => this.props.onClose()}>&times;</a>
				</header>}
				<section>
					<label>
						<span>Card Language:</span>
						<LocaleSelector
							locale={this.props.locale}
							selectLocale={(locale: string, loaded?: () => void) => this.props.onSelectLocale(locale, loaded)}
							disabled={!this.props.onSelectLocale}
						/>
					</label>
				</section>
				<section>
					<label className="joust-scrubber-settings-checkbox">
						<input
							type="checkbox"
							checked={this.props.isLogVisible}
							onChange={(e) => this.props.onToggleLog()}
						/>
						<span>Show Event Log</span>
					</label>
				</section>
				{this.props.replayBlob &&
					<section>
						<a onClick={() => this.downloadXML()}>Download XML</a>
					</section>
				}
				<footer>
					<a href="https://github.com/HearthSim/Joust/issues" target="_blank">Report Issue</a>
					<a href="https://hearthsim.info/joust/" target="_blank" title={release ? "Joust " + release : null}>About</a>
				</footer>
			</div>
		);
	}
}
