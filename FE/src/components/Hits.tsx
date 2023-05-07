import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import HitCard from "./HitCard"
import { userEndpoint } from "../lib/api"

interface IHitProps {
    indexed_text: string
    metaData: {
        bucket: string
        email: string
        key: string
        name: string
        login_id: string
        userId: string
    }
    objectID: string
    raw_text: string
}

const Hits = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [Hits, setHits] = useState<IHitProps[]>([])

    useEffect(() => {
        const q = searchParams.get("q")
        const API_KEY = "239bafadc92234194000c718993e7374" //search client key: read only i think?
        const APPLICATION_ID = "CWLQNCS6S6"

        const data = { params: `query=${q}&hitsPerPage=10&getRankingInfo=1` }

        axios
            .post(
                `https://${APPLICATION_ID}-dsn.algolia.net/1/indexes/test_index/query`,
                data,
                {
                    headers: {
                        "X-Algolia-API-Key": API_KEY,
                        "X-Algolia-Application-Id": APPLICATION_ID,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setHits(response.data.hits)
            })
            .catch((error) => {
                console.log(error)
                alert("Error fetching hits")
            })
    }, [])

    return (
        <div className='container mx-auto'>
            <h1 className='font-bold text-primary text-3xl'>Results:</h1>
            <div className='flex flex-col '>
                {Hits.map((h) => {
                    return <HitCard hits={h} />
                })}
            </div>
        </div>
    )
}

export default Hits
