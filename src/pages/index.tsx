import algoliasearch from "algoliasearch/lite"
import { useState, useEffect } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-hooks-web"

function validateFileName(fileName: string) {
    var pattern = /^[a-zA-Z0-9]+_\d{4}-index\.txt$/
    return pattern.test(fileName)
}

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_AGL_APPID!,
    process.env.NEXT_PUBLIC_ADMIN_API_KEY!
)



export default function App() {
    const [selectedFile, setSelectedFile] = useState<File>()
    const [isFilePicked, setIsFilePicked] = useState(false)

    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0])
        setIsFilePicked(true)
    }

    const handleUpload = async () => {
        const url = fetch(process.env.NEXT_PUBLIC_PRESIGNER as unknown as URL, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((e) => e.json())
            .then((e) => e.url)

        await fetch(await url, {
            method: "PUT",
            headers: {
                "Content-type": "multipart/form-data",
            },
            body: selectedFile,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    useEffect(() => {
        if (isFilePicked) {
            let reader = new FileReader()

            if (!validateFileName(selectedFile!.name)) {
                ;(
                    document.getElementById("fileUpload") as HTMLInputElement
                ).value = ""
                setIsFilePicked(false)
                alert("Invalid file name")
                return
            }

            reader.onload = function (e) {
                var content = reader.result

                //validate content
                console.log({ content: content })
            }

            reader.readAsText(selectedFile!)
        }
    }, [isFilePicked])
    // const Hit = ({ hit }) => <p>{hit.indexed_text}</p>;
    // hitComponent={Hit}

    return (
        <div>
            <InstantSearch searchClient={searchClient} indexName='test_index' >
                <SearchBox placeholder='Search here' />
                <Hits  />
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
