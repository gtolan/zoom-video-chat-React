import '../styles/HomePage.scss';

const HomePage = () => {
    const inputChanged = () => {
            console.log('input changed')
    }

    return (
        <main className="homepage">
            <section>
                <form>
                    <p className="title">Meeting ID or Personal Link Name</p>
                    <input type="text" name="meeting-code" onChange={inputChanged} placeholder="Enter Meeting ID or Personal Link Name"/>
                    <button className="submit" type="submit" disabled>
                        Join
                    </button>
                </form>
            </section>
        </main>
    )
}

export default HomePage
