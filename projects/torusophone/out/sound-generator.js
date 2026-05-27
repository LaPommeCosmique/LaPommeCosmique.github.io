
const DURATION_OF_TIME_STEP = 0.01 // every time step is 1/100 of a second

function interpolate(x, x0, x1, y0, y1) {
    return (y1 - y0) * (x - x0) / (x1 - x0) + y0
}
function log_interpolate(x, x0, x1, y0, y1) {
    return Math.exp(interpolate(x, x0, x1, Math.log(y0), Math.log(y1)))
}

function toneAt(tone, trackTimeStep) {
    if (tone.steps.length > 0 && tone.startTimeStep <= trackTimeStep && (tone.endTimeStep === null || tone.endTimeStep > trackTimeStep)) {
        let indexBefore = 0 // index of first step before current trackTimeStep
        let indexAfter = null // index of first step after current trackTimeStep
        for (const [index, step] of tone.steps.entries()) {
            if (step.timeStep > trackTimeStep) {
                indexAfter = index
                break
            } else {
                indexBefore = index
            }
        }
        if (indexAfter !== null) {
            return {
                frequency: log_interpolate(trackTimeStep, tone.steps[indexBefore].timeStep, tone.steps[indexAfter].timeStep, tone.steps[indexBefore].frequency, tone.steps[indexAfter].frequency),
                amplitude: log_interpolate(trackTimeStep, tone.steps[indexBefore].timeStep, tone.steps[indexAfter].timeStep, tone.steps[indexBefore].amplitude, tone.steps[indexAfter].amplitude),
            }
        } else {
            return { // index before is the last step
                frequency: tone.steps[indexBefore].frequency,
                amplitude: tone.steps[indexBefore].amplitude
            }
        }
    } else return null
}
function notesToTones(notes) {
    // converts TrackNotes to array of sound generator TrackTones
    // sound generator TrackTones have an id field, and an array of ToneSteps *ordered* in increasing timeStep 
    const tones = []
    notes.forEach(note => {
        const fundamentalStepOrdered = [
            // add step for base tone
            {
                ...note.fundamental.baseTone,
                timeStep: note.startTimeStep
            }, 
            // add steps // map step time to absolute (relative to track origin)
            ...note.fundamental.toneSteps.map(step => ({...step, timeStep: note.startTimeStep + step.timeStepOffset}))
        ].sort((stepA, stepB) => stepA.timeStep - stepB.timeStep) // order steps in increasing timeStep
            
        const fundamentalTone = {
            id: note.fundamental.id,
            startTimeStep: note.startTimeStep,
            endTimeStep: note.endTimeStep,
            steps: fundamentalStepOrdered
        }
        tones.push(fundamentalTone)

        note.partials.forEach(partial => {
            // order partials by time step
            const partialStepsOrdered = [
                // add step for base partial
                {
                    ...partial.basePartial,
                    timeStep: note.startTimeStep+(partial.startTimeStepOffset??0)
                }, 
                // add steps // map step time to absolute (relative to track origin)
                ...partial.partialSteps.map(step => ({...step, timeStep: note.startTimeStep + (partial.startTimeStepOffset??0) + step.timeStepOffset}))
            ].sort((stepA, stepB) => stepA.timeStep - stepB.timeStep) // order steps in increasing timeStep

            // since we are converting partialSteps to toneSteps, we need a step at each fundamental step and partial step
            let indexOfFundamental = 0
            let indexOfPartial = 0
            const partialToneStepsOrdered = []

            while (indexOfFundamental < fundamentalStepOrdered.length || indexOfPartial < partialStepsOrdered.length) {
                let timeStep = null, fundamentalAtTrackTimeStep = null, partialAtTrackTimeStep = null
                if (indexOfPartial >= partialStepsOrdered.length) { 
                    // no more partial steps
                    timeStep = fundamentalStepOrdered[indexOfFundamental].timeStep
                    fundamentalAtTrackTimeStep = fundamentalStepOrdered[indexOfFundamental]
                    partialAtTrackTimeStep = partialStepsOrdered[indexOfPartial - 1]
                    indexOfFundamental++
                } else if (indexOfFundamental >= fundamentalStepOrdered.length) {
                    // no more fundamental steps
                    timeStep = partialStepsOrdered[indexOfPartial].timeStep
                    fundamentalAtTrackTimeStep = fundamentalStepOrdered[indexOfFundamental - 1]
                    partialAtTrackTimeStep = partialStepsOrdered[indexOfPartial]
                    indexOfPartial++
                } else if (fundamentalStepOrdered[indexOfFundamental].timeStep == partialStepsOrdered[indexOfPartial].timeStep) {
                    // same time steps
                    timeStep = partialStepsOrdered[indexOfPartial].timeStep
                    fundamentalAtTrackTimeStep = fundamentalStepOrdered[indexOfFundamental]
                    partialAtTrackTimeStep = partialStepsOrdered[indexOfPartial]
                    indexOfFundamental++
                    indexOfPartial++
                } else if (fundamentalStepOrdered[indexOfFundamental].timeStep < partialStepsOrdered[indexOfPartial].timeStep) {
                    // add tone at fundamental step
                    timeStep = fundamentalStepOrdered[indexOfFundamental].timeStep
                    fundamentalAtTrackTimeStep = fundamentalStepOrdered[indexOfFundamental]
                    partialAtTrackTimeStep = indexOfPartial > 0 ? {
                        frequencyRatio: log_interpolate(timeStep, partialStepsOrdered[indexOfPartial - 1].timeStep, partialStepsOrdered[indexOfPartial].timeStep, partialStepsOrdered[indexOfPartial - 1].frequencyRatio, partialStepsOrdered[indexOfPartial].frequencyRatio),
                        amplitudeRatio: log_interpolate(timeStep, partialStepsOrdered[indexOfPartial - 1].timeStep, partialStepsOrdered[indexOfPartial].timeStep, partialStepsOrdered[indexOfPartial - 1].amplitudeRatio, partialStepsOrdered[indexOfPartial].amplitudeRatio),
                    } : partialStepsOrdered[indexOfPartial]
                    indexOfFundamental++
                } else { // fundamentalStepOrdered[indexOfFundamental].timeStep > partialStepsOrdered[indexOfPartial].timeStep
                    // add tone at partial step
                    timeStep = partialStepsOrdered[indexOfPartial].timeStep
                    fundamentalAtTrackTimeStep = toneAt(fundamentalTone, partialStepsOrdered[indexOfPartial].timeStep)
                    partialAtTrackTimeStep = partialStepsOrdered[indexOfPartial]
                    indexOfPartial++
                }
                if (
                    timeStep >= note.startTimeStep+(partial.startTimeStepOffset??0)
                    && (partial.endTimeStepOffset === null || timeStep <= note.startTimeStep+(partial.endTimeStepOffset??0))
                ) {
                    partialToneStepsOrdered.push({
                        timeStep: timeStep,
                        frequency: (fundamentalAtTrackTimeStep?.frequency ?? 0) * partialAtTrackTimeStep.frequencyRatio,
                        amplitude: (fundamentalAtTrackTimeStep?.amplitude ?? 0) * partialAtTrackTimeStep.amplitudeRatio
                    })
                }
            }
            const partialTone = {
                id: partial.id,
                startTimeStep: note.startTimeStep+(partial.startTimeStepOffset??0),
                endTimeStep: (partial.endTimeStepOffset && (note.startTimeStep+partial.endTimeStepOffset)) ?? note.endTimeStep,
                steps: partialToneStepsOrdered
            }
            tones.push(partialTone)
        })
    })
    return tones
}

class SoundGenerator extends AudioWorkletProcessor {
    constructor() {
        super()
        this.tones = null
        this.trackTimeStep = null
        this.timeStepLimit = null
        this.playbackMode = "FIXED" // can be FIXED or LIVE
        this.playbackStarted = false // to signal when live playback has started
        this.phaseMap = new Map()
        this.port.onmessage = (event) => {
            const message = event.data
            // TODO send state of audiocontext (suspended, unpaused)
            switch (message.type) {
                case "NOTES-UPDATE": {
                    this.tones = notesToTones(message.notes)
                    // iterate through partials, add corresponding phase if it does not exist
                    this.tones.forEach(tone => {
                        if (!this.phaseMap.has(tone.id))
                            this.phaseMap.set(tone.id, 0)
                    })
                    // iterate through phase map, remove phases of things that don't exist
                    const currentIds = this.tones.map(tone => tone.id)
                    this.phaseMap.keys().forEach(id => {
                        if (!currentIds.some(currentId => currentId == id)) {
                            this.phaseMap.delete(id)
                        }
                    })
                    break
                }
                case "PLAYBACK-STATE-UPDATE": {
                    const state = message.state
                    if (
                        state.playbackMode == "FIXED" 
                        || (state.playbackMode == "LIVE" && (!state.playing || state.playbackLiveFixed))
                    ) {
                        this.playbackMode = "FIXED"
                        this.trackTimeStep = state.timeStep
                        if (state.playing && state.startTime !== null) {
                            this.playbackStarted = true
                        } else this.playbackStarted = false
                    } else {
                        this.playbackMode = "LIVE"
                        if (state.startTime === null) {
                            this.trackTimeStep = state.startTimeStep
                            this.playbackStarted = false
                        } else {
                            this.trackTimeStep = state.startTimeStep + (Date.now() - state.startTime) / 1000 / DURATION_OF_TIME_STEP
                            this.playbackStarted = true
                        }                        
                    }
                    if (this.timeStepLimit) this.trackTimeStep %= this.timeStepLimit
                    break
                }
                case "TRACK-STATE-UPDATE": {
                    this.timeStepLimit = message.timeStepLimit
                    if (this.trackTimeStep) this.trackTimeStep %= this.timeStepLimit
                    break
                }
            }
            // console.log(this.playbackMode)
        }
    }
    
    get_max_displacement(tones=this.tones) { return tones?.reduce(((a, tone) => a + tone.amplitude), 0) ?? 0 }
    get_max_potential_displacement(tones=this.tones) { return tones.length }
    get_displacement_and_update_phase_map(tones=this.tones, phaseMap=this.phaseMap, trackTimeStep=this.trackTimeStep) {
        return tones?.reduce(((displacement, tone) => {
            const toneAtTrackTime = toneAt(tone, trackTimeStep)
            if (toneAtTrackTime) {
                displacement += toneAtTrackTime.amplitude*Math.sin(phaseMap.get(tone.id))
                phaseMap.set(tone.id, phaseMap.get(tone.id) + 2*Math.PI*toneAtTrackTime.frequency/sampleRate)
            }
            return displacement
        }), 0) ?? 0
    }
    update_phase_map(numSamples) {
        this.tones.forEach(tone => {
            this.phaseMap.set(tone.id, this.phaseMap.get(tone.id) + 2*Math.PI*tone.frequency*numSamples/sampleRate)
        })
    }
    process(inputs, outputs) {
        if (!this.playbackStarted) {
            this.port.postMessage({ type: "PLAYBACK-START", time: Date.now() })
            this.playbackStarted = true
        }

        const output = outputs[0];
        const numSamples = output[0].length;
    
        // const amplitude_scale = 1 / Math.max(1, this.get_max_displacement())
        const amplitude_scale = 1/10
        // const amplitude_scale = 1 / Math.max(1, this.get_max_potential_displacement())
        for (let i = 0; i < numSamples; i++) {
            let v = this.get_displacement_and_update_phase_map() * amplitude_scale
            output.forEach((channel) => channel[i] = v)
            if (this.playbackMode == "LIVE") {
                this.trackTimeStep += 1/sampleRate/DURATION_OF_TIME_STEP
                if (this.trackTimeStep > this.timeStepLimit) this.trackTimeStep %= this.timeStepLimit
            }
        }

        return true;
    }
}

registerProcessor('sound-generator', SoundGenerator);