import useCaller from '../hooks/useCallee.js'

const Caller = () => {

    useCaller()
    return (
          <main>
            <section className="connections">
                    <div id="selectSource" className="hidden">
                        <div id="select">Select an audio &amp; video source, then click <strong>Get media</strong>:</div>
                        <div className="source">
                            <label htmlFor="audioSrc">Audio source:</label>
                            <select id="audioSrc"></select>
                        </div>
                        <div className="source">
                            <label htmlFor="videoSrc">Video source:</label>
                            <select id="videoSrc"></select>
                        </div>
                    </div>
                    <div id="buttons">
                        
                        <button id="getMedia">Get media</button>
                        <button id="createPeerConnection" disabled>Create peer connection</button>
                        <button id="createOffer" disabled>Create offer</button>
                        <button id="setOffer" disabled>Set offer</button>
                       
                      
                    </div>
                    <div id="preview">
                        <div id="local">
                                <h2>Local</h2>
                                <video playsInline autoPlay muted></video>
                                <h2>Offer SDP</h2>
                                <textarea></textarea>
                                <br>
                                </br>
                        </div>
                    
                    <div id="remote">
                        <h2>Remote</h2>
                        <video playsInline autoPlay></video>
                        <h2>Answer SDP</h2>
                        <textarea></textarea>
                    </div>
                    </div>
            </section>
        </main>
    )
}

export default Caller
