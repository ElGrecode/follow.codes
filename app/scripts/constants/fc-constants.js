module.exports = {
    // Map a list of actions
    //todo: possibly register these actions not as view actions (look into)
    REGISTER_VAI : 'REGISTER_VAI',
    REGISTER_AUDIO : 'REGISTER_AUDIO',
    REGISTER_RECORDER : 'REGISTER_RECORDER',
    REGISTER_PLAYBACK_INTERVAL_IDS: 'REGISTER_PLAYBACK_INTERVAL_IDS',
    REGISTER_PLAYBACK_START_TIME : 'REGISTER_PLAYBACK_START_TIME',
    RECORDER_NOT_ALLOWABLE : 'RECORDER_NOT_ALLOWABLE',

    START_RECORDING_VIDEO : 'START_RECORDING_VIDEO',
    START_RECORDING_AUDIO : 'START_RECORDING_AUDIO',
    MAIN_PHASE_RECORDING : 'MAIN_PHASE_RECORDING',

    CODING_EVENT : 'CODING_EVENT',

    STOP_RECORDING_VIDEO : 'STOP_RECORDING_VIDEO',
    STOP_RECORDING_AUDIO : 'STOP_RECORDING_AUDIO',
    REGISTER_AUDIO_FILE : 'REGISTER_AUDIO_FILE',
    CREATE_VIDEO_FORMAT : 'CREATE_VIDEO_FORMAT',
    PLAYBACK_VIDEO : 'PLAYBACK_VIDEO',
    CURRENT_TICK : 'CURRENT_TICK',
    PLAYBACK_AUDIO : 'PLAYBACK_AUDIO',

    // Playback actions
    //PLAY_AUDIO : 'PAUSE_AUDIO'
    PAUSE_AUDIO : 'PAUSE_AUDIO',
    PAUSE_VIDEO : 'PAUSE_VIDEO',
    PAUSED_VIDEO_STATE : 'PAUSED_VIDEO_STATE',
    PAUSED_VIDEO_TIME : 'PAUSED_VIDEO_TIME'
    // PLAY_SCREENCAST
    // PAUSE_SCREENCAST
    // SAVE_SCREENCAST?



    //ADD_ITEM: 'ADD_ITEM',
    //REMOVE_ITEM: 'REMOVE_ITEM',
    //INCREASE_ITEM: 'INCREASE_ITEM',
    //DECREASE_ITEM: 'DECREASE_ITEM',




};
