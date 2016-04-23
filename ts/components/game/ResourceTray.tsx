import * as React from "react";
import {GameTag} from "../../enums";
import PlayerEntity from "../../Player";
import {AssetDirectoryProps} from "../../interfaces"

interface ResourceTrayProps extends AssetDirectoryProps, React.Props<any> {
	player: PlayerEntity;
}

class ResourceTray extends React.Component<ResourceTrayProps, {}> {

	public render(): JSX.Element {
		var crystals = [];
		let resources = this.props.player.getTag(GameTag.RESOURCES) + this.props.player.getTag(GameTag.TEMP_RESOURCES);
		let available = resources - this.props.player.getTag(GameTag.RESOURCES_USED);
		let locked = this.props.player.getTag(GameTag.OVERLOAD_LOCKED);
		var crystalStyle = {};
		crystalStyle['width'] = 100 / resources +'%';
		for (let i = 0; i < this.props.player.getTag(GameTag.MAXRESOURCES); i++) {
			var crystalClassNames = ['crystal'];
			if (i < available) {
				crystalClassNames.push('full');
			}
			else if (i < resources) {
				if (i >= resources - locked) {
					crystalClassNames.push('locked');
				}
				else {
					crystalClassNames.push('empty');
				}
			}
			else {
				crystalClassNames.push('hidden');
			}
			crystals.push(<img src={this.props.assetDirectory + 'images/mana_crystal.png'} key={i} className={crystalClassNames.join(' ')} style={crystalStyle}/>);
		}
		return	<div className="tray">
					<span>{available}/{resources}</span>
					<div className="crystals">
						{crystals}
					</div>
				</div>;
	}
}

export default ResourceTray;
