import { useEffect, useState } from "react"

import MainLayout from "../../components/layouts/MainLayout"

import {
    getCADocuments
} from "../../services/caService"

const CADocuments = () => {

    const [documents, setDocuments] = useState([])

    const fetchDocuments = async () => {

        try {

            const response =
                await getCADocuments()

            setDocuments(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {

        fetchDocuments()

    }, [])

    return (
        <MainLayout>

            <div className="p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Client Documents
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {
                        documents.map((document) => (

                            <div
                                key={document.documentId}
                                className="bg-white p-4 rounded-lg shadow border"
                            >

                                <h2 className="text-xl font-semibold">
                                    {document.fileName}
                                </h2>

                                <p className="mt-2">
                                    Business:
                                    {" "}
                                    {document.businessName}
                                </p>

                                <p className="mt-2">
                                    Type:
                                    {" "}
                                    {document.documentType}
                                </p>

                                <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 underline mt-4 block"
                                >
                                    View Document
                                </a>

                            </div>
                        ))
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default CADocuments