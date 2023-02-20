function Navbar() {
    return (
        <section className="justify-start">
        <nav className='md:py flex justify-evenly shadow-lg bg-black py-7'>
        <h1 className='text-xl font-bold text-secondary '>
                    CPSS
                </h1>
        <ul className='flex items-center gap-10'>
            <li>
                <a href='#' className='text-white font-bold'>
                    Contribute
                </a>
            </li>
            <li>
                <a href='https://github.com/Tochey/CPSS/blob/main/README.md' className='text-white font-bold'>
                    About
                </a>
            </li>
            <li>
                <a href='https://www.linkedin.com/in/tochidon/' className='text-white font-bold'>
                    Creator
                </a>
            </li>
        </ul>
        </nav>
    </section>
    )
}

export { Navbar }
