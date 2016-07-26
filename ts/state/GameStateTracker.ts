import GameState from "./GameState";
import * as Stream from "stream";
import GameStateMutator from "./GameStateMutator";
import PushDescriptorMutator from "./mutators/PushDescriptorMutator";
import IncrementTimeMutator from "./mutators/IncrementTimeMutator";
import {GameTag, BlockType, Step, MetaDataType} from "../enums";
import PopDescriptorMutator from "./mutators/PopDescriptorMutator";
import SetChoicesMutator from "./mutators/SetChoicesMutator";
import EnrichDescriptorMutator from "./mutators/EnrichDescriptorMutator";
import SetOptionsMutator from "./mutators/SetOptionsMutator";
import TagChangeMutator from "./mutators/TagChangeMutator";

class GameStateTracker extends Stream.Transform {

	public gameState:GameState;

	constructor(initialGameState?:GameState, opts?:Stream.TransformOptions) {
		opts = opts || {};
		opts.objectMode = true;
		super(opts);
		this.gameState = initialGameState || new GameState(undefined, undefined, undefined, undefined, 0);
		this.mulliganChoicesSeen = 0;
		this.upcomingMetadataTargets = [];
	}

	_transform(mutator:any, encoding:string, callback:Function):void {
		var oldState = this.gameState;
		this.gameState = this.gameState.apply(mutator);
		if (oldState !== this.gameState) {
			this.push(this.gameState);
			this.time(mutator as GameStateMutator);
		}
		callback();
	}

	private waitAtNextBlockOrEndOfBlock:boolean;
	private mulliganChoicesSeen:number;
	private lastDescriptorEntityId:number;
	private lastDescriptorType:BlockType;
	private upcomingMetadataTargets:number[];
	private hasSteppedThisBlock:boolean;

	protected time(mutator:GameStateMutator) {
		let postStep = 0;
		let step = this.gameState.game ? this.gameState.game.getTag(GameTag.STEP) : Step.INVALID;

		// main action timing
		if (this.waitAtNextBlockOrEndOfBlock && (mutator instanceof PopDescriptorMutator || mutator instanceof PushDescriptorMutator)) {
			postStep = 2;
			this.waitAtNextBlockOrEndOfBlock = false;
		}

		if (mutator instanceof PushDescriptorMutator) {
			this.lastDescriptorEntityId = mutator.descriptor.entityId;
			this.lastDescriptorType = mutator.descriptor.type;
			switch (mutator.descriptor.type) {
				case BlockType.PLAY:
					this.waitAtNextBlockOrEndOfBlock = true;
					break;
				case BlockType.TRIGGER:
					if (!postStep) {
						if (mutator.descriptor.entityId > 3) {
							// normal entity triggers
							postStep = 1;
						}
						else {
							switch (step) {
								case Step.MAIN_START:
									// before card is drawn
									postStep = 1;
									break;
								case Step.MAIN_ACTION:
									// after card is drawn
									postStep = 2;
									break;
							}
						}
					}
					break;
				case BlockType.ATTACK:
					// before attack hits
					postStep = 1;
					break;
				case BlockType.POWER:
					if (!postStep) {
						postStep = 1;
					}
					break;
				default:
					if (!postStep) {
						postStep = 1.5;
					}
					break;
			}
		}

		if (mutator instanceof PopDescriptorMutator) {
			if (!postStep) {
				if (this.lastDescriptorEntityId > 3) {
					if(this.lastDescriptorType === BlockType.TRIGGER) {
						postStep = 1;
					}
					else if(!this.hasSteppedThisBlock) {
						postStep = 2;
						this.hasSteppedThisBlock = true;
					}
				}
			}
			if (this.upcomingMetadataTargets.length) {
				this.upcomingMetadataTargets = [];
			}
			this.lastDescriptorType = this.gameState.descriptor ? this.gameState.descriptor.type : null;
		}

		// damage hits/healing
		if (mutator instanceof EnrichDescriptorMutator) {
			let targets = mutator.metaData.entities.toArray();
			if (this.lastDescriptorType !== BlockType.ATTACK) {
				// attack pauses are handled in diffs
				if (mutator.metaData.type === MetaDataType.TARGET) {
					this.upcomingMetadataTargets = _.merge(this.upcomingMetadataTargets, targets);
				}
				if (mutator.metaData.type === MetaDataType.DAMAGE || mutator.metaData.type === MetaDataType.HEALING) {
					this.upcomingMetadataTargets = _.difference<number>(this.upcomingMetadataTargets, targets);
					if (!this.upcomingMetadataTargets.length) {
						// once all targets have received their damage value, we step
						this.hasSteppedThisBlock = true;
						postStep = targets.length > 1 ? 2 : 1;
					}
				}
			}
		}

		// attack and stuff
		if (mutator instanceof TagChangeMutator) {
			if (this.lastDescriptorType === BlockType.ATTACK) {
				if (mutator.tag === GameTag.PROPOSED_DEFENDER && mutator.value === 0) {
					postStep = 1;
				}
			}
		}

		// step when playable options are available
		if (mutator instanceof SetOptionsMutator) {
			postStep = 0;
		}

		// step when choices are set
		if (mutator instanceof SetChoicesMutator) {
			if (step === Step.BEGIN_MULLIGAN) {
				this.mulliganChoicesSeen++;
				if (this.mulliganChoicesSeen >= 2) {
					// mulligan step
					postStep = 6;
				}
			}
			else {
				// discover step
				postStep = 4;
			}
		}

		if (postStep) {
			this.gameState = this.gameState.apply(new IncrementTimeMutator(postStep));
		}
	}
}

export default GameStateTracker;
