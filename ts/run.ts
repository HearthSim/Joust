import Launcher from "./Launcher";
import {GameWidgetProps} from "./components/GameWidget";

export function renderHSReplay(target: string, url: string, opts?: GameWidgetProps) {
	new Launcher(target).setOptions(opts).fromUrl(url);
}

export function launcher(target: string | HTMLElement) {
	return new Launcher(target);
}

export function release(): string {
	return JOUST_RELEASE;
}

export function destroy(target: any): void {
	Launcher.destroy(target);
}
