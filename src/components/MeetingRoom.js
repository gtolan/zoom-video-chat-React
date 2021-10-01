

const MeetingRoom = () => {
    return (
        <main>
            <section className="connections">
                    <div id="preview">
                        <div id="local">
                                <h2>Local</h2>
                                <video playsinline autoplay muted></video>
                                <h2>Offer SDP</h2>
                                <textarea></textarea>
                                <br>
                                </br>
                        </div>
                    </div>
                    <div id="remote">
                        <h2>Remote</h2>
                        <video playsinline autoplay></video>
                        <h2>Answer SDP</h2>
                        <textarea></textarea>
                    </div>
            </section>
        </main>
    )
}

export default MeetingRoom
