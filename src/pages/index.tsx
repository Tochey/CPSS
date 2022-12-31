import algoliasearch from "algoliasearch/lite"
import { useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-hooks-web"

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_AGL_APPID!,
    process.env.NEXT_PUBLIC_ADMIN_API_KEY!
)

export default function App() {
    const [selectedFile, setSelectedFile] = useState()
    const [isFilePicked, setIsFilePicked] = useState(false)

    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0])
        setIsFilePicked(true)
    }

    const handleUpload = async () => {
        const ans = fetch(process.env.NEXT_PUBLIC_PRESIGNER as unknown as URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: selectedFile,
        })
            .then((e) => e.json())
            .then((e) => e.res)

        // await fetch(await ans, {
        //     method: "PUT",
        //     headers: {
        //         'Content-type': 'multipart/form-data',
        //       },
        //     body: selectedFile,
        // })
        //     .then((response) => response.json())
        //     .then((result) => {
        //         console.log("Success:", result)
        //     })
        //     .catch((error) => {
        //         console.error("Error:", error)
        //     })
    }

    if (isFilePicked) {
        var reader = new FileReader()
        console.log(selectedFile)
        reader.onload = function (e) {
            var content = reader.result

            //validate content
            console.log(content)
        }

        reader.readAsText(selectedFile!)
    }

    return (
        <div>
            <InstantSearch searchClient={searchClient} indexName='test_index'>
                <SearchBox placeholder='Search here' searchAsYouType={false} />
                <Hits />
            </InstantSearch>
            <input
                type='file'
                name='userFileUpload'
                id='fileUpload'
                onChange={changeHandler}
                className='m-5'
                accept='.txt'
            />
            <div>
                <button
                    className=' border border-black px-3 m-5 text-green-500 font-bold uppercase'
                    onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </div>
    )
}
