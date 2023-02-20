import {Link} from 'react-router-dom'
function Navbar() {
    return (
        <section className='justify-start'>
            <nav className='md:py flex justify-evenly shadow-lg bg-black py-7'>
               <Link to='/'>
               <h1 className='font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-primary to-pink-600 cursor-pointer'>CPSS</h1>
                </Link>
                <ul className='flex items-center gap-10'>
                    <li>
                        <a
                            href='https://www.linkedin.com/in/tochidon/'
                            className='text-gray-400 font-bold'>
                            Creator
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://github.com/Tochey/CPSS/blob/main/README.md'
                            className='text-gray-400 font-bold'>
                            About
                        </a>
                    </li>
                    <li>
                        <a href='https://github.com/Tochey/CPSS/blob/main/CONTRIBUTING.md' className='text-gray-400 font-bold'>
                            Contribute
                        </a>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export { Navbar }
