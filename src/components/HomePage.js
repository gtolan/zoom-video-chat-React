import '../styles/HomePage.scss';

const HomePage = () => {
    const inputChanged = () => {
            console.log('input changed')
    }

    return (
        <main className="homepage">
            <section>
                
                    <p className="title">Meeting ID or Personal Link Name</p>
                    <form>
                        <input type="text" name="meeting-code" onChange={inputChanged} placeholder="Enter Meeting ID or Personal Link Name"/>
                        <p className="meeting-terms">
                            By clicking "Join", you agree to our Terms of Services and Privacy Statement
                        </p>
                        <button className="submit" type="submit" disabled>
                            Join
                        </button>
                    </form>
            </section>
        </main>
    )
}

export default HomePage
