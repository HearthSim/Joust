import {JoustClient} from "../interfaces";

class HSReplayClient implements JoustClient {

	isInteractive():boolean {
		return false;
	}


}

export default HSReplayClient;