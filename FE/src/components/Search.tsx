import React, { useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-hooks-web"
import algoliasearch from "algoliasearch/lite"
import { connectSearchBox } from "react-instantsearch-dom"

const Search = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])

    const index = searchClient.initIndex("test_index")
    const Hits = ({ index_text, metaData }) => {
        return (
            <div className='w-full flex p-3 pl-4 items-center hover:bg-gray-300 rounded-lg cursor-pointer'>
                <div className='mr-4'>
                    <div className='h-9 w-9 rounded-sm flex items-center justify-center text-3xl'>
                        <svg
                            className='icon'
                            viewBox='0 0 1024 1024'
                            version='1.1'
                            xmlns='http://www.w3.org/2000/svg'
                            p-id='1640'
                            width='200'
                            height='200'>
                            <path
                                d='M96 970.666667a416 32 0 1 0 832 0 416 32 0 1 0-832 0Z'
                                fill='#45413C'
                                p-id='1641'></path>
                            <path
                                d='M896 864c0 46.933333-38.4 85.333333-85.333333 85.333333H213.333333c-46.933333 0-85.333333-38.4-85.333333-85.333333V576c0-211.2 172.8-384 384-384s384 172.8 384 384v288z'
                                fill='#DAEDF7'
                                p-id='1642'></path>
                            <path
                                d='M512 192C300.8 192 128 364.8 128 576v106.666667c0-211.2 172.8-384 384-384s384 172.8 384 384v-106.666667c0-211.2-172.8-384-384-384z'
                                fill='#FFFFFF'
                                p-id='1643'></path>
                            <path
                                d='M650.666667 938.666667c0 23.466667-19.2 42.666667-42.666667 42.666666h-192c-23.466667 0-42.666667-19.2-42.666667-42.666666v-170.666667c0-23.466667 19.2-42.666667 42.666667-42.666667h192c23.466667 0 42.666667 19.2 42.666667 42.666667v170.666667z'
                                fill='#C0DCEB'
                                p-id='1644'></path>
                            <path
                                d='M373.333333 821.333333h277.333334v42.666667h-277.333334z'
                                fill='#ADC4D9'
                                p-id='1645'></path>
                            <path
                                d='M970.666667 778.666667l-74.666667 42.666666V554.666667l74.666667 42.666666zM53.333333 778.666667l74.666667 42.666666V554.666667l-74.666667 42.666666z'
                                fill='#ADC4D9'
                                p-id='1646'></path>
                            <path
                                d='M768 74.666667m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z'
                                fill='#FF6242'
                                p-id='1647'></path>
                            <path
                                d='M650.666667 821.333333h-277.333334V768c0-23.466667 19.2-42.666667 42.666667-42.666667h192c23.466667 0 42.666667 19.2 42.666667 42.666667v53.333333z'
                                fill='#FF6242'
                                p-id='1648'></path>
                            <path
                                d='M693.333333 533.333333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z'
                                fill='#00DFEB'
                                p-id='1649'></path>
                            <path
                                d='M693.333333 533.333333m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z'
                                fill='#627B8C'
                                p-id='1650'></path>
                            <path
                                d='M330.666667 533.333333m-106.666667 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z'
                                fill='#00DFEB'
                                p-id='1651'></path>
                            <path
                                d='M330.666667 533.333333m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z'
                                fill='#627B8C'
                                p-id='1652'></path>
                        </svg>
                    </div>
                </div>
                <div>
                    <div className='font-bold text-lg'>
                        {metaData && metaData.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                        <span className='mr-2'>index_text : {index_text}</span>
                        <span className='mr-2'>gender: man</span>
                        <span className='mr-2'>hobby: skiing</span>
                    </div>
                </div>
            </div>
        )
    }

    const handleSearch = (e: any) => {
        if (!e.target.value.trim()) {
            setResults([])
            return
        }

        index
            .search(e.target.value, {
                queryType: "prefixNone",
            })
            .then(({ hits }) => {
                console.log(hits)
                setResults(hits)
            })
    }

    return (
        <div className='w-4/6 z-50 relative mx-auto mt-36'>
            <div className='bg-white w-full h-16 rounded-xl mb-3 shadow-lg p-2 border-none focus:ring-0'>
                <input
                    type='text'
                    placeholder='Search'
                    className='w-full h-full text-2xl rounded-lg focus:outline-none'
                    onChange={handleSearch}
                />
            </div>
            {results.length > 0 && (
                <div className='bg-white w-full rounded-xl shadow-xl overflow-hidden p-1'>
                    {results.map(({ indexed_text, meta_data }, index) => (
                        <Hits
                            index_text={indexed_text}
                            key={index}
                            metaData={meta_data}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export { Search }
