import Launcher from "./Launcher";
import {GameWidgetProps} from "./interfaces";

module.exports = {

	renderHSReplay: (target: string, url: string, opts?: GameWidgetProps) => {
		new Launcher(target).setOptions(opts).fromUrl(url);
	},

	launcher: (target: string | HTMLElement) => {
		return new Launcher(target);
	},

	release: (): string => {
		return JOUST_RELEASE;
	},

	destroy(target: any): void {
		Launcher.destroy(target);
	},
};
